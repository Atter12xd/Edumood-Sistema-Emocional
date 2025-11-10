// D:\VICTOR SHOPIFY\CODIGOS\Essential\essential\app\routes\codform\codform.tsx
import React from 'react';
import { useLoaderData } from '@remix-run/react';
import DesignPanel from './components/DesignPanel';
import PreviewPanel from './components/PreviewPanel';
import FormContent from './components/FormContent';
import { codFormStyles } from './styles/codform.styles';
import type { CodFormLoaderData } from './types/codform.types';
import { useCodFormState } from './hooks/useCodFormState';

export default function CodForm() {
  const loaderData = useLoaderData<CodFormLoaderData>();
  const { state, actions } = useCodFormState(loaderData);

  const {
    isMounted,
    isDesktop,
    hasChanges,
    isSaving,
    isLoading,
    savedFormId,
    saveStatus,
    formData,
    formType,
          formStyle,
    buttonConfig,
    errorMessages,
          blocks,
          blockOrder,
          blockColors,
    formErrors,
    showModal,
    product,
  } = state;

  const {
    setShowModal,
    setFormType,
    handleInputChange,
    handleStyleChange,
    handleBlockToggle,
    handleBlockReorder,
    handleBlockColorsChange,
    handleBlockConfigChange,
    handleErrorMessageChange,
    handleButtonConfigChange,
    handleSubmit,
    handleSave,
    handleDiscard,
  } = actions;

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
              onClick={() => void handleSave()}
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
            formErrors={formErrors}
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
                formErrors={formErrors}
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