// index.ts
export { default as CodForm } from './codform';
export { default as FormContent } from './components/FormContent';
export { default as DesignPanel } from './components/DesignPanel';
export { default as PreviewPanel } from './components/PreviewPanel';

// Exportar tipos
export type {
  FormData,
  FormStyle,
  Blocks,
  ErrorMessages,
  Product,
  BlockConfig
} from './types/codform.types';

// Exportar estilos
export { codFormStyles } from './styles/codform.styles';