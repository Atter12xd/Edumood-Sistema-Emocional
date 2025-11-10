import * as React from "react";
import { useState, useEffect } from 'react';

// Configuración de API centralizada
const API_CONFIG = {
  BASE_URL: 'https://essent-backen-production.up.railway.app',
  ENDPOINTS: {
    WHATSAPP: {
      CREAR: (userId: string) => `/whatsapp/crear/${userId}`,
      OBTENER: (userId: string) => `/whatsapp/obtener/${userId}`,
      SIGUIENTE: (userId: string) => `/whatsapp/siguiente/${userId}`,
      ELIMINAR: (userId: string, numero: string) => `/whatsapp/eliminar/${userId}/${numero}`,
      ACTUALIZAR: (userId: string, numeroViejo: string) => `/whatsapp/actualizar/${userId}/${numeroViejo}`
    }
  },
  HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
};

// Códigos de país con banderas
const COUNTRY_CODES = [
  { code: '+51', country: 'PE', flag: '🇵🇪', name: 'Perú' },
  { code: '+1', country: 'US', flag: '🇺🇸', name: 'Estados Unidos' },
  { code: '+34', country: 'ES', flag: '🇪🇸', name: 'España' },
  { code: '+52', country: 'MX', flag: '🇲🇽', name: 'México' },
  { code: '+54', country: 'AR', flag: '🇦🇷', name: 'Argentina' },
  { code: '+56', country: 'CL', flag: '🇨🇱', name: 'Chile' },
  { code: '+57', country: 'CO', flag: '🇨🇴', name: 'Colombia' },
  { code: '+58', country: 'VE', flag: '🇻🇪', name: 'Venezuela' },
  { code: '+593', country: 'EC', flag: '🇪🇨', name: 'Ecuador' },
  { code: '+591', country: 'BO', flag: '🇧🇴', name: 'Bolivia' },
  { code: '+55', country: 'BR', flag: '🇧🇷', name: 'Brasil' },
  { code: '+33', country: 'FR', flag: '🇫🇷', name: 'Francia' },
  { code: '+44', country: 'GB', flag: '🇬🇧', name: 'Reino Unido' },
  { code: '+49', country: 'DE', flag: '🇩🇪', name: 'Alemania' },
  { code: '+39', country: 'IT', flag: '🇮🇹', name: 'Italia' }
];

// Helper function para construir URLs completas
const buildApiUrl = (endpoint: string): string => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

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

interface WhatsAppNumber {
  id: string;
  numero: string;
  nombre: string;
  activo: boolean;
  fechaCreacion: string;
}

interface WhatsAppManagerProps {
  propietario: Owner | null;
  onNumberSelect?: (countryCode: string, phoneNumber: string) => void;
}
// Función para mostrar alert personalizado bonito
const mostrarAlertBonito = (numero: string): Promise<boolean> => {
  return new Promise((resolve) => {
    // Crear el modal dinámicamente
    const modal = document.createElement('div');
    modal.innerHTML = `
      <style>
        .alert-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.7);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10000;
          animation: fadeIn 0.3s ease-out;
        }
        .alert-content {
          background: linear-gradient(145deg, #ffffff 0%, #f8fafc 100%);
          border-radius: 24px;
          padding: 40px;
          max-width: 450px;
          width: 90%;
          box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
          animation: slideIn 0.3s ease-out;
          border: 2px solid rgba(255, 255, 255, 0.2);
        }
        .alert-icon {
          width: 80px;
          height: 80px;
          background: linear-gradient(135deg, #f59e0b 0%, #ef4444 100%);
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 24px;
          font-size: 36px;
          animation: bounce 0.6s ease-out;
        }
        .alert-title {
          font-size: 24px;
          font-weight: 700;
          color: #1f2937;
          text-align: center;
          margin: 0 0 16px 0;
        }
        .alert-message {
          font-size: 16px;
          color: #6b7280;
          text-align: center;
          margin: 0 0 24px 0;
          line-height: 1.5;
        }
        .alert-number {
          background: linear-gradient(135deg, #fef3c7 0%, #fed7aa 100%);
          padding: 16px 20px;
          border-radius: 12px;
          text-align: center;
          margin: 0 0 32px 0;
          border: 2px solid rgba(251, 191, 36, 0.3);
        }
        .alert-number span {
          font-size: 18px;
          font-weight: 600;
          color: #92400e;
        }
        .alert-buttons {
          display: flex;
          gap: 12px;
          justify-content: center;
        }
        .alert-btn {
          padding: 14px 28px;
          border: none;
          border-radius: 12px;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          min-width: 100px;
        }
        .alert-btn-cancel {
          background: linear-gradient(135deg, #6b7280 0%, #4b5563 100%);
          color: white;
        }
        .alert-btn-cancel:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 16px rgba(107, 114, 128, 0.4);
        }
        .alert-btn-confirm {
          background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
          color: white;
        }
        .alert-btn-confirm:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 16px rgba(239, 68, 68, 0.4);
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideIn {
          from { 
            opacity: 0;
            transform: scale(0.9) translateY(-20px);
          }
          to { 
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        @keyframes bounce {
          0%, 20%, 53%, 80%, 100% {
            animation-timing-function: cubic-bezier(0.215, 0.610, 0.355, 1.000);
            transform: translate3d(0,0,0);
          }
          40%, 43% {
            animation-timing-function: cubic-bezier(0.755, 0.050, 0.855, 0.060);
            transform: translate3d(0, -8px, 0);
          }
          70% {
            animation-timing-function: cubic-bezier(0.755, 0.050, 0.855, 0.060);
            transform: translate3d(0, -4px, 0);
          }
          90% {
            transform: translate3d(0,-1px,0);
          }
        }
      </style>
      
      <div class="alert-backdrop">
        <div class="alert-content">
          <div class="alert-icon">⚠️</div>
          <h3 class="alert-title">¿Eliminar número?</h3>
          <p class="alert-message">Esta acción eliminará permanentemente el número de WhatsApp de tu lista.</p>
          <div class="alert-number">
            <span>📱 ${numero}</span>
          </div>
          <div class="alert-buttons">
            <button class="alert-btn alert-btn-cancel" onclick="cancelarAlert()">Cancelar</button>
            <button class="alert-btn alert-btn-confirm" onclick="confirmarAlert()">Eliminar</button>
          </div>
        </div>
      </div>
    `;

    // Agregar al body
    document.body.appendChild(modal);

    // Funciones globales para los botones
    (window as any).cancelarAlert = () => {
      document.body.removeChild(modal);
      resolve(false);
    };

    (window as any).confirmarAlert = () => {
      document.body.removeChild(modal);
      resolve(true);
    };
  });
};
export default function WhatsAppManager({ propietario, onNumberSelect }: WhatsAppManagerProps) {
  // Estados para gestión de números WhatsApp
  const [whatsappNumbers, setWhatsappNumbers] = useState<WhatsAppNumber[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newNumberName, setNewNumberName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [showWhatsappSection, setShowWhatsappSection] = useState(false);
  const [selectedCountryCode, setSelectedCountryCode] = useState('+51');

  // Funciones para gestión de números WhatsApp
  const obtenerNumerosWhatsApp = async () => {
    if (!propietario?.shopId) return;

    setLoading(true);
    setError(null);

    try {
      const encodedShopId = encodeURIComponent(propietario.shopId);
      const endpoint = API_CONFIG.ENDPOINTS.WHATSAPP.OBTENER(encodedShopId);
      const fullUrl = buildApiUrl(endpoint);

      console.log('🔍 Obteniendo números desde:', fullUrl);
      console.log('🏪 Shop ID:', propietario.shopId);

      const response = await fetch(fullUrl);

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('✅ Respuesta completa del servidor:', JSON.stringify(data, null, 2));

      // El backend devuelve { numeros: [...] }, extraer solo el array
      const numerosArray = data.numeros || [];
      setWhatsappNumbers(numerosArray.map((numero: string, index: number) => ({
        id: index.toString(),
        numero: numero,
        nombre: `Número ${index + 1}`,
        activo: true,
        fechaCreacion: new Date().toISOString()
      })));

      console.log('✅ Números WhatsApp obtenidos:', numerosArray);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
      console.error('❌ Error obteniendo números:', err);
    } finally {
      setLoading(false);
    }
  };

  const crearNumeroWhatsApp = async () => {
    console.log('🎬 [INICIO] Función crearNumeroWhatsApp ejecutándose...');

    if (!propietario?.shopId || !newNumber.trim() || !newNumberName.trim()) {
      console.error('❌ [VALIDACIÓN] Faltan campos requeridos');
      setError('Por favor completa todos los campos');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const encodedShopId = encodeURIComponent(propietario.shopId);
      const endpoint = API_CONFIG.ENDPOINTS.WHATSAPP.CREAR(encodedShopId);
      const fullUrl = buildApiUrl(endpoint);

      // Combinar código de país con número
      const fullNumber = selectedCountryCode + newNumber.trim();

      const requestBody = {
        numero: fullNumber,
        nombre: newNumberName.trim(),
        activo: true
      };

      console.log('📱 [REQUEST BODY] Datos a enviar:', requestBody);

      const response = await fetch(fullUrl, {
        method: 'POST',
        headers: API_CONFIG.HEADERS,
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error ${response.status}: ${response.statusText} - ${errorText}`);
      }

      const data = await response.json();
      console.log('✅ [SUCCESS] Número creado exitosamente:', data);

      // Limpiar formulario
      setNewNumber('');
      setNewNumberName('');
      setSelectedCountryCode('+51');

      // Recargar lista
      await obtenerNumerosWhatsApp();

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error creando número';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Función para eliminar con confirmación usando alert bonito
  const eliminarNumero = async (numero: string) => {
    const confirmacion = await mostrarAlertBonito(numero);

    if (!confirmacion) return;

    if (!propietario?.shopId) return;

    setLoading(true);
    setError(null);

    try {
      const encodedShopId = encodeURIComponent(propietario.shopId);
      const encodedNumero = encodeURIComponent(numero);
      const endpoint = API_CONFIG.ENDPOINTS.WHATSAPP.ELIMINAR(encodedShopId, encodedNumero);
      const fullUrl = buildApiUrl(endpoint);

      console.log('🗑️ Eliminando número desde:', fullUrl);

      const response = await fetch(fullUrl, {
        method: 'DELETE',
        headers: API_CONFIG.HEADERS
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      // console.log('✅ Número eliminado exitosamente');
      // alert('Número eliminado exitosamente');

      // Recargar lista
      await obtenerNumerosWhatsApp();

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error eliminando número');
      console.error('❌ Error eliminando número:', err);
    } finally {
      setLoading(false);
    }
  };

  // Función para usar número (enviar al formulario principal)
  const usarNumero = (numero: string) => {
    if (onNumberSelect) {
      // Separar código de país del número
      const countryCode = COUNTRY_CODES.find(cc => numero.startsWith(cc.code));
      if (countryCode) {
        const phoneNumber = numero.substring(countryCode.code.length);
        onNumberSelect(countryCode.code, phoneNumber);
        console.log('📱 Número enviado al formulario:', { code: countryCode.code, number: phoneNumber });
      } else {
        // Si no se encuentra el código, usar el número completo
        onNumberSelect('', numero);
      }
    }
  };

  // Cargar números al mostrar la sección
  useEffect(() => {
    if (showWhatsappSection && propietario?.shopId) {
      console.log('🔄 Auto-cargando números para Shop ID:', propietario.shopId);
      obtenerNumerosWhatsApp();
    }
  }, [showWhatsappSection, propietario?.shopId]);

  if (!propietario) return null;

  return (
    <>
      {/* Sección de Gestión de Números WhatsApp */}
      <div style={{
        marginBottom: '40px',
        padding: '40px',
        background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
        borderRadius: '24px',
        border: '1px solid #e2e8f0',
        boxShadow: '0 20px 40px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.6)'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '32px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{
              width: '56px',
              height: '56px',
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              borderRadius: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px',
              color: 'white',
              boxShadow: '0 12px 24px rgba(16, 185, 129, 0.4), inset 0 1px 0 rgba(255,255,255,0.3)'
            }}>
              📱
            </div>
            <div>
              <h3 style={{
                margin: '0',
                fontSize: '24px',
                fontWeight: '700',
                color: '#1e293b',
                lineHeight: '1.2'
              }}>
                Gestión de Números WhatsApp
              </h3>
              <p style={{
                margin: '0',
                fontSize: '15px',
                color: '#64748b',
                fontWeight: '500'
              }}>
                Sistema de rotación automática inteligente
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowWhatsappSection(!showWhatsappSection)}
            style={{
              padding: '14px 28px',
              background: showWhatsappSection
                ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'
                : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '16px',
              cursor: 'pointer',
              fontSize: '15px',
              fontWeight: '600',
              boxShadow: showWhatsappSection
                ? '0 12px 24px rgba(239, 68, 68, 0.4)'
                : '0 12px 24px rgba(16, 185, 129, 0.4)',
              transition: 'all 0.3s ease',
              transform: 'translateY(0)',
            }}
            onMouseEnter={(e) => e.target.style.transform = 'translateY(-3px)'}
            onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
          >
            {showWhatsappSection ? '✕ Ocultar' : '👁 Mostrar'}
          </button>
        </div>

        {showWhatsappSection && (
          <div style={{ display: 'grid', gap: '32px' }}>

            {/* Formulario para crear nuevo número con selector de país */}
            <div style={{
              padding: '36px',
              backgroundColor: 'white',
              borderRadius: '20px',
              border: '1px solid #e2e8f0',
              boxShadow: '0 8px 32px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.9)'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                marginBottom: '28px'
              }}>
                <div style={{
                  width: '44px',
                  height: '44px',
                  background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '20px',
                  color: 'white',
                  boxShadow: '0 8px 16px rgba(59, 130, 246, 0.3)'
                }}>
                  ➕
                </div>
                <h4 style={{
                  margin: '0',
                  fontSize: '20px',
                  fontWeight: '600',
                  color: '#1e293b'
                }}>
                  Agregar Nuevo Número
                </h4>
              </div>
              <div style={{
                display: 'grid',
                gridTemplateColumns: '220px 1fr 1fr',
                gap: '20px',
                marginBottom: '32px'
              }}>
                {/* Selector de código de país */}
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#374151',
                    marginBottom: '8px',
                    letterSpacing: '0.025em'
                  }}>
                    País
                  </label>
                  <select
                    value={selectedCountryCode}
                    onChange={(e) => setSelectedCountryCode(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '14px',
                      outline: 'none',
                      transition: 'all 0.2s ease',
                      backgroundColor: '#ffffff',
                      fontWeight: '500',
                      cursor: 'pointer',
                      color: '#111827',
                      boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                      appearance: 'none',
                      backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
                      backgroundPosition: 'right 12px center',
                      backgroundRepeat: 'no-repeat',
                      backgroundSize: '16px',
                      paddingRight: '40px'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#3b82f6';
                      e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#d1d5db';
                      e.target.style.boxShadow = '0 1px 2px 0 rgba(0, 0, 0, 0.05)';
                    }}
                  >
                    {COUNTRY_CODES.map((country) => (
                      <option key={country.code} value={country.code}>
                        {country.flag} {country.code} {country.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#374151',
                    marginBottom: '8px',
                    letterSpacing: '0.025em'
                  }}>
                    Número WhatsApp
                  </label>
                  <input
                    type="text"
                    value={newNumber}
                    onChange={(e) => setNewNumber(e.target.value)}
                    placeholder="987654321"
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '14px',
                      outline: 'none',
                      transition: 'all 0.2s ease',
                      backgroundColor: '#ffffff',
                      fontWeight: '500',
                      color: '#111827',
                      boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                      boxSizing: 'border-box'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#3b82f6';
                      e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#d1d5db';
                      e.target.style.boxShadow = '0 1px 2px 0 rgba(0, 0, 0, 0.05)';
                    }}
                  />
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#374151',
                    marginBottom: '8px',
                    letterSpacing: '0.025em'
                  }}>
                    Descripción
                  </label>
                  <input
                    type="text"
                    value={newNumberName}
                    onChange={(e) => setNewNumberName(e.target.value)}
                    placeholder="Ej: Ventas Principal"
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '14px',
                      outline: 'none',
                      transition: 'all 0.2s ease',
                      backgroundColor: '#ffffff',
                      fontWeight: '500',
                      color: '#111827',
                      boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                      boxSizing: 'border-box'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#3b82f6';
                      e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#d1d5db';
                      e.target.style.boxShadow = '0 1px 2px 0 rgba(0, 0, 0, 0.05)';
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
                <button
                  onClick={crearNumeroWhatsApp}
                  disabled={loading || !newNumber.trim() || !newNumberName.trim()}
                  style={{
                    flex: 1,
                    maxWidth: '300px',
                    padding: '18px 32px',
                    background: (loading || !newNumber.trim() || !newNumberName.trim())
                      ? '#94a3b8'
                      : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '16px',
                    cursor: (loading || !newNumber.trim() || !newNumberName.trim()) ? 'not-allowed' : 'pointer',
                    fontSize: '16px',
                    fontWeight: '600',
                    boxShadow: (loading || !newNumber.trim() || !newNumberName.trim())
                      ? 'none'
                      : '0 12px 24px rgba(16, 185, 129, 0.4)',
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '12px'
                  }}
                  onMouseEnter={(e) => {
                    if (!loading && newNumber.trim() && newNumberName.trim()) {
                      e.target.style.transform = 'translateY(-2px)';
                      e.target.style.boxShadow = '0 16px 32px rgba(16, 185, 129, 0.5)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!loading && newNumber.trim() && newNumberName.trim()) {
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = '0 12px 24px rgba(16, 185, 129, 0.4)';
                    }
                  }}
                >
                  {loading ? (
                    <>
                      <div style={{
                        width: '20px',
                        height: '20px',
                        border: '2px solid rgba(255,255,255,0.3)',
                        borderTop: '2px solid white',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite'
                      }}></div>
                      Creando...
                    </>
                  ) : (
                    <>
                      <span style={{ fontSize: '18px' }}>✨</span>
                      Agregar Número
                    </>
                  )}
                </button>

              </div>
            </div>

            {/* Mostrar error si existe */}
            {error && (
              <div style={{
                padding: '20px 24px',
                background: 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)',
                border: '1px solid #fecaca',
                borderRadius: '16px',
                color: '#dc2626',
                fontSize: '15px',
                fontWeight: '500',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                boxShadow: '0 4px 12px rgba(239, 68, 68, 0.1)'
              }}>
                <span style={{ fontSize: '20px' }}>⚠️</span>
                {error}
              </div>
            )}

            {/* Lista de números existentes */}
            {whatsappNumbers.length > 0 && (
              <div style={{
                padding: '36px',
                backgroundColor: 'white',
                borderRadius: '20px',
                border: '1px solid #e2e8f0',
                boxShadow: '0 8px 32px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.9)'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  marginBottom: '28px'
                }}>
                  <div style={{
                    width: '44px',
                    height: '44px',
                    background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '20px',
                    color: 'white',
                    boxShadow: '0 8px 16px rgba(139, 92, 246, 0.3)'
                  }}>
                    📋
                  </div>
                  <h4 style={{
                    margin: '0',
                    fontSize: '20px',
                    fontWeight: '600',
                    color: '#1e293b'
                  }}>
                    Números Activos ({whatsappNumbers.length})
                  </h4>
                </div>

                <div style={{
                  display: 'grid',
                  gap: '16px',
                  maxHeight: '400px',
                  overflowY: 'auto',
                  paddingRight: '8px'
                }}>
                  {whatsappNumbers.map((num, index) => {
                    // Encontrar el código de país y bandera
                    const countryInfo = COUNTRY_CODES.find(cc => num.numero.startsWith(cc.code));
                    const flag = countryInfo?.flag || '🌍';
                    const countryName = countryInfo?.name || 'Internacional';

                    return (
                      <div
                        key={index}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '24px 28px',
                          background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
                          border: '2px solid #e2e8f0',
                          borderRadius: '20px',
                          fontSize: '15px',
                          transition: 'all 0.3s ease',
                          cursor: 'pointer',
                          position: 'relative',
                          overflow: 'hidden'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'translateY(-4px)';
                          e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.12)';
                          e.currentTarget.style.borderColor = '#10b981';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = 'none';
                          e.currentTarget.style.borderColor = '#e2e8f0';
                        }}
                      >
                        {/* Efecto de brillo sutil */}
                        <div style={{
                          position: 'absolute',
                          top: '0',
                          left: '0',
                          right: '0',
                          height: '1px',
                          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.8), transparent)'
                        }}></div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                          <div style={{
                            width: '52px',
                            height: '52px',
                            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                            borderRadius: '16px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '18px',
                            color: 'white',
                            fontWeight: '700',
                            boxShadow: '0 8px 16px rgba(16, 185, 129, 0.3), inset 0 1px 0 rgba(255,255,255,0.3)'
                          }}>
                            {flag}
                          </div>
                          <div>
                            <div style={{
                              fontWeight: '600',
                              color: '#1e293b',
                              fontSize: '17px',
                              marginBottom: '4px',
                              letterSpacing: '-0.02em'
                            }}>
                              {num.numero}
                            </div>
                            <div style={{
                              color: '#64748b',
                              fontSize: '14px',
                              fontWeight: '500'
                            }}>
                              {countryName} • {num.nombre}
                            </div>
                          </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          {/* Indicador de estado activo */}
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '6px 12px',
                            background: 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)',
                            border: '1px solid #86efac',
                            borderRadius: '12px'
                          }}>
                            <div style={{
                              width: '8px',
                              height: '8px',
                              backgroundColor: '#10b981',
                              borderRadius: '50%',
                              animation: 'pulse 2s infinite'
                            }}></div>
                            <span style={{
                              fontSize: '12px',
                              fontWeight: '600',
                              color: '#059669'
                            }}>
                              Activo
                            </span>
                          </div>

                          {/* Botón Eliminar */}
                          <button
                            onClick={() => eliminarNumero(num.numero)}
                            disabled={loading}
                            style={{
                              padding: '10px 16px',
                              background: loading
                                ? '#94a3b8'
                                : 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                              color: 'white',
                              border: 'none',
                              borderRadius: '12px',
                              cursor: loading ? 'not-allowed' : 'pointer',
                              fontSize: '13px',
                              fontWeight: '600',
                              boxShadow: loading
                                ? 'none'
                                : '0 4px 12px rgba(239, 68, 68, 0.3)',
                              transition: 'all 0.2s ease'
                            }}
                            onMouseEnter={(e) => {
                              if (!loading) {
                                e.target.style.transform = 'scale(1.05)';
                                e.target.style.boxShadow = '0 8px 20px rgba(239, 68, 68, 0.4)';
                              }
                            }}
                            onMouseLeave={(e) => {
                              if (!loading) {
                                e.target.style.transform = 'scale(1)';
                                e.target.style.boxShadow = '0 4px 12px rgba(239, 68, 68, 0.3)';
                              }
                            }}
                          >
                            🗑️ Eliminar
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Mensaje si no hay números y no está cargando */}
            {!loading && whatsappNumbers.length === 0 && (
              <div style={{
                textAlign: 'center',
                padding: '48px 24px',
                background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
                borderRadius: '20px',
                border: '2px dashed rgba(148, 163, 184, 0.5)',
                marginTop: '24px'
              }}>
                <div style={{
                  fontSize: '48px',
                  marginBottom: '16px'
                }}>
                  📱
                </div>
                <h4 style={{
                  margin: '0 0 8px 0',
                  fontSize: '18px',
                  fontWeight: '600',
                  color: '#475569'
                }}>
                  No hay números registrados
                </h4>
                <p style={{
                  margin: '0',
                  fontSize: '14px',
                  color: '#64748b'
                }}>
                  Agrega tu primer número de WhatsApp para comenzar
                </p>
              </div>
            )}

            {/* Indicador de carga */}
            {loading && (
              <div style={{
                textAlign: 'center',
                padding: '32px',
                background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
                borderRadius: '20px',
                border: '2px solid rgba(59, 130, 246, 0.2)',
                marginTop: '24px'
              }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  border: '4px solid rgba(59, 130, 246, 0.3)',
                  borderTop: '4px solid #3b82f6',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite',
                  margin: '0 auto 16px'
                }} />
                <p style={{
                  margin: '0',
                  fontSize: '16px',
                  fontWeight: '600',
                  color: '#1e40af'
                }}>
                  Cargando números...
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Estilos CSS para animaciones */}
      <style>
        {`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
          }
        `}
      </style>
    </>
  );
}