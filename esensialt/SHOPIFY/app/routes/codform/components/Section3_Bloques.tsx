// components/Section3_Bloques.tsx
import React, { useState } from 'react';
import { Blocks, Product, BlockColors, BlockConfig } from '../types/codform.types';
import { codFormStyles } from '../styles/codform.styles';
import { useIsMobile } from '~/utils/hooks';

interface BlockItem {
  id: string;
  name: string;
  label: string;
  isFixed?: boolean;
}

interface Section3Props {
  blocks?: Blocks;
  product?: Product;
  blockOrder?: string[];
  blockColors: BlockColors;
  onBlockToggle: (blockName: string, property: string) => void;
  onBlockReorder: (newOrder: string[]) => void;
  onBlockColorsChange: (colors: BlockColors) => void;
  onBlockConfigChange: (blockName: string, config: Partial<BlockConfig>) => void;
  showHeading?: boolean;
}

const Section3_Bloques: React.FC<Section3Props> = ({
  blocks,
  product,
  blockOrder,
  blockColors,
  onBlockToggle,
  onBlockReorder,
  onBlockColorsChange,
  onBlockConfigChange,
  showHeading = true
}) => {
  const [draggedIndex, setDraggedIndex] = React.useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = React.useState<number | null>(null);
  const [showColorPicker, setShowColorPicker] = React.useState(false);
  const [editingBlock, setEditingBlock] = React.useState<string | null>(null);
  const isMobile = useIsMobile();

  const handleColorChange = (field: string, value: string | number) => {
    const newColors = {...blockColors, [field]: value};
    onBlockColorsChange(newColors);
  };

  const updateBlockConfig = (blockName: string, field: string, value: any) => {
    onBlockConfigChange(blockName, { [field]: value });
  };

  const handleEditBlock = (blockId: string) => {
    setEditingBlock(editingBlock === blockId ? null : blockId);
  };

  const safeProduct = product || { name: 'Producto', price: 0, currency: 'S/.', image: '🛋️' };
  
  const safeBlockOrder = blockOrder || [
    'orderSummary', 'shippingRates', 'totalSummary', 'discountCodes', 'shippingAddress',
    'firstName', 'lastName', 'phone', 'address', 'address2', 'province', 'city',
    'postalCode', 'email', 'orderNote', 'newsletter', 'terms', 'submitButton'
  ];
  
  const safeBlocks = blocks || {
    orderSummary: { active: true, visible: true },
    shippingRates: { active: true, visible: true },
    totalSummary: { active: true, visible: true },
    discountCodes: { active: true, visible: true },
    shippingAddress: { active: true, visible: true },
    firstName: { active: true, visible: true },
    lastName: { active: true, visible: true },
    phone: { active: true, visible: true },
    address: { active: true, visible: true },
    address2: { active: true, visible: true },
    province: { active: true, visible: true },
    city: { active: true, visible: true },
    postalCode: { active: true, visible: true },
    email: { active: true, visible: true },
    orderNote: { active: true, visible: true },
    newsletter: { active: true, visible: true },
    terms: { active: true, visible: true },
    submitButton: { active: true, visible: true }
  };

  const allBlocks: BlockItem[] = [
    { id: 'orderSummary', name: 'orderSummary', label: 'RESUMEN DEL PEDIDO' },
    { id: 'shippingRates', name: 'shippingRates', label: 'TARIFAS DE ENVÍO' },
    { id: 'totalSummary', name: 'totalSummary', label: 'RESUMEN TOTAL' },
    { id: 'discountCodes', name: 'discountCodes', label: 'CÓDIGOS DE DESCUENTO' },
    { id: 'shippingAddress', name: 'shippingAddress', label: 'Ingrese su dirección de envío' },
    { id: 'firstName', name: 'firstName', label: 'Nombre' },
    { id: 'lastName', name: 'lastName', label: 'Apellido' },
    { id: 'phone', name: 'phone', label: 'Teléfono' },
    { id: 'address', name: 'address', label: 'Dirección' },
    { id: 'address2', name: 'address2', label: 'Dirección 2' },
    { id: 'province', name: 'province', label: 'Provincia' },
    { id: 'city', name: 'city', label: 'Ciudad' },
    { id: 'postalCode', name: 'postalCode', label: 'Código postal' },
    { id: 'email', name: 'email', label: 'Correo electrónico' },
    { id: 'orderNote', name: 'orderNote', label: 'Nota del pedido' },
    { id: 'newsletter', name: 'newsletter', label: 'Suscríbete para recibir notificaciones...' },
    { id: 'terms', name: 'terms', label: 'Acepto nuestros...' },
    { id: 'submitButton', name: 'submitButton', label: `COMPLETA TU COMPRA - ${safeProduct.currency}${safeProduct.price}`, isFixed: true }
  ];

  const orderedBlocks = safeBlockOrder.map(id => allBlocks.find(block => block.id === id)).filter((block): block is BlockItem => block !== undefined);

  const handleDragStart = (index: number) => setDraggedIndex(index);
  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;
    setDragOverIndex(index);
  };
  const handleDragLeave = () => setDragOverIndex(null);
  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === dropIndex) {
      setDraggedIndex(null);
      setDragOverIndex(null);
      return;
    }
    const newOrder = [...safeBlockOrder];
    const [draggedItem] = newOrder.splice(draggedIndex, 1);
    newOrder.splice(dropIndex, 0, draggedItem);
    onBlockReorder(newOrder);
    setDraggedIndex(null);
    setDragOverIndex(null);
  };
  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const moveBlock = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === safeBlockOrder.length - 1) return;
    const newOrder = [...safeBlockOrder];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    [newOrder[index], newOrder[targetIndex]] = [newOrder[targetIndex], newOrder[index]];
    onBlockReorder(newOrder);
  };

  const isTextField = (blockId: string) => ['firstName', 'lastName', 'phone', 'address', 'address2', 'province', 'city', 'postalCode', 'email', 'orderNote', 'discountCodes'].includes(blockId);
  const isCheckbox = (blockId: string) => ['newsletter', 'terms'].includes(blockId);
  const isHeader = (blockId: string) => ['shippingAddress'].includes(blockId);

  const getDefaultValues = (blockId: string) => {
    const defaults: any = {
      firstName: { placeholder: 'Nombre', required: true, textColor: '#1f2937', bgColor: '#ffffff', textSize: 14, borderColor: '#e5e7eb', borderRadius: 6 },
      lastName: { placeholder: 'Apellido', required: true, textColor: '#1f2937', bgColor: '#ffffff', textSize: 14, borderColor: '#e5e7eb', borderRadius: 6 },
      phone: { placeholder: 'Teléfono', required: true, textColor: '#1f2937', bgColor: '#ffffff', textSize: 14, borderColor: '#e5e7eb', borderRadius: 6 },
      address: { placeholder: 'Dirección', required: true, textColor: '#1f2937', bgColor: '#ffffff', textSize: 14, borderColor: '#e5e7eb', borderRadius: 6 },
      address2: { placeholder: 'Dirección 2', required: false, textColor: '#1f2937', bgColor: '#ffffff', textSize: 14, borderColor: '#e5e7eb', borderRadius: 6 },
      province: { placeholder: 'Provincia', required: true, textColor: '#1f2937', bgColor: '#ffffff', textSize: 14, borderColor: '#e5e7eb', borderRadius: 6 },
      city: { placeholder: 'Ciudad', required: true, textColor: '#1f2937', bgColor: '#ffffff', textSize: 14, borderColor: '#e5e7eb', borderRadius: 6 },
      postalCode: { placeholder: 'Ej: 15001', required: true, textColor: '#1f2937', bgColor: '#ffffff', textSize: 14, borderColor: '#e5e7eb', borderRadius: 6 },
      email: { placeholder: 'tu@email.com', required: true, textColor: '#1f2937', bgColor: '#ffffff', textSize: 14, borderColor: '#e5e7eb', borderRadius: 6 },
      orderNote: { placeholder: 'Instrucciones especiales de entrega...', required: false, textColor: '#6b7280', bgColor: '#f9fafb', textSize: 13, borderColor: '#d1d5db', borderRadius: 8 },
      discountCodes: { placeholder: 'Código de descuento', required: false, textColor: '#1f2937', bgColor: '#ffffff', textSize: 14, borderColor: '#e5e7eb', borderRadius: 6 },
      orderSummary: { textColor: '#111827', bgColor: '#f9fafb', textSize: 14, borderColor: '#e5e7eb', borderRadius: 8 },
      totalSummary: { textColor: '#111827', bgColor: '#f9fafb', textSize: 16, borderColor: '#e5e7eb', borderRadius: 8 },
      shippingAddress: { textColor: '#111827', bgColor: 'transparent', textSize: 16, borderColor: 'transparent', borderRadius: 0 },
      newsletter: { textColor: '#374151', bgColor: '#ffffff', textSize: 14, borderColor: '#d1d5db', borderRadius: 4 },
      terms: { required: true, textColor: '#374151', bgColor: '#ffffff', textSize: 14, borderColor: '#d1d5db', borderRadius: 4 }
    };
    return defaults[blockId] || { textColor: '#1f2937', bgColor: '#ffffff', textSize: 14, borderColor: '#e5e7eb', borderRadius: 6 };
  };

  return (
    <>
      {showHeading && (
        <div style={{ marginBottom: isMobile ? '26px' : '32px' }}>
          <h3 style={{ ...codFormStyles.sectionTitle, fontSize: isMobile ? '16px' : '18px', marginBottom: isMobile ? '12px' : '16px' }}>
            3. Personaliza el formulario
          </h3>
          <div style={{ ...codFormStyles.customizationInfo, fontSize: isMobile ? '13px' : '14px', padding: isMobile ? '12px' : '16px' }}>
            <div style={{ ...codFormStyles.blockInfo, marginBottom: isMobile ? '8px' : '10px' }}><input type="checkbox" disabled style={{ marginRight: '6px' }} /><span>Los bloques grises están <strong>deshabilitados</strong> en su formulario. Use el botón con forma de ojo para habilitarlos.</span></div>
            <div style={{ ...codFormStyles.blockInfo, marginBottom: isMobile ? '8px' : '10px' }}><input type="checkbox" checked disabled style={{ marginRight: '6px' }} /><span>Los bloques blancos están <strong>activos</strong> en tu formulario.</span></div>
            <div style={{ ...codFormStyles.blockInfo, color: '#1e40af' }}><input type="checkbox" checked disabled style={{ marginRight: '6px' }} /><span>Los bloques azules se activan cuando arrastra una tarjeta por el formulario. Suelte la tarjeta para completar la acción.</span></div>
          </div>

          <div style={{ background: '#f8fafc', borderRadius: isMobile ? '6px' : '8px', padding: isMobile ? '12px' : '16px', marginBottom: isMobile ? '16px' : '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '6px' : '8px', marginBottom: isMobile ? '6px' : '8px', fontSize: isMobile ? '13px' : '14px', color: '#666' }}><span style={{ fontSize: isMobile ? '14px' : '16px' }}>✏️</span><span>Clica en el botón <strong>lápiz</strong> para editar un bloque.</span></div>
            <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '6px' : '8px', marginBottom: isMobile ? '6px' : '8px', fontSize: isMobile ? '13px' : '14px', color: '#666' }}><span style={{ fontSize: isMobile ? '14px' : '16px' }}>⋮</span><span>Presione y mueva el botón <strong>arrastrador</strong> para mover un bloque.</span></div>
            <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '6px' : '8px', fontSize: isMobile ? '13px' : '14px', color: '#666' }}><span style={{ fontSize: isMobile ? '14px' : '16px' }}>↕️</span><span>Clica en los botones de <strong>flechas</strong> para cambiar la posición de un bloque.</span></div>
          </div>
        </div>
      )}

      <div style={{marginBottom: isMobile ? '30px' : '40px', border: '1px solid #e5e7eb', borderRadius: isMobile ? '6px' : '8px', padding: isMobile ? '16px' : '20px', background: '#fff'}}>
        <div style={{display: 'flex', flexDirection: isMobile ? 'column' : 'row', justifyContent: 'space-between', alignItems: isMobile ? 'flex-start' : 'center', marginBottom: isMobile ? '16px' : '20px', gap: isMobile ? '12px' : '0'}}>
          <div>
            <h3 style={{margin: 0, fontSize: isMobile ? '16px' : '18px', fontWeight: '600'}}>Estilo de bloques</h3>
            <p style={{margin: '5px 0 0 0', color: '#666', fontSize: isMobile ? '13px' : '14px'}}>Personaliza la apariencia de los bloques del formulario</p>
          </div>
          <button style={{padding: isMobile ? '8px 14px' : '8px 16px', background: '#fff', border: '1px solid #d1d5db', borderRadius: '6px', cursor: 'pointer', fontSize: isMobile ? '13px' : '14px', display: 'flex', alignItems: 'center', gap: '5px', width: isMobile ? '100%' : 'auto', justifyContent: isMobile ? 'center' : 'flex-start'}} onClick={() => setShowColorPicker(!showColorPicker)}>
            Estilos {showColorPicker ? '▲' : '▼'}
          </button>
        </div>

        {showColorPicker && (
          <div style={{marginTop: isMobile ? '16px' : '20px'}}>
            <div style={{display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: isMobile ? '12px' : '16px', marginBottom: isMobile ? '16px' : '20px'}}>
              <div>
                <label style={{display: 'block', marginBottom: '8px', fontSize: isMobile ? '13px' : '14px', fontWeight: '500'}}>Color de texto</label>
                <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                  <input type="color" value={blockColors.textColor} onChange={(e) => handleColorChange('textColor', e.target.value)} style={{width: isMobile ? '45px' : '50px', height: isMobile ? '35px' : '40px', borderRadius: '6px', border: '1px solid #d1d5db', cursor: 'pointer'}} />
                  <input type="text" value={blockColors.textColor} onChange={(e) => handleColorChange('textColor', e.target.value)} style={{flex: 1, padding: isMobile ? '6px 10px' : '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: isMobile ? '13px' : '14px'}} />
                </div>
              </div>
              <div>
                <label style={{display: 'block', marginBottom: '8px', fontSize: isMobile ? '13px' : '14px', fontWeight: '500'}}>Tamaño del texto</label>
                <input type="range" min="10" max="24" value={blockColors.textSize} onChange={(e) => handleColorChange('textSize', parseInt(e.target.value))} style={{width: '100%'}} />
                <span style={{fontSize: isMobile ? '11px' : '12px', color: '#666'}}>{blockColors.textSize}px</span>
              </div>
            </div>

            <div style={{marginBottom: isMobile ? '16px' : '20px'}}>
              <label style={{display: 'block', marginBottom: '8px', fontSize: isMobile ? '13px' : '14px', fontWeight: '500'}}>Color del fondo</label>
              <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                <input type="color" value={blockColors.bgColor} onChange={(e) => handleColorChange('bgColor', e.target.value)} style={{width: isMobile ? '45px' : '50px', height: isMobile ? '35px' : '40px', borderRadius: '6px', border: '1px solid #d1d5db', cursor: 'pointer'}} />
                <input type="text" value={blockColors.bgColor} onChange={(e) => handleColorChange('bgColor', e.target.value)} style={{flex: 1, padding: isMobile ? '6px 10px' : '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: isMobile ? '13px' : '14px'}} />
              </div>
            </div>

            <div style={{background: '#fef3c7', border: '1px solid #fbbf24', borderRadius: isMobile ? '6px' : '8px', padding: isMobile ? '10px' : '12px', marginBottom: isMobile ? '16px' : '20px', fontSize: isMobile ? '13px' : '14px', color: '#92400e'}}>
              <strong>Importante:</strong> cambiar el color de fondo de su formulario podría afectar negativamente su tasa de conversión.
            </div>

            <div style={{display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: isMobile ? '12px' : '16px', marginBottom: isMobile ? '16px' : '20px'}}>
              <div>
                <label style={{display: 'block', marginBottom: '8px', fontSize: isMobile ? '13px' : '14px', fontWeight: '500'}}>Radio del borde</label>
                <input type="range" min="0" max="50" value={blockColors.borderRadius} onChange={(e) => handleColorChange('borderRadius', parseInt(e.target.value))} style={{width: '100%'}} />
                <span style={{fontSize: isMobile ? '11px' : '12px', color: '#666'}}>{blockColors.borderRadius}px</span>
              </div>
              <div>
                <label style={{display: 'block', marginBottom: '8px', fontSize: isMobile ? '13px' : '14px', fontWeight: '500'}}>Ancho del borde</label>
                <input type="range" min="0" max="10" value={blockColors.borderWidth} onChange={(e) => handleColorChange('borderWidth', parseInt(e.target.value))} style={{width: '100%'}} />
                <span style={{fontSize: isMobile ? '11px' : '12px', color: '#666'}}>{blockColors.borderWidth}px</span>
              </div>
            </div>

            <div style={{display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: isMobile ? '12px' : '16px', marginBottom: isMobile ? '16px' : '20px'}}>
              <div>
                <label style={{display: 'block', marginBottom: '8px', fontSize: isMobile ? '13px' : '14px', fontWeight: '500'}}>Color del borde</label>
                <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                  <input type="color" value={blockColors.borderColor} onChange={(e) => handleColorChange('borderColor', e.target.value)} style={{width: isMobile ? '45px' : '50px', height: isMobile ? '35px' : '40px', borderRadius: '6px', border: '1px solid #d1d5db', cursor: 'pointer'}} />
                  <input type="text" value={blockColors.borderColor} onChange={(e) => handleColorChange('borderColor', e.target.value)} style={{flex: 1, padding: isMobile ? '6px 10px' : '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: isMobile ? '13px' : '14px'}} />
                </div>
              </div>
              <div>
                <label style={{display: 'block', marginBottom: '8px', fontSize: isMobile ? '13px' : '14px', fontWeight: '500'}}>Sombra</label>
                <input type="range" min="0" max="20" value={blockColors.shadow} onChange={(e) => handleColorChange('shadow', parseInt(e.target.value))} style={{width: '100%'}} />
                <span style={{fontSize: isMobile ? '11px' : '12px', color: '#666'}}>{blockColors.shadow}px</span>
              </div>
            </div>
          </div>
        )}
      </div>

      <div style={codFormStyles.formBlocks}>
        <div style={{...codFormStyles.formBlockHeader, padding: isMobile ? '12px' : '16px'}}>
          <h4 style={{margin: 0, fontSize: isMobile ? '14px' : '16px'}}>PAGO CONTRA REEMBOLSO</h4>
          <button style={{...codFormStyles.actionBtn, fontSize: isMobile ? '16px' : '18px'}} onClick={() => handleEditBlock('header')}>✏️</button>
        </div>
        
        {orderedBlocks.map((block, index) => {
          const blockData = safeBlocks[block.name as keyof Blocks];
          const isVisible = blockData?.visible !== false;
          const isDragging = draggedIndex === index;
          const isDragOver = dragOverIndex === index;
          const isFixed = block.isFixed;
          const isEditing = editingBlock === block.id;
          
          const currentLabel = blockData?.label || block.label;
          const defaults = getDefaultValues(block.id);
          const currentPlaceholder = blockData?.placeholder || defaults.placeholder || '';
          const currentRequired = blockData?.required !== undefined ? blockData.required : defaults.required || false;
          const currentTextColor = blockData?.textColor || defaults.textColor;
          const currentBgColor = blockData?.bgColor || defaults.bgColor;
          const currentTextSize = blockData?.textSize || defaults.textSize;
          const currentBorderColor = blockData?.borderColor || defaults.borderColor;
          const currentBorderRadius = blockData?.borderRadius || defaults.borderRadius;

          return (
            <React.Fragment key={block.id}>
              <div draggable={!isFixed} onDragStart={() => !isFixed && handleDragStart(index)} onDragOver={(e) => !isFixed && handleDragOver(e, index)} onDragLeave={handleDragLeave} onDrop={(e) => !isFixed && handleDrop(e, index)} onDragEnd={handleDragEnd} style={{...codFormStyles.formBlock, opacity: isDragging ? 0.5 : 1, backgroundColor: isDragOver ? '#dbeafe' : (isVisible ? 'white' : '#f3f4f6'), borderColor: isDragOver ? '#3b82f6' : '#e5e7eb', transition: 'all 0.2s ease', cursor: isFixed ? 'default' : 'move', padding: isMobile ? '10px' : '12px'}}>
                <div style={{...codFormStyles.blockControls, gap: isMobile ? '6px' : '8px'}}>
                  {!isFixed && <span style={{...codFormStyles.dragHandle, cursor: 'grab', opacity: isDragging ? 0.3 : 1, fontSize: isMobile ? '16px' : '18px'}}>⋮</span>}
                  {!isFixed && <button style={{...codFormStyles.visibilityBtn, opacity: isVisible ? 1 : 0.3, fontSize: isMobile ? '14px' : '16px'}} onClick={() => onBlockToggle(block.name, 'visible')}>👁️</button>}
                  <span style={{...codFormStyles.blockName, marginLeft: isFixed ? '8px' : '0', fontSize: isMobile ? '13px' : '14px', wordBreak: 'break-word'}}>{currentLabel}</span>
                </div>
                <div style={{...codFormStyles.blockActions, gap: isMobile ? '4px' : '6px'}}>
                  <button style={{...codFormStyles.actionBtn, backgroundColor: isEditing ? '#e0e7ff' : 'transparent', fontSize: isMobile ? '14px' : '16px', padding: isMobile ? '4px 8px' : '6px 10px'}} onClick={(e) => { e.stopPropagation(); handleEditBlock(block.id); }}>✏️</button>
                  {!isFixed && (<><button style={{...codFormStyles.actionBtn, opacity: index === 0 ? 0.3 : 1, cursor: index === 0 ? 'not-allowed' : 'pointer', fontSize: isMobile ? '14px' : '16px', padding: isMobile ? '4px 8px' : '6px 10px'}} onClick={() => index > 0 && moveBlock(index, 'up')} disabled={index === 0}>↑</button><button style={{...codFormStyles.actionBtn, opacity: index === orderedBlocks.length - 1 ? 0.3 : 1, cursor: index === orderedBlocks.length - 1 ? 'not-allowed' : 'pointer', fontSize: isMobile ? '14px' : '16px', padding: isMobile ? '4px 8px' : '6px 10px'}} onClick={() => index < orderedBlocks.length - 1 && moveBlock(index, 'down')} disabled={index === orderedBlocks.length - 1}>↓</button></>)}
                </div>
              </div>

              {isEditing && (
                <div style={{background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: isMobile ? '6px' : '8px', padding: isMobile ? '16px' : '20px', marginBottom: isMobile ? '10px' : '12px'}}>
                  <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: isMobile ? '12px' : '16px'}}>
                    <h4 style={{margin: 0, fontSize: isMobile ? '15px' : '16px', fontWeight: '600'}}>Editar: {block.label}</h4>
                    <button style={{background: 'transparent', border: 'none', fontSize: isMobile ? '24px' : '20px', cursor: 'pointer', color: '#9ca3af'}} onClick={() => setEditingBlock(null)}>×</button>
                  </div>
                  
                  <div style={{marginBottom: isMobile ? '12px' : '16px'}}>
                    <label style={{display: 'block', marginBottom: '8px', fontSize: isMobile ? '13px' : '14px', fontWeight: '500'}}>
                      {isTextField(block.id) ? 'Etiqueta del campo' : isCheckbox(block.id) ? 'Texto' : isHeader(block.id) ? 'Texto del encabezado' : 'Título'}
                    </label>
                    <input 
                      type="text" 
                      value={currentLabel} 
                      onChange={(e) => updateBlockConfig(block.name, 'label', e.target.value)} 
                      style={{width: '100%', padding: isMobile ? '8px 10px' : '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: isMobile ? '13px' : '14px'}} 
                    />
                  </div>

                  {isTextField(block.id) && (
                    <div style={{marginBottom: isMobile ? '12px' : '16px'}}>
                      <label style={{display: 'block', marginBottom: '8px', fontSize: isMobile ? '13px' : '14px', fontWeight: '500'}}>Placeholder</label>
                      <input 
                        type="text" 
                        value={currentPlaceholder}
                        onChange={(e) => updateBlockConfig(block.name, 'placeholder', e.target.value)} 
                        style={{width: '100%', padding: isMobile ? '8px 10px' : '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: isMobile ? '13px' : '14px'}} 
                      />
                    </div>
                  )}

                  <div style={{display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: isMobile ? '12px' : '16px', marginBottom: isMobile ? '12px' : '16px'}}>
                    <div>
                      <label style={{display: 'block', marginBottom: '8px', fontSize: isMobile ? '13px' : '14px', fontWeight: '500'}}>Color de texto</label>
                      <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                        <input 
                          type="color" 
                          value={currentTextColor} 
                          onChange={(e) => updateBlockConfig(block.name, 'textColor', e.target.value)} 
                          style={{width: isMobile ? '35px' : '40px', height: isMobile ? '30px' : '35px', borderRadius: '6px', border: '1px solid #d1d5db', cursor: 'pointer'}} 
                        />
                        <input 
                          type="text" 
                          value={currentTextColor} 
                          onChange={(e) => updateBlockConfig(block.name, 'textColor', e.target.value)} 
                          style={{flex: 1, padding: isMobile ? '5px 8px' : '6px 10px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: isMobile ? '12px' : '13px'}} 
                        />
                      </div>
                    </div>
                    <div>
                      <label style={{display: 'block', marginBottom: '8px', fontSize: isMobile ? '13px' : '14px', fontWeight: '500'}}>Color de fondo</label>
                      <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                        <input 
                          type="color" 
                          value={currentBgColor} 
                          onChange={(e) => updateBlockConfig(block.name, 'bgColor', e.target.value)} 
                          style={{width: isMobile ? '35px' : '40px', height: isMobile ? '30px' : '35px', borderRadius: '6px', border: '1px solid #d1d5db', cursor: 'pointer'}} 
                        />
                        <input 
                          type="text" 
                          value={currentBgColor} 
                          onChange={(e) => updateBlockConfig(block.name, 'bgColor', e.target.value)} 
                          style={{flex: 1, padding: isMobile ? '5px 8px' : '6px 10px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: isMobile ? '12px' : '13px'}} 
                        />
                      </div>
                    </div>
                  </div>

                  <div style={{display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: isMobile ? '12px' : '16px', marginBottom: isMobile ? '12px' : '16px'}}>
                    <div>
                      <label style={{display: 'block', marginBottom: '8px', fontSize: isMobile ? '13px' : '14px', fontWeight: '500'}}>Tamaño del texto</label>
                      <input 
                        type="range" 
                        min="10" 
                        max="24" 
                        value={currentTextSize} 
                        onChange={(e) => updateBlockConfig(block.name, 'textSize', parseInt(e.target.value))} 
                        style={{width: '100%'}} 
                      />
                      <span style={{fontSize: isMobile ? '11px' : '12px', color: '#666'}}>{currentTextSize}px</span>
                    </div>
                    <div>
                      <label style={{display: 'block', marginBottom: '8px', fontSize: isMobile ? '13px' : '14px', fontWeight: '500'}}>Radio del borde</label>
                      <input 
                        type="range" 
                        min="0" 
                        max="50" 
                        value={currentBorderRadius} 
                        onChange={(e) => updateBlockConfig(block.name, 'borderRadius', parseInt(e.target.value))} 
                        style={{width: '100%'}} 
                      />
                      <span style={{fontSize: isMobile ? '11px' : '12px', color: '#666'}}>{currentBorderRadius}px</span>
                    </div>
                  </div>

                  <div style={{marginBottom: isMobile ? '12px' : '16px'}}>
                    <label style={{display: 'block', marginBottom: '8px', fontSize: isMobile ? '13px' : '14px', fontWeight: '500'}}>Color del borde</label>
                    <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                      <input 
                        type="color" 
                        value={currentBorderColor} 
                        onChange={(e) => updateBlockConfig(block.name, 'borderColor', e.target.value)} 
                        style={{width: isMobile ? '35px' : '40px', height: isMobile ? '30px' : '35px', borderRadius: '6px', border: '1px solid #d1d5db', cursor: 'pointer'}} 
                      />
                      <input 
                        type="text" 
                        value={currentBorderColor} 
                        onChange={(e) => updateBlockConfig(block.name, 'borderColor', e.target.value)} 
                        style={{flex: 1, padding: isMobile ? '5px 8px' : '6px 10px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: isMobile ? '12px' : '13px'}} 
                      />
                    </div>
                  </div>

                  {(isTextField(block.id) || block.id === 'terms') && (
                    <div style={{marginBottom: isMobile ? '12px' : '16px'}}>
                      <label style={{display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer'}}>
                        <input 
                          type="checkbox" 
                          checked={currentRequired} 
                          onChange={(e) => updateBlockConfig(block.name, 'required', e.target.checked)} 
                          style={{width: isMobile ? '15px' : '16px', height: isMobile ? '15px' : '16px'}} 
                        />
                        <span style={{fontSize: isMobile ? '13px' : '14px'}}>Campo requerido</span>
                      </label>
                    </div>
                  )}
                </div>
              )}
            </React.Fragment>
          );
        })}

        <button style={{...codFormStyles.addCustomButton, padding: isMobile ? '10px 16px' : '12px 20px', fontSize: isMobile ? '13px' : '14px'}}>+ Agrega un campo, botón, texto o imagen personalizados</button>
      </div>
    </>
  );
};

export default Section3_Bloques;