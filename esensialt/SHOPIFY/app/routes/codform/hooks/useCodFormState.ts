import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  BlockColors,
  BlockConfig,
  Blocks,
  ButtonConfig,
  CodFormLoaderData,
  ErrorMessages,
  FormData,
  FormErrors,
  FormStyle,
  Owner,
  Product,
} from "../types/codform.types";
import {
  fetchCodFormByShopId,
  upsertCodForm,
} from "../services/codform.api";
import {
  blockFieldMap,
  validateCodFormData,
} from "../validation/codform.validation";
import clientLogger from "~/utils/logger.client";
import { useWindowSize } from "~/utils/hooks";

export interface UseCodFormStateResult {
  state: {
    isMounted: boolean;
    isDesktop: boolean;
    hasChanges: boolean;
    isSaving: boolean;
    isLoading: boolean;
    propietario: Owner | null;
    savedFormId: string | null;
    saveStatus: {
      type: "success" | "error" | null;
      message: string;
    };
    formErrors: FormErrors;
    formData: FormData;
    formType: string;
    formStyle: FormStyle;
    buttonConfig: ButtonConfig;
    errorMessages: ErrorMessages;
    blocks: Blocks;
    blockOrder: string[];
    blockColors: BlockColors;
    showModal: boolean;
    product: Product;
  };
  actions: {
    setShowModal: (value: boolean) => void;
    setFormType: (value: string) => void;
    handleInputChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
    handleStyleChange: (property: string, value: unknown) => void;
    handleBlockToggle: (blockName: string, property: string) => void;
    handleBlockReorder: (newOrder: string[]) => void;
    handleBlockColorsChange: (colors: BlockColors) => void;
    handleBlockConfigChange: (blockName: string, config: Partial<BlockConfig>) => void;
    handleErrorMessageChange: (type: string, value: string) => void;
    handleButtonConfigChange: (config: ButtonConfig) => void;
    handleSubmit: (event: React.FormEvent) => void;
    handleSave: () => Promise<void>;
    handleDiscard: () => void;
  };
}

const INITIAL_FORM_DATA: FormData = {
  firstName: "",
  lastName: "",
  phone: "",
  address: "",
  address2: "",
  province: "",
  city: "",
  zipCode: "",
  email: "",
  orderNote: "",
  shippingMethod: "standard",
  discountCode: "",
  newsletter: false,
  terms: false,
};

const INITIAL_FORM_STYLE: FormStyle = {
  textColor: "rgba(0,0,0,1)",
  textSize: 14,
  backgroundColor: "rgba(255,255,255,1)",
  borderRadius: 8,
  borderWidth: 2,
  borderColor: "rgba(0,0,0,1)",
  shadow: 4,
  hideCloseButton: false,
  hideFieldLabels: false,
  enableRTL: false,
  enableFullScreen: false,
};

const INITIAL_BUTTON_CONFIG: ButtonConfig = {
  text: "COMPRAR AHORA",
  subtitle: "",
  animation: "Ninguna",
  icon: "Icono de botón",
  position: "Abajo",
  bgColor: "rgb(99, 102, 241)",
  textColor: "rgba(255,255,255,1)",
  textSize: 16,
  borderRadius: 6,
  borderWidth: 0,
  borderColor: "rgba(0,0,0,1)",
  shadow: 4,
  enableMobile: true,
};

const INITIAL_ERROR_MESSAGES: ErrorMessages = {
  required: "Este campo es obligatorio.",
  invalid: "Introduce un valor válido.",
};

const INITIAL_BLOCKS: Blocks = {
  orderSummary: { active: true, visible: true },
  shippingRates: { active: true, visible: true },
  totalSummary: { active: true, visible: true },
  discountCodes: { active: true, visible: true },
  shippingAddress: { active: true, visible: true },
  firstName: { active: true, visible: true },
  lastName: { active: true, visible: true },
  phone: { active: true, visible: true },
  address: { active: true, visible: true },
  address2: { active: true, visible: true },
  province: { active: true, visible: true },
  city: { active: true, visible: true },
  postalCode: { active: true, visible: true },
  email: { active: true, visible: true },
  orderNote: { active: true, visible: true },
  newsletter: { active: true, visible: true },
  terms: { active: true, visible: true },
  submitButton: { active: true, visible: true },
};

const INITIAL_BLOCK_ORDER: string[] = [
  "orderSummary",
  "shippingRates",
  "totalSummary",
  "discountCodes",
  "shippingAddress",
  "firstName",
  "lastName",
  "phone",
  "address",
  "address2",
  "province",
  "city",
  "postalCode",
  "email",
  "orderNote",
  "newsletter",
  "terms",
  "submitButton",
];

const INITIAL_BLOCK_COLORS: BlockColors = {
  textColor: "#1f2937",
  textSize: 14,
  bgColor: "#ffffff",
  borderRadius: 8,
  borderWidth: 2,
  borderColor: "#e5e7eb",
  shadow: 4,
};

const DEFAULT_PRODUCT: Product = {
  name: "Knitted Throw Pillows",
  price: 19.99,
  currency: "S/.",
  image: "🛋️",
};

export function useCodFormState(
  loaderData: CodFormLoaderData
): UseCodFormStateResult {
  const [isMounted, setIsMounted] = useState(false);
  const { isDesktop } = useWindowSize();
  const [hasChanges, setHasChanges] = useState(false);
  const [propietario, setPropietario] = useState<Owner | null>(
    loaderData.owner ?? null
  );
  const [savedFormId, setSavedFormId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });
  
  // Ref para evitar múltiples guardados simultáneos
  const isSavingRef = useRef(false);

  const [formData, setFormData] = useState<FormData>(INITIAL_FORM_DATA);
  const [showModal, setShowModal] = useState(false);
  const [formType, setFormType] = useState("popup");
  const [formStyle, setFormStyle] = useState<FormStyle>(INITIAL_FORM_STYLE);
  const [buttonConfig, setButtonConfig] = useState<ButtonConfig>(
    INITIAL_BUTTON_CONFIG
  );
  const [errorMessages, setErrorMessages] =
    useState<ErrorMessages>(INITIAL_ERROR_MESSAGES);
  const [blocks, setBlocks] = useState<Blocks>(INITIAL_BLOCKS);
  const [blockOrder, setBlockOrder] = useState<string[]>(INITIAL_BLOCK_ORDER);
  const [blockColors, setBlockColors] =
    useState<BlockColors>(INITIAL_BLOCK_COLORS);
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  useEffect(() => {
    if (loaderData.owner) {
      setPropietario(loaderData.owner);
    }
  }, [loaderData.owner]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const loadExistingForm = useCallback(async () => {
    if (!propietario?.shopId) {
      setIsLoading(false);
      return;
    }

    // Si es un shopId de preview local, no intentar cargar desde API
    if (propietario.shopId === "local-preview-shop-id" || propietario.shopId.includes("local-preview")) {
      setIsLoading(false);
      setHasChanges(false);
      return;
    }

    try {
      setIsLoading(true);
      const existingForm = await fetchCodFormByShopId(propietario.shopId);

      if (!existingForm) {
        setSavedFormId(null);
        setIsLoading(false);
        return;
      }

      setSavedFormId(existingForm.id);
      const loadedConfig = existingForm.form_config;
      const modalidad = existingForm.form_type === "popup" ? "popup" : "embedded";

      setFormType(modalidad);
      setFormStyle(loadedConfig.formStyle ?? INITIAL_FORM_STYLE);
      setBlocks(loadedConfig.blocks ?? INITIAL_BLOCKS);
      setBlockOrder(loadedConfig.blockOrder ?? INITIAL_BLOCK_ORDER);
      setBlockColors(loadedConfig.blockColors ?? INITIAL_BLOCK_COLORS);
      setButtonConfig(
        loadedConfig.buttonConfig ??
          (modalidad === "popup" ? INITIAL_BUTTON_CONFIG : INITIAL_BUTTON_CONFIG)
      );
      setErrorMessages(loadedConfig.errorMessages ?? INITIAL_ERROR_MESSAGES);
      setFormErrors({});
      setHasChanges(false);
    } catch (error) {
      clientLogger.warn("[CODFORM] No se pudo cargar formulario existente (modo preview o sin conexión)", {
        error,
        shopId: propietario?.shopId,
      });
      // No mostrar error en modo preview, solo continuar con valores por defecto
      if (!propietario?.shopId?.includes("local-preview")) {
        setSaveStatus({
          type: "error",
          message: "Error al cargar formulario existente",
        });
        setTimeout(() => setSaveStatus({ type: null, message: "" }), 5000);
      }
    } finally {
      setIsLoading(false);
    }
  }, [propietario?.shopId]);

  useEffect(() => {
    loadExistingForm();
  }, [loadExistingForm]);

  const product = useMemo(() => DEFAULT_PRODUCT, []);

  const markAsChanged = useCallback(() => {
    setHasChanges(true);
  }, []);

  const handleInputChange: UseCodFormStateResult["actions"]["handleInputChange"] =
    useCallback((event) => {
      const { name, value, type } = event.target;
      const checked = (event.target as HTMLInputElement).checked;

      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));

      setFormErrors((prev) => {
        if (!prev[name as keyof FormData]) {
          return prev;
        }
        const { [name as keyof FormData]: _removed, ...rest } = prev;
        return rest;
      });

      markAsChanged();
    }, [markAsChanged]);

  const handleStyleChange: UseCodFormStateResult["actions"]["handleStyleChange"] =
    useCallback((property, value) => {
      setFormStyle((prev) => ({
        ...prev,
        [property as keyof FormStyle]: value,
      }));
      markAsChanged();
    }, [markAsChanged]);

  const handleBlockToggle: UseCodFormStateResult["actions"]["handleBlockToggle"] =
    useCallback((blockName, property) => {
      setBlocks((prev) => {
        const blockKey = blockName as keyof Blocks;
        const currentBlock = prev[blockKey];
        const propertyKey = property as keyof BlockConfig;

        const updatedBlock = {
          ...prev,
          [blockKey]: {
            ...currentBlock,
            [propertyKey]: !currentBlock[propertyKey],
          },
        };

        if (propertyKey === "visible" && !updatedBlock[blockKey].visible) {
          const fieldName = blockFieldMap[blockKey];
          if (fieldName) {
            setFormErrors((prevErrors) => {
              if (!(fieldName in prevErrors)) {
                return prevErrors;
              }
              const { [fieldName]: _removed, ...rest } = prevErrors;
              return rest;
            });
          }
        }

        return updatedBlock;
      });
      markAsChanged();
    }, [markAsChanged]);

  const handleBlockReorder: UseCodFormStateResult["actions"]["handleBlockReorder"] =
    useCallback((newOrder) => {
      setBlockOrder(newOrder);
      markAsChanged();
    }, [markAsChanged]);

  const handleBlockColorsChange: UseCodFormStateResult["actions"]["handleBlockColorsChange"] =
    useCallback((colors) => {
      setBlockColors(colors);
      setFormType("embedded");
      markAsChanged();
    }, [markAsChanged]);

  const handleBlockConfigChange: UseCodFormStateResult["actions"]["handleBlockConfigChange"] =
    useCallback((blockName, config) => {
      setBlocks((prev) => ({
        ...prev,
        [blockName]: {
          ...prev[blockName as keyof Blocks],
          ...config,
        },
      }));
      setFormType("embedded");
      markAsChanged();
    }, [markAsChanged]);

  const handleErrorMessageChange: UseCodFormStateResult["actions"]["handleErrorMessageChange"] =
    useCallback((type, value) => {
      setErrorMessages((prev) => ({
        ...prev,
        [type]: value,
      }));
      markAsChanged();
    }, [markAsChanged]);

  const handleButtonConfigChange: UseCodFormStateResult["actions"]["handleButtonConfigChange"] =
    useCallback((config) => {
      setButtonConfig(config);
      markAsChanged();
    }, [markAsChanged]);

  const handleSubmit: UseCodFormStateResult["actions"]["handleSubmit"] = useCallback(
    (event) => {
      event.preventDefault();

      const validation = validateCodFormData(formData, blocks, errorMessages);
      if (!validation.success) {
        setFormErrors(validation.errors);
        setSaveStatus({
          type: "error",
          message: "Hay campos con errores. Revísalos antes de continuar.",
        });
        setTimeout(() => setSaveStatus({ type: null, message: "" }), 5000);
        return;
      }

      setFormErrors({});
      clientLogger.info("[CODFORM] Formulario validado, listo para pago", {
        formData,
      });
      // El pago se procesará a través del componente CulqiCheckout
      // Este handler solo valida el formulario
    },
    [blocks, errorMessages, formData]
  );

  const handleSave = useCallback(async () => {
    // Prevenir múltiples guardados simultáneos
    if (isSavingRef.current || isSaving) {
      clientLogger.warn("[CODFORM] Guardado ya en progreso, ignorando llamada duplicada");
      return;
    }

    if (!propietario?.shopId) {
      setSaveStatus({
        type: "error",
        message: "No se encontró información del propietario",
      });
      return;
    }

    const validation = validateCodFormData(formData, blocks, errorMessages);
    if (!validation.success) {
      setFormErrors(validation.errors);
      setSaveStatus({
        type: "error",
        message: "Hay campos con errores. Revísalos antes de guardar.",
      });
      setTimeout(() => setSaveStatus({ type: null, message: "" }), 5000);
      return;
    }

    setFormErrors({});

    try {
      isSavingRef.current = true;
      setIsSaving(true);
      setSaveStatus({ type: null, message: "" });

      const result = await upsertCodForm({
        shopOwner: propietario,
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

      if (result.success && result.data) {
        setSavedFormId(result.data.id);
        setSaveStatus({
          type: "success",
          message: savedFormId
            ? "✅ Formulario actualizado exitosamente"
            : "✅ Formulario creado exitosamente",
        });
        setHasChanges(false);
        setTimeout(() => setSaveStatus({ type: null, message: "" }), 3000);
      }
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Error al guardar el formulario";
      clientLogger.error("[CODFORM] Error al guardar formulario", {
        error,
        shopId: propietario?.shopId,
      });
      setSaveStatus({
        type: "error",
        message,
      });
      setTimeout(() => setSaveStatus({ type: null, message: "" }), 5000);
    } finally {
      isSavingRef.current = false;
      setIsSaving(false);
    }
  }, [
    propietario,
    product,
    formType,
    formStyle,
    blocks,
    blockOrder,
    blockColors,
    buttonConfig,
    errorMessages,
    savedFormId,
    isSaving,
  ]);

  const handleDiscard = useCallback(() => {
    if (!hasChanges) return;

    const confirmed = window.confirm(
      "¿Estás seguro de que quieres descartar los cambios?"
    );
    if (confirmed) {
      window.location.reload();
    }
  }, [hasChanges]);

  return {
    state: {
      isMounted,
      isDesktop,
      hasChanges,
      isSaving,
      isLoading,
      propietario,
      savedFormId,
      saveStatus,
      formErrors,
      formData,
      formType,
      formStyle,
      buttonConfig,
      errorMessages,
      blocks,
      blockOrder,
      blockColors,
      showModal,
      product,
    },
    actions: {
      setShowModal,
      setFormType,
      handleInputChange,
      handleStyleChange,
      handleBlockToggle,
      handleBlockReorder,
      handleBlockColorsChange,
      handleBlockConfigChange,
      handleErrorMessageChange,
      handleButtonConfigChange,
      handleSubmit,
      handleSave,
      handleDiscard,
    },
  };
}
