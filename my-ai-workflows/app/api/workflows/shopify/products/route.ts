// app/api/workflows/shopify/products/route.ts
// Obtener productos de Shopify (replica del HTTP Request de n8n)

import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { logExecution, createResponse, createErrorResponse } from '@/lib/utils'

// Validación de input
const ProductsRequestSchema = z.object({
  limit: z.number().min(1).max(50).default(5),
  collection: z.string().optional(),
  vendor: z.string().optional(),
  product_type: z.string().optional()
})

// Configuración Shopify
const SHOPIFY_CONFIG = {
  shop: 'verify-test-111',
  accessToken: process.env.SHOPIFY_ACCESS_TOKEN || '',
  apiVersion: '2023-10'
};

export async function POST(request: NextRequest) {
  const startTime = Date.now()
  
  try {
    // 1. Validar input
    const rawBody = await request.json()
    const params = ProductsRequestSchema.parse(rawBody)
    
    // 2. Log inicio
    await logExecution({
      workflow: 'shopify-products',
      status: 'started',
      input: params
    })
    
    // 3. Fetch productos de Shopify
    const products = await fetchShopifyProducts(params)
    
    // 4. Formatear respuesta para WhatsApp (igual que tu Code1 de n8n)
    const formattedResponse = formatProductsForWhatsApp(products)
    
    // 5. Log éxito
    const executionTime = Date.now() - startTime
    await logExecution({
      workflow: 'shopify-products',
      status: 'completed',
      output: formattedResponse,
      duration: executionTime
    })
    
    return createResponse({
      success: true,
      data: formattedResponse,
      executionTime,
      metadata: {
        workflowName: 'shopify-products',
        version: '1.0.0',
        timestamp: new Date().toISOString()
      }
    })
    
  } catch (error: any) {
    const executionTime = Date.now() - startTime
    await logExecution({
      workflow: 'shopify-products',
      status: 'failed',
      error: error.message,
      duration: executionTime
    })
    
    if (error instanceof z.ZodError) {
      return createErrorResponse(`Validation error: ${error.errors.map(e => e.message).join(', ')}`, 400)
    }
    
    return createErrorResponse(error.message || 'Failed to fetch products', 500)
  }
}

async function fetchShopifyProducts(params: z.infer<typeof ProductsRequestSchema>) {
  const { limit, collection, vendor, product_type } = params
  
  // Construir URL con parámetros (igual que tu n8n)
  let url = `https://${SHOPIFY_CONFIG.shop}.myshopify.com/admin/api/${SHOPIFY_CONFIG.apiVersion}/products.json?limit=${limit}`
  
  if (collection) url += `&collection=${collection}`
  if (vendor) url += `&vendor=${vendor}`
  if (product_type) url += `&product_type=${product_type}`
  
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'X-Shopify-Access-Token': SHOPIFY_CONFIG.accessToken,
        'Content-Type': 'application/json'
      }
    })
    
    if (!response.ok) {
      throw new Error(`Shopify API error: ${response.status} ${response.statusText}`)
    }
    
    const data = await response.json()
    return data.products || []
    
  } catch (error: any) {
    throw new Error(`Failed to fetch Shopify products: ${error.message}`)
  }
}

// Formatear productos para WhatsApp (EXACTO como tu Code1 de n8n)
function formatProductsForWhatsApp(products: any[]) {
  if (!products || products.length === 0) {
    return {
      whatsappMessage: "❌ *Lo siento, no hay productos disponibles en este momento.*\n\n*Verify* - ¡Pronto tendremos más productos para ti! 😊",
      products: []
    }
  }
  
  // Crear mensaje formateado para WhatsApp (igual que tu n8n)
  let mensaje = "🛍️ *Productos disponibles en Verify:*\n\n"
  
  products.forEach((producto, index) => {
    // Limpiar HTML de la descripción (igual que tu Code1)
    const descripcion = producto.body_html ? 
      producto.body_html.replace(/<[^>]*>/g, '').substring(0, 100) : 
      'Sin descripción disponible'
    
    // Obtener precio del primer variant (igual que tu Code1)
    const precio = producto.variants && producto.variants[0] ? 
      producto.variants[0].price : 
      'Precio no disponible'
    
    mensaje += `${index + 1}. *${producto.title}*\n`
    mensaje += `💰 Precio: $${precio}\n`
    mensaje += `📝 ${descripcion}...\n`
    mensaje += `🔗 ID: ${producto.id}\n\n`
  })
  
  mensaje += `Ver más productos: https://${SHOPIFY_CONFIG.shop}.myshopify.com/collections/all\n\n`
  mensaje += "¿Te interesa algún producto? ¡Dime cuál y te ayudo con tu pedido! 😊"
  
  return {
    whatsappMessage: mensaje,
    products: products.map(product => ({
      id: product.id,
      title: product.title,
      price: product.variants?.[0]?.price || 'N/A',
      description: product.body_html?.replace(/<[^>]*>/g, '').substring(0, 100) || 'Sin descripción',
      vendor: product.vendor,
      product_type: product.product_type,
      variants: product.variants?.map((variant: any) => ({
        id: variant.id,
        title: variant.title,
        price: variant.price,
        inventory_quantity: variant.inventory_quantity
      })) || []
    })),
    total_products: products.length
  }
}

// GET endpoint para testing
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const limit = parseInt(searchParams.get('limit') || '5')
  
  try {
    // Fetch directo para testing
    const products = await fetchShopifyProducts({ limit })
    const formatted = formatProductsForWhatsApp(products)
    
    return createResponse({
      message: "Shopify Products API",
      data: formatted,
      total: products.length
    })
    
  } catch (error: any) {
    return createErrorResponse(`Failed to fetch products: ${error.message}`, 500)
  }
}