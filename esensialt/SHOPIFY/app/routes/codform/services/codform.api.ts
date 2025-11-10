import { BACKEND_CONFIG, getBackendUrl } from "~/config/app.config";
import type {
  BlockColors,
  Blocks,
  ButtonConfig,
  ErrorMessages,
  FormStyle,
  Owner,
} from "../types/codform.types";

const CODFORM_ENDPOINTS = BACKEND_CONFIG.endpoints.codForms;

export interface CodFormApiResponse<T = unknown> {
  success: boolean;
  data: T;
  message?: string;
}

export interface CodFormApiForm {
  id: string;
  form_type: string;
  form_config: {
    formStyle: FormStyle;
    blocks: Blocks;
    blockOrder: string[];
    blockColors: BlockColors;
    buttonConfig: ButtonConfig | null;
    errorMessages: ErrorMessages;
  };
}

export interface UpsertCodFormPayload {
  shopOwner: Owner;
  product: {
    name: string;
    price: number;
    currency: string;
    image: string;
  };
  formType: string;
  formStyle: FormStyle;
  blocks: Blocks;
  blockOrder: string[];
  blockColors: BlockColors;
  buttonConfig: ButtonConfig | null;
  errorMessages: ErrorMessages;
  savedFormId?: string | null;
}

export async function fetchCodFormByShopId(
  shopId: string
): Promise<CodFormApiForm | null> {
  const url = getBackendUrl(CODFORM_ENDPOINTS.get(shopId));

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Error al cargar formularios");
  }

  const result = (await response.json()) as CodFormApiResponse<CodFormApiForm[]>;

  if (!result.success || !Array.isArray(result.data) || result.data.length === 0) {
    return null;
  }

  return result.data[0];
}

export async function upsertCodForm({
  shopOwner,
  product,
  formType,
  formStyle,
  blocks,
  blockOrder,
  blockColors,
  buttonConfig,
  errorMessages,
  savedFormId,
}: UpsertCodFormPayload): Promise<CodFormApiResponse<CodFormApiForm>> {
  const hasExistingForm = Boolean(savedFormId);

  const endpoint = hasExistingForm
    ? CODFORM_ENDPOINTS.update(savedFormId as string)
    : CODFORM_ENDPOINTS.create;

  const url = getBackendUrl(endpoint);

  const bodyData = {
    idusuarios: shopOwner.shopId,
    name: `Formulario COD - ${shopOwner.shopName || "Mi Tienda"}`,
    form_type: formType,
    country: shopOwner.country || "Peru",
    shopify_shop_url: shopOwner.shopName
      ? `https://${shopOwner.shopName}.myshopify.com`
      : "",
    product_name: product.name,
    product_price: product.price,
    product_currency: product.currency,
    product_image: product.image,
    form_config: {
      formStyle,
      blocks,
      blockOrder,
      blockColors,
      buttonConfig: formType === "popup" ? buttonConfig : null,
      errorMessages,
    },
  };

  const response = await fetch(url, {
    method: hasExistingForm ? "PATCH" : "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(bodyData),
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw new Error(errorBody?.message || "Error al guardar formulario");
  }

  return (await response.json()) as CodFormApiResponse<CodFormApiForm>;
}
