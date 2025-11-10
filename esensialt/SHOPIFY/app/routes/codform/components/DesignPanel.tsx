// components/DesignPanel.tsx
import React, { useState, useEffect } from 'react';
import { FormStyle, Blocks, ErrorMessages, Product, BlockColors, BlockConfig } from '../types/codform.types';
import { codFormStyles } from '../styles/codform.styles';
import Section1_Modalidad from './Section1_Modalidad';
import Section2_Pais from './Section2_Pais';
import Section3_Bloques from './Section3_Bloques';
import Section4_Estilos from './Section4_Estilos';

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

interface DesignPanelProps {
  formType: string;
  formStyle: FormStyle;
  blocks: Blocks;
  blockOrder: string[];
  blockColors: BlockColors;
  errorMessages: ErrorMessages;
  product: Product;
  buttonConfig: ButtonConfig;
  onFormTypeChange: (type: string) => void;
  onStyleChange: (property: string, value: any) => void;
  onBlockToggle: (blockName: string, property: string) => void;
  onBlockReorder: (newOrder: string[]) => void;
  onBlockColorsChange: (colors: BlockColors) => void;
  onBlockConfigChange: (blockName: string, config: Partial<BlockConfig>) => void;
  onErrorMessageChange: (type: string, value: string) => void;
  onButtonConfigChange: (config: ButtonConfig) => void;
  onShowModal: () => void;
}

const DesignPanel: React.FC<DesignPanelProps> = ({
  formType,
  formStyle,
  blocks,
  blockOrder,
  blockColors,
  errorMessages,
  product,
  buttonConfig,
  onFormTypeChange,
  onStyleChange,
  onBlockToggle,
  onBlockReorder,
  onBlockColorsChange,
  onBlockConfigChange,
  onErrorMessageChange,
  onButtonConfigChange,
  onShowModal
}) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      if (typeof window !== 'undefined') {
        setIsMobile(window.innerWidth < 768);
      }
    };
    
    checkMobile();
    
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', checkMobile);
      return () => window.removeEventListener('resize', checkMobile);
    }
  }, []);

  return (
    <div style={{
      ...codFormStyles.designPanel,
      padding: isMobile ? '16px' : '24px',
      maxHeight: isMobile ? 'none' : '90vh',
      overflowY: isMobile ? 'visible' : 'auto'
    }}>
      <h1 style={{
        ...codFormStyles.mainTitle,
        fontSize: isMobile ? '24px' : '28px',
        marginBottom: isMobile ? '20px' : '30px'
      }}>Diseño del Formulario</h1>
      
      <Section1_Modalidad 
        formType={formType}
        buttonConfig={buttonConfig}
        onFormTypeChange={onFormTypeChange}
        onButtonConfigChange={onButtonConfigChange}
        onShowModal={onShowModal}
      />

      <Section2_Pais />

      <Section3_Bloques 
        blocks={blocks}
        product={product}
        blockOrder={blockOrder}
        blockColors={blockColors}
        onBlockToggle={onBlockToggle}
        onBlockReorder={onBlockReorder}
        onBlockColorsChange={onBlockColorsChange}
        onBlockConfigChange={onBlockConfigChange}
      />

      <Section4_Estilos 
        formStyle={formStyle}
        errorMessages={errorMessages}
        onStyleChange={onStyleChange}
        onErrorMessageChange={onErrorMessageChange}
      />
    </div>
  );
};

export default DesignPanel;