import { useCallback, useRef } from "react";

/**
 * Hook para crear una función con debounce
 * Útil para evitar múltiples llamadas a API o funciones costosas
 * 
 * @param callback - Función a ejecutar después del delay
 * @param delay - Tiempo de espera en milisegundos (default: 300ms)
 * @returns Función debounced
 * 
 * @example
 * const debouncedSave = useDebounce(() => {
 *   saveToAPI();
 * }, 500);
 * 
 * // Llamar múltiples veces solo ejecutará una vez después de 500ms
 * debouncedSave();
 * debouncedSave();
 * debouncedSave();
 */
export function useDebounce<T extends (...args: unknown[]) => void>(
  callback: T,
  delay: number = 300
): T {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const debouncedCallback = useCallback(
    (...args: Parameters<T>) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        callback(...args);
      }, delay);
    },
    [callback, delay]
  ) as T;

  return debouncedCallback;
}

/**
 * Hook para crear una función con debounce que puede ser cancelada
 * Útil cuando necesitas cancelar la ejecución pendiente
 * 
 * @param callback - Función a ejecutar después del delay
 * @param delay - Tiempo de espera en milisegundos (default: 300ms)
 * @returns Objeto con la función debounced y método para cancelar
 * 
 * @example
 * const { debounced, cancel } = useDebounceWithCancel(() => {
 *   saveToAPI();
 * }, 500);
 * 
 * debounced();
 * // Si necesitas cancelar antes de que se ejecute:
 * cancel();
 */
export function useDebounceWithCancel<T extends (...args: unknown[]) => void>(
  callback: T,
  delay: number = 300
): {
  debounced: T;
  cancel: () => void;
} {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const debounced = useCallback(
    (...args: Parameters<T>) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        callback(...args);
      }, delay);
    },
    [callback, delay]
  ) as T;

  const cancel = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  return { debounced, cancel };
}

