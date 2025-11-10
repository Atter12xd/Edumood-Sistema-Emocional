// D:\VICTOR SHOPIFY\CODIGOS\Essential\essential\app\routes\codform\styles\codform.animations.ts

export const buttonAnimations = {
  none: {
    animation: 'none'
  },
  shake: {
    animation: 'shake 0.5s ease-in-out infinite'
  },
  bounce: {
    animation: 'bounce 1s ease-in-out infinite'
  },
  pulse: {
    animation: 'pulse 1.5s ease-in-out infinite'
  }
};

// Keyframes CSS como string para inyectar en el head
export const animationKeyframes = `
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
    20%, 40%, 60%, 80% { transform: translateX(5px); }
  }

  @keyframes bounce {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
  }

  @keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.05); }
  }
`;

// Función para inyectar los keyframes en el documento
export const injectAnimationStyles = () => {
  if (typeof document !== 'undefined') {
    const styleId = 'codform-animations';
    
    // Verificar si ya existe
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.textContent = animationKeyframes;
      document.head.appendChild(style);
    }
  }
};

// Función helper para obtener el estilo de animación
export const getAnimationStyle = (animationType: string) => {
  return buttonAnimations[animationType as keyof typeof buttonAnimations] || buttonAnimations.none;
};