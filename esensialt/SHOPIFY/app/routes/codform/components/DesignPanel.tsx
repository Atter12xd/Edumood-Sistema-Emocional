// components/DesignPanel.tsx
import React, { useState } from 'react';
import { FormStyle, Blocks, ErrorMessages, Product, BlockColors, BlockConfig } from '../types/codform.types';
import { codFormStyles } from '../styles/codform.styles';
import Section1_Modalidad from './Section1_Modalidad';
import Section2_Pais from './Section2_Pais';
import Section3_Bloques from './Section3_Bloques';
import Section4_Estilos from './Section4_Estilos';
import { useIsMobile } from '~/utils/hooks';

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
  const isMobile = useIsMobile();
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    modalidad: true,
    pais: false,
    bloques: true,
    estilos: true,
  });

  const toggleSection = (sectionKey: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [sectionKey]: !prev[sectionKey],
    }));
  };

  const visibleBlocks = Object.values(blocks || {}).filter((block) => block?.visible !== false).length;
  const totalBlocks = Object.keys(blocks || {}).length;

  const designerSections = [
    {
      key: 'modalidad',
      title: 'Modalidad y CTA',
      description: 'Define cómo aparece el formulario y personaliza el botón principal.',
      badge: formType === 'popup' ? 'Popup activo' : 'Embebido activo',
      render: (
        <Section1_Modalidad
          formType={formType}
          buttonConfig={buttonConfig}
          onFormTypeChange={onFormTypeChange}
          onButtonConfigChange={onButtonConfigChange}
          onShowModal={onShowModal}
          showHeading={false}
        />
      ),
    },
    {
      key: 'pais',
      title: 'Ubicación y operaciones',
      description: 'Selecciona la región para ajustar mensajes y logística de pedidos.',
      badge: 'Perú (default)',
      render: <Section2_Pais showHeading={false} />,
    },
    {
      key: 'bloques',
      title: 'Bloques del formulario',
      description: 'Activa, ordena y personaliza cada elemento que verán tus clientes.',
      badge: `${visibleBlocks}/${totalBlocks} visibles`,
      render: (
        <Section3_Bloques
          blocks={blocks}
          product={product}
          blockOrder={blockOrder}
          blockColors={blockColors}
          onBlockToggle={onBlockToggle}
          onBlockReorder={onBlockReorder}
          onBlockColorsChange={onBlockColorsChange}
          onBlockConfigChange={onBlockConfigChange}
          showHeading={false}
        />
      ),
    },
    {
      key: 'estilos',
      title: 'Mensajes y microcopys',
      description: 'Ajusta los textos del formulario para alinear el tono con tu marca.',
      badge: '2 textos editables',
      render: (
        <Section4_Estilos
          formStyle={formStyle}
          errorMessages={errorMessages}
          onStyleChange={onStyleChange}
          onErrorMessageChange={onErrorMessageChange}
          showHeading={false}
        />
      ),
    },
  ];

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
      }}>Diseñador COD profesional</h1>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
        {designerSections.map((section) => {
          const isOpen = openSections[section.key] ?? true;
          return (
            <div key={section.key} style={codFormStyles.sectionPanel}>
              <button
                type="button"
                style={codFormStyles.sectionPanelHeader}
                onClick={() => toggleSection(section.key)}
                aria-expanded={isOpen}
              >
                <div style={codFormStyles.sectionPanelHeaderContent}>
                  <span style={codFormStyles.sectionPanelTitle}>{section.title}</span>
                  <span style={codFormStyles.sectionPanelDescription}>{section.description}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  {section.badge && <span style={codFormStyles.sectionPanelBadge}>{section.badge}</span>}
                  <span
                    style={{
                      ...codFormStyles.sectionPanelToggle,
                      transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                    }}
                  >
                    ⌃
                  </span>
                </div>
              </button>
              <div style={isOpen ? codFormStyles.sectionPanelBody : codFormStyles.sectionPanelBodyHidden}>
                {section.render}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DesignPanel;