// D:\VICTOR SHOPIFY\CODIGOS\Essential\essential\app\routes\codform\styles\codform.icons.ts

export const buttonIconsConfig = {
  none: {
    label: 'Sin icono',
    emoji: '',
    unicode: ''
  },
  cart1: {
    label: 'Carrito 1',
    emoji: '🛒',
    unicode: '&#x1F6D2;'
  },
  cart2: {
    label: 'Carrito 2',
    emoji: '🛍️',
    unicode: '&#x1F6CD;'
  },
  cart3: {
    label: 'Carrito 3',
    emoji: '🛺',
    unicode: '&#x1F6FA;'
  },
  bag: {
    label: 'Bolsa',
    emoji: '👜',
    unicode: '&#x1F45C;'
  },
  box: {
    label: 'Paquete',
    emoji: '📦',
    unicode: '&#x1F4E6;'
  },
  truck: {
    label: 'Camión',
    emoji: '🚚',
    unicode: '&#x1F69A;'
  },
  arrow: {
    label: 'Flecha',
    emoji: '➡️',
    unicode: '&#x27A1;'
  },
  card: {
    label: 'Tarjeta',
    emoji: '💳',
    unicode: '&#x1F4B3;'
  },
  tag: {
    label: 'Etiqueta',
    emoji: '🏷️',
    unicode: '&#x1F3F7;'
  },
  money: {
    label: 'Dinero',
    emoji: '💰',
    unicode: '&#x1F4B0;'
  }
};

// Función helper para obtener el icono
export const getButtonIcon = (iconType: string): string => {
  const icon = buttonIconsConfig[iconType as keyof typeof buttonIconsConfig];
  return icon ? icon.emoji : '';
};

// Función helper para obtener el label del icono
export const getButtonIconLabel = (iconType: string): string => {
  const icon = buttonIconsConfig[iconType as keyof typeof buttonIconsConfig];
  return icon ? icon.label : 'Sin icono';
};

// Exportar un array para usar en los selects
export const buttonIconsArray = Object.entries(buttonIconsConfig).map(([key, value]) => ({
  key,
  label: value.label,
  emoji: value.emoji
}));