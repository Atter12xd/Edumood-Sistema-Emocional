// app/services/culqi.service.ts
// Servicio para integración con Culqi Payment Gateway

import Culqi from 'culqi-node';
import { CULQI_CONFIG } from '~/config/app.config';
import logger from '~/utils/logger.server';

// Inicializar cliente de Culqi
const culqi = new Culqi({
  privateKey: CULQI_CONFIG.secretKey,
});

/**
 * Tipos para las respuestas de Culqi
 */
export interface CulqiTokenResponse {
  id: string;
  object: 'token';
  email: string;
  card_number: string;
  last_four: string;
  active: boolean;
  creation_date: number;
}

export interface CulqiChargeResponse {
  id: string;
  object: 'charge';
  amount: number;
  amount_refunded: number;
  currency_code: string;
  email: string;
  description: string;
  outcome: {
    type: string;
    code: string;
    merchant_message: string;
    user_message: string;
  };
  creation_date: number;
  creation_date_readable: string;
  metadata: Record<string, unknown>;
}

export interface CulqiChargeRequest {
  amount: number;
  currency_code: string;
  email: string;
  source_id: string; // Token ID
  description: string;
  metadata?: Record<string, unknown>;
}

export interface CulqiError {
  object: 'error';
  type: string;
  merchant_message: string;
  user_message: string;
}

/**
 * Crear un token de tarjeta
 * @param cardData - Datos de la tarjeta
 * @returns Token ID o error
 */
export async function createToken(cardData: {
  card_number: string;
  cvv: string;
  expiration_month: string;
  expiration_year: string;
  email: string;
}): Promise<{ success: boolean; token?: string; error?: CulqiError }> {
  try {
    logger.info('[CULQI] Creando token de tarjeta', {
      email: cardData.email,
      last_four: cardData.card_number.slice(-4),
    });

    const token = await culqi.tokens.create({
      card_number: cardData.card_number,
      cvv: cardData.cvv,
      expiration_month: cardData.expiration_month,
      expiration_year: cardData.expiration_year,
      email: cardData.email,
    });

    logger.info('[CULQI] Token creado exitosamente', {
      token_id: token.id,
    });

    return {
      success: true,
      token: token.id,
    };
  } catch (error: unknown) {
    const culqiError = error as CulqiError;
    logger.error('[CULQI] Error al crear token', {
      error: culqiError,
      email: cardData.email,
    });

    return {
      success: false,
      error: culqiError,
    };
  }
}

/**
 * Crear un cargo (pago) usando un token
 * @param chargeData - Datos del cargo
 * @returns Información del cargo o error
 */
export async function createCharge(
  chargeData: CulqiChargeRequest
): Promise<{ success: boolean; charge?: CulqiChargeResponse; error?: CulqiError }> {
  try {
    logger.info('[CULQI] Creando cargo', {
      amount: chargeData.amount,
      currency: chargeData.currency_code,
      email: chargeData.email,
    });

    const charge = await culqi.charges.create({
      amount: chargeData.amount,
      currency_code: chargeData.currency_code,
      email: chargeData.email,
      source_id: chargeData.source_id,
      description: chargeData.description,
      metadata: chargeData.metadata || {},
    });

    logger.info('[CULQI] Cargo creado exitosamente', {
      charge_id: charge.id,
      amount: charge.amount,
      outcome: charge.outcome.type,
    });

    return {
      success: true,
      charge: charge as CulqiChargeResponse,
    };
  } catch (error: unknown) {
    const culqiError = error as CulqiError;
    logger.error('[CULQI] Error al crear cargo', {
      error: culqiError,
      amount: chargeData.amount,
      email: chargeData.email,
    });

    return {
      success: false,
      error: culqiError,
    };
  }
}

/**
 * Obtener información de un cargo
 * @param chargeId - ID del cargo
 * @returns Información del cargo o error
 */
export async function getCharge(
  chargeId: string
): Promise<{ success: boolean; charge?: CulqiChargeResponse; error?: CulqiError }> {
  try {
    logger.info('[CULQI] Obteniendo información de cargo', {
      charge_id: chargeId,
    });

    const charge = await culqi.charges.get(chargeId);

    return {
      success: true,
      charge: charge as CulqiChargeResponse,
    };
  } catch (error: unknown) {
    const culqiError = error as CulqiError;
    logger.error('[CULQI] Error al obtener cargo', {
      error: culqiError,
      charge_id: chargeId,
    });

    return {
      success: false,
      error: culqiError,
    };
  }
}

/**
 * Validar que las credenciales de Culqi estén configuradas
 */
export function validateCulqiConfig(): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!CULQI_CONFIG.secretKey || CULQI_CONFIG.secretKey === 'sk_test_367uAvKKpKk9ChQs') {
    errors.push('CULQI_SECRET_KEY no está configurada o está usando valor por defecto');
  }

  if (!CULQI_CONFIG.publicKey || CULQI_CONFIG.publicKey === 'pk_test_dkeS17NBw8B1srCt') {
    errors.push('CULQI_PUBLIC_KEY no está configurada o está usando valor por defecto');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

