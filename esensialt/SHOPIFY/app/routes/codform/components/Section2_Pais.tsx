// components/Section2_Pais.tsx
import React from 'react';
import { codFormStyles } from '../styles/codform.styles';

const Section2_Pais: React.FC = () => {
  return (
    <div style={{marginBottom: '40px'}}>
      <h3 style={codFormStyles.sectionTitle}>2. Selecciona el país del formulario</h3>
      <select style={codFormStyles.countrySelect}>
        <option value="peru">Perú</option>
        <option value="colombia">Colombia</option>
        <option value="mexico">México</option>
      </select>
      <p style={{fontSize: '14px', color: '#666', lineHeight: '1.5'}}>
        Todos los pedidos realizados con el formulario serán registrados con el país seleccionado.
      </p>
    </div>
  );
};

export default Section2_Pais;