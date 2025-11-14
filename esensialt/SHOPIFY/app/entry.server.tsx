import type { AppLoadContext, EntryContext } from "@remix-run/node";
import { RemixServer } from "@remix-run/react";
import { renderToString } from "react-dom/server";
import shopify from "./shopify.server";

export default function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext,
  loadContext: AppLoadContext,
) {
  // Ignorar requests de Chrome DevTools que causan 404 (no son errores reales)
  if (request.url.includes('.well-known/appspecific')) {
    return new Response('', { status: 404 });
  }

  // 🚨 DEBUG: Verificar si entry.server.tsx se está ejecutando (solo en desarrollo)
  if (process.env.NODE_ENV === 'development' && !request.url.includes('.well-known')) {
    console.log("🔥 entry.server.tsx EJECUTÁNDOSE:", {
      url: request.url,
      method: request.method,
      status: responseStatusCode
    });
  }

  // 🛡️ SOLUCIÓN OFICIAL DE SHOPIFY - Security Headers automáticos
  // Esto agrega automáticamente los headers Content-Security-Policy requeridos
  // para frame-ancestors según la documentación oficial
  try {
    shopify.addDocumentResponseHeaders(request, responseHeaders);
  } catch (error) {
    // Si falla (por ejemplo en rutas locales), continuar sin los headers de Shopify
    if (process.env.NODE_ENV === 'development') {
      console.warn("⚠️ No se pudieron agregar headers de Shopify (puede ser ruta local):", error);
    }
  }

  // Renderizar la aplicación React a string
  const markup = renderToString(
    <RemixServer context={remixContext} url={request.url} />
  );

  // Configurar el Content-Type
  responseHeaders.set("Content-Type", "text/html");

  // Retornar la respuesta HTML completa
  return new Response("<!DOCTYPE html>" + markup, {
    headers: responseHeaders,
    status: responseStatusCode,
  });
}