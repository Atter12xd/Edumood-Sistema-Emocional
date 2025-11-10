// app/api/workflows/shopify/products/route.ts
// Obtener productos de Shopify DINÁMICAMENTE - VERSIÓN CORREGIDA

import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { logExecution, createResponse, createErrorResponse } from '@/lib/utils'

const ProductsRequestSchema = z.object({
  shopDomain: z.string().min(1, "Shop domain is required"),
  limit: z.number().min(1).max(50).default(5),
  collection: z.string().optional(),
  vendor: z.string().optional(),
  product_type: z.string().optional()
})

// 🔧 FUNCIÓN CORREGIDA PARA OBTENER TOKEN
async function getShopConfig(shopDomain: string) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const apiKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    
    console.log('🔧 Environment check:', {
      hasSupabaseUrl: !!supabaseUrl,
      hasServiceKey: !!apiKey,
      urlPreview: supabaseUrl ? supabaseUrl.substring(0, 30) + '...' : 'undefined'
    })
    
    if (!supabaseUrl || !apiKey) {
      throw new Error(`Missing Supabase configuration. URL: ${!!supabaseUrl}, Key: ${!!apiKey}`)
    }
    
    // 🔧 NORMALIZAR shopDomain - siempre incluir .myshopify.com
    const normalizedShopDomain = shopDomain.includes('.myshopify.com') 
      ? shopDomain 
      : `${shopDomain}.myshopify.com`
    
    console.log(`🔍 Searching for shop: ${normalizedShopDomain}`)
    
    // 🔧 QUERY MÁS COMPLETA PARA DEBUG
    const fullUrl = `${supabaseUrl}/rest/v1/tiendas?dominio_shopify=eq.${normalizedShopDomain}&select=*`
    
    console.log(`🔗 Supabase query: ${fullUrl}`)
    
    const response = await fetch(fullUrl, {
      headers: {
        'apikey': apiKey,
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    })
    
    if (!response.ok) {
      const errorText = await response.text()
      console.error('❌ Supabase response error:', response.status, errorText)
      throw new Error(`Supabase error: ${response.status} - ${errorText}`)
    }
    
    const data = await response.json()
    console.log(`📊 Supabase response:`, {
      found: data.length,
      shops: data.map((shop: any) => ({
        dominio: shop.dominio_shopify,
        hasToken: !!shop.token_shopify,
        tokenPreview: shop.token_shopify ? shop.token_shopify.substring(0, 10) + '...' : 'NO TOKEN',
        activa: shop.activa,
        nombre: shop.nombre
      }))
    })
    
    const shopData = data[0]
    
    if (!shopData) {
      throw new Error(`Shop not found in database: ${normalizedShopDomain}`)
    }
    
    if (!shopData.token_shopify) {
      throw new Error(`No access token found for shop: ${normalizedShopDomain}. Shop exists but token is missing.`)
    }
    
    // 🔧 TEMPORAL: Comentado para debug
    // if (!shopData.activa) {
    //   throw new Error(`Shop is inactive: ${normalizedShopDomain}`)
    // }
    
    // 🔧 CORRECCIÓN CRÍTICA: RETORNAR DOMINIO COMPLETO
    return {
      shop: normalizedShopDomain, // ← USAR DOMINIO COMPLETO, NO SOLO EL NOMBRE
      accessToken: shopData.token_shopify,
      apiVersion: '2023-10',
      shopInfo: {
        nombre: shopData.nombre,
        activa: shopData.activa,
        fecha_instalacion: shopData.fecha_instalacion
      }
    }
    
  } catch (error: any) {
    console.error('❌ Error getting shop config:', error.message)
    throw new Error(`Failed to get shop configuration: ${error.message}`)
  }
}

export async function POST(request: NextRequest) {
  const startTime = Date.now()
  
  try {
    const rawBody = await request.json()
    console.log('🔍 Products API received:', rawBody)
    
    const params = ProductsRequestSchema.parse(rawBody)
    console.log('✅ Validated params:', params)
    
    // 🔧 LOG TEMPORAL SIN USERID
    await logExecution({
      workflow: 'shopify-products',
      status: 'started'
    })
    
    console.log(`🏪 Getting shop config for: ${params.shopDomain}`)
    const shopConfig = await getShopConfig(params.shopDomain)
    console.log(`✅ Shop config obtained:`, {
      shop: shopConfig.shop,
      hasToken: !!shopConfig.accessToken,
      tokenPreview: shopConfig.accessToken.substring(0, 10) + '...'
    })
    
    console.log(`📦 Fetching products...`)
    const products = await fetchShopifyProducts(params, shopConfig)
    console.log(`✅ Found ${products.length} products`)
    
    const formattedResponse = formatProductsForWhatsApp(products, shopConfig.shop)
    
    const executionTime = Date.now() - startTime
    await logExecution({
      workflow: 'shopify-products',
      status: 'completed'
    })
    
    return createResponse({
      success: true,
      data: formattedResponse,
      executionTime,
      metadata: {
        workflowName: 'shopify-products',
        version: '2.1.0',
        shopDomain: params.shopDomain,
        actualShop: shopConfig.shop,
        productsCount: products.length,
        timestamp: new Date().toISOString()
      }
    })
    
  } catch (error: any) {
    const executionTime = Date.now() - startTime
    console.error('❌ Products API error:', error.message)
    console.error('❌ Full error stack:', error.stack)
    
    await logExecution({
      workflow: 'shopify-products',
      status: 'failed'
    })
    
    if (error instanceof z.ZodError) {
      return createErrorResponse(`Validation error: ${error.errors.map(e => e.message).join(', ')}`, 400)
    }
    
    return createErrorResponse(error.message || 'Failed to fetch products', 500)
  }
}

// 🔧 FUNCIÓN CORREGIDA PARA FETCH SHOPIFY
async function fetchShopifyProducts(
  params: z.infer<typeof ProductsRequestSchema>, 
  shopConfig: { shop: string; accessToken: string; apiVersion: string }
) {
  const { limit, collection, vendor, product_type } = params
  
  // 🔧 CORRECCIÓN CRÍTICA: NO AGREGAR .myshopify.com porque ya está incluido
  let url = `https://${shopConfig.shop}/admin/api/${shopConfig.apiVersion}/products.json?limit=${limit}`
  
  if (collection) url += `&collection=${encodeURIComponent(collection)}`
  if (vendor) url += `&vendor=${encodeURIComponent(vendor)}`
  if (product_type) url += `&product_type=${encodeURIComponent(product_type)}`
  
  console.log(`🔗 Fetching from: ${url}`)
  console.log(`🔑 Using token: ${shopConfig.accessToken.substring(0, 15)}...`)
  
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'X-Shopify-Access-Token': shopConfig.accessToken,
        'Content-Type': 'application/json',
        'User-Agent': 'Dynamic-Shopify-App/1.0'
      }
    })
    
    console.log(`📡 Shopify response status: ${response.status}`)
    
    if (!response.ok) {
      const errorText = await response.text()
      console.error('❌ Shopify API error details:', {
        status: response.status,
        statusText: response.statusText,
        url: url,
        tokenPreview: shopConfig.accessToken.substring(0, 10) + '...',
        responseBody: errorText
      })
      throw new Error(`Shopify API error: ${response.status} ${errorText}`)
    }
    
    const data = await response.json()
    console.log(`✅ Shopify API success: ${data.products?.length || 0} products found`)
    
    return data.products || []
    
  } catch (error: any) {
    console.error('❌ Fetch error:', error.message)
    throw new Error(`Failed to fetch Shopify products: ${error.message}`)
  }
}

// 🔧 FUNCIÓN DE FORMATO SIN CAMBIOS MAYORES
function formatProductsForWhatsApp(products: any[], shopName: string) {
  // Extraer nombre limpio de la tienda
  const cleanShopName = shopName.replace('.myshopify.com', '')
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
  
  if (!products || products.length === 0) {
    return {
      whatsappMessage: `❌ *Lo siento, no hay productos disponibles en este momento.*\n\n*${cleanShopName}* - ¡Pronto tendremos más productos para ti! 😊`,
      products: []
    }
  }
  
  let mensaje = `🛍️ *Productos disponibles en ${cleanShopName}:*\n\n`
  
  products.forEach((producto, index) => {
    const descripcion = producto.body_html ? 
      producto.body_html.replace(/<[^>]*>/g, '').substring(0, 100) : 
      'Sin descripción disponible'
    
    const precio = producto.variants && producto.variants[0] ? 
      producto.variants[0].price : 
      'Precio no disponible'
    
    mensaje += `**${index + 1}. ${producto.title}**\n`
    mensaje += `💰 Precio: $${precio}\n`
    mensaje += `📝 ${descripcion}...\n\n`
  })
  
  mensaje += `¿Te interesa algún producto de *${cleanShopName}*? ¡Dime cuál y te ayudo con tu pedido! 😊`
  
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

// 🔧 GET ENDPOINT PARA TESTING
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const shopDomain = searchParams.get('shop') || 'atter-prueba.myshopify.com'
  const limit = parseInt(searchParams.get('limit') || '5')
  
  console.log(`🧪 Testing GET endpoint with: ${shopDomain}`)
  
  try {
    const shopConfig = await getShopConfig(shopDomain)
    const products = await fetchShopifyProducts({ shopDomain, limit }, shopConfig)
    const formatted = formatProductsForWhatsApp(products, shopConfig.shop)
    
    return createResponse({
      success: true,
      message: `Shopify Products API Test - ${shopDomain}`,
      data: formatted,
      debug: {
        inputShopDomain: shopDomain,
        resolvedShop: shopConfig.shop,
        hasToken: !!shopConfig.accessToken,
        tokenLength: shopConfig.accessToken.length,
        apiVersion: shopConfig.apiVersion,
        productsFound: products.length
      }
    })
    
  } catch (error: any) {
    console.error('🧪 Test endpoint error:', error)
    return createErrorResponse(`Test failed: ${error.message}`, 500)
  }
}