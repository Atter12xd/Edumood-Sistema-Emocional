import { beforeEach, describe, expect, it, vi, afterEach } from "vitest";
import type { CodFormApiResponse } from "../app/routes/codform/services/codform.api";
import {
  fetchCodFormByShopId,
  upsertCodForm,
} from "../app/routes/codform/services/codform.api";
import logger from "../app/utils/logger.server";

vi.mock("../app/utils/logger.server", () => {
  const info = vi.fn();
  const warn = vi.fn();
  const error = vi.fn();
  const debug = vi.fn();

  return {
    __esModule: true,
    default: {
      info,
      warn,
      error,
      debug,
    },
  };
});

describe("COD Form API service", () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  it("debe obtener un formulario existente correctamente", async () => {
    const mockResponse: CodFormApiResponse<any[]> = {
      success: true,
      data: [
        {
          id: "cod123",
          form_type: "popup",
          form_config: {
            formStyle: {},
            blocks: {},
            blockOrder: [],
            blockColors: {},
            buttonConfig: null,
            errorMessages: {},
          },
        },
      ],
    };

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockResponse,
    });

    const result = await fetchCodFormByShopId("shop-123");

    expect(result?.id).toBe("cod123");
    expect(logger.info).toHaveBeenCalled();
  });

  it("debe registrar error cuando el backend responde con status no exitoso", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
      text: async () => JSON.stringify({ message: "Internal error" }),
    });

    await expect(fetchCodFormByShopId("shop-error")).rejects.toThrow(
      "Error al cargar formularios"
    );
    expect(logger.error).toHaveBeenCalled();
  });

  it("debe rechazar payload inválido al guardar", async () => {
    await expect(
      upsertCodForm({
        // @ts-expect-error verificando validación interna
        shopOwner: {},
        product: {
          name: "",
          price: Number.NaN,
          currency: "",
          image: "",
        },
        formType: "popup",
        formStyle: {} as any,
        blocks: {} as any,
        blockOrder: [],
        blockColors: {} as any,
        buttonConfig: null,
        errorMessages: {} as any,
      })
    ).rejects.toThrow();

    expect(logger.warn).toHaveBeenCalled();
  });

  it("debe enviar y recibir guardado exitoso", async () => {
    const mockResponse: CodFormApiResponse<any> = {
      success: true,
      data: {
        id: "cod-999",
      },
    };

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockResponse,
    });

    const result = await upsertCodForm({
      shopOwner: {
        shopId: "owner-1",
        shopName: "store",
        country: "PE",
        email: "store@example.com",
        phone: "+51999999999",
      },
      product: {
        name: "Producto",
        price: 10,
        currency: "PEN",
        image: "",
      },
      formType: "popup",
      formStyle: {} as any,
      blocks: { submitButton: { active: true, visible: true } } as any,
      blockOrder: ["submitButton"],
      blockColors: {} as any,
      buttonConfig: null,
      errorMessages: {} as any,
    });

    expect(result.success).toBe(true);
    expect(logger.info).toHaveBeenCalled();
  });
});


