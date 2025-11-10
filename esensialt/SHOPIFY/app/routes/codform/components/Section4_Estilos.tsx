// components/Section4_Estilos.tsx
import React from 'react';
import { FormStyle, ErrorMessages } from '../types/codform.types';
import { codFormStyles } from '../styles/codform.styles';

interface Section4Props {
  formStyle: FormStyle;
  errorMessages: ErrorMessages;
  onStyleChange: (property: string, value: any) => void;
  onErrorMessageChange: (type: string, value: string) => void;
}

const Section4_Estilos: React.FC<Section4Props> = ({
  formStyle,
  errorMessages,
  onStyleChange,
  onErrorMessageChange
}) => {
  return (
    <>

      <div style={codFormStyles.styleSection}>
        <h3 style={codFormStyles.sectionTitle}>4. Personaliza los textos genéricos del formulario</h3>
        <div style={{display: 'flex', flexDirection: 'column', gap: '20px'}}>
          <div style={{display: 'flex', flexDirection: 'column', gap: '8px'}}>
            <label style={{fontSize: '14px', fontWeight: '500', color: '#374151'}}>Error de campo obligatorio</label>
            <input
              type="text"
              value={errorMessages.required}
              onChange={(e) => onErrorMessageChange('required', e.target.value)}
              style={codFormStyles.textInput}
            />
          </div>
          <div style={{display: 'flex', flexDirection: 'column', gap: '8px'}}>
            <label style={{fontSize: '14px', fontWeight: '500', color: '#374151'}}>Error de campo genérico no válido</label>
            <input
              type="text"
              value={errorMessages.invalid}
              onChange={(e) => onErrorMessageChange('invalid', e.target.value)}
              style={codFormStyles.textInput}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Section4_Estilos;