// components/PreviewPanel.tsx
import React, { useEffect, useMemo, useState } from "react";
import FormContent from "./FormContent";
import type {
  FormData,
  FormStyle,
  Blocks,
  Product,
  BlockColors,
  FormErrors,
} from "../types/codform.types";
import { codFormStyles } from "../styles/codform.styles";
import {
  injectAnimationStyles,
  getAnimationStyle,
} from "../styles/codform.animations";
import { getButtonIcon } from "../styles/codform.icons";
import { useIsMobile } from "~/utils/hooks";

interface ButtonConfig {
  text: string;
  subtitle: string;
  animation: string;
  icon: string;
  bgColor: string;
  textColor: string;
  textSize: number;
  borderRadius: number;
  borderWidth: number;
  borderColor: string;
  shadow: number;
}

interface PreviewPanelProps {
  formType: string;
  formData: FormData;
  formStyle: FormStyle;
  blocks: Blocks;
  product: Product;
  blockOrder: string[];
  blockColors: BlockColors;
  buttonConfig: ButtonConfig;
  onInputChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void;
  onSubmit: (e: React.FormEvent) => void;
  onShowModal: () => void;
  formErrors: FormErrors;
}

const PreviewPanel: React.FC<PreviewPanelProps> = ({
  formType,
  formData,
  formStyle,
  blocks,
  product,
  blockOrder,
  blockColors,
  buttonConfig,
  onInputChange,
  onSubmit,
  onShowModal,
  formErrors,
}) => {
  const isViewportCompact = useIsMobile();
  const [previewDevice, setPreviewDevice] = useState<"desktop" | "mobile">(
    "desktop"
  );

  useEffect(() => {
    injectAnimationStyles();
  }, []);

  const animationStyle = getAnimationStyle(buttonConfig.animation);
  const buttonIcon = getButtonIcon(buttonConfig.icon);
  const priceValue =
    typeof product?.price === "number" ? product.price.toFixed(2) : "0.00";
  const productPriceLabel = `${product?.currency || "S/."} ${priceValue}`;
  const productEmoji = product?.image || "🛒";
  const buttonPadding =
    buttonConfig.subtitle && buttonConfig.subtitle.trim() !== ""
      ? isViewportCompact
        ? "12px 24px"
        : "14px 36px"
      : isViewportCompact
      ? "14px 28px"
      : "16px 40px";

  const formPreviewContainerStyle = useMemo(() => {
    const maxWidth = formStyle.enableFullScreen
      ? "100%"
      : previewDevice === "mobile"
      ? "420px"
      : "560px";

    return {
      background: "transparent",
      borderRadius: formStyle.enableFullScreen
        ? "0px"
        : `${Math.max(0, formStyle.borderRadius)}px`,
      padding: 0,
      boxShadow: "none",
      width: "100%",
      maxWidth,
      margin: "0 auto",
      transition: "all 0.3s ease",
      display: "flex",
      justifyContent: "center",
    } as React.CSSProperties;
  }, [
    formStyle.borderRadius,
    formStyle.enableFullScreen,
    previewDevice,
  ]);

  return (
    <div
      style={{
        ...codFormStyles.previewPanel,
        padding: isViewportCompact ? "16px" : "28px",
      }}
    >
      <div style={codFormStyles.previewTopBar}>
        <div style={codFormStyles.previewTitleGroup}>
          <span style={codFormStyles.previewTitle}>Vista previa en vivo</span>
          <span style={codFormStyles.previewSubtitle}>
            Así se ve tu formulario COD {" "}
            {formType === "popup"
              ? "apareciendo como popup interactivo."
              : "embebido dentro de la página."}
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <span style={codFormStyles.previewBadge}>
            {formType === "popup" ? "Popup" : "Embebido"}
          </span>
          <div style={codFormStyles.previewDeviceSwitch}>
            <button
              type="button"
              onClick={() => setPreviewDevice("desktop")}
              style={{
                ...codFormStyles.previewDeviceButton,
                ...(previewDevice === "desktop"
                  ? codFormStyles.previewDeviceButtonActive
                  : {}),
              }}
            >
              🖥️ Desktop
            </button>
            <button
              type="button"
              onClick={() => setPreviewDevice("mobile")}
              style={{
                ...codFormStyles.previewDeviceButton,
                ...(previewDevice === "mobile"
                  ? codFormStyles.previewDeviceButtonActive
                  : {}),
              }}
            >
              📱 Mobile
            </button>
          </div>
        </div>
      </div>

      <div
        style={{
          ...codFormStyles.previewContainer,
          padding: isViewportCompact ? "20px" : "32px",
          alignItems: "flex-start",
          justifyContent: "center",
        }}
      >
        {formType === "embedded" ? (
          <div
            style={{
              ...codFormStyles.previewFrame,
              maxWidth: previewDevice === "mobile" ? "460px" : "100%",
            }}
          >
            <div style={codFormStyles.previewFrameHeader}>
              <span style={{ fontSize: "16px", fontWeight: 600, color: "#111827" }}>
                Essential COD · Tienda Shopify
              </span>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  fontSize: "12px",
                  color: "#9ca3af",
                }}
              >
                <span>🟢 Live</span>
                <span>·</span>
                <span>{new Date().toLocaleDateString()}</span>
              </div>
            </div>
            <div style={codFormStyles.previewFrameBody}>
              <div style={codFormStyles.previewProductSummary}>
                <div style={codFormStyles.previewProductImage}>{productEmoji}</div>
                <div style={codFormStyles.previewProductMeta}>
                  <span style={codFormStyles.previewProductName}>
                    {product?.name || "Producto sin título"}
                  </span>
                  <span style={codFormStyles.previewProductPrice}>
                    {productPriceLabel}
                  </span>
                  <span style={{ fontSize: "12px", color: "#6d7175" }}>
                    Checkout COD configurado
                  </span>
                </div>
              </div>
              <div style={formPreviewContainerStyle}>
                <FormContent
                  formData={formData}
                  formStyle={formStyle}
                  blocks={blocks}
                  product={product}
                  blockOrder={blockOrder}
                  blockColors={blockColors}
                  formErrors={formErrors}
                  onInputChange={onInputChange}
                  onSubmit={onSubmit}
                />
              </div>
            </div>
          </div>
        ) : (
          <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
            <div style={codFormStyles.previewPhoneFrame}>
              <div style={codFormStyles.previewPhoneScreen}>
                <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                  <div style={codFormStyles.previewProductImage}>{productEmoji}</div>
                  <div style={codFormStyles.previewProductMeta}>
                    <span style={codFormStyles.previewProductName}>
                      {product?.name || "Producto destacado"}
                    </span>
                    <span style={codFormStyles.previewProductPrice}>
                      {productPriceLabel}
                    </span>
                    <span style={{ fontSize: "12px", color: "#6d7175" }}>
                      Pago contra entrega disponible
                    </span>
                  </div>
                </div>

                <p style={{ fontSize: "13px", color: "#6d7175", lineHeight: 1.5 }}>
                  El popup aparecerá encima de tu sitio cuando el cliente interactúe con
                  el botón. Presiona el botón para simular la experiencia completa.
                </p>

                <button
                  style={{
                    background: buttonConfig.bgColor,
                    color: buttonConfig.textColor,
                    borderRadius: `${buttonConfig.borderRadius}px`,
                    border: `${buttonConfig.borderWidth}px solid ${buttonConfig.borderColor}`,
                    boxShadow: `0 ${buttonConfig.shadow}px ${buttonConfig.shadow * 2}px rgba(0, 0, 0, 0.15)`,
                    padding: buttonPadding,
                    cursor: "pointer",
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "6px",
                    minWidth: "220px",
                    width: "100%",
                    position: "relative",
                    overflow: "hidden",
                    ...animationStyle,
                  }}
                  onClick={onShowModal}
                  onMouseEnter={(e) => {
                    if (!isViewportCompact) {
                      e.currentTarget.style.transform = "translateY(-3px) scale(1.02)";
                      e.currentTarget.style.boxShadow = `0 ${buttonConfig.shadow + 6}px ${(buttonConfig.shadow + 6) * 2}px rgba(0, 0, 0, 0.25)`;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isViewportCompact) {
                      e.currentTarget.style.transform = "translateY(0) scale(1)";
                      e.currentTarget.style.boxShadow = `0 ${buttonConfig.shadow}px ${buttonConfig.shadow * 2}px rgba(0, 0, 0, 0.15)`;
                    }
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      fontSize: `${Math.max(14, buttonConfig.textSize - 1)}px`,
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                      textAlign: "center",
                    }}
                  >
                    {buttonIcon && <span style={{ fontSize: "18px" }}>{buttonIcon}</span>}
                    {buttonConfig.text}
                  </div>

                  {buttonConfig.subtitle && buttonConfig.subtitle.trim() !== "" && (
                    <span
                      style={{
                        fontSize: `${Math.max(11, buttonConfig.textSize - 5)}px`,
                        fontWeight: 500,
                        opacity: 0.85,
                        textTransform: "none",
                        textAlign: "center",
                      }}
                    >
                      {buttonConfig.subtitle}
                    </span>
                  )}
                </button>

                <span
                  style={{
                    fontSize: "12px",
                    color: "#64748b",
                    textAlign: "center",
                    lineHeight: 1.5,
                  }}
                >
                  Haz clic en “Abrir popup completo” para validar la estructura y los
                  mensajes finales.
                </span>

                <button
                  type="button"
                  onClick={onShowModal}
                  style={{
                    ...codFormStyles.previewFloatingButton,
                    marginTop: "4px",
                  }}
                >
                  Abrir popup completo
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PreviewPanel;