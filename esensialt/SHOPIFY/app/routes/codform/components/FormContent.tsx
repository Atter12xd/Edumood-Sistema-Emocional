// components/FormContent.tsx
import React, { useState, useEffect } from 'react';
import { FormData, FormStyle, Blocks, Product, BlockColors } from '../types/codform.types';

interface FormContentProps {
  formData: FormData;
  formStyle: FormStyle;
  blocks: Blocks;
  product: Product;
  blockOrder: string[];
  blockColors?: BlockColors;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
}

const FormContent: React.FC<FormContentProps> = ({
  formData,
  formStyle,
  blocks,
  product,
  blockOrder,
  blockColors,
  onInputChange,
  onSubmit
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

  const globalColors = blockColors || {
    textColor: '#1f2937',
    textSize: 14,
    bgColor: '#ffffff',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#e5e7eb',
    shadow: 4
  };

  const getBlockStyles = (blockName: keyof Blocks) => {
    const block = blocks[blockName];
    return {
      textColor: block?.textColor || globalColors.textColor,
      textSize: block?.textSize || globalColors.textSize,
      bgColor: block?.bgColor || globalColors.bgColor,
      borderColor: block?.borderColor || globalColors.borderColor,
      borderRadius: block?.borderRadius || globalColors.borderRadius,
      label: block?.label,
      placeholder: block?.placeholder,
      required: block?.required
    };
  };

  const formGroupStyle: React.CSSProperties = {
    marginBottom: isMobile ? '16px' : '20px'
  };

  const blockComponents: Record<string, JSX.Element> = {
    orderSummary: blocks.orderSummary?.visible ? (
      <div key="orderSummary" style={{
        padding: isMobile ? '12px' : '16px',
        backgroundColor: getBlockStyles('orderSummary').bgColor,
        borderRadius: `${getBlockStyles('orderSummary').borderRadius}px`,
        marginBottom: isMobile ? '16px' : '20px',
        border: `${globalColors.borderWidth}px solid ${getBlockStyles('orderSummary').borderColor}`,
        boxShadow: `0 ${globalColors.shadow}px ${globalColors.shadow * 2}px rgba(0, 0, 0, 0.1)`
      }}>
        <div style={{display: 'flex', alignItems: 'center', gap: isMobile ? '8px' : '12px'}}>
          <div style={{
            backgroundColor: '#1f2937',
            color: 'white',
            width: isMobile ? '24px' : '28px',
            height: isMobile ? '24px' : '28px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: isMobile ? `${Math.max(12, getBlockStyles('orderSummary').textSize - 2)}px` : `${getBlockStyles('orderSummary').textSize}px`,
            fontWeight: '600',
            flexShrink: 0
          }}>1</div>
          <div style={{fontSize: isMobile ? '28px' : '32px', flexShrink: 0}}>{product.image}</div>
          <div style={{flex: 1, minWidth: 0}}>
            <div style={{fontSize: isMobile ? `${Math.max(13, getBlockStyles('orderSummary').textSize - 1)}px` : `${getBlockStyles('orderSummary').textSize}px`, fontWeight: '600', color: getBlockStyles('orderSummary').textColor, wordWrap: 'break-word'}}>
              {product.name}
            </div>
            <div style={{fontSize: isMobile ? `${Math.max(14, getBlockStyles('orderSummary').textSize)}px` : `${getBlockStyles('orderSummary').textSize + 2}px`, fontWeight: '700', color: '#6366f1'}}>
              {product.currency}{product.price}
            </div>
          </div>
        </div>
      </div>
    ) : <React.Fragment key="orderSummary" />,

    shippingRates: blocks.shippingRates?.visible ? (
      <div key="shippingRates" style={formGroupStyle}>
        <label style={{
          display: 'block',
          marginBottom: isMobile ? '6px' : '8px',
          fontSize: isMobile ? `${Math.max(13, getBlockStyles('shippingRates').textSize - 1)}px` : `${getBlockStyles('shippingRates').textSize}px`,
          fontWeight: '500',
          color: getBlockStyles('shippingRates').textColor
        }}>
          {getBlockStyles('shippingRates').label || 'Método de envío'}
        </label>
        <select 
          name="shippingMethod" 
          value={formData.shippingMethod || 'standard'}
          onChange={onInputChange}
          style={{
            width: '100%',
            padding: isMobile ? '10px' : '12px',
            border: `${globalColors.borderWidth}px solid ${getBlockStyles('shippingRates').borderColor}`,
            borderRadius: `${getBlockStyles('shippingRates').borderRadius}px`,
            fontSize: isMobile ? `${Math.max(14, getBlockStyles('shippingRates').textSize - 1)}px` : `${getBlockStyles('shippingRates').textSize}px`,
            fontFamily: 'inherit',
            backgroundColor: getBlockStyles('shippingRates').bgColor,
            color: getBlockStyles('shippingRates').textColor,
            boxShadow: `0 ${globalColors.shadow}px ${globalColors.shadow * 2}px rgba(0, 0, 0, 0.1)`
          }}
        >
          <option value="standard">Envío estándar - Gratis</option>
          <option value="express">Envío express - {product.currency}5.00</option>
        </select>
      </div>
    ) : <React.Fragment key="shippingRates" />,

    totalSummary: blocks.totalSummary?.visible ? (
      <div key="totalSummary" style={{
        padding: isMobile ? '12px' : '16px',
        backgroundColor: getBlockStyles('totalSummary').bgColor,
        borderRadius: `${getBlockStyles('totalSummary').borderRadius}px`,
        marginBottom: isMobile ? '16px' : '20px',
        border: `${globalColors.borderWidth}px solid ${getBlockStyles('totalSummary').borderColor}`,
        boxShadow: `0 ${globalColors.shadow}px ${globalColors.shadow * 2}px rgba(0, 0, 0, 0.1)`
      }}>
        <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '8px'}}>
          <span style={{fontSize: isMobile ? `${Math.max(13, getBlockStyles('totalSummary').textSize - 1)}px` : `${getBlockStyles('totalSummary').textSize}px`, color: getBlockStyles('totalSummary').textColor}}>Subtotal</span>
          <span style={{fontSize: isMobile ? `${Math.max(13, getBlockStyles('totalSummary').textSize - 1)}px` : `${getBlockStyles('totalSummary').textSize}px`, fontWeight: '600', color: getBlockStyles('totalSummary').textColor}}>{product.currency} {product.price}</span>
        </div>
        <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '12px'}}>
          <span style={{fontSize: isMobile ? `${Math.max(13, getBlockStyles('totalSummary').textSize - 1)}px` : `${getBlockStyles('totalSummary').textSize}px`, color: getBlockStyles('totalSummary').textColor}}>Envío</span>
          <span style={{fontSize: isMobile ? `${Math.max(13, getBlockStyles('totalSummary').textSize - 1)}px` : `${getBlockStyles('totalSummary').textSize}px`, fontWeight: '600', color: '#10b981'}}>Gratis</span>
        </div>
        <div style={{
          borderTop: `${globalColors.borderWidth}px solid ${getBlockStyles('totalSummary').borderColor}`,
          paddingTop: '12px',
          display: 'flex',
          justifyContent: 'space-between'
        }}>
          <span style={{fontSize: isMobile ? `${Math.max(16, getBlockStyles('totalSummary').textSize + 2)}px` : `${getBlockStyles('totalSummary').textSize + 4}px`, fontWeight: '700', color: getBlockStyles('totalSummary').textColor}}>Total</span>
          <span style={{fontSize: isMobile ? `${Math.max(16, getBlockStyles('totalSummary').textSize + 2)}px` : `${getBlockStyles('totalSummary').textSize + 4}px`, fontWeight: '700', color: '#6366f1'}}>
            {product.currency} {product.price}
          </span>
        </div>
      </div>
    ) : <React.Fragment key="totalSummary" />,

    discountCodes: blocks.discountCodes?.visible ? (
      <div key="discountCodes" style={formGroupStyle}>
        <label style={{
          display: 'block',
          marginBottom: isMobile ? '6px' : '8px',
          fontSize: isMobile ? `${Math.max(13, getBlockStyles('discountCodes').textSize - 1)}px` : `${getBlockStyles('discountCodes').textSize}px`,
          fontWeight: '500',
          color: getBlockStyles('discountCodes').textColor
        }}>
          {getBlockStyles('discountCodes').label || 'Código de descuento'}
        </label>
        <input
          type="text"
          name="discountCode"
          value={formData.discountCode || ''}
          onChange={onInputChange}
          placeholder={getBlockStyles('discountCodes').placeholder || 'Código de descuento'}
          style={{
            width: '100%',
            padding: isMobile ? '10px' : '12px',
            border: `${globalColors.borderWidth}px solid ${getBlockStyles('discountCodes').borderColor}`,
            borderRadius: `${getBlockStyles('discountCodes').borderRadius}px`,
            fontSize: isMobile ? `${Math.max(14, getBlockStyles('discountCodes').textSize - 1)}px` : `${getBlockStyles('discountCodes').textSize}px`,
            fontFamily: 'inherit',
            backgroundColor: getBlockStyles('discountCodes').bgColor,
            color: getBlockStyles('discountCodes').textColor,
            boxShadow: `0 ${globalColors.shadow}px ${globalColors.shadow * 2}px rgba(0, 0, 0, 0.1)`
          }}
        />
      </div>
    ) : <React.Fragment key="discountCodes" />,

    shippingAddress: blocks.shippingAddress?.visible ? (
      <div key="shippingAddress" style={{marginBottom: isMobile ? '12px' : '16px', marginTop: isMobile ? '16px' : '24px'}}>
        <h3 style={{
          fontSize: isMobile ? `${Math.max(15, getBlockStyles('shippingAddress').textSize - 1)}px` : `${getBlockStyles('shippingAddress').textSize}px`,
          fontWeight: '600',
          color: getBlockStyles('shippingAddress').textColor,
          margin: '0 0 12px 0'
        }}>
          {getBlockStyles('shippingAddress').label || 'Ingrese su dirección de envío'}
        </h3>
      </div>
    ) : <React.Fragment key="shippingAddress" />,

    firstName: blocks.firstName?.visible ? (
      <div key="firstName" style={formGroupStyle}>
        <label style={{
          display: 'block',
          marginBottom: isMobile ? '6px' : '8px',
          fontSize: isMobile ? `${Math.max(13, getBlockStyles('firstName').textSize - 1)}px` : `${getBlockStyles('firstName').textSize}px`,
          fontWeight: '500',
          color: getBlockStyles('firstName').textColor
        }}>
          {getBlockStyles('firstName').label || 'Nombre'} 
          {getBlockStyles('firstName').required && <span style={{color: '#ef4444'}}> *</span>}
        </label>
        <input
          type="text"
          name="firstName"
          value={formData.firstName}
          onChange={onInputChange}
          placeholder={getBlockStyles('firstName').placeholder || 'Nombre'}
          required={getBlockStyles('firstName').required}
          style={{
            width: '100%',
            padding: isMobile ? '10px' : '12px',
            border: `${globalColors.borderWidth}px solid ${getBlockStyles('firstName').borderColor}`,
            borderRadius: `${getBlockStyles('firstName').borderRadius}px`,
            fontSize: isMobile ? `${Math.max(14, getBlockStyles('firstName').textSize - 1)}px` : `${getBlockStyles('firstName').textSize}px`,
            fontFamily: 'inherit',
            backgroundColor: getBlockStyles('firstName').bgColor,
            color: getBlockStyles('firstName').textColor,
            boxShadow: `0 ${globalColors.shadow}px ${globalColors.shadow * 2}px rgba(0, 0, 0, 0.1)`
          }}
        />
      </div>
    ) : <React.Fragment key="firstName" />,

    lastName: blocks.lastName?.visible ? (
      <div key="lastName" style={formGroupStyle}>
        <label style={{
          display: 'block',
          marginBottom: isMobile ? '6px' : '8px',
          fontSize: isMobile ? `${Math.max(13, getBlockStyles('lastName').textSize - 1)}px` : `${getBlockStyles('lastName').textSize}px`,
          fontWeight: '500',
          color: getBlockStyles('lastName').textColor
        }}>
          {getBlockStyles('lastName').label || 'Apellido'} 
          {getBlockStyles('lastName').required && <span style={{color: '#ef4444'}}> *</span>}
        </label>
        <input
          type="text"
          name="lastName"
          value={formData.lastName}
          onChange={onInputChange}
          placeholder={getBlockStyles('lastName').placeholder || 'Apellido'}
          required={getBlockStyles('lastName').required}
          style={{
            width: '100%',
            padding: isMobile ? '10px' : '12px',
            border: `${globalColors.borderWidth}px solid ${getBlockStyles('lastName').borderColor}`,
            borderRadius: `${getBlockStyles('lastName').borderRadius}px`,
            fontSize: isMobile ? `${Math.max(14, getBlockStyles('lastName').textSize - 1)}px` : `${getBlockStyles('lastName').textSize}px`,
            fontFamily: 'inherit',
            backgroundColor: getBlockStyles('lastName').bgColor,
            color: getBlockStyles('lastName').textColor,
            boxShadow: `0 ${globalColors.shadow}px ${globalColors.shadow * 2}px rgba(0, 0, 0, 0.1)`
          }}
        />
      </div>
    ) : <React.Fragment key="lastName" />,

    phone: blocks.phone?.visible ? (
      <div key="phone" style={formGroupStyle}>
        <label style={{
          display: 'block',
          marginBottom: isMobile ? '6px' : '8px',
          fontSize: isMobile ? `${Math.max(13, getBlockStyles('phone').textSize - 1)}px` : `${getBlockStyles('phone').textSize}px`,
          fontWeight: '500',
          color: getBlockStyles('phone').textColor
        }}>
          {getBlockStyles('phone').label || 'Teléfono'} 
          {getBlockStyles('phone').required && <span style={{color: '#ef4444'}}> *</span>}
        </label>
        <input
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={onInputChange}
          placeholder={getBlockStyles('phone').placeholder || 'Teléfono'}
          required={getBlockStyles('phone').required}
          style={{
            width: '100%',
            padding: isMobile ? '10px' : '12px',
            border: `${globalColors.borderWidth}px solid ${getBlockStyles('phone').borderColor}`,
            borderRadius: `${getBlockStyles('phone').borderRadius}px`,
            fontSize: isMobile ? `${Math.max(14, getBlockStyles('phone').textSize - 1)}px` : `${getBlockStyles('phone').textSize}px`,
            fontFamily: 'inherit',
            backgroundColor: getBlockStyles('phone').bgColor,
            color: getBlockStyles('phone').textColor,
            boxShadow: `0 ${globalColors.shadow}px ${globalColors.shadow * 2}px rgba(0, 0, 0, 0.1)`
          }}
        />
      </div>
    ) : <React.Fragment key="phone" />,

    address: blocks.address?.visible ? (
      <div key="address" style={formGroupStyle}>
        <label style={{
          display: 'block',
          marginBottom: isMobile ? '6px' : '8px',
          fontSize: isMobile ? `${Math.max(13, getBlockStyles('address').textSize - 1)}px` : `${getBlockStyles('address').textSize}px`,
          fontWeight: '500',
          color: getBlockStyles('address').textColor
        }}>
          {getBlockStyles('address').label || 'Dirección'} 
          {getBlockStyles('address').required && <span style={{color: '#ef4444'}}> *</span>}
        </label>
        <input
          type="text"
          name="address"
          value={formData.address}
          onChange={onInputChange}
          placeholder={getBlockStyles('address').placeholder || 'Dirección'}
          required={getBlockStyles('address').required}
          style={{
            width: '100%',
            padding: isMobile ? '10px' : '12px',
            border: `${globalColors.borderWidth}px solid ${getBlockStyles('address').borderColor}`,
            borderRadius: `${getBlockStyles('address').borderRadius}px`,
            fontSize: isMobile ? `${Math.max(14, getBlockStyles('address').textSize - 1)}px` : `${getBlockStyles('address').textSize}px`,
            fontFamily: 'inherit',
            backgroundColor: getBlockStyles('address').bgColor,
            color: getBlockStyles('address').textColor,
            boxShadow: `0 ${globalColors.shadow}px ${globalColors.shadow * 2}px rgba(0, 0, 0, 0.1)`
          }}
        />
      </div>
    ) : <React.Fragment key="address" />,

    address2: blocks.address2?.visible ? (
      <div key="address2" style={formGroupStyle}>
        <label style={{
          display: 'block',
          marginBottom: isMobile ? '6px' : '8px',
          fontSize: isMobile ? `${Math.max(13, getBlockStyles('address2').textSize - 1)}px` : `${getBlockStyles('address2').textSize}px`,
          fontWeight: '500',
          color: getBlockStyles('address2').textColor
        }}>
          {getBlockStyles('address2').label || 'Dirección 2'}
        </label>
        <input
          type="text"
          name="address2"
          value={formData.address2}
          onChange={onInputChange}
          placeholder={getBlockStyles('address2').placeholder || 'Dirección 2'}
          style={{
            width: '100%',
            padding: isMobile ? '10px' : '12px',
            border: `${globalColors.borderWidth}px solid ${getBlockStyles('address2').borderColor}`,
            borderRadius: `${getBlockStyles('address2').borderRadius}px`,
            fontSize: isMobile ? `${Math.max(14, getBlockStyles('address2').textSize - 1)}px` : `${getBlockStyles('address2').textSize}px`,
            fontFamily: 'inherit',
            backgroundColor: getBlockStyles('address2').bgColor,
            color: getBlockStyles('address2').textColor,
            boxShadow: `0 ${globalColors.shadow}px ${globalColors.shadow * 2}px rgba(0, 0, 0, 0.1)`
          }}
        />
      </div>
    ) : <React.Fragment key="address2" />,

    province: blocks.province?.visible ? (
      <div key="province" style={formGroupStyle}>
        <label style={{
          display: 'block',
          marginBottom: isMobile ? '6px' : '8px',
          fontSize: isMobile ? `${Math.max(13, getBlockStyles('province').textSize - 1)}px` : `${getBlockStyles('province').textSize}px`,
          fontWeight: '500',
          color: getBlockStyles('province').textColor
        }}>
          {getBlockStyles('province').label || 'Provincia'} 
          {getBlockStyles('province').required && <span style={{color: '#ef4444'}}> *</span>}
        </label>
        <input
          type="text"
          name="province"
          value={formData.province}
          onChange={onInputChange}
          placeholder={getBlockStyles('province').placeholder || 'Provincia'}
          required={getBlockStyles('province').required}
          style={{
            width: '100%',
            padding: isMobile ? '10px' : '12px',
            border: `${globalColors.borderWidth}px solid ${getBlockStyles('province').borderColor}`,
            borderRadius: `${getBlockStyles('province').borderRadius}px`,
            fontSize: isMobile ? `${Math.max(14, getBlockStyles('province').textSize - 1)}px` : `${getBlockStyles('province').textSize}px`,
            fontFamily: 'inherit',
            backgroundColor: getBlockStyles('province').bgColor,
            color: getBlockStyles('province').textColor,
            boxShadow: `0 ${globalColors.shadow}px ${globalColors.shadow * 2}px rgba(0, 0, 0, 0.1)`
          }}
        />
      </div>
    ) : <React.Fragment key="province" />,

    city: blocks.city?.visible ? (
      <div key="city" style={formGroupStyle}>
        <label style={{
          display: 'block',
          marginBottom: isMobile ? '6px' : '8px',
          fontSize: isMobile ? `${Math.max(13, getBlockStyles('city').textSize - 1)}px` : `${getBlockStyles('city').textSize}px`,
          fontWeight: '500',
          color: getBlockStyles('city').textColor
        }}>
          {getBlockStyles('city').label || 'Ciudad'} 
          {getBlockStyles('city').required && <span style={{color: '#ef4444'}}> *</span>}
        </label>
        <input
          type="text"
          name="city"
          value={formData.city}
          onChange={onInputChange}
          placeholder={getBlockStyles('city').placeholder || 'Ciudad'}
          required={getBlockStyles('city').required}
          style={{
            width: '100%',
            padding: isMobile ? '10px' : '12px',
            border: `${globalColors.borderWidth}px solid ${getBlockStyles('city').borderColor}`,
            borderRadius: `${getBlockStyles('city').borderRadius}px`,
            fontSize: isMobile ? `${Math.max(14, getBlockStyles('city').textSize - 1)}px` : `${getBlockStyles('city').textSize}px`,
            fontFamily: 'inherit',
            backgroundColor: getBlockStyles('city').bgColor,
            color: getBlockStyles('city').textColor,
            boxShadow: `0 ${globalColors.shadow}px ${globalColors.shadow * 2}px rgba(0, 0, 0, 0.1)`
          }}
        />
      </div>
    ) : <React.Fragment key="city" />,

    postalCode: blocks.postalCode?.visible ? (
      <div key="postalCode" style={formGroupStyle}>
        <label style={{
          display: 'block',
          marginBottom: isMobile ? '6px' : '8px',
          fontSize: isMobile ? `${Math.max(13, getBlockStyles('postalCode').textSize - 1)}px` : `${getBlockStyles('postalCode').textSize}px`,
          fontWeight: '500',
          color: getBlockStyles('postalCode').textColor
        }}>
          {getBlockStyles('postalCode').label || 'Código postal'} 
          {getBlockStyles('postalCode').required && <span style={{color: '#ef4444'}}> *</span>}
        </label>
        <input
          type="text"
          name="zipCode"
          value={formData.zipCode}
          onChange={onInputChange}
          placeholder={getBlockStyles('postalCode').placeholder || 'Ej: 15001'}
          required={getBlockStyles('postalCode').required}
          style={{
            width: '100%',
            padding: isMobile ? '10px' : '12px',
            border: `${globalColors.borderWidth}px solid ${getBlockStyles('postalCode').borderColor}`,
            borderRadius: `${getBlockStyles('postalCode').borderRadius}px`,
            fontSize: isMobile ? `${Math.max(14, getBlockStyles('postalCode').textSize - 1)}px` : `${getBlockStyles('postalCode').textSize}px`,
            fontFamily: 'inherit',
            backgroundColor: getBlockStyles('postalCode').bgColor,
            color: getBlockStyles('postalCode').textColor,
            boxShadow: `0 ${globalColors.shadow}px ${globalColors.shadow * 2}px rgba(0, 0, 0, 0.1)`
          }}
        />
      </div>
    ) : <React.Fragment key="postalCode" />,

    email: blocks.email?.visible ? (
      <div key="email" style={formGroupStyle}>
        <label style={{
          display: 'block',
          marginBottom: isMobile ? '6px' : '8px',
          fontSize: isMobile ? `${Math.max(13, getBlockStyles('email').textSize - 1)}px` : `${getBlockStyles('email').textSize}px`,
          fontWeight: '500',
          color: getBlockStyles('email').textColor
        }}>
          {getBlockStyles('email').label || 'Correo electrónico'} 
          {getBlockStyles('email').required && <span style={{color: '#ef4444'}}> *</span>}
        </label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={onInputChange}
          placeholder={getBlockStyles('email').placeholder || 'tu@email.com'}
          required={getBlockStyles('email').required}
          style={{
            width: '100%',
            padding: isMobile ? '10px' : '12px',
            border: `${globalColors.borderWidth}px solid ${getBlockStyles('email').borderColor}`,
            borderRadius: `${getBlockStyles('email').borderRadius}px`,
            fontSize: isMobile ? `${Math.max(14, getBlockStyles('email').textSize - 1)}px` : `${getBlockStyles('email').textSize}px`,
            fontFamily: 'inherit',
            backgroundColor: getBlockStyles('email').bgColor,
            color: getBlockStyles('email').textColor,
            boxShadow: `0 ${globalColors.shadow}px ${globalColors.shadow * 2}px rgba(0, 0, 0, 0.1)`
          }}
        />
      </div>
    ) : <React.Fragment key="email" />,

    orderNote: blocks.orderNote?.visible ? (
      <div key="orderNote" style={formGroupStyle}>
        <label style={{
          display: 'block',
          marginBottom: isMobile ? '6px' : '8px',
          fontSize: isMobile ? `${Math.max(13, getBlockStyles('orderNote').textSize - 1)}px` : `${getBlockStyles('orderNote').textSize}px`,
          fontWeight: '500',
          color: getBlockStyles('orderNote').textColor
        }}>
          {getBlockStyles('orderNote').label || 'Nota del pedido'}
        </label>
        <textarea
          name="orderNote"
          value={formData.orderNote}
          onChange={onInputChange}
          placeholder={getBlockStyles('orderNote').placeholder || 'Instrucciones especiales de entrega...'}
          style={{
            width: '100%',
            padding: isMobile ? '10px' : '12px',
            border: `${globalColors.borderWidth}px solid ${getBlockStyles('orderNote').borderColor}`,
            borderRadius: `${getBlockStyles('orderNote').borderRadius}px`,
            fontSize: isMobile ? `${Math.max(14, getBlockStyles('orderNote').textSize - 1)}px` : `${getBlockStyles('orderNote').textSize}px`,
            fontFamily: 'inherit',
            backgroundColor: getBlockStyles('orderNote').bgColor,
            color: getBlockStyles('orderNote').textColor,
            boxShadow: `0 ${globalColors.shadow}px ${globalColors.shadow * 2}px rgba(0, 0, 0, 0.1)`,
            minHeight: isMobile ? '70px' : '80px',
            resize: 'vertical'
          }}
        />
      </div>
      ) : <React.Fragment key="newsletter" />,

    terms: blocks.terms?.visible ? (
      <div key="terms" style={{display: 'flex', alignItems: 'flex-start', gap: isMobile ? '6px' : '8px', marginBottom: isMobile ? '16px' : '20px'}}>
        <input
          type="checkbox"
          name="terms"
          checked={formData.terms}
          onChange={onInputChange}
          required={getBlockStyles('terms').required}
          style={{marginTop: '4px', width: isMobile ? '16px' : '18px', height: isMobile ? '16px' : '18px'}}
        />
        <label style={{
          fontSize: isMobile ? `${Math.max(13, getBlockStyles('terms').textSize - 1)}px` : `${getBlockStyles('terms').textSize}px`, 
          color: getBlockStyles('terms').textColor, 
          lineHeight: '1.5',
          cursor: 'pointer'
        }}>
          {getBlockStyles('terms').label || 'Acepto nuestros términos y condiciones'}
          {getBlockStyles('terms').required && <span style={{color: '#ef4444'}}> *</span>}
        </label>
      </div>
    ) : <React.Fragment key="terms" />,

    submitButton: blocks.submitButton?.visible ? (
      <button
        key="submitButton"
        type="submit"
        style={{
          width: '100%',
          padding: isMobile ? '14px' : '16px',
          backgroundColor: '#6366f1',
          color: 'white',
          border: 'none',
          borderRadius: `${globalColors.borderRadius}px`,
          fontSize: isMobile ? `${Math.max(14, globalColors.textSize)}px` : `${globalColors.textSize + 2}px`,
          fontWeight: '700',
          cursor: 'pointer',
          textTransform: 'uppercase',
          letterSpacing: isMobile ? '0.3px' : '0.5px',
          boxShadow: `0 ${globalColors.shadow}px ${globalColors.shadow * 2}px rgba(99, 102, 241, 0.3)`,
          transition: 'all 0.3s ease'
        }}
      >
        {getBlockStyles('submitButton').label || `COMPLETA TU COMPRA - ${product.currency}${product.price}`}
      </button>
    ) : <React.Fragment key="submitButton" />
  };

  const orderedComponents = blockOrder
    .map(blockId => blockComponents[blockId])
    .filter(Boolean);

  return (
    <form onSubmit={onSubmit} style={{width: '100%'}}>
      {orderedComponents}
    </form>
  );
};

export default FormContent;