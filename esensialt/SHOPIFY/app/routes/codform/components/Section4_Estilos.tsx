// components/Section4_Estilos.tsx
import React, { useMemo, useState } from 'react';
import type { FormStyle, ErrorMessages } from '../types/codform.types';
import { codFormStyles } from '../styles/codform.styles';
import { useIsMobile } from '~/utils/hooks';

interface Section4Props {
  formStyle: FormStyle;
  errorMessages: ErrorMessages;
  onStyleChange: (property: string, value: any) => void;
  onErrorMessageChange: (type: string, value: string) => void;
  showHeading?: boolean;
}

const rgbaRegex =
  /^rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})(?:\s*,\s*(\d*\.?\d+))?\s*\)$/i;

const toHex = (value: number) => value.toString(16).padStart(2, '0');

const normalizeColorForPicker = (color: string): string => {
  if (!color) {
    return '#000000';
  }

  const trimmed = color.trim();
  if (/^#([0-9A-F]{3}|[0-9A-F]{6})$/i.test(trimmed)) {
    return trimmed;
  }

  const match = trimmed.match(rgbaRegex);
  if (match) {
    const r = Math.min(255, parseInt(match[1], 10));
    const g = Math.min(255, parseInt(match[2], 10));
    const b = Math.min(255, parseInt(match[3], 10));
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  }

  return '#000000';
};

const Section4_Estilos: React.FC<Section4Props> = ({
  formStyle,
  errorMessages,
  onStyleChange,
  onErrorMessageChange,
  showHeading = true
}) => {
  const isMobile = useIsMobile();
  const [showAppearancePanel, setShowAppearancePanel] = useState(true);
  const [showCopyPanel, setShowCopyPanel] = useState(true);

  const colorPickerValues = useMemo(
    () => ({
      textColor: normalizeColorForPicker(formStyle.textColor),
      backgroundColor: normalizeColorForPicker(formStyle.backgroundColor),
      borderColor: normalizeColorForPicker(formStyle.borderColor)
    }),
    [formStyle.backgroundColor, formStyle.borderColor, formStyle.textColor]
  );

  const sectionCardStyle: React.CSSProperties = {
    border: '1px solid #e5e7eb',
    borderRadius: isMobile ? '12px' : '14px',
    padding: isMobile ? '16px' : '22px',
    background: '#fff',
    boxShadow: '0 12px 28px rgba(15, 23, 42, 0.06)',
    display: 'flex',
    flexDirection: 'column',
    gap: isMobile ? '16px' : '18px'
  };

  const fieldLabelStyle: React.CSSProperties = {
    fontSize: isMobile ? '13px' : '14px',
    fontWeight: 500,
    color: '#374151'
  };

  const subtleTextStyle: React.CSSProperties = {
    fontSize: '12px',
    color: '#6b7280'
  };

  const colorInputStyle: React.CSSProperties = {
    width: isMobile ? '42px' : '48px',
    height: isMobile ? '32px' : '36px',
    borderRadius: '6px',
    border: '1px solid #d1d5db',
    cursor: 'pointer',
    padding: 0
  };

  return (
    <div style={codFormStyles.styleSection}>
      {showHeading && (
        <h3 style={{ ...codFormStyles.sectionTitle, marginBottom: '18px' }}>
          4. Personaliza estilos y microcopys
        </h3>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: isMobile ? '20px' : '24px' }}>
        <div style={sectionCardStyle}>
          <div
            style={{
              display: 'flex',
              flexDirection: isMobile ? 'column' : 'row',
              justifyContent: 'space-between',
              alignItems: isMobile ? 'flex-start' : 'center',
              gap: '12px'
            }}
          >
            <div>
              <h4 style={{ margin: 0, fontSize: '16px', fontWeight: 600, color: '#111827' }}>
                Apariencia general
              </h4>
              <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#6b7280' }}>
                Ajusta colores, tipografía y contornos para alinear el formulario con tu marca.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowAppearancePanel((prev) => !prev)}
              style={{
                padding: '8px 14px',
                borderRadius: '6px',
                border: '1px solid #d1d5db',
                background: '#f9fafb',
                fontSize: '13px',
                fontWeight: 500,
                color: '#374151',
                cursor: 'pointer'
              }}
            >
              {showAppearancePanel ? 'Ocultar' : 'Mostrar'} opciones
            </button>
          </div>

          {showAppearancePanel && (
            <>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, minmax(0, 1fr))',
                  gap: isMobile ? '14px' : '18px'
                }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={fieldLabelStyle}>Color principal de texto</label>
                  <p style={subtleTextStyle}>Se aplica a títulos, etiquetas y textos base.</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <input
                      type="color"
                      value={colorPickerValues.textColor}
                      onChange={(e) => onStyleChange('textColor', e.target.value)}
                      style={colorInputStyle}
                    />
                    <input
                      type="text"
                      value={formStyle.textColor}
                      onChange={(e) => onStyleChange('textColor', e.target.value)}
                      style={{ ...codFormStyles.textInput, flex: 1 }}
                      placeholder="Ej. #1f2937 o rgba(31,41,55,1)"
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={fieldLabelStyle}>Color de fondo del formulario</label>
                  <p style={subtleTextStyle}>Personaliza la tarjeta que contiene todos los campos.</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <input
                      type="color"
                      value={colorPickerValues.backgroundColor}
                      onChange={(e) => onStyleChange('backgroundColor', e.target.value)}
                      style={colorInputStyle}
                    />
                    <input
                      type="text"
                      value={formStyle.backgroundColor}
                      onChange={(e) => onStyleChange('backgroundColor', e.target.value)}
                      style={{ ...codFormStyles.textInput, flex: 1 }}
                      placeholder="Ej. #ffffff o rgba(255,255,255,1)"
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={fieldLabelStyle}>
                    Tamaño base de texto <span style={{ color: '#6366f1' }}>{Math.round(formStyle.textSize)}px</span>
                  </label>
                  <input
                    type="range"
                    min={12}
                    max={22}
                    value={formStyle.textSize}
                    onChange={(e) => onStyleChange('textSize', parseInt(e.target.value, 10) || 14)}
                    style={{ width: '100%' }}
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={fieldLabelStyle}>
                    Radio de bordes <span style={{ color: '#6366f1' }}>{formStyle.borderRadius}px</span>
                  </label>
                  <input
                    type="range"
                    min={0}
                    max={40}
                    value={formStyle.borderRadius}
                    onChange={(e) => onStyleChange('borderRadius', parseInt(e.target.value, 10) || 0)}
                    style={{ width: '100%' }}
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={fieldLabelStyle}>
                    Ancho de borde <span style={{ color: '#6366f1' }}>{formStyle.borderWidth}px</span>
                  </label>
                  <input
                    type="range"
                    min={0}
                    max={10}
                    value={formStyle.borderWidth}
                    onChange={(e) => onStyleChange('borderWidth', parseInt(e.target.value, 10) || 0)}
                    style={{ width: '100%' }}
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={fieldLabelStyle}>Color del borde</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <input
                      type="color"
                      value={colorPickerValues.borderColor}
                      onChange={(e) => onStyleChange('borderColor', e.target.value)}
                      style={colorInputStyle}
                    />
                    <input
                      type="text"
                      value={formStyle.borderColor}
                      onChange={(e) => onStyleChange('borderColor', e.target.value)}
                      style={{ ...codFormStyles.textInput, flex: 1 }}
                      placeholder="Ej. #e5e7eb"
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={fieldLabelStyle}>
                    Intensidad de sombra <span style={{ color: '#6366f1' }}>{formStyle.shadow}px</span>
                  </label>
                  <input
                    type="range"
                    min={0}
                    max={30}
                    value={formStyle.shadow}
                    onChange={(e) => onStyleChange('shadow', parseInt(e.target.value, 10) || 0)}
                    style={{ width: '100%' }}
                  />
                </div>
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, minmax(0, 1fr))',
                  gap: '12px'
                }}
              >
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', color: '#374151' }}>
                  <input
                    type="checkbox"
                    checked={formStyle.hideFieldLabels}
                    onChange={() => onStyleChange('hideFieldLabels', !formStyle.hideFieldLabels)}
                    style={{ width: '16px', height: '16px' }}
                  />
                  Ocultar etiquetas de campos
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', color: '#374151' }}>
                  <input
                    type="checkbox"
                    checked={formStyle.hideCloseButton}
                    onChange={() => onStyleChange('hideCloseButton', !formStyle.hideCloseButton)}
                    style={{ width: '16px', height: '16px' }}
                  />
                  Ocultar botón de cierre (modal)
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', color: '#374151' }}>
                  <input
                    type="checkbox"
                    checked={formStyle.enableRTL}
                    onChange={() => onStyleChange('enableRTL', !formStyle.enableRTL)}
                    style={{ width: '16px', height: '16px' }}
                  />
                  Activar lectura RTL (derecha a izquierda)
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', color: '#374151' }}>
                  <input
                    type="checkbox"
                    checked={formStyle.enableFullScreen}
                    onChange={() => onStyleChange('enableFullScreen', !formStyle.enableFullScreen)}
                    style={{ width: '16px', height: '16px' }}
                  />
                  Forzar formulario a ancho completo
                </label>
              </div>
            </>
          )}
        </div>

        <div style={sectionCardStyle}>
          <div
            style={{
              display: 'flex',
              flexDirection: isMobile ? 'column' : 'row',
              justifyContent: 'space-between',
              alignItems: isMobile ? 'flex-start' : 'center',
              gap: '12px'
            }}
          >
            <div>
              <h4 style={{ margin: 0, fontSize: '16px', fontWeight: 600, color: '#111827' }}>
                Mensajes de validación
              </h4>
              <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#6b7280' }}>
                Ajusta los textos que verá el cliente cuando haya errores en el formulario.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowCopyPanel((prev) => !prev)}
              style={{
                padding: '8px 14px',
                borderRadius: '6px',
                border: '1px solid #d1d5db',
                background: '#f9fafb',
                fontSize: '13px',
                fontWeight: 500,
                color: '#374151',
                cursor: 'pointer'
              }}
            >
              {showCopyPanel ? 'Ocultar' : 'Mostrar'} mensajes
            </button>
          </div>

          {showCopyPanel && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={fieldLabelStyle}>Error de campo obligatorio</label>
                <input
                  type="text"
                  value={errorMessages.required}
                  onChange={(e) => onErrorMessageChange('required', e.target.value)}
                  style={codFormStyles.textInput}
                  placeholder="Ej. Este campo es obligatorio"
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={fieldLabelStyle}>Error de formato no válido</label>
                <input
                  type="text"
                  value={errorMessages.invalid}
                  onChange={(e) => onErrorMessageChange('invalid', e.target.value)}
                  style={codFormStyles.textInput}
                  placeholder="Ej. Revisa el formato ingresado"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Section4_Estilos;