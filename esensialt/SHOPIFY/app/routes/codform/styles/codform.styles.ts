// D:\VICTOR SHOPIFY\CODIGOS\Essential\essential\app\routes\codform\styles\codform.styles.ts
export const codFormStyles = {
  container: {
    maxWidth: '1400px',
    margin: '0 auto',
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '40px',
    background: 'white',
    borderRadius: '20px',
    padding: '40px',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.1)'
  },
  designPanel: {
    overflowY: 'auto' as const,
    maxHeight: '80vh',
    paddingRight: '10px'
  },
  mainTitle: {
    fontSize: '32px',
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: '30px'
  },
  sectionTitle: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#333',
    marginBottom: '15px'
  },
  modeButtons: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '20px',
    marginBottom: '20px'
  },
  modeButton: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    padding: '25px 20px',
    border: '2px solid #e5e7eb',
    borderRadius: '12px',
    background: 'white',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    fontSize: '16px',
    fontWeight: '500'
  },
  modeButtonActive: {
    borderColor: '#667eea',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white'
  },
  modeIcon: {
    fontSize: '28px',
    marginBottom: '10px'
  },
  infoBanner: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
    padding: '16px',
    background: '#eff6ff',
    border: '1px solid #bfdbfe',
    borderRadius: '8px',
    fontSize: '14px',
    color: '#1e40af',
    lineHeight: '1.5'
  },
  previewButton: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    border: 'none',
    padding: '12px 24px',
    borderRadius: '8px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'transform 0.2s ease'
  },
  countrySelect: {
    width: '100%',
    padding: '12px 16px',
    border: '2px solid #e5e7eb',
    borderRadius: '8px',
    fontSize: '16px',
    marginBottom: '10px',
    outline: 'none',
    transition: 'border-color 0.3s ease'
  },
  customizationInfo: {
    background: '#f8fafc',
    borderRadius: '8px',
    padding: '20px',
    marginBottom: '20px'
  },
  blockInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '12px',
    fontSize: '14px'
  },
  formBlocks: {
    background: '#f8fafc',
    borderRadius: '12px',
    padding: '20px',
    marginBottom: '40px'
  },
  formBlockHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '15px',
    background: '#667eea',
    color: 'white',
    borderRadius: '8px',
    marginBottom: '2px',
    fontWeight: '600'
  },
  formBlock: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 15px',
    background: 'white',
    border: '1px solid #e5e7eb',
    marginBottom: '2px',
    transition: 'all 0.2s ease'
  },
  blockControls: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },
  dragHandle: {
    cursor: 'move',
    color: '#9ca3af',
    fontSize: '16px'
  },
  visibilityBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '16px',
    opacity: '0.7'
  },
  blockName: {
    fontSize: '14px',
    color: '#374151',
    fontWeight: '500'
  },
  blockActions: {
    display: 'flex',
    gap: '8px'
  },
  actionBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '6px',
    borderRadius: '4px',
    transition: 'background 0.2s ease',
    color: '#6b7280',
    fontSize: '12px'
  },
  addCustomButton: {
    width: '100%',
    padding: '15px',
    background: '#374151',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontWeight: '500',
    cursor: 'pointer',
    marginTop: '10px'
  },
  styleSection: {
    background: '#f8fafc',
    borderRadius: '12px',
    padding: '24px',
    marginBottom: '40px'
  },
  styleHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px'
  },
  resetButton: {
    background: 'none',
    border: '1px solid #d1d5db',
    padding: '8px 16px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    color: '#6b7280'
  },
  styleRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '20px',
    marginBottom: '20px'
  },
  styleControl: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '8px'
  },
  colorInputWrapper: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
  },
  colorPreview: {
    width: '32px',
    height: '32px',
    borderRadius: '6px',
    border: '2px solid #e5e7eb',
    flexShrink: 0
  },
  colorInput: {
    flex: 1,
    padding: '8px 12px',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    fontSize: '14px',
    outline: 'none'
  },
  rangeControl: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },
  rangeSlider: {
    flex: 1,
    height: '6px',
    background: '#e5e7eb',
    borderRadius: '3px',
    outline: 'none',
    cursor: 'pointer'
  },
  rangeValue: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#374151',
    minWidth: '40px',
    textAlign: 'right' as const
  },
  styleWarning: {
    marginTop: '8px',
    padding: '12px',
    background: '#fef3cd',
    border: '1px solid #fbbf24',
    borderRadius: '6px',
    fontSize: '13px',
    color: '#92400e'
  },
  checkboxControls: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '12px'
  },
  checkboxControl: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '10px'
  },
  textInput: {
    padding: '10px 12px',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    fontSize: '14px',
    outline: 'none',
    width: '100%'
  },
  previewPanel: {
    position: 'sticky' as const,
    top: 0,
    height: 'fit-content'
  },
  previewContainer: {
    background: '#f8fafc',
    borderRadius: '12px',
    padding: '20px',
    minHeight: '600px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  modalOverlay: {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.7)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: '20px'
  },
  formModal: {
    background: 'white',
    borderRadius: '16px',
    maxWidth: '500px',
    width: '100%',
    maxHeight: '90vh',
    overflowY: 'auto' as const
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '25px',
    borderBottom: '1px solid #e5e7eb'
  },
  closeButton: {
    background: 'none',
    border: 'none',
    fontSize: '32px',
    color: '#666',
    cursor: 'pointer',
    padding: 0,
    width: '32px',
    height: '32px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '50%'
  },
  modalContent: {
    padding: '25px'
  },
  formHeader: {
    marginBottom: '25px'
  },
  productDisplay: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    padding: '20px',
    background: '#f8fafc',
    borderRadius: '12px',
    border: '1px solid #e5e7eb',
    position: 'relative' as const
  },
  productBadge: {
    position: 'absolute' as const,
    top: '-8px',
    left: '-8px',
    background: '#1f2937',
    color: 'white',
    width: '24px',
    height: '24px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '12px',
    fontWeight: '600'
  },
  productEmoji: {
    fontSize: '32px'
  },
  productInfo: {
    flex: 1
  },
  orderSummary: {
    background: '#f8fafc',
    borderRadius: '12px',
    padding: '20px',
    marginBottom: '25px'
  },
  summaryRow: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '12px',
    fontSize: '16px'
  },
  summaryRowTotal: {
    borderTop: '2px solid #e5e7eb',
    paddingTop: '12px',
    marginBottom: 0,
    fontWeight: '700',
    fontSize: '18px'
  },
  freeShipping: {
    color: '#10b981',
    fontWeight: '600'
  },
  shippingSection: {
    marginBottom: '25px'
  },
  shippingOption: {
    display: 'flex',
    alignItems: 'center',
    padding: '15px',
    border: '2px solid #e5e7eb',
    borderRadius: '8px',
    background: 'white'
  },
  formSection: {
    marginBottom: '25px'
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '20px'
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column' as const
  },
  formGroupFullWidth: {
    gridColumn: '1 / -1'
  },
  formLabel: {
    fontWeight: '500',
    color: '#374151',
    marginBottom: '8px',
    fontSize: '14px'
  },
  formInput: {
    padding: '12px 16px',
    border: '2px solid #e5e7eb',
    borderRadius: '8px',
    fontSize: '16px',
    transition: 'all 0.3s ease',
    outline: 'none'
  },
  checkboxGroup: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
    marginBottom: '20px'
  },
  submitButton: {
    width: '100%',
    background: 'linear-gradient(135deg, #1f2937 0%, #111827 100%)',
    color: 'white',
    border: 'none',
    padding: '18px 24px',
    borderRadius: '12px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.5px'
  },
  buyNowButton: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    border: 'none',
    padding: '15px 30px',
    borderRadius: '8px',
    fontWeight: '600',
    cursor: 'pointer',
    marginTop: '20px'
  },
  previewPage: {
    background: 'white',
    borderRadius: '8px',
    padding: '40px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    textAlign: 'center' as const,
    maxWidth: '300px'
  }
};