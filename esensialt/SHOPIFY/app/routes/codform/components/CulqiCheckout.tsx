// app/routes/codform/components/CulqiCheckout.tsx
// Componente para integración con Culqi Payment Gateway

import React, { useEffect, useState, useRef } from 'react';
import { CULQI_CONFIG } from '~/config/app.config';
import clientLogger from '~/utils/logger.client';

interface CulqiCheckoutProps {
  amount: number;
  email: string;
  description: string;
  currency?: string;
  onSuccess: (chargeId: string, chargeData: unknown) => void;
  onError: (error: string) => void;
  disabled?: boolean;
  buttonText?: string;
  buttonStyle?: React.CSSProperties;
}

declare global {
  interface Window {
    Culqi: {
      publicKey: string;
      token: (tokenData: {
        card_number: string;
        cvv: string;
        expiration_month: string;
        expiration_year: string;
        email: string;
      }) => Promise<{ id: string; object: string }>;
      open: () => void;
      close: () => void;
      setPublicKey: (key: string) => void;
      setLanguage: (lang: string) => void;
    };
  }
}

export const CulqiCheckout: React.FC<CulqiCheckoutProps> = ({
  amount,
  email,
  description,
  currency = 'PEN',
  onSuccess,
  onError,
  disabled = false,
  buttonText = 'Pagar con Culqi',
  buttonStyle,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [culqiLoaded, setCulqiLoaded] = useState(false);
  const scriptLoadedRef = useRef(false);

  // Cargar Culqi.js v4
  useEffect(() => {
    if (scriptLoadedRef.current) {
      setCulqiLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.culqi.com/js/v4';
    script.async = true;
    script.onload = () => {
      scriptLoadedRef.current = true;
      setCulqiLoaded(true);
      
      // Configurar Culqi
      if (window.Culqi) {
        window.Culqi.setPublicKey(CULQI_CONFIG.publicKey);
        window.Culqi.setLanguage('es');
        clientLogger.info('[CULQI] Culqi.js cargado y configurado', {
          publicKey: CULQI_CONFIG.publicKey.substring(0, 10) + '...',
        });
      }
    };
    script.onerror = () => {
      clientLogger.error('[CULQI] Error al cargar Culqi.js');
      onError('Error al cargar el sistema de pagos. Por favor, recarga la página.');
    };

    document.head.appendChild(script);

    return () => {
      // No remover el script para evitar recargas innecesarias
    };
  }, [onError]);

  const handlePayment = async () => {
    if (!culqiLoaded || !window.Culqi) {
      onError('El sistema de pagos aún no está listo. Por favor, espera un momento.');
      return;
    }

    if (disabled || isLoading) {
      return;
    }

    setIsLoading(true);

    try {
      // Abrir modal de Culqi
      window.Culqi.open();

      // Escuchar evento de token creado
      const handleCulqiToken = async (event: CustomEvent) => {
        const token = event.detail;

        try {
          clientLogger.info('[CULQI] Token recibido, creando cargo', {
            token_id: token.id,
            amount,
            email,
          });

          // Crear cargo en el backend
          const response = await fetch('/api/culqi/create-charge', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              token_id: token.id,
              amount,
              email,
              description,
              currency_code: currency,
              metadata: {
                source: 'cod_form',
                timestamp: new Date().toISOString(),
              },
            }),
          });

          const result = await response.json();

          if (!response.ok || !result.success) {
            throw new Error(result.error || result.user_message || 'Error al procesar el pago');
          }

          clientLogger.info('[CULQI] Pago procesado exitosamente', {
            charge_id: result.data.charge_id,
          });

          onSuccess(result.data.charge_id, result.data);
        } catch (error: unknown) {
          const errorMessage = error instanceof Error ? error.message : 'Error al procesar el pago';
          clientLogger.error('[CULQI] Error al procesar pago', {
            error,
            token_id: token.id,
          });
          onError(errorMessage);
        } finally {
          setIsLoading(false);
          // Remover listener
          document.removeEventListener('culqi:token', handleCulqiToken as EventListener);
        }
      };

      // Escuchar evento de error de Culqi
      const handleCulqiError = (event: CustomEvent) => {
        const error = event.detail;
        clientLogger.error('[CULQI] Error de Culqi', { error });
        onError(error.user_message || 'Error al procesar la tarjeta');
        setIsLoading(false);
        document.removeEventListener('culqi:error', handleCulqiError as EventListener);
      };

      // Agregar listeners
      document.addEventListener('culqi:token', handleCulqiToken as EventListener);
      document.addEventListener('culqi:error', handleCulqiError as EventListener);

      // Timeout de seguridad (30 segundos)
      setTimeout(() => {
        if (isLoading) {
          setIsLoading(false);
          document.removeEventListener('culqi:token', handleCulqiToken as EventListener);
          document.removeEventListener('culqi:error', handleCulqiError as EventListener);
          onError('Tiempo de espera agotado. Por favor, intenta nuevamente.');
        }
      }, 30000);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Error inesperado';
      clientLogger.error('[CULQI] Error inesperado', { error });
      onError(errorMessage);
      setIsLoading(false);
    }
  };

  const defaultButtonStyle: React.CSSProperties = {
    width: '100%',
    padding: '16px',
    backgroundColor: disabled ? '#9ca3af' : '#6366f1',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '700',
    cursor: disabled || isLoading ? 'not-allowed' : 'pointer',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    boxShadow: disabled ? 'none' : '0 4px 12px rgba(99, 102, 241, 0.3)',
    transition: 'all 0.3s ease',
    opacity: isLoading ? 0.7 : 1,
  };

  return (
    <button
      type="button"
      onClick={handlePayment}
      disabled={disabled || isLoading || !culqiLoaded}
      style={{ ...defaultButtonStyle, ...buttonStyle }}
    >
      {isLoading ? (
        <>
          <span style={{ marginRight: '8px' }}>⏳</span>
          Procesando...
        </>
      ) : (
        <>
          <span style={{ marginRight: '8px' }}>💳</span>
          {buttonText}
        </>
      )}
    </button>
  );
};

