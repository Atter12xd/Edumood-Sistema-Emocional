// components/Section1_Modalidad.tsx
import React, { useState } from 'react';
import { codFormStyles } from '../styles/codform.styles';
import { buttonIconsArray } from '../styles/codform.icons';

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

interface Section1Props {
  formType: string;
  buttonConfig: ButtonConfig;
  onFormTypeChange: (type: string) => void;
  onButtonConfigChange: (config: ButtonConfig) => void;
  onShowModal: () => void;
  showHeading?: boolean;
}

const buttonAnimations = {
  none: 'Ninguna',
  shake: 'Sacudida',
  bounce: 'Rebote',
  pulse: 'Pulsación'
};

const Section1_Modalidad: React.FC<Section1Props> = ({
  formType,
  buttonConfig,
  onFormTypeChange,
  onButtonConfigChange,
  onShowModal,
  showHeading = true
}) => {
  const [showPreview, setShowPreview] = useState(false);

  const handleInputChange = (field: string, value: any) => {
    const newConfig = {...buttonConfig, [field]: value};
    onButtonConfigChange(newConfig);
  };

  return (
    <>
      <div style={{ marginBottom: '32px' }}>
        {showHeading && (
          <h3 style={{ ...codFormStyles.sectionTitle, marginBottom: '18px' }}>
            1. Selecciona la modalidad del formulario
          </h3>
        )}
        <div style={codFormStyles.modeButtons}>
          <button
            style={formType === 'popup' ? {...codFormStyles.modeButton, ...codFormStyles.modeButtonActive} : codFormStyles.modeButton}
            onClick={() => onFormTypeChange('popup')}
          >
            <div style={codFormStyles.modeIcon}>↗</div>
            Popup
          </button>
          <button
            style={formType === 'embedded' ? {...codFormStyles.modeButton, ...codFormStyles.modeButtonActive} : codFormStyles.modeButton}
            onClick={() => onFormTypeChange('embedded')}
          >
            <div style={codFormStyles.modeIcon}>📄</div>
            Incorporado
          </button>
        </div>
        
        {formType === 'popup' && (
          <div style={codFormStyles.infoBanner}>
            <div style={{color: '#3b82f6', fontWeight: 'bold', marginTop: '2px'}}>ℹ</div>
            Cuando tus clientes hagan clic en el Botón de Compra de la aplicación, 
            el formulario se abrirá como popup en la página.
          </div>
        )}
      </div>

      {/* Botón de Compra */}
      <div style={{marginBottom: '32px', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '22px', background: '#fff'}}>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
          <div>
            <h3 style={{margin: 0, fontSize: '18px', fontWeight: '600'}}>Botón de Compra</h3>
            <p style={{margin: '5px 0 0 0', color: '#666', fontSize: '14px'}}>Personaliza el Botón de Compra del formulario</p>
          </div>
          <button 
            style={{
              padding: '8px 16px',
              background: '#fff',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              display: 'flex',
              alignItems: 'center',
              gap: '5px'
            }}
            onClick={() => setShowPreview(!showPreview)}
          >
            Preview {showPreview ? '▲' : '▼'}
          </button>
        </div>

        {showPreview && (
          <div style={{marginTop: '20px'}}>
            {/* Texto del botón */}
            <div style={{marginBottom: '20px'}}>
              <label style={{display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500'}}>
                Texto del botón
              </label>
              <input
                type="text"
                value={buttonConfig.text}
                onChange={(e) => handleInputChange('text', e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '14px'
                }}
              />
            </div>

            {/* Subtítulo del botón */}
            <div style={{marginBottom: '20px'}}>
              <label style={{display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500'}}>
                Subtítulo del botón
              </label>
              <input
                type="text"
                value={buttonConfig.subtitle}
                onChange={(e) => handleInputChange('subtitle', e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '14px'
                }}
              />
            </div>

            {/* Fila: Animación e Icono */}
            <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px'}}>
              <div>
                <label style={{display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500'}}>
                  Animación de botón
                </label>
                <select
                  value={buttonConfig.animation}
                  onChange={(e) => handleInputChange('animation', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '14px'
                  }}
                >
                  {Object.entries(buttonAnimations).map(([key, label]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label style={{display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500'}}>
                  Icono de botón
                </label>
                <select
                  value={buttonConfig.icon}
                  onChange={(e) => handleInputChange('icon', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '14px'
                  }}
                >
                  {buttonIconsArray.map((icon) => (
                    <option key={icon.key} value={icon.key}>
                      {icon.emoji} {icon.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Fila: Ubicación y Color de fondo */}
            <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px'}}>
              <div>
                <label style={{display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500'}}>
                  Ubicación del botón adhesivo
                </label>
                <select
                  value={buttonConfig.position}
                  onChange={(e) => handleInputChange('position', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '14px'
                  }}
                >
                  <option>Abajo</option>
                  <option>Arriba</option>
                </select>
              </div>
              <div>
                <label style={{display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500'}}>
                  Color del fondo
                </label>
                <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                  <input
                    type="color"
                    value={buttonConfig.bgColor}
                    onChange={(e) => handleInputChange('bgColor', e.target.value)}
                    style={{
                      width: '50px',
                      height: '40px',
                      borderRadius: '6px',
                      border: '1px solid #d1d5db',
                      cursor: 'pointer'
                    }}
                  />
                  <input
                    type="text"
                    value={buttonConfig.bgColor}
                    onChange={(e) => handleInputChange('bgColor', e.target.value)}
                    style={{
                      flex: 1,
                      padding: '8px 12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '14px'
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Fila: Color de texto y Tamaño */}
            <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px'}}>
              <div>
                <label style={{display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500'}}>
                  Color de texto
                </label>
                <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                  <input
                    type="color"
                    value={buttonConfig.textColor}
                    onChange={(e) => handleInputChange('textColor', e.target.value)}
                    style={{
                      width: '50px',
                      height: '40px',
                      borderRadius: '6px',
                      border: '1px solid #d1d5db',
                      cursor: 'pointer'
                    }}
                  />
                  <input
                    type="text"
                    value={buttonConfig.textColor}
                    onChange={(e) => handleInputChange('textColor', e.target.value)}
                    style={{
                      flex: 1,
                      padding: '8px 12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '14px'
                    }}
                  />
                </div>
              </div>
              <div>
                <label style={{display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500'}}>
                  Tamaño del texto
                </label>
                <input
                  type="range"
                  min="10"
                  max="24"
                  value={buttonConfig.textSize}
                  onChange={(e) => handleInputChange('textSize', parseInt(e.target.value))}
                  style={{width: '100%'}}
                />
                <span style={{fontSize: '12px', color: '#666'}}>{buttonConfig.textSize}px</span>
              </div>
            </div>

            {/* Fila: Radio y Ancho del borde */}
            <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px'}}>
              <div>
                <label style={{display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500'}}>
                  Radio del borde
                </label>
                <input
                  type="range"
                  min="0"
                  max="50"
                  value={buttonConfig.borderRadius}
                  onChange={(e) => handleInputChange('borderRadius', parseInt(e.target.value))}
                  style={{width: '100%'}}
                />
                <span style={{fontSize: '12px', color: '#666'}}>{buttonConfig.borderRadius}px</span>
              </div>
              <div>
                <label style={{display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500'}}>
                  Ancho del borde
                </label>
                <input
                  type="range"
                  min="0"
                  max="10"
                  value={buttonConfig.borderWidth}
                  onChange={(e) => handleInputChange('borderWidth', parseInt(e.target.value))}
                  style={{width: '100%'}}
                />
                <span style={{fontSize: '12px', color: '#666'}}>{buttonConfig.borderWidth}px</span>
              </div>
            </div>

            {/* Fila: Color del borde y Sombra */}
            <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px'}}>
              <div>
                <label style={{display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500'}}>
                  Color del borde
                </label>
                <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                  <input
                    type="color"
                    value={buttonConfig.borderColor}
                    onChange={(e) => handleInputChange('borderColor', e.target.value)}
                    style={{
                      width: '50px',
                      height: '40px',
                      borderRadius: '6px',
                      border: '1px solid #d1d5db',
                      cursor: 'pointer'
                    }}
                  />
                  <input
                    type="text"
                    value={buttonConfig.borderColor}
                    onChange={(e) => handleInputChange('borderColor', e.target.value)}
                    style={{
                      flex: 1,
                      padding: '8px 12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '14px'
                    }}
                  />
                </div>
              </div>
              <div>
                <label style={{display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500'}}>
                  Sombra
                </label>
                <input
                  type="range"
                  min="0"
                  max="20"
                  value={buttonConfig.shadow}
                  onChange={(e) => handleInputChange('shadow', parseInt(e.target.value))}
                  style={{width: '100%'}}
                />
                <span style={{fontSize: '12px', color: '#666'}}>{buttonConfig.shadow}px</span>
              </div>
            </div>

            {/* Checkbox móvil */}
            <div style={{marginBottom: '20px'}}>
              <label style={{display: 'flex', alignItems: 'flex-start', gap: '10px', cursor: 'pointer'}}>
                <input
                  type="checkbox"
                  checked={buttonConfig.enableMobile}
                  onChange={(e) => handleInputChange('enableMobile', e.target.checked)}
                  style={{marginTop: '3px'}}
                />
                <span style={{fontSize: '14px', color: '#374151', lineHeight: '1.5'}}>
                  Habilita el botón adhesivo en dispositivos móviles (solo en páginas de productos)
                </span>
              </label>
            </div>

            {/* Banner de información */}
            <div style={{
              background: '#eff6ff',
              border: '1px solid #bfdbfe',
              borderRadius: '8px',
              padding: '16px',
              display: 'flex',
              gap: '12px'
            }}>
              <div style={{color: '#3b82f6', fontSize: '20px'}}>ℹ</div>
              <div style={{fontSize: '14px', lineHeight: '1.6'}}>
                <strong>¿Necesitas más personalizaciones?</strong>
                <br />
                Si no te gusta <strong>el Botón de Compra en tu tienda</strong> o te gustaría hacer{' '}
                <strong>otras personalizaciones</strong>, ¡no dudes en contactarnos! ¡Nuestros especialistas te ayudarán a 
                modificar el Botón de Compra para satisfacer completamente tus necesidades!
              </div>
            </div>

            {/* Botón de contacto */}
            <div style={{marginTop: '16px'}}>
              <button style={{
                padding: '10px 20px',
                background: '#fff',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                💬 Contáctanos
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Botón Vista Previa del Formulario */}
      <div style={{marginBottom: '40px'}}>
        <button 
          style={codFormStyles.previewButton}
          onClick={onShowModal}
        >
          Vista Previa del Formulario
        </button>
      </div>
    </>
  );
};

export default Section1_Modalidad;