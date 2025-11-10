// D:\VICTOR SHOPIFY\CODIGOS\Essential\essential\app\routes\codform\codform.tsx
import React, { useState, useEffect } from 'react';
import { useLoaderData } from '@remix-run/react';
import DesignPanel from './components/DesignPanel';
import PreviewPanel from './components/PreviewPanel';
import FormContent from './components/FormContent';
import { FormData, FormStyle, Blocks, ErrorMessages, Product, BlockConfig, BlockColors } from './types/codform.types';
import { codFormStyles } from './styles/codform.styles';

// URL base de Railway
const RAILWAY_API_URL = 'https://essent-backen-production.up.railway.app/cod-forms';

export interface ButtonConfig {
  text: string;
  subtitle: string;
  animation: string;
  icon: string;
  position: string;
  bgColor: string;
  textColor: string;
  textSize: number;
  borderRadius: number;
  borderWidth: number;
  borderColor: string;
  shadow: number;
  enableMobile: boolean;
}

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

export default function CodForm() {
  const [isMounted, setIsMounted] = useState(false);
  const [isDesktop, setIsDesktop] = useState(true);
  const [hasChanges, setHasChanges] = useState(false);
  const [propietario, setPropietario] = useState<Owner | null>(null);
  const [savedFormId, setSavedFormId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });

  // Obtener datos del loader
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

  useEffect(() => {
    setIsMounted(true);
    
    const checkScreenSize = () => {
      if (typeof window !== 'undefined') {
        setIsDesktop(window.innerWidth >= 1024);
      }
    };
    
    checkScreenSize();
    
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', checkScreenSize);
      return () => window.removeEventListener('resize', checkScreenSize);
    }
  }, []);

  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    phone: '',
    address: '',
    address2: '',
    province: '',
    city: '',
    zipCode: '',
    email: '',
    orderNote: '',
    shippingMethod: 'standard',
    discountCode: '',
    newsletter: false,
    terms: false
  });

  const [showModal, setShowModal] = useState(false);
  const [formType, setFormType] = useState('popup');
  
  const [formStyle, setFormStyle] = useState<FormStyle>({
    textColor: 'rgba(0,0,0,1)',
    textSize: 14,
    backgroundColor: 'rgba(255,255,255,1)',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: 'rgba(0,0,0,1)',
    shadow: 4,
    hideCloseButton: false,
    hideFieldLabels: false,
    enableRTL: false,
    enableFullScreen: false
  });

  const [buttonConfig, setButtonConfig] = useState<ButtonConfig>({
    text: 'COMPRAR AHORA',
    subtitle: '',
    animation: 'Ninguna',
    icon: 'Icono de botón',
    position: 'Abajo',
    bgColor: 'rgb(99, 102, 241)',
    textColor: 'rgba(255,255,255,1)',
    textSize: 16,
    borderRadius: 6,
    borderWidth: 0,
    borderColor: 'rgba(0,0,0,1)',
    shadow: 4,
    enableMobile: true
  });

  const [errorMessages, setErrorMessages] = useState<ErrorMessages>({
    required: 'Este campo es obligatorio.',
    invalid: 'Introduce un valor válido.'
  });

  const [blocks, setBlocks] = useState<Blocks>({
    orderSummary: { active: true, visible: true },
    shippingRates: { active: true, visible: true },
    totalSummary: { active: true, visible: true },
    discountCodes: { active: true, visible: true },
    shippingAddress: { active: true, visible: true },
    firstName: { active: true, visible: true },
    lastName: { active: true, visible: true },
    phone: { active: true, visible: true },
    address: { active: true, visible: true },
    address2: { active: true, visible: true },
    province: { active: true, visible: true },
    city: { active: true, visible: true },
    postalCode: { active: true, visible: true },
    email: { active: true, visible: true },
    orderNote: { active: true, visible: true },
    newsletter: { active: true, visible: true },
    terms: { active: true, visible: true },
    submitButton: { active: true, visible: true }
  });

  const [blockOrder, setBlockOrder] = useState<string[]>([
    'orderSummary',
    'shippingRates',
    'totalSummary',
    'discountCodes',
    'shippingAddress',
    'firstName',
    'lastName',
    'phone',
    'address',
    'address2',
    'province',
    'city',
    'postalCode',
    'email',
    'orderNote',
    'newsletter',
    'terms',
    'submitButton'
  ]);

  const [blockColors, setBlockColors] = useState<BlockColors>({
    textColor: '#1f2937',
    textSize: 14,
    bgColor: '#ffffff',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#e5e7eb',
    shadow: 4
  });

  const product: Product = {
    name: "Knitted Throw Pillows",
    price: 19.99,
    currency: "S/.",
    image: "🛋️"
  };

  // ============================================
  // FUNCIONES RAILWAY API
  // ============================================

  // Cargar formulario existente al montar
  useEffect(() => {
    if (propietario?.shopId) {
      loadExistingForm();
    }
  }, [propietario?.shopId]);

  const loadExistingForm = async () => {
    if (!propietario?.shopId) return;

    try {
      setIsLoading(true);

      // GET /cod-forms?idusuarios={shopId}
      const response = await fetch(
        `${RAILWAY_API_URL}?idusuarios=${propietario.shopId}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error('Error al cargar formularios');
      }

      const result = await response.json();

      if (result.success && result.data && result.data.length > 0) {
        const existingForm = result.data[0];
        setSavedFormId(existingForm.id);

        const loadedConfig = existingForm.form_config;
        const modalidad = existingForm.form_type === 'popup' ? 'popup' : 'embedded';

        // Actualizar estados con los datos cargados
        setFormType(modalidad);
        setFormStyle(loadedConfig.formStyle || formStyle);
        setBlocks(loadedConfig.blocks || blocks);
        setBlockOrder(loadedConfig.blockOrder || blockOrder);
        setBlockColors(loadedConfig.blockColors || blockColors);
        setButtonConfig(loadedConfig.buttonConfig || buttonConfig);
        setErrorMessages(loadedConfig.errorMessages || errorMessages);

        console.log('✅ Formulario cargado:', existingForm.id);
      } else {
        console.log('ℹ️ No se encontraron formularios existentes');
      }
    } catch (error) {
      console.error('❌ Error al cargar formulario:', error);
      setSaveStatus({
        type: 'error',
        message: 'Error al cargar formulario existente',
      });
      setTimeout(() => setSaveStatus({ type: null, message: '' }), 5000);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveToRailway = async () => {
    if (!propietario?.shopId) {
      setSaveStatus({
        type: 'error',
        message: 'No se encontró información del propietario',
      });
      return;
    }

    try {
      setIsSaving(true);
      setSaveStatus({ type: null, message: '' });

      const bodyData = {
        idusuarios: propietario.shopId,
        name: `Formulario COD - ${propietario.shopName || 'Mi Tienda'}`,
        form_type: formType,
        country: propietario.country || 'Peru',
        shopify_shop_url: propietario.shopName
          ? `https://${propietario.shopName}.myshopify.com`
          : '',
        product_name: product.name,
        product_price: product.price,
        product_currency: product.currency,
        product_image: product.image,
        form_config: {
          formStyle,
          blocks,
          blockOrder,
          blockColors,
          buttonConfig: formType === 'popup' ? buttonConfig : null,
          errorMessages,
        },
      };

      const url = savedFormId
        ? `${RAILWAY_API_URL}/${savedFormId}`
        : RAILWAY_API_URL;

      const method = savedFormId ? 'PATCH' : 'POST';

      console.log(`🚀 ${method} ${url}`);
      console.log('📦 Body:', JSON.stringify(bodyData, null, 2));

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bodyData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al guardar formulario');
      }

      const result = await response.json();

      if (result.success) {
        setSavedFormId(result.data.id);
        setSaveStatus({
          type: 'success',
          message: savedFormId
            ? '✅ Formulario actualizado exitosamente'
            : '✅ Formulario creado exitosamente',
        });

        setHasChanges(false);
        console.log('✅ Formulario guardado:', result.data.id);

        setTimeout(() => {
          setSaveStatus({ type: null, message: '' });
        }, 3000);
      } else {
        throw new Error(result.message || 'Error al guardar');
      }
    } catch (error: any) {
      console.error('❌ Error al guardar:', error);
      setSaveStatus({
        type: 'error',
        message: error.message || 'Error al guardar el formulario',
      });

      setTimeout(() => {
        setSaveStatus({ type: null, message: '' });
      }, 5000);
    } finally {
      setIsSaving(false);
    }
  };

  // ============================================
  // HANDLERS ORIGINALES
  // ============================================

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    setHasChanges(true);
  };

  const handleStyleChange = (property: string, value: any) => {
    setFormStyle(prev => ({
      ...prev,
      [property]: value
    }));
    setHasChanges(true);
  };

  const handleBlockToggle = (blockName: string, property: string) => {
    setBlocks(prev => {
      const blockKey = blockName as keyof Blocks;
      const currentBlock = prev[blockKey];
      const propertyKey = property as keyof BlockConfig;
      
      return {
        ...prev,
        [blockKey]: {
          ...currentBlock,
          [propertyKey]: !currentBlock[propertyKey]
        }
      };
    });
    setHasChanges(true);
  };

  const handleBlockReorder = (newOrder: string[]) => {
    setBlockOrder(newOrder);
    setHasChanges(true);
  };

  const handleBlockColorsChange = (colors: BlockColors) => {
    setBlockColors(colors);
    setFormType('embedded');
    setHasChanges(true);
  };

  const handleBlockConfigChange = (blockName: string, config: Partial<BlockConfig>) => {
    setBlocks(prev => ({
      ...prev,
      [blockName]: {
        ...prev[blockName as keyof Blocks],
        ...config
      }
    }));
    setFormType('embedded');
    setHasChanges(true);
  };

  const handleErrorMessageChange = (type: string, value: string) => {
    setErrorMessages(prev => ({
      ...prev,
      [type]: value
    }));
    setHasChanges(true);
  };

  const handleButtonConfigChange = (config: ButtonConfig) => {
    setButtonConfig(config);
    setHasChanges(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Order submitted:', formData);
    alert('¡Pedido enviado exitosamente!');
  };

  const handleSave = () => {
    handleSaveToRailway();
  };

  const handleDiscard = () => {
    if (hasChanges) {
      const confirmed = window.confirm('¿Estás seguro de que quieres descartar los cambios?');
      if (confirmed) {
        window.location.reload();
      }
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      }}>
        <div style={{
          textAlign: 'center',
          color: '#fff',
          padding: '40px',
          backgroundColor: 'rgba(255,255,255,0.1)',
          borderRadius: '16px',
          backdropFilter: 'blur(10px)',
        }}>
          <div style={{
            width: '48px',
            height: '48px',
            border: '4px solid rgba(255,255,255,0.3)',
            borderTopColor: '#fff',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 20px',
          }} />
          <p style={{ fontSize: '16px', fontWeight: '500' }}>Cargando formulario...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, system-ui, sans-serif"
    }}>
      {/* HEADER CON BOTONES */}
      {hasChanges && (
        <div style={{
          position: 'sticky',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          backgroundColor: '#374151',
          borderBottom: '1px solid #4b5563',
          padding: isMounted && !isDesktop ? '12px 16px' : '14px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            color: '#fff',
            fontSize: isMounted && !isDesktop ? '14px' : '15px'
          }}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" style={{flexShrink: 0}}>
              <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="2"/>
              <path d="M10 6v4l3 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <span>Cambios no guardados</span>
          </div>
          
          <div style={{
            display: 'flex',
            gap: isMounted && !isDesktop ? '8px' : '12px'
          }}>
            <button
              onClick={handleDiscard}
              disabled={isSaving}
              style={{
                padding: isMounted && !isDesktop ? '8px 16px' : '10px 20px',
                backgroundColor: 'transparent',
                color: '#fff',
                border: '1px solid #6b7280',
                borderRadius: '6px',
                cursor: isSaving ? 'not-allowed' : 'pointer',
                fontSize: isMounted && !isDesktop ? '13px' : '14px',
                fontWeight: '500',
                transition: 'all 0.2s',
                fontFamily: 'inherit',
                opacity: isSaving ? 0.5 : 1,
              }}
              onMouseEnter={(e) => !isSaving && (e.currentTarget.style.backgroundColor = '#4b5563')}
              onMouseLeave={(e) => !isSaving && (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              Descartar
            </button>
            
            <button
              onClick={handleSave}
              disabled={isSaving}
              style={{
                padding: isMounted && !isDesktop ? '8px 16px' : '10px 20px',
                backgroundColor: isSaving ? '#6b7280' : '#10b981',
                color: '#fff',
                border: 'none',
                borderRadius: '6px',
                cursor: isSaving ? 'not-allowed' : 'pointer',
                fontSize: isMounted && !isDesktop ? '13px' : '14px',
                fontWeight: '600',
                transition: 'all 0.2s',
                boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                fontFamily: 'inherit',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
              onMouseEnter={(e) => !isSaving && (e.currentTarget.style.backgroundColor = '#059669')}
              onMouseLeave={(e) => !isSaving && (e.currentTarget.style.backgroundColor = '#10b981')}
            >
              {isSaving && (
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{animation: 'spin 1s linear infinite'}}>
                  <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeDasharray="30" strokeDashoffset="10" opacity="0.3"/>
                </svg>
              )}
              {isSaving ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </div>
      )}

      {/* MENSAJE DE ESTADO (Success/Error) */}
      {saveStatus.type && (
        <div style={{
          position: 'fixed',
          top: '80px',
          right: '20px',
          zIndex: 1001,
          backgroundColor: saveStatus.type === 'success' ? '#10b981' : '#ef4444',
          color: '#fff',
          padding: '12px 20px',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          fontSize: '14px',
          fontWeight: '500',
          animation: 'slideInRight 0.3s ease-out',
        }}>
          {saveStatus.type === 'success' ? '✓' : '✕'}
          {saveStatus.message}
        </div>
      )}

      {/* INFO DEL FORMULARIO GUARDADO */}
      {savedFormId && !hasChanges && (
        <div style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          zIndex: 1001,
          backgroundColor: 'rgba(255,255,255,0.95)',
          color: '#374151',
          padding: '10px 16px',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          fontSize: '12px',
          fontWeight: '500',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}>
          <span style={{color: '#10b981'}}>●</span>
          ID: <code style={{backgroundColor: '#f3f4f6', padding: '2px 6px', borderRadius: '4px'}}>{savedFormId.slice(0, 8)}...</code>
        </div>
      )}

      {/* CONTENIDO PRINCIPAL */}
      <div style={{padding: '20px'}}>
        <div style={{
          ...codFormStyles.container,
          display: 'grid',
          gridTemplateColumns: isMounted && isDesktop ? '1fr 1fr' : '1fr',
          gap: '20px',
          maxWidth: '1600px',
          margin: '0 auto'
        }}>
          <DesignPanel
            formType={formType}
            formStyle={formStyle}
            blocks={blocks}
            blockOrder={blockOrder}
            blockColors={blockColors}
            errorMessages={errorMessages}
            product={product}
            buttonConfig={buttonConfig}
            onFormTypeChange={setFormType}
            onStyleChange={handleStyleChange}
            onBlockToggle={handleBlockToggle}
            onBlockReorder={handleBlockReorder}
            onBlockColorsChange={handleBlockColorsChange}
            onBlockConfigChange={handleBlockConfigChange}
            onErrorMessageChange={handleErrorMessageChange}
            onButtonConfigChange={handleButtonConfigChange}
            onShowModal={() => setShowModal(true)}
          />
          
          <PreviewPanel
            formType={formType}
            formData={formData}
            formStyle={formStyle}
            blocks={blocks}
            product={product}
            blockOrder={blockOrder}
            blockColors={blockColors}
            buttonConfig={buttonConfig}
            onInputChange={handleInputChange}
            onSubmit={handleSubmit}
            onShowModal={() => setShowModal(true)}
          />
        </div>
      </div>

      {/* MODAL */}
      {showModal && (
        <div style={codFormStyles.modalOverlay} onClick={() => setShowModal(false)}>
          <div 
            style={{
              ...codFormStyles.formModal,
              boxShadow: `0 ${formStyle.shadow}px ${formStyle.shadow * 2}px rgba(0, 0, 0, 0.3)`,
              maxWidth: isMounted && isDesktop ? '600px' : '90%',
              width: '100%'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={codFormStyles.modalHeader}>
              <h2 style={{fontSize: isMounted && isDesktop ? '24px' : '20px', fontWeight: '700', color: '#1a1a1a', margin: 0}}>PAGO CONTRA REEMBOLSO</h2>
              {!formStyle.hideCloseButton && (
                <button 
                  style={codFormStyles.closeButton}
                  onClick={() => setShowModal(false)}
                >
                  ×
                </button>
              )}
            </div>
            <div style={codFormStyles.modalContent}>
              <FormContent
                formData={formData}
                formStyle={formStyle}
                blocks={blocks}
                product={product}
                blockOrder={blockOrder}
                blockColors={blockColors}
                onInputChange={handleInputChange}
                onSubmit={handleSubmit}
              />
            </div>
          </div>
        </div>
      )}

      {/* CSS para animaciones */}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes slideInRight {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}