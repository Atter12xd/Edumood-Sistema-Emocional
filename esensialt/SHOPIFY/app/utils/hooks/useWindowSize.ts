import { useEffect, useState } from "react";

export interface WindowSize {
  width: number;
  height: number;
  isDesktop: boolean;
  isTablet: boolean;
  isMobile: boolean;
}

/**
 * Hook para detectar el tamaño de la ventana y breakpoints comunes
 * Elimina duplicación de lógica de resize en múltiples componentes
 * 
 * @param breakpoints - Breakpoints personalizados (opcional)
 * @returns Objeto con dimensiones y flags de breakpoint
 * 
 * @example
 * const { width, isDesktop, isMobile } = useWindowSize();
 * 
 * // Breakpoints por defecto:
 * // - isMobile: width < 768px
 * // - isTablet: 768px <= width < 1024px
 * // - isDesktop: width >= 1024px
 */
export function useWindowSize(breakpoints?: {
  mobile?: number;
  tablet?: number;
  desktop?: number;
}): WindowSize {
  const mobileBreakpoint = breakpoints?.mobile ?? 768;
  const tabletBreakpoint = breakpoints?.tablet ?? 1024;

  const [windowSize, setWindowSize] = useState<WindowSize>(() => {
    if (typeof window === "undefined") {
      return {
        width: 1024,
        height: 768,
        isDesktop: true,
        isTablet: false,
        isMobile: false,
      };
    }

    const width = window.innerWidth;
    return {
      width,
      height: window.innerHeight,
      isDesktop: width >= tabletBreakpoint,
      isTablet: width >= mobileBreakpoint && width < tabletBreakpoint,
      isMobile: width < mobileBreakpoint,
    };
  });

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      setWindowSize({
        width,
        height,
        isDesktop: width >= tabletBreakpoint,
        isTablet: width >= mobileBreakpoint && width < tabletBreakpoint,
        isMobile: width < mobileBreakpoint,
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [mobileBreakpoint, tabletBreakpoint]);

  return windowSize;
}

/**
 * Hook simplificado para detectar solo si es móvil
 * Útil cuando solo necesitas saber si es móvil o no
 * 
 * @param breakpoint - Breakpoint para móvil (default: 768px)
 * @returns true si es móvil, false si no
 * 
 * @example
 * const isMobile = useIsMobile();
 */
export function useIsMobile(breakpoint: number = 768): boolean {
  const { isMobile } = useWindowSize({ mobile: breakpoint });
  return isMobile;
}

/**
 * Hook simplificado para detectar solo si es desktop
 * Útil cuando solo necesitas saber si es desktop o no
 * 
 * @param breakpoint - Breakpoint para desktop (default: 1024px)
 * @returns true si es desktop, false si no
 * 
 * @example
 * const isDesktop = useIsDesktop();
 */
export function useIsDesktop(breakpoint: number = 1024): boolean {
  const { isDesktop } = useWindowSize({ desktop: breakpoint });
  return isDesktop;
}


