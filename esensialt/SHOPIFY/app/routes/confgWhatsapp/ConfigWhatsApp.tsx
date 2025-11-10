import * as React from "react";
import { useFetcher } from "@remix-run/react";
import { DEFAULT_FORM_VALUES } from "./constants";
import { validateForm } from "./validation";
import { convertTo24Hour } from "./timeUtils";
import { FormFields } from "./FormFields";
import { setupImageCompression } from "./imageUtils";
import { useState, useEffect } from 'react';
import { useLoaderData } from '@remix-run/react';
import WhatsAppManager from "./WhatsAppManager";

interface Owner {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  shopName: string;
  address: string;
  city: string;
  country: string;
  shopId: string;
}

declare global {
  interface Window {
    compressAndSetImage: (file: File) => void;
  }
}

export default function ConfigWhatsApp() {
  const fetcher = useFetcher<any>();

  // Estados del formulario principal
  const [position, setPosition] = useState(DEFAULT_FORM_VALUES.position);
  const [color, setColor] = useState(DEFAULT_FORM_VALUES.color);
  const [icon, setIcon] = useState(DEFAULT_FORM_VALUES.icon);
  const [countryCode, setCountryCode] = useState(DEFAULT_FORM_VALUES.countryCode);
  const [phoneNumber, setPhoneNumber] = useState(DEFAULT_FORM_VALUES.phoneNumber);
  const [startMessage, setStartMessage] = useState(DEFAULT_FORM_VALUES.startMessage);
  const [buttonStyle, setButtonStyle] = useState(DEFAULT_FORM_VALUES.buttonStyle);
  const [logoUrl, setLogoUrl] = useState(DEFAULT_FORM_VALUES.logoUrl);
  const [isActive24Hours, setIsActive24Hours] = useState(DEFAULT_FORM_VALUES.isActive24Hours);
  const [startTime, setStartTime] = useState(DEFAULT_FORM_VALUES.startTime);
  const [endTime, setEndTime] = useState(DEFAULT_FORM_VALUES.endTime);
  const [activeDays, setActiveDays] = useState(DEFAULT_FORM_VALUES.activeDays);
  const [propietario, setPropietario] = useState<Owner | null>(null);

  // Estado de activación del widget
  const [isWidgetActive, setIsWidgetActive] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  // Obtener datos del loader de forma segura
  const loaderData = useLoaderData<{
    owner?: Owner;
    shop: string;
    error?: string;
  }>();

  const { owner, shop } = loaderData;

  // Cargar información del propietario al montar el componente
  useEffect(() => {
    if (owner) {
      setPropietario(owner);
      console.log('Información del propietario cargada:', owner);
    }
  }, [owner]);

  // Función callback para cuando se selecciona un número en WhatsAppManager
  const handleNumberSelect = (newCountryCode: string, newPhoneNumber: string) => {
    setCountryCode(newCountryCode);
    setPhoneNumber(newPhoneNumber);
    // Reactivar widget cuando cambie el número
    if (isWidgetActive) {
      activateWidget();
    }
  };

  // Configurar script de compresión de imágenes
  React.useEffect(() => {
    setupImageCompression();
  }, []);

  // Función para activar/actualizar el widget
  const activateWidget = async () => {
    // Validar formulario
    const validation = validateForm({
      phoneNumber,
      startMessage,
      countryCode,
      logoUrl,
      color
    });

    if (!validation.isValid) {
      alert(validation.message);
      return;
    }

    // Crear FormData
    const formData = new FormData();
    formData.append("phoneWithCode", countryCode + phoneNumber);
    formData.append("startMessage", startMessage);
    formData.append("position", position);
    formData.append("color", color);
    formData.append("icon", icon);
    formData.append("buttonStyle", buttonStyle);
    formData.append("logoUrl", logoUrl);
    formData.append("activeHours", isActive24Hours ? "24hours" : "custom");
    formData.append("startTime", convertTo24Hour(startTime));
    formData.append("endTime", convertTo24Hour(endTime));
    formData.append("isActive24Hours", isActive24Hours.toString());
    formData.append("activeDays", activeDays);

    console.log("📤 Activando/Actualizando widget:", {
      phone: countryCode + phoneNumber,
      message: startMessage,
      position,
      color,
      icon,
      buttonStyle,
      logoUrl,
      activeHours: isActive24Hours ? "24hours" : "custom",
      startTime: convertTo24Hour(startTime),
      endTime: convertTo24Hour(endTime),
      isActive24Hours,
      activeDays
    });

    fetcher.submit(formData, { method: "POST" });
  };

  // Efecto para manejar la respuesta del servidor (solo activación)
  React.useEffect(() => {
    if (fetcher.data?.success) {
      console.log("✅ Widget activado/actualizado correctamente");
      setIsWidgetActive(true);
      setShowSuccessMessage(true);
      
      // Ocultar mensaje de éxito después de 3 segundos
      setTimeout(() => {
        setShowSuccessMessage(false);
      }, 3000);
    }
  }, [fetcher.data]);

  // Hook para escuchar eventos de compresión de imagen
  React.useEffect(() => {
    const handleLogoUpdate = (event: any) => {
      setLogoUrl(event.detail);
      // Reactivar widget cuando cambie el logo
      if (isWidgetActive) {
        setTimeout(activateWidget, 500);
      }
    };

    document.addEventListener('updateLogo', handleLogoUpdate);

    return () => {
      document.removeEventListener('updateLogo', handleLogoUpdate);
    };
  }, [isWidgetActive]);

  // Efecto para reactivar widget cuando cambien los valores del formulario
  React.useEffect(() => {
    if (isWidgetActive) {
      const timeoutId = setTimeout(() => {
        activateWidget();
      }, 1000); // Esperar 1 segundo después del cambio para evitar muchas llamadas

      return () => clearTimeout(timeoutId);
    }
  }, [
    position, color, icon, startMessage, buttonStyle, 
    isActive24Hours, startTime, endTime, activeDays, isWidgetActive
  ]);

  // Estados de loading
  const isSubmitting = fetcher.state === "submitting";
  const hasError = fetcher.data?.success === false;

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, system-ui, sans-serif",
      padding: '60px 20px'
    }}>
      {/* Header */}
      <div style={{
        textAlign: 'center',
        marginBottom: '60px',
        color: 'white'
      }}>
        <h1 style={{
          fontSize: '48px',
          fontWeight: '800',
          margin: '0 0 20px 0',
          letterSpacing: '-2px',
          textShadow: '0 4px 20px rgba(0,0,0,0.3)'
        }}>
          🚀 Widget WhatsApp
        </h1>
        <p style={{
          fontSize: '20px',
          margin: '0',
          fontWeight: '400',
          opacity: '0.9'
        }}>
          Configura y activa tu botón de contacto - {shop}
        </p>
      </div>

      {/* Contenedor principal */}
      <div style={{
        maxWidth: '800px',
        margin: '0 auto',
        backgroundColor: 'white',
        borderRadius: '24px',
        padding: '50px',
        boxShadow: '0 25px 50px rgba(0,0,0,0.25), 0 0 0 1px rgba(255,255,255,0.1)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255,255,255,0.2)'
      }}>
        
        {/* Estado del Widget */}
        <div style={{
          marginBottom: '40px',
          padding: '20px',
          backgroundColor: isWidgetActive ? '#dcfce7' : '#fef3c7',
          border: `2px solid ${isWidgetActive ? '#16a34a' : '#d97706'}`,
          borderRadius: '16px',
          textAlign: 'center'
        }}>
          <div style={{
            fontSize: '24px',
            fontWeight: '700',
            color: isWidgetActive ? '#166534' : '#92400e',
            marginBottom: '10px'
          }}>
            {isWidgetActive ? '✅ Widget Activo' : '⚠️ Widget Inactivo'}
          </div>
          <div style={{
            fontSize: '16px',
            color: isWidgetActive ? '#15803d' : '#a16207'
          }}>
            {isWidgetActive 
              ? 'Tu botón de WhatsApp está funcionando en tu tienda'
              : 'Activa el widget para que aparezca en tu tienda'
            }
          </div>
        </div>

        {/* Mensaje de éxito temporal */}
        {showSuccessMessage && (
          <div style={{
            marginBottom: '30px',
            padding: '15px 20px',
            backgroundColor: '#d1fae5',
            border: '2px solid #10b981',
            borderRadius: '12px',
            color: '#065f46',
            textAlign: 'center',
            fontWeight: '600',
            fontSize: '16px'
          }}>
            🎉 Widget actualizado correctamente
          </div>
        )}

        {/* Componente separado de Gestión de WhatsApp */}
        <WhatsAppManager 
          propietario={propietario}
          onNumberSelect={handleNumberSelect}
        />

        {/* Formulario principal */}
        <FormFields 
          position={position}
          setPosition={setPosition}
          color={color}
          setColor={setColor}
          icon={icon}
          setIcon={setIcon}
          countryCode={countryCode}
          setCountryCode={setCountryCode}
          phoneNumber={phoneNumber}
          setPhoneNumber={setPhoneNumber}
          startMessage={startMessage}
          setStartMessage={setStartMessage}
          buttonStyle={buttonStyle}
          setButtonStyle={setButtonStyle}
          logoUrl={logoUrl}
          setLogoUrl={setLogoUrl}
          isActive24Hours={isActive24Hours}
          setIsActive24Hours={setIsActive24Hours}
          startTime={startTime}
          setStartTime={setStartTime}
          endTime={endTime}
          setEndTime={setEndTime}
          activeDays={activeDays}
          setActiveDays={setActiveDays}
        />

        {/* Mensaje de error */}
        {hasError && (
          <div style={{
            marginTop: '20px',
            padding: '15px 20px',
            backgroundColor: '#fee2e2',
            border: '2px solid #ef4444',
            borderRadius: '12px',
            color: '#991b1b',
            textAlign: 'center',
            fontWeight: '600'
          }}>
            ❌ Error al activar el widget. Intenta nuevamente.
          </div>
        )}

        {/* Botón de activar/actualizar */}
        <div style={{ textAlign: 'center', marginTop: '40px' }}>
          <button
            onClick={activateWidget}
            disabled={isSubmitting}
            style={{
              padding: '20px 60px',
              fontSize: '18px',
              fontWeight: '700',
              color: 'white',
              background: isSubmitting 
                ? '#94a3b8' 
                : isWidgetActive
                ? 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)'
                : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              border: 'none',
              borderRadius: '20px',
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
              boxShadow: isSubmitting 
                ? 'none' 
                : isWidgetActive
                ? '0 20px 40px rgba(59, 130, 246, 0.4)'
                : '0 20px 40px rgba(16, 185, 129, 0.4)',
              transform: isSubmitting ? 'scale(0.98)' : 'scale(1)',
              transition: 'all 0.3s ease',
              letterSpacing: '0.5px',
              textTransform: 'uppercase'
            }}
          >
            {isSubmitting 
              ? '🔄 Procesando...' 
              : isWidgetActive 
              ? '🔄 Actualizar Widget' 
              : '🚀 Activar Widget'
            }
          </button>
        </div>

        {/* Instrucciones de acceso */}
        {isWidgetActive && (
          <div style={{
            marginTop: '40px',
            padding: '25px',
            backgroundColor: '#f8fafc',
            border: '2px solid #e2e8f0',
            borderRadius: '16px'
          }}>
            <h3 style={{
              fontSize: '20px',
              fontWeight: '700',
              color: '#1e293b',
              marginBottom: '15px',
              textAlign: 'center'
            }}>
              📋 Acceso al Editor de Tema
            </h3>
            <p style={{
              fontSize: '16px',
              color: '#475569',
              marginBottom: '20px',
              lineHeight: '1.6',
              textAlign: 'center'
            }}>
              Tu widget está configurado. Para verlo en tu tienda, ve al editor de tema:
            </p>
            <div style={{
              textAlign: 'center'
            }}>
              <button
                onClick={() => {
                  const shopName = shop.replace('.myshopify.com', '');
                  const themeEditorUrl = `https://admin.shopify.com/store/${shopName}/themes/current/editor?context=apps`;
                  window.open(themeEditorUrl, '_blank');
                }}
                style={{
                  padding: '12px 30px',
                  fontSize: '16px',
                  fontWeight: '600',
                  color: 'white',
                  background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                  border: 'none',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  boxShadow: '0 10px 25px rgba(139, 92, 246, 0.4)',
                  transition: 'all 0.3s ease'
                }}
              >
                🎨 Abrir Editor de Tema
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}