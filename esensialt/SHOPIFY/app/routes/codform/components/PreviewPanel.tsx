// components/PreviewPanel.tsx
import React, { useEffect, useState } from 'react';
import FormContent from './FormContent';
import { FormData, FormStyle, Blocks, Product, BlockColors } from '../types/codform.types';
import { codFormStyles } from '../styles/codform.styles';
import { injectAnimationStyles, getAnimationStyle } from '../styles/codform.animations';
import { getButtonIcon } from '../styles/codform.icons';

interface ButtonConfig {
  text: string;
  subtitle: string;
  animation: string;
  icon: string;
  bgColor: string;
  textColor: string;
  textSize: number;
  borderRadius: number;
  borderWidth: number;
  borderColor: string;
  shadow: number;
}

interface PreviewPanelProps {
  formType: string;
  formData: FormData;
  formStyle: FormStyle;
  blocks: Blocks;
  product: Product;
  blockOrder: string[];
  blockColors: BlockColors;
  buttonConfig: ButtonConfig;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  onShowModal: () => void;
}

const PreviewPanel: React.FC<PreviewPanelProps> = ({
  formType,
  formData,
  formStyle,
  blocks,
  product,
  blockOrder,
  blockColors,
  buttonConfig,
  onInputChange,
  onSubmit,
  onShowModal
}) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    injectAnimationStyles();
    
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

  const animationStyle = getAnimationStyle(buttonConfig.animation);
  const buttonIcon = getButtonIcon(buttonConfig.icon);

  return (
    <div style={{
      ...codFormStyles.previewPanel,
      padding: isMobile ? '16px' : '24px'
    }}>
      <h3 style={{
        fontSize: isMobile ? '18px' : '20px',
        fontWeight: '600',
        color: '#333',
        marginBottom: isMobile ? '16px' : '20px'
      }}>Vista previa:</h3>
      
      <div style={{
        ...codFormStyles.previewContainer,
        padding: isMobile ? '12px' : '20px'
      }}>
        {formType === 'embedded' ? (
          <div style={{width: '100%'}}>
            <div style={{
              ...codFormStyles.formModal,
              boxShadow: `0 ${formStyle.shadow}px ${formStyle.shadow * 2}px rgba(0, 0, 0, 0.1)`,
              maxWidth: '100%',
              margin: '0 auto'
            }}>
              <div style={{
                ...codFormStyles.modalHeader,
                padding: isMobile ? '16px' : '24px'
              }}>
                <h2 style={{
                  fontSize: isMobile ? '20px' : '24px',
                  fontWeight: '700',
                  color: '#1a1a1a',
                  margin: 0
                }}>PAGO CONTRA REEMBOLSO</h2>
                {!formStyle.hideCloseButton && (
                  <button style={{
                    ...codFormStyles.closeButton,
                    fontSize: isMobile ? '28px' : '32px'
                  }}>×</button>
                )}
              </div>
              <div style={{
                ...codFormStyles.modalContent,
                padding: isMobile ? '16px' : '24px'
              }}>
                <FormContent
                  formData={formData}
                  formStyle={formStyle}
                  blocks={blocks}
                  product={product}
                  blockOrder={blockOrder}
                  blockColors={blockColors}
                  onInputChange={onInputChange}
                  onSubmit={onSubmit}
                />
              </div>
            </div>
          </div>
        ) : (
          <div style={{width: '100%', display: 'flex', justifyContent: 'center'}}>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: isMobile ? '40px 20px' : '60px 40px',
              background: '#ffffff',
              borderRadius: isMobile ? '8px' : '12px',
              minHeight: isMobile ? '400px' : '500px',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              maxWidth: isMobile ? '100%' : '600px',
              width: '100%'
            }}>
              <button 
                style={{
                  background: buttonConfig.bgColor,
                  color: buttonConfig.textColor,
                  borderRadius: `${buttonConfig.borderRadius}px`,
                  border: `${buttonConfig.borderWidth}px solid ${buttonConfig.borderColor}`,
                  boxShadow: `0 ${buttonConfig.shadow}px ${buttonConfig.shadow * 2}px rgba(0, 0, 0, 0.15)`,
                  padding: buttonConfig.subtitle && buttonConfig.subtitle.trim() !== '' 
                    ? (isMobile ? '12px 32px' : '14px 48px')
                    : (isMobile ? '14px 32px' : '16px 48px'),
                  cursor: 'pointer',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: isMobile ? '4px' : '6px',
                  minWidth: isMobile ? '220px' : '280px',
                  maxWidth: isMobile ? '100%' : 'none',
                  position: 'relative',
                  overflow: 'hidden',
                  ...animationStyle
                }}
                onClick={onShowModal}
                onMouseEnter={(e) => {
                  if (!isMobile) {
                    e.currentTarget.style.transform = 'translateY(-3px) scale(1.02)';
                    e.currentTarget.style.boxShadow = `0 ${buttonConfig.shadow + 6}px ${(buttonConfig.shadow + 6) * 2}px rgba(0, 0, 0, 0.25)`;
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isMobile) {
                    e.currentTarget.style.transform = 'translateY(0) scale(1)';
                    e.currentTarget.style.boxShadow = `0 ${buttonConfig.shadow}px ${buttonConfig.shadow * 2}px rgba(0, 0, 0, 0.15)`;
                  }
                }}
              >
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: isMobile ? '8px' : '10px',
                  fontSize: isMobile ? `${Math.max(14, buttonConfig.textSize - 2)}px` : `${buttonConfig.textSize}px`,
                  fontWeight: '700',
                  textTransform: 'uppercase',
                  letterSpacing: isMobile ? '0.5px' : '1px',
                  textAlign: 'center'
                }}>
                  {buttonIcon && <span style={{fontSize: isMobile ? '16px' : '18px'}}>{buttonIcon}</span>}
                  {buttonConfig.text}
                </div>
                
                {buttonConfig.subtitle && buttonConfig.subtitle.trim() !== '' && (
                  <span style={{
                    fontSize: isMobile 
                      ? `${Math.max(10, buttonConfig.textSize - 5)}px`
                      : `${Math.max(10, buttonConfig.textSize - 4)}px`,
                    fontWeight: '400',
                    opacity: 0.85,
                    letterSpacing: '0.3px',
                    textTransform: 'none',
                    textAlign: 'center'
                  }}>
                    {buttonConfig.subtitle}
                  </span>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PreviewPanel;