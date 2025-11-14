// app/routes/api.culqi.create-charge.ts
// API Route para crear cargos con Culqi

import { json, type ActionFunctionArgs } from '@remix-run/node';
import { createCharge, validateCulqiConfig } from '~/services/culqi.service.server';
import { CULQI_CONFIG } from '~/config/app.config';
import logger from '~/utils/logger.server';
import { z } from 'zod';

/**
 * Schema de validación para crear un cargo
 */
const CreateChargeSchema = z.object({
  token_id: z.string().min(1, 'Token ID es requerido'),
  amount: z.number().positive('El monto debe ser positivo'),
  email: z.string().email('Email inválido'),
  description: z.string().min(1, 'Descripción es requerida'),
  currency_code: z.string().optional().default('PEN'),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

/**
 * Action handler para crear un cargo con Culqi
 */
export async function action({ request }: ActionFunctionArgs) {
  // Solo permitir POST
  if (request.method !== 'POST') {
    return json({ success: false, error: 'Método no permitido' }, { status: 405 });
  }

  try {
    // Validar configuración de Culqi
    const configValidation = validateCulqiConfig();
    if (!configValidation.isValid) {
      logger.warn('[CULQI API] Configuración inválida', {
        errors: configValidation.errors,
      });
      return json(
        {
          success: false,
          error: 'Configuración de Culqi inválida',
          details: configValidation.errors,
        },
        { status: 500 }
      );
    }

    // Parsear body
    const body = await request.json();

    // Validar datos con Zod
    const validation = CreateChargeSchema.safeParse(body);
    if (!validation.success) {
      logger.warn('[CULQI API] Validación fallida', {
        errors: validation.error.issues,
      });
      return json(
        {
          success: false,
          error: 'Datos inválidos',
          details: validation.error.issues,
        },
        { status: 400 }
      );
    }

    const { token_id, amount, email, description, currency_code, metadata } = validation.data;

    // Crear cargo (Culqi espera el monto en centavos)
    const result = await createCharge({
      amount: Math.round(amount * 100), // Convertir a centavos
      currency_code: currency_code || CULQI_CONFIG.currency,
      email,
      source_id: token_id,
      description,
      metadata: metadata || {},
    });

    if (!result.success) {
      logger.error('[CULQI API] Error al crear cargo', {
        error: result.error,
        amount,
        email,
      });

      return json(
        {
          success: false,
          error: result.error?.merchant_message || 'Error al procesar el pago',
          user_message: result.error?.user_message || 'No se pudo procesar el pago',
        },
        { status: 400 }
      );
    }

    logger.info('[CULQI API] Cargo creado exitosamente', {
      charge_id: result.charge?.id,
      amount: result.charge?.amount,
    });

    return json({
      success: true,
      data: {
        charge_id: result.charge?.id,
        amount: result.charge?.amount,
        currency: result.charge?.currency_code,
        status: result.charge?.outcome.type,
        message: result.charge?.outcome.merchant_message,
      },
    });
  } catch (error: unknown) {
    logger.error('[CULQI API] Error inesperado', {
      error,
    });

    return json(
      {
        success: false,
        error: 'Error interno del servidor',
      },
      { status: 500 }
    );
  }
}

