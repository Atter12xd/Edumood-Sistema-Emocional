// types/codform.types.ts

export interface FormData {
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  address2: string;
  province: string;
  city: string;
  zipCode: string;
  email: string;
  orderNote: string;
  shippingMethod?: string;
  discountCode?: string; // NUEVO
  newsletter: boolean;
  terms: boolean;
}

export interface FormStyle {
  textColor: string;
  textSize: number;
  backgroundColor: string;
  borderRadius: number;
  borderWidth: number;
  borderColor: string;
  shadow: number;
  hideCloseButton: boolean;
  hideFieldLabels: boolean;
  enableRTL: boolean;
  enableFullScreen: boolean;
}

export interface BlockConfig {
  active: boolean;
  visible: boolean;
  label?: string;
  placeholder?: string;
  required?: boolean;
  textColor?: string;
  bgColor?: string;
  textSize?: number;
  borderColor?: string;
  borderRadius?: number;
}

export interface Blocks {
  orderSummary: BlockConfig;
  shippingRates: BlockConfig;
  totalSummary: BlockConfig;
  discountCodes: BlockConfig; // NUEVO
  shippingAddress: BlockConfig; // NUEVO - Es un header/título
  firstName: BlockConfig; // NUEVO
  lastName: BlockConfig; // NUEVO
  phone: BlockConfig; // NUEVO
  address: BlockConfig; // NUEVO
  address2: BlockConfig; // NUEVO
  province: BlockConfig; // NUEVO
  city: BlockConfig; // NUEVO
  postalCode: BlockConfig;
  email: BlockConfig;
  orderNote: BlockConfig;
  newsletter: BlockConfig;
  terms: BlockConfig;
  submitButton: BlockConfig;
}

export interface ErrorMessages {
  required: string;
  invalid: string;
}

export interface Product {
  name: string;
  price: number;
  currency: string;
  image: string;
}

export interface BlockColors {
  textColor: string;
  textSize: number;
  bgColor: string;
  borderRadius: number;
  borderWidth: number;
  borderColor: string;
  shadow: number;
}

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

export interface Owner {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  shopName: string;
  address: string;
  city: string;
  country: string;
  shopId: string;
}

export interface CodFormLoaderData {
  owner?: Owner;
  shop: string;
  error?: string;
}

export type FormErrors = Partial<Record<keyof FormData, string>>;