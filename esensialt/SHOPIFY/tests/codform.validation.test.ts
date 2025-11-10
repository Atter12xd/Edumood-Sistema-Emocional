import { describe, it, expect } from "vitest";
import { validateCodFormData } from "../app/routes/codform/validation/codform.validation";
import type {
  Blocks,
  ErrorMessages,
  FormData,
} from "../app/routes/codform/types/codform.types";

const baseMessages: ErrorMessages = {
  required: "Este campo es obligatorio.",
  invalid: "Introduce un valor válido.",
};

const createBlocks = (overrides?: Partial<Blocks>): Blocks => ({
  orderSummary: { active: true, visible: true },
  shippingRates: { active: true, visible: true },
  totalSummary: { active: true, visible: true },
  discountCodes: { active: true, visible: true },
  shippingAddress: { active: true, visible: true },
  firstName: { active: true, visible: true, required: true },
  lastName: { active: true, visible: true, required: true },
  phone: { active: true, visible: true, required: true },
  address: { active: true, visible: true, required: true },
  address2: { active: true, visible: true },
  province: { active: true, visible: true, required: true },
  city: { active: true, visible: true, required: true },
  postalCode: { active: true, visible: true, required: true },
  email: { active: true, visible: true, required: true },
  orderNote: { active: true, visible: true },
  newsletter: { active: true, visible: true },
  terms: { active: true, visible: true, required: true },
  submitButton: { active: true, visible: true },
  ...overrides,
});

const validFormData: FormData = {
  firstName: "Juan",
  lastName: "Pérez",
  phone: "+51987654321",
  address: "Av. Principal 123",
  address2: "",
  province: "Lima",
  city: "Lima",
  zipCode: "15001",
  email: "juan@example.com",
  orderNote: "",
  shippingMethod: "standard",
  discountCode: "",
  newsletter: false,
  terms: true,
};

describe("validateCodFormData", () => {
  it("should validate a correct form successfully", () => {
    const result = validateCodFormData(validFormData, createBlocks(), baseMessages);
    expect(result.success).toBe(true);
    expect(result.errors).toEqual({});
  });

  it("should flag required fields when empty", () => {
    const data: FormData = {
      ...validFormData,
      firstName: "",
      email: "",
      terms: false,
    };

    const result = validateCodFormData(data, createBlocks(), baseMessages);

    expect(result.success).toBe(false);
    expect(result.errors.firstName).toBe(baseMessages.required);
    expect(result.errors.email).toBe(baseMessages.required);
    expect(result.errors.terms).toBeDefined();
  });

  it("should ignore hidden blocks when validating", () => {
    const blocks = createBlocks({
      phone: { active: true, visible: false, required: true },
    });

    const data: FormData = {
      ...validFormData,
      phone: "",
    };

    const result = validateCodFormData(data, blocks, baseMessages);
    expect(result.success).toBe(true);
    expect(result.errors.phone).toBeUndefined();
  });

  it("should enforce phone pattern", () => {
    const data: FormData = {
      ...validFormData,
      phone: "abc",
    };

    const result = validateCodFormData(data, createBlocks(), baseMessages);
    expect(result.success).toBe(false);
    expect(result.errors.phone).toBe(baseMessages.invalid);
  });
});
