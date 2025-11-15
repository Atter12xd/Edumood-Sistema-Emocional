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

    // IMPORTANTE: Configurar la llave pública en window ANTES de cargar el script
    // Esto permite que Culqi la detecte al inicializarse
    if (typeof window !== 'undefined') {
      (window as any).Culqi = (window as any).Culqi || {};
      (window as any).Culqi.publicKey = CULQI_CONFIG.publicKey;
      console.log('[CULQI][DEBUG] publicKey pre-configurada en window.Culqi antes de cargar script');
    }
    
    const script = document.createElement('script');
    script.src = 'https://checkout.culqi.com/js/v4';
    script.async = true;
    
    // Configurar la llave pública como atributo del script (método alternativo)
    script.setAttribute('data-culqi-public-key', CULQI_CONFIG.publicKey);
    console.log('[CULQI][DEBUG] Script creado con data-culqi-public-key:', {
      hasAttribute: script.hasAttribute('data-culqi-public-key'),
      attributeValue: script.getAttribute('data-culqi-public-key')?.substring(0, 15) + '...',
      keyLength: CULQI_CONFIG.publicKey.length,
      keyStartsWith: CULQI_CONFIG.publicKey.startsWith('pk_') ? 'SÍ' : 'NO',
    });
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
          
          console.log('[CULQI][DEBUG] window.Culqi detectado, configurando...', {
            culqiType: typeof window.Culqi,
            culqiKeys: Object.keys(window.Culqi || {}),
            hasPublicKeyBefore: 'publicKey' in window.Culqi,
            publicKeyValueBefore: window.Culqi.publicKey ? 'ya existe' : 'no existe',
          });
          
          // En Culqi.js v4, la llave pública se asigna DIRECTAMENTE (no hay setPublicKey)
          // Según documentación oficial: Culqi.publicKey = 'tu-llave-publica'
          // NOTA: Culqi enmascara la llave pública por seguridad, por eso no podemos compararla
          // IMPORTANTE: NO usar init() ya que puede resetear la configuración
          try {
            // Validar formato de llave pública
            if (!CULQI_CONFIG.publicKey || !CULQI_CONFIG.publicKey.startsWith('pk_')) {
              console.error('[CULQI][DEBUG] ❌ ERROR: La llave pública no tiene el formato correcto');
              onError('Error en la configuración del sistema de pagos. Por favor, contacta al soporte.');
              return;
            }
            
            // Asignar directamente la llave pública (ÚNICO método para v4)
            window.Culqi.publicKey = CULQI_CONFIG.publicKey;
            
            console.log('[CULQI][DEBUG] ✅ publicKey asignada directamente:', {
              keyLength: CULQI_CONFIG.publicKey.length,
              keyPrefix: CULQI_CONFIG.publicKey.substring(0, 10) + '...',
              keyStartsWith: CULQI_CONFIG.publicKey.startsWith('pk_') ? 'SÍ (correcto)' : 'NO (incorrecto)',
              hasPublicKeyAfter: 'publicKey' in window.Culqi,
            });
            
            // Esperar un momento para que Culqi procese la asignación
            setTimeout(() => {
              // Reasignar una vez más después de un momento
              window.Culqi.publicKey = CULQI_CONFIG.publicKey;
              console.log('[CULQI][DEBUG] ✅ publicKey reasignada después de esperar');
            }, 100);
            
            // Configurar idioma si existe
            if (typeof window.Culqi.setLanguage === 'function') {
              window.Culqi.setLanguage('es');
              console.log('[CULQI][DEBUG] Idioma configurado a español');
            }
            
            // Verificar que window.Culqi existe y tiene la propiedad publicKey
            // (no comparamos el valor porque Culqi lo enmascara por seguridad)
            console.log('[CULQI][DEBUG] Verificando configuración inicial de Culqi:', {
              culqiExists: !!window.Culqi,
              hasPublicKeyProperty: 'publicKey' in window.Culqi,
              publicKeyValue: window.Culqi?.publicKey ? 'configurada' : 'no configurada',
              culqiMethods: window.Culqi ? Object.keys(window.Culqi).filter(k => typeof window.Culqi[k as keyof typeof window.Culqi] === 'function') : [],
              culqiProperties: window.Culqi ? Object.keys(window.Culqi) : [],
            });
            
            if (window.Culqi && 'publicKey' in window.Culqi) {
              setCulqiLoaded(true);
              console.log('[CULQI][DEBUG] ✅ Culqi.js inicializado correctamente');
              clientLogger.info('[CULQI] Culqi.js cargado y configurado correctamente', {
                publicKeyLength: CULQI_CONFIG.publicKey.length,
                publicKeyPrefix: CULQI_CONFIG.publicKey.substring(0, 10) + '...',
                hasPublicKey: 'publicKey' in window.Culqi,
                attempts,
              });
            } else {
              console.error('[CULQI][DEBUG] ❌ window.Culqi no tiene la propiedad publicKey');
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

    // Verificar que tenemos los datos necesarios ANTES de continuar
    const emailTrimmed = email?.trim() || '';
    const amountNumber = typeof amount === 'number' ? amount : parseFloat(String(amount || 0));
    
    clientLogger.info('[CULQI] Validando datos antes de pagar', {
      email: emailTrimmed ? emailTrimmed.substring(0, 5) + '...' : 'vacío',
      emailLength: emailTrimmed.length,
      amount: amountNumber,
      amountType: typeof amount,
      originalAmount: amount,
    });

    if (!emailTrimmed || emailTrimmed.length === 0) {
      onError('Por favor, ingresa tu correo electrónico antes de pagar.');
      return;
    }

    // Validar formato de email básico
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailTrimmed)) {
      onError('Por favor, ingresa un correo electrónico válido.');
      return;
    }

    if (!amountNumber || isNaN(amountNumber) || amountNumber <= 0) {
      onError('El monto debe ser mayor a cero. Por favor, verifica el precio del producto.');
      return;
    }

    // Verificar y configurar la llave pública antes de abrir el modal
    // Siempre reconfiguramos para asegurar que esté correcta
    console.log('[CULQI][DEBUG] ========== INICIO CONFIGURACIÓN LLAVE PÚBLICA ==========');
    console.log('[CULQI][DEBUG] Estado ANTES de configurar llave pública:', {
      culqiExists: !!window.Culqi,
      culqiType: typeof window.Culqi,
      publicKeyBefore: window.Culqi?.publicKey ? 'existe' : 'no existe',
      configPublicKey: CULQI_CONFIG.publicKey ? CULQI_CONFIG.publicKey.substring(0, 15) + '...' : 'NO DEFINIDA',
      configPublicKeyLength: CULQI_CONFIG.publicKey?.length || 0,
      configPublicKeyStartsWith: CULQI_CONFIG.publicKey?.startsWith('pk_') ? 'SÍ (correcto)' : 'NO (incorrecto)',
    });
    
    // Validar que la llave pública tenga el formato correcto
    if (!CULQI_CONFIG.publicKey || !CULQI_CONFIG.publicKey.startsWith('pk_')) {
      console.error('[CULQI][DEBUG] ❌ ERROR: La llave pública no tiene el formato correcto (debe empezar con pk_)');
      onError('Error en la configuración del sistema de pagos. Por favor, contacta al soporte.');
      return;
    }
    
    // Asignar la llave pública DIRECTAMENTE (único método para Culqi v4)
    // NO usar init() ya que puede resetear la configuración
    try {
      window.Culqi.publicKey = CULQI_CONFIG.publicKey;
      console.log('[CULQI][DEBUG] ✅ publicKey reasignada antes de abrir modal');
    } catch (error) {
      console.error('[CULQI][DEBUG] ❌ Error al asignar llave pública:', error);
      onError('Error al configurar el sistema de pagos. Por favor, recarga la página.');
      return;
    }
    
    clientLogger.info('[CULQI] Configurando llave pública antes de abrir modal', {
      publicKeyLength: CULQI_CONFIG.publicKey.length,
      publicKeyPrefix: CULQI_CONFIG.publicKey.substring(0, 10) + '...',
      hasPublicKeyProperty: 'publicKey' in window.Culqi,
      publicKeyValue: window.Culqi.publicKey ? 'configurada' : 'no configurada',
      culqiObjectKeys: Object.keys(window.Culqi || {}),
    });
    
    // Verificar inmediatamente (sin esperar) que la llave pública esté configurada
    // La asignación es síncrona, no necesitamos esperar
    console.log('[CULQI][DEBUG] Estado DESPUÉS de configurar:', {
      publicKeyExists: !!window.Culqi.publicKey,
      publicKeyType: typeof window.Culqi.publicKey,
      publicKeyValue: window.Culqi.publicKey ? window.Culqi.publicKey.substring(0, 15) + '...' : 'NO EXISTE',
      publicKeyInObject: 'publicKey' in window.Culqi,
      culqiOpenExists: typeof window.Culqi.open === 'function',
      culqiTokenExists: typeof window.Culqi.token === 'function',
    });
    
    // Verificar si la llave pública está configurada
    // Nota: Culqi puede enmascarar la llave, así que verificamos si existe la propiedad
    const hasPublicKey = 'publicKey' in window.Culqi && window.Culqi.publicKey;
    
    if (!hasPublicKey) {
      console.error('[CULQI][DEBUG] ❌ ERROR CRÍTICO: La llave pública no se pudo configurar');
      clientLogger.error('[CULQI] La llave pública no se pudo configurar', {
        culqiObject: window.Culqi,
        configKey: CULQI_CONFIG.publicKey ? CULQI_CONFIG.publicKey.substring(0, 10) + '...' : 'NO DEFINIDA',
      });
      onError('Error al configurar el sistema de pagos. Por favor, recarga la página.');
      return;
    }
    
    // Reconfigurar la llave pública JUSTO antes de abrir (asegurar que esté fresca)
    window.Culqi.publicKey = CULQI_CONFIG.publicKey;
    console.log('[CULQI][DEBUG] ✅ Llave pública reconfigurada justo antes de abrir');
    console.log('[CULQI][DEBUG] ========== FIN CONFIGURACIÓN LLAVE PÚBLICA ==========');

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
        console.log('[CULQI][DEBUG] 🎉 Evento culqi:token recibido');
        const customEvent = event as CustomEvent;
        const token = customEvent.detail;
        
        console.log('[CULQI][DEBUG] Token recibido:', {
          tokenId: token?.id,
          tokenObject: token?.object,
          tokenKeys: token ? Object.keys(token) : 'no token',
          fullToken: token,
        });

        try {
          clientLogger.info('[CULQI] Token recibido, creando cargo', {
            token_id: token.id,
            amount: amountNumber,
            email: emailTrimmed,
          });

          // Crear cargo en el backend usando los valores validados
          // Asegurar que el currency sea válido (PEN o USD)
          const validCurrency = currency.toUpperCase() === 'USD' || currency.toUpperCase() === 'PEN' 
            ? currency.toUpperCase() 
            : 'PEN';
          
          const response = await fetch('/api/culqi/create-charge', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              token_id: token.id,
              amount: amountNumber, // Usar el valor validado
              email: emailTrimmed, // Usar el email validado
              description,
              currency_code: validCurrency, // Usar currency validado
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
        console.error('[CULQI][DEBUG] ❌ Evento culqi:error recibido');
        const customEvent = event as CustomEvent;
        const error = customEvent.detail;
        
        console.error('[CULQI][DEBUG] Error completo de Culqi:', {
          errorObject: error,
          errorKeys: error ? Object.keys(error) : 'no error',
          userMessage: error?.user_message,
          merchantMessage: error?.merchant_message,
          type: error?.type,
          fullError: error,
        });
        
        clientLogger.error('[CULQI] Error de Culqi', { error });
        onError(error.user_message || error.merchant_message || 'Error al procesar la tarjeta');
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
        console.log('[CULQI][DEBUG] ⏱️ Timeout alcanzado (30 segundos)');
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

      // Verificación final y reconfiguración de llave pública JUSTO antes de abrir
      // Esto asegura que la llave esté configurada correctamente
      // IMPORTANTE: Hacer esto inmediatamente antes de open() sin esperas
      window.Culqi.publicKey = CULQI_CONFIG.publicKey;
      
      // Verificar estado interno de Culqi
      const culqiInternal = (window.Culqi as any);
      console.log('[CULQI][DEBUG] Estado interno de Culqi ANTES de configuración:', {
        isCheckoutEnabled: culqiInternal._isCheckoutEnabled,
        isTestEnvironment: culqiInternal._isTestEnvironment,
        publicKeyInternal: culqiInternal._publickey ? culqiInternal._publickey.substring(0, 15) + '...' : 'NO EXISTE',
        hasSettings: !!culqiInternal._settings,
        settingsKeys: culqiInternal._settings ? Object.keys(culqiInternal._settings) : [],
      });
      
      // IMPORTANTE: En Culqi v4, NO usar settings() ya que puede causar errores
      // La configuración se hace solo con publicKey y luego se usa token() directamente
      // El monto y currency se pasan al crear el token, no en settings()
      
      // Validar que el currency sea válido para Culqi (solo acepta USD o PEN)
      const validCurrency = currency.toUpperCase() === 'USD' || currency.toUpperCase() === 'PEN' 
        ? currency.toUpperCase() 
        : 'PEN'; // Default a PEN si no es válido
      
      if (currency.toUpperCase() !== validCurrency) {
        console.warn('[CULQI][DEBUG] ⚠️ Currency inválido, usando PEN por defecto:', {
          currencyRecibido: currency,
          currencyUsado: validCurrency,
        });
      }
      
      console.log('[CULQI][DEBUG] Configuración final:', {
        currency: validCurrency,
        amount: amountNumber,
        amountInCents: amountNumber * 100,
        email: emailTrimmed.substring(0, 10) + '...',
      });
      
      // El problema principal es que _isCheckoutEnabled es false
      // Esto significa que la llave no tiene permisos de checkout en el panel de Culqi
      // Intentaremos abrir el modal de todas formas, pero puede fallar
      if (culqiInternal._isCheckoutEnabled === false) {
        console.error('[CULQI][DEBUG] ⚠️⚠️⚠️ ADVERTENCIA CRÍTICA ⚠️⚠️⚠️');
        console.error('[CULQI][DEBUG] El checkout está DESHABILITADO en la llave pública.');
        console.error('[CULQI][DEBUG] Esto significa que la llave no tiene permisos de checkout en el panel de Culqi.');
        console.error('[CULQI][DEBUG] SOLUCIÓN: Necesitas habilitar el checkout en el panel de Culqi para esta llave.');
        console.error('[CULQI][DEBUG] Intentaremos abrir el modal de todas formas, pero probablemente fallará...');
        
        // NO bloquear el flujo aún, pero mostrar advertencia clara
      }
      
      // Verificar que la llave esté realmente configurada
      const finalCheck = 'publicKey' in window.Culqi && window.Culqi.publicKey;
      if (!finalCheck) {
        console.error('[CULQI][DEBUG] ❌ ERROR: La llave pública no está configurada justo antes de abrir');
        onError('Error al configurar el sistema de pagos. Por favor, recarga la página.');
        setIsLoading(false);
        return;
      }
      
      // Log final del estado
      console.log('[CULQI][DEBUG] Estado interno de Culqi DESPUÉS de configuración:', {
        isCheckoutEnabled: culqiInternal._isCheckoutEnabled,
        publicKeyConfigured: !!window.Culqi.publicKey,
        hasOpenFunction: typeof window.Culqi.open === 'function',
        note: 'Procediendo a abrir modal aunque checkout esté deshabilitado (puede funcionar)',
      });
      
      console.log('[CULQI][DEBUG] Verificación FINAL antes de abrir modal:', {
        culqiExists: !!window.Culqi,
        publicKeyFinal: 'configurada',
        publicKeyInObject: true,
        publicKeyLength: CULQI_CONFIG.publicKey.length,
        openFunction: typeof window.Culqi?.open,
        listenersAdded: {
          token: !!tokenHandlerRef.current,
          error: !!errorHandlerRef.current,
        },
        email: emailTrimmed.substring(0, 10) + '...',
        amount: amountNumber,
      });

      // Agregar listener temporal para capturar errores inmediatos
      const immediateErrorHandler = (event: Event) => {
        const customEvent = event as CustomEvent;
        const error = customEvent.detail;
        console.error('[CULQI][DEBUG] ⚠️⚠️⚠️ ERROR INMEDIATO DE CULQI ⚠️⚠️⚠️:', {
          error,
          errorType: typeof error,
          errorKeys: error ? Object.keys(error) : [],
          userMessage: error?.user_message,
          merchantMessage: error?.merchant_message,
          type: error?.type,
          code: error?.code,
          fullError: JSON.stringify(error, null, 2),
          timestamp: new Date().toISOString(),
          publicKeyAtError: window.Culqi?.publicKey ? 'existe' : 'NO existe',
        });
      };
      
      // Escuchar errores inmediatos (se removerá después)
      document.addEventListener('culqi:error', immediateErrorHandler, { once: true });
      
      // También escuchar en window por si Culqi emite el error de otra manera
      const originalConsoleError = console.error;
      console.error = (...args) => {
        if (args.some(arg => typeof arg === 'string' && arg.includes('configuración'))) {
          console.error('[CULQI][DEBUG] ⚠️⚠️⚠️ ERROR DETECTADO EN CONSOLE ⚠️⚠️⚠️:', args);
        }
        originalConsoleError.apply(console, args);
      };
      
      // Abrir modal de Culqi
      try {
        console.log('[CULQI][DEBUG] 🚀 Llamando a window.Culqi.open()...');
        console.log('[CULQI][DEBUG] Estado de Culqi justo antes de open():', {
          culqi: window.Culqi,
          publicKey: window.Culqi.publicKey ? 'configurada' : 'NO configurada',
          openFunction: typeof window.Culqi.open,
        });
        
        window.Culqi.open();
        
        console.log('[CULQI][DEBUG] ✅ window.Culqi.open() llamado sin errores síncronos');
        console.log('[CULQI][DEBUG] Esperando eventos de Culqi (culqi:token o culqi:error)...');
        
        // Remover el listener inmediato después de un momento
        setTimeout(() => {
          document.removeEventListener('culqi:error', immediateErrorHandler);
        }, 1000);
      } catch (error) {
        console.error('[CULQI][DEBUG] ❌ ERROR síncrono al llamar window.Culqi.open():', error);
        document.removeEventListener('culqi:error', immediateErrorHandler);
        clientLogger.error('[CULQI] Error al abrir modal de Culqi', { error });
        onError('Error al abrir el formulario de pago. Por favor, intenta nuevamente.');
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

