// D:\VICTOR SHOPIFY\CODIGOS\Essential\essential\app\routes\codform\codform.tsx
import React from "react";
import { useLoaderData } from "@remix-run/react";
import DesignPanel from "./components/DesignPanel";
import PreviewPanel from "./components/PreviewPanel";
import FormContent from "./components/FormContent";
import { codFormStyles } from "./styles/codform.styles";
import type { CodFormLoaderData } from "./types/codform.types";
import { useCodFormState } from "./hooks/useCodFormState";

export default function CodForm() {
  const loaderData = useLoaderData<CodFormLoaderData>();
  const { state, actions } = useCodFormState(loaderData);

  const {
    isMounted,
    isDesktop,
    hasChanges,
    isSaving,
    isLoading,
    propietario,
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

  const storeName = propietario?.shopName || loaderData.shop || "Tienda sin nombre";
  const ownerEmail = propietario?.email || "Sin correo asignado";
  const activeBlocks = Object.values(blocks || {}).filter((block) => block?.visible !== false).length;
  const totalBlocks = Object.keys(blocks || {}).length;
  const modeLabel = formType === "popup" ? "Popup interactivo" : "Embebido";
  const formStatusLabel = hasChanges
    ? "Cambios sin guardar"
    : savedFormId
    ? "Sin cambios pendientes"
    : "Formulario nuevo";
  const shortFormId = savedFormId ? `${savedFormId.slice(0, 6)}…` : "—";

  if (isLoading) {
    return (
      <div
        style={{
          ...codFormStyles.page,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            textAlign: "center",
            color: "#1f2937",
            padding: "36px 48px",
            backgroundColor: "rgba(255,255,255,0.85)",
            borderRadius: "20px",
            boxShadow: "0 25px 60px rgba(15,23,42,0.12)",
            backdropFilter: "blur(12px)",
          }}
        >
          <div
            style={{
              width: "48px",
              height: "48px",
              border: "4px solid rgba(44,110,203,0.18)",
              borderTopColor: "#2c6ecb",
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
              margin: "0 auto 18px",
            }}
          />
          <p style={{ fontSize: "16px", fontWeight: 600, color: "#2c6ecb", letterSpacing: "0.04em" }}>
            Preparando el diseñador COD…
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={codFormStyles.page}>
      <div style={codFormStyles.pageContent}>
        <header style={codFormStyles.headerBar}>
          <div style={codFormStyles.headerLeft}>
            <div style={codFormStyles.headerIcon}>🛍️</div>
            <div style={codFormStyles.headerTitleGroup}>
              <span style={codFormStyles.headerTitle}>Essential COD Form Designer</span>
              <span style={codFormStyles.headerSubtitle}>{storeName}</span>
              <div style={codFormStyles.headerMeta}>
                <span style={codFormStyles.metaBadge}>📧 {ownerEmail}</span>
                <span style={codFormStyles.metaBadge}>🆔 Form ID: {shortFormId}</span>
                <span style={codFormStyles.metaBadge}>
                  {hasChanges ? "🟠" : savedFormId ? "🟢" : "⚪️"} {formStatusLabel}
                </span>
              </div>
            </div>
          </div>

          <div style={codFormStyles.headerActions}>
            <button
              type="button"
              onClick={handleDiscard}
              disabled={!hasChanges || isSaving}
              style={{
                ...codFormStyles.headerButtonGhost,
                opacity: !hasChanges || isSaving ? 0.6 : 1,
                cursor: !hasChanges || isSaving ? "not-allowed" : "pointer",
              }}
            >
              Descartar cambios
            </button>
            <button
              type="button"
              onClick={() => setShowModal(true)}
              style={{
                ...codFormStyles.headerButtonSecondary,
                opacity: showModal ? 0.7 : 1,
              }}
            >
              Vista previa
            </button>
            <button
              type="button"
              onClick={() => void handleSave()}
              disabled={isSaving}
              style={{
                ...codFormStyles.headerButtonPrimary,
                opacity: isSaving ? 0.7 : 1,
                cursor: isSaving ? "not-allowed" : "pointer",
              }}
            >
              {isSaving ? "Guardando…" : hasChanges ? "Guardar cambios" : "Guardar"}
            </button>
          </div>
        </header>

        <section style={codFormStyles.insightRow}>
          <article style={codFormStyles.insightCard}>
            <span style={codFormStyles.insightLabel}>Modalidad activa</span>
            <span style={codFormStyles.insightValue}>{modeLabel}</span>
            <span style={codFormStyles.insightContext}>
              Cambia entre popup o embebido sin perder configuraciones guardadas.
            </span>
          </article>
          <article style={codFormStyles.insightCard}>
            <span style={codFormStyles.insightLabel}>Bloques visibles</span>
            <span style={codFormStyles.insightValue}>
              {activeBlocks} / {totalBlocks}
            </span>
            <span style={codFormStyles.insightContext}>
              Control granular de cada sección del formulario de conversión.
            </span>
          </article>
          <article style={codFormStyles.insightCard}>
            <span style={codFormStyles.insightLabel}>Estilos personalizados</span>
            <span style={codFormStyles.insightValue}>
              {`${Math.round(formStyle.textSize)}px · ${formStyle.borderRadius}px`}
            </span>
            <span style={codFormStyles.insightContext}>
              Textos, radios y colores listos para alinearse con tu branding.
            </span>
          </article>
        </section>

        <div
          style={{
            ...codFormStyles.layoutGrid,
            gridTemplateColumns: isMounted && isDesktop ? "minmax(0, 480px) minmax(0, 1fr)" : "1fr",
          }}
        >
          <div style={codFormStyles.configColumn}>
            <div style={codFormStyles.surfaceCard}>
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
            </div>
          </div>

          <div>
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
      </div>

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

      {/* MODAL */}
      {showModal && (
        <div 
          style={{
            ...codFormStyles.modalOverlay,
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.75)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px',
            overflowY: 'auto',
          }} 
          onClick={() => setShowModal(false)}
        >
          <div 
            style={{
              ...codFormStyles.formModal,
              boxShadow: formStyle.shadow > 0
                ? `0 ${formStyle.shadow}px ${formStyle.shadow * 2}px rgba(0, 0, 0, 0.35)`
                : '0 20px 60px rgba(0, 0, 0, 0.3)',
              maxWidth: formStyle.enableFullScreen
                ? '98%'
                : isMounted && isDesktop
                ? '700px'
                : '95%',
              width: formStyle.enableFullScreen ? '100%' : '100%',
              borderRadius: `${formStyle.borderRadius}px`,
              border: `${formStyle.borderWidth}px solid ${formStyle.borderColor}`,
              background: formStyle.backgroundColor,
              maxHeight: '95vh',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              margin: 'auto',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header fijo */}
            <div style={{
              ...codFormStyles.modalHeader,
              position: 'sticky',
              top: 0,
              background: formStyle.backgroundColor,
              zIndex: 10,
              borderBottom: `1px solid ${formStyle.borderColor}`,
              padding: formStyle.enableFullScreen ? '16px 20px' : '20px 25px',
            }}>
              <h2 style={{
                fontSize: isMounted && isDesktop ? '26px' : '22px', 
                fontWeight: '700', 
                color: formStyle.textColor, 
                margin: 0,
                letterSpacing: '0.5px',
              }}>
                PAGO CONTRA REEMBOLSO
              </h2>
              {!formStyle.hideCloseButton && (
                <button 
                  style={{
                    ...codFormStyles.closeButton,
                    background: 'rgba(0, 0, 0, 0.05)',
                    transition: 'all 0.2s ease',
                  }}
                  onClick={() => setShowModal(false)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(0, 0, 0, 0.1)';
                    e.currentTarget.style.transform = 'rotate(90deg)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(0, 0, 0, 0.05)';
                    e.currentTarget.style.transform = 'rotate(0deg)';
                  }}
                >
                  ×
                </button>
              )}
            </div>
            
            {/* Contenido con scroll */}
            <div style={{
              ...codFormStyles.modalContent,
              padding: formStyle.enableFullScreen ? '16px 20px' : '25px',
              background: formStyle.backgroundColor,
              overflowY: 'auto',
              overflowX: 'hidden',
              flex: 1,
              // Scrollbar personalizado
              scrollbarWidth: 'thin',
              scrollbarColor: '#cbd5e1 transparent',
            }}>
              <style>{`
                div::-webkit-scrollbar {
                  width: 8px;
                }
                div::-webkit-scrollbar-track {
                  background: transparent;
                }
                div::-webkit-scrollbar-thumb {
                  background: #cbd5e1;
                  border-radius: 4px;
                }
                div::-webkit-scrollbar-thumb:hover {
                  background: #94a3b8;
                }
              `}</style>
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