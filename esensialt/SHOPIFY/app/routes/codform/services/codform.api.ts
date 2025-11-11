import { BACKEND_CONFIG, getBackendUrl } from "~/config/app.config";
import logger from "~/utils/logger.server";
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

function validateUpsertPayload(payload: UpsertCodFormPayload): string[] {
  const errors: string[] = [];

  if (!payload.shopOwner?.shopId) {
    errors.push("El identificador de la tienda (shopId) es obligatorio.");
  }

  if (!payload.product?.name?.trim()) {
    errors.push("El nombre del producto es obligatorio.");
  }

  if (typeof payload.product?.price !== "number" || Number.isNaN(payload.product.price)) {
    errors.push("El precio del producto debe ser un número válido.");
  }

  if (!payload.product?.currency?.trim()) {
    errors.push("La moneda del producto es obligatoria.");
  }

  if (!payload.blocks || Object.keys(payload.blocks).length === 0) {
    errors.push("La configuración de bloques no puede estar vacía.");
  }

  if (!payload.blockOrder || payload.blockOrder.length === 0) {
    errors.push("El orden de los bloques es obligatorio.");
  }

  return errors;
}

async function parseErrorBody(response: Response) {
  const text = await response.text().catch(() => "");
  try {
    return text ? JSON.parse(text) : {};
  } catch {
    return { raw: text };
  }
}

export async function fetchCodFormByShopId(
  shopId: string
): Promise<CodFormApiForm | null> {
  if (!shopId) {
    logger.warn({ shopId }, "[CODFORM] shopId no proporcionado para fetchCodFormByShopId");
    return null;
  }

  const url = getBackendUrl(CODFORM_ENDPOINTS.get(shopId));
  const startedAt = Date.now();

  try {
    logger.info({ shopId, url }, "[CODFORM] solicitando formulario existente");

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorBody = await parseErrorBody(response);
      logger.warn(
        { shopId, status: response.status, errorBody },
        "[CODFORM] error al obtener formulario"
      );
      throw new Error("Error al cargar formularios");
    }

    const result = (await response.json()) as CodFormApiResponse<CodFormApiForm[]>;

    if (!result.success || !Array.isArray(result.data) || result.data.length === 0) {
      logger.info({ shopId, durationMs: Date.now() - startedAt }, "[CODFORM] no se encontró formulario existente");
      return null;
    }

    logger.info(
      { shopId, formId: result.data[0].id, durationMs: Date.now() - startedAt },
      "[CODFORM] formulario obtenido exitosamente"
    );

    return result.data[0];
  } catch (error) {
    logger.error(
      { shopId, error: error instanceof Error ? error.message : error },
      "[CODFORM] fallo al obtener formulario"
    );
    throw error instanceof Error ? error : new Error("Error al cargar formularios");
  }
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
  const validationErrors = validateUpsertPayload({
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
  });

  if (validationErrors.length > 0) {
    logger.warn(
      { shopId: shopOwner?.shopId, validationErrors },
      "[CODFORM] payload inválido al intentar guardar"
    );
    throw new Error(validationErrors.join(" "));
  }

  const hasExistingForm = Boolean(savedFormId);

  const endpoint = hasExistingForm
    ? CODFORM_ENDPOINTS.update(savedFormId as string)
    : CODFORM_ENDPOINTS.create;

  const url = getBackendUrl(endpoint);
  const startedAt = Date.now();

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

  try {
    logger.info(
      {
        shopId: shopOwner.shopId,
        method: hasExistingForm ? "PATCH" : "POST",
        endpoint,
      },
      "[CODFORM] enviando formulario para guardar/actualizar"
    );

    const response = await fetch(url, {
      method: hasExistingForm ? "PATCH" : "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bodyData),
    });

    if (!response.ok) {
      const errorBody = await parseErrorBody(response);
      logger.error(
        {
          shopId: shopOwner.shopId,
          status: response.status,
          errorBody,
        },
        "[CODFORM] error desde backend al guardar formulario"
      );

      const message =
        typeof errorBody?.message === "string"
          ? errorBody.message
          : "Error al guardar formulario";
      throw new Error(message);
    }

    const result = (await response.json()) as CodFormApiResponse<CodFormApiForm>;

    logger.info(
      {
        shopId: shopOwner.shopId,
        formId: result?.data?.id,
        durationMs: Date.now() - startedAt,
      },
      "[CODFORM] formulario guardado correctamente"
    );

    return result;
  } catch (error) {
    logger.error(
      {
        shopId: shopOwner?.shopId,
        error: error instanceof Error ? error.message : error,
      },
      "[CODFORM] fallo al guardar formulario"
    );
    throw error instanceof Error ? error : new Error("Error al guardar formulario");
  }
}
