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
      publicKey?: string;
      token: (tokenData: {
        card_number: string;
        cvv: string;
        expiration_month: string;
        expiration_year: string;
        email: string;
      }) => Promise<{ id: string; object: string }>;
      open: () => void;
      close: () => void;
      setPublicKey?: (key: string) => void;
      setLanguage?: (lang: string) => void;
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
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const tokenHandlerRef = useRef<((event: Event) => void) | null>(null);
  const errorHandlerRef = useRef<((event: Event) => void) | null>(null);

  // Cargar Culqi.js v4
  useEffect(() => {
    if (scriptLoadedRef.current) {
      setCulqiLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.culqi.com/js/v4';
    script.async = true;
    // Configurar la llave pública como atributo del script (método alternativo)
    script.setAttribute('data-culqi-public-key', CULQI_CONFIG.publicKey);
    
    // También configurar directamente en el objeto global antes de que se cargue
    // Esto asegura que esté disponible cuando Culqi se inicialice
    if (typeof window !== 'undefined') {
      (window as any).__CULQI_PUBLIC_KEY__ = CULQI_CONFIG.publicKey;
    }
    script.onload = () => {
      scriptLoadedRef.current = true;
      
      // Esperar un momento para que Culqi se inicialice completamente
      // Intentar múltiples veces porque Culqi puede tardar en inicializarse
      let attempts = 0;
      const maxAttempts = 10;
      
      const checkCulqi = setInterval(() => {
        attempts++;
        
        if (window.Culqi) {
          clearInterval(checkCulqi);
          
          // En Culqi.js v4, la llave pública se asigna DIRECTAMENTE (no hay setPublicKey)
          // Según documentación oficial: Culqi.publicKey = 'tu-llave-publica'
          // NOTA: Culqi enmascara la llave pública por seguridad, por eso no podemos compararla
          try {
            // Asignar directamente la llave pública (método correcto para v4)
            window.Culqi.publicKey = CULQI_CONFIG.publicKey;
            
            // Configurar idioma si existe
            if (typeof window.Culqi.setLanguage === 'function') {
              window.Culqi.setLanguage('es');
            }
            
            // Verificar que window.Culqi existe y tiene la propiedad publicKey
            // (no comparamos el valor porque Culqi lo enmascara por seguridad)
            if (window.Culqi && 'publicKey' in window.Culqi) {
              setCulqiLoaded(true);
              clientLogger.info('[CULQI] Culqi.js cargado y configurado correctamente', {
                publicKeyLength: CULQI_CONFIG.publicKey.length,
                publicKeyPrefix: CULQI_CONFIG.publicKey.substring(0, 10) + '...',
                hasPublicKey: 'publicKey' in window.Culqi,
                attempts,
              });
            } else {
              clientLogger.error('[CULQI] window.Culqi no tiene la propiedad publicKey');
              onError('Error al configurar el sistema de pagos. Por favor, recarga la página.');
            }
          } catch (error) {
            clientLogger.error('[CULQI] Error al configurar Culqi', { error });
            onError('Error al configurar el sistema de pagos. Por favor, recarga la página.');
          }
        } else if (attempts >= maxAttempts) {
          clearInterval(checkCulqi);
          clientLogger.error('[CULQI] window.Culqi no está disponible después de múltiples intentos');
          onError('Error al inicializar el sistema de pagos. Por favor, recarga la página.');
        }
      }, 100);
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

  // Limpiar listeners al desmontar
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      if (tokenHandlerRef.current) {
        document.removeEventListener('culqi:token', tokenHandlerRef.current);
        tokenHandlerRef.current = null;
      }
      if (errorHandlerRef.current) {
        document.removeEventListener('culqi:error', errorHandlerRef.current);
        errorHandlerRef.current = null;
      }
    };
  }, []);

  const handlePayment = async () => {
    if (!culqiLoaded || !window.Culqi) {
      onError('El sistema de pagos aún no está listo. Por favor, espera un momento.');
      return;
    }

    if (disabled || isLoading) {
      return;
    }

    // Verificar que la llave pública esté configurada antes de abrir el modal
    if (!window.Culqi.publicKey) {
      // Intentar configurarla nuevamente
      window.Culqi.publicKey = CULQI_CONFIG.publicKey;
      clientLogger.warn('[CULQI] Reconfigurando llave pública antes de abrir modal');
    }

    // Verificar que tenemos los datos necesarios
    if (!email || !amount || amount <= 0) {
      onError('Por favor, completa todos los campos del formulario antes de pagar.');
      return;
    }

    // Limpiar handlers anteriores si existen
    if (tokenHandlerRef.current) {
      document.removeEventListener('culqi:token', tokenHandlerRef.current);
    }
    if (errorHandlerRef.current) {
      document.removeEventListener('culqi:error', errorHandlerRef.current);
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    setIsLoading(true);

    try {
      // Escuchar evento de token creado
      const handleCulqiToken = async (event: Event) => {
        const customEvent = event as CustomEvent;
        const token = customEvent.detail;

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

          // Limpiar listeners
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
          }
          if (tokenHandlerRef.current) {
            document.removeEventListener('culqi:token', tokenHandlerRef.current);
            tokenHandlerRef.current = null;
          }
          if (errorHandlerRef.current) {
            document.removeEventListener('culqi:error', errorHandlerRef.current);
            errorHandlerRef.current = null;
          }

          onSuccess(result.data.charge_id, result.data);
          setIsLoading(false);
        } catch (error: unknown) {
          const errorMessage = error instanceof Error ? error.message : 'Error al procesar el pago';
          clientLogger.error('[CULQI] Error al procesar pago', {
            error,
            token_id: token.id,
          });
          onError(errorMessage);
          setIsLoading(false);
          
          // Limpiar listeners
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
          }
          if (tokenHandlerRef.current) {
            document.removeEventListener('culqi:token', tokenHandlerRef.current);
            tokenHandlerRef.current = null;
          }
          if (errorHandlerRef.current) {
            document.removeEventListener('culqi:error', errorHandlerRef.current);
            errorHandlerRef.current = null;
          }
        }
      };

      // Escuchar evento de error de Culqi
      const handleCulqiError = (event: Event) => {
        const customEvent = event as CustomEvent;
        const error = customEvent.detail;
        clientLogger.error('[CULQI] Error de Culqi', { error });
        onError(error.user_message || 'Error al procesar la tarjeta');
        setIsLoading(false);
        
        // Limpiar listeners
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }
        if (tokenHandlerRef.current) {
          document.removeEventListener('culqi:token', tokenHandlerRef.current);
          tokenHandlerRef.current = null;
        }
        if (errorHandlerRef.current) {
          document.removeEventListener('culqi:error', errorHandlerRef.current);
          errorHandlerRef.current = null;
        }
      };

      // Guardar referencias
      tokenHandlerRef.current = handleCulqiToken;
      errorHandlerRef.current = handleCulqiError;

      // Agregar listeners
      document.addEventListener('culqi:token', handleCulqiToken);
      document.addEventListener('culqi:error', handleCulqiError);

      // Timeout de seguridad (30 segundos)
      timeoutRef.current = setTimeout(() => {
        setIsLoading(false);
        if (tokenHandlerRef.current) {
          document.removeEventListener('culqi:token', tokenHandlerRef.current);
          tokenHandlerRef.current = null;
        }
        if (errorHandlerRef.current) {
          document.removeEventListener('culqi:error', errorHandlerRef.current);
          errorHandlerRef.current = null;
        }
        onError('Tiempo de espera agotado. Por favor, intenta nuevamente.');
        timeoutRef.current = null;
      }, 30000);

      // Abrir modal de Culqi
      window.Culqi.open();
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Error inesperado';
      clientLogger.error('[CULQI] Error inesperado', { error });
      onError(errorMessage);
      setIsLoading(false);
      
      // Limpiar listeners
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      if (tokenHandlerRef.current) {
        document.removeEventListener('culqi:token', tokenHandlerRef.current);
        tokenHandlerRef.current = null;
      }
      if (errorHandlerRef.current) {
        document.removeEventListener('culqi:error', errorHandlerRef.current);
        errorHandlerRef.current = null;
      }
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

