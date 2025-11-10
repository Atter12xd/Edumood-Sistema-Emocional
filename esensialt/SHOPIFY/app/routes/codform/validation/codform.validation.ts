import { z } from "zod";
import type {
  Blocks,
  ErrorMessages,
  FormData,
  FormErrors,
} from "../types/codform.types";

const PHONE_REGEX = /^[+\d][\d\s().-]{5,20}$/;

const createBaseSchema = (messages: ErrorMessages) =>
  z
    .object({
      firstName: z
        .string()
        .trim()
        .min(1, { message: messages.required }),
      lastName: z
        .string()
        .trim()
        .min(1, { message: messages.required }),
      phone: z
        .string()
        .trim()
        .min(6, { message: messages.required })
        .regex(PHONE_REGEX, { message: messages.invalid }),
      address: z
        .string()
        .trim()
        .min(1, { message: messages.required }),
      address2: z.string().optional(),
      province: z
        .string()
        .trim()
        .min(1, { message: messages.required }),
      city: z
        .string()
        .trim()
        .min(1, { message: messages.required }),
      zipCode: z
        .string()
        .trim()
        .min(2, { message: messages.required }),
      email: z
        .string()
        .trim()
        .min(1, { message: messages.required })
        .email({ message: messages.invalid }),
      orderNote: z.string().optional(),
      shippingMethod: z.string().optional(),
      discountCode: z.string().optional(),
      newsletter: z.boolean(),
      terms: z
        .boolean()
        .refine((value) => value, {
          message: "Debes aceptar los términos y condiciones",
        }),
    })
    .strict();

export const blockFieldMap: Partial<Record<keyof Blocks, keyof FormData>> = {
  discountCodes: "discountCode",
  shippingRates: "shippingMethod",
  firstName: "firstName",
  lastName: "lastName",
  phone: "phone",
  address: "address",
  address2: "address2",
  province: "province",
  city: "city",
  postalCode: "zipCode",
  email: "email",
  orderNote: "orderNote",
  newsletter: "newsletter",
  terms: "terms",
};

function applyBlockRules(
  data: FormData,
  blocks: Blocks,
  messages: ErrorMessages,
  errors: FormErrors
) {
  (Object.keys(blocks) as Array<keyof Blocks>).forEach((blockKey) => {
    const blockConfig = blocks[blockKey];
    if (!blockConfig?.visible) {
      return;
    }

    const fieldName = blockFieldMap[blockKey];
    if (!fieldName) {
      return;
    }

    const value = data[fieldName];
    const isEmpty =
      typeof value === "string"
        ? value.trim().length === 0
        : value === false || value === undefined || value === null;

    if (blockConfig.required && isEmpty) {
      errors[fieldName] = messages.required;
    }
  });
}

export function validateCodFormData(
  data: FormData,
  blocks: Blocks,
  messages: ErrorMessages
): { success: boolean; errors: FormErrors } {
  const schema = createBaseSchema(messages);
  const result = schema.safeParse(data);

  const errors: FormErrors = {};

  if (!result.success) {
    for (const issue of result.error.issues) {
      const fieldPath = issue.path[0] as keyof FormData | undefined;
      if (fieldPath) {
        errors[fieldPath] = issue.message;
      }
    }
  }

  applyBlockRules(data, blocks, messages, errors);

  (Object.keys(blocks) as Array<keyof Blocks>).forEach((blockKey) => {
    const blockConfig = blocks[blockKey];
    if (blockConfig?.visible) {
      return;
    }

    const fieldName = blockFieldMap[blockKey];
    if (fieldName && fieldName in errors) {
      delete errors[fieldName];
    }
  });

  const success = Object.keys(errors).length === 0;
  return { success, errors };
}
