// app/api/workflows/sales-coordinator/route.ts
// Coordinador principal que maneja el flujo completo del Sales Agent

import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { logExecution, createResponse, createErrorResponse } from '@/lib/utils'

// Validación de input
const SalesCoordinatorSchema = z.object({
  text: z.string().min(1, "Text is required"),
  userId: z.string().optional(),
  sessionId: z.string().optional(),
  context: z.object({
    previousMessages: z.array(z.string()).optional(),
    customerData: z.object({
      name: z.string().optional(),
      phone: z.string().optional(),
      email: z.string().optional(),
      address: z.string().optional()
    }).optional()
  }).optional()
})

export async function POST(request: NextRequest) {
  const startTime = Date.now()
  let sessionId: string
  
  try {
    // 1. Validar input
    const rawBody = await request.json()
    const validatedData = SalesCoordinatorSchema.parse(rawBody)
    
    sessionId = validatedData.sessionId || `session_${Date.now()}`
    
    // 2. Log inicio del flujo completo
    await logExecution({
      workflow: 'sales-coordinator',
      status: 'started',
      input: { text: validatedData.text, sessionId }
    })
    
    // 3. PASO 1: Ejecutar Sales Agent
    const salesAgentResponse = await callSalesAgent(validatedData)
    
    // 4. PASO 2: Procesar la respuesta según la intención
    const finalResponse = await processIntent(salesAgentResponse, validatedData)
    
    // 5. Log éxito
    const executionTime = Date.now() - startTime
    await logExecution({
      workflow: 'sales-coordinator',
      status: 'completed',
      output: finalResponse,
      duration: executionTime
    })
    
    return createResponse({
      success: true,
      data: finalResponse,
      executionTime,
      sessionId,
      metadata: {
        workflowName: 'sales-coordinator',
        version: '1.0.0',
        timestamp: new Date().toISOString()
      }
    })
    
  } catch (error: any) {
    const executionTime = Date.now() - startTime
    await logExecution({
      workflow: 'sales-coordinator',
      status: 'failed',
      error: error.message,
      duration: executionTime
    })
    
    return createErrorResponse(error.message || 'Sales coordinator error', 500)
  }
}

// Llamar al Sales Agent
async function callSalesAgent(data: any) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/workflows/sales-agent`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    
    if (!response.ok) {
      throw new Error(`Sales agent error: ${response.status}`)
    }
    
    const result = await response.json()
    return result.data
    
  } catch (error: any) {
    throw new Error(`Failed to call sales agent: ${error.message}`)
  }
}

// Procesar intención y ejecutar acciones correspondientes
async function processIntent(salesResponse: any, originalData: any) {
  const { intent, response } = salesResponse
  
  switch (intent) {
    case 'show_products':
      // El AI Agent respondió "productos" - obtener productos de Shopify
      const productsData = await callShopifyProducts()
      return {
        type: 'products_list',
        message: productsData.whatsappMessage,
        products: productsData.products,
        originalIntent: intent,
        aiResponse: response,
        salesData: salesResponse
      }
    
    case 'create_order':
      // El AI Agent dijo "pedido" - crear orden
      return {
        type: 'order_creation',
        message: "🛒 *Procesando tu pedido...*\n\nNecesito confirmar algunos detalles antes de crear tu orden.",
        nextStep: 'collect_order_details',
        originalIntent: intent,
        aiResponse: response,
        salesData: salesResponse
      }
    
    case 'product_info':
      // Solicitar información específica de producto
      const productId = response.match(/ID:(\d+)/)?.[1]
      if (productId) {
        const productInfo = await callShopifyProductInfo(productId)
        return {
          type: 'product_details',
          message: productInfo.whatsappMessage,
          product: productInfo.product,
          originalIntent: intent,
          aiResponse: response,
          salesData: salesResponse
        }
      }
      break
    
    case 'purchase_intent':
      // Cliente mostró interés en comprar
      return {
        type: 'purchase_intent',
        message: response, // Respuesta del AI (pidiendo datos)
        nextStep: 'collect_customer_data',
        originalIntent: intent,
        aiResponse: response,
        salesData: salesResponse
      }
    
    default:
      // Conversación normal
      return {
        type: 'conversation',
        message: response,
        originalIntent: intent,
        aiResponse: response,
        salesData: salesResponse
      }
  }
  
  // Fallback
  return {
    type: 'conversation',
    message: response,
    originalIntent: intent,
    aiResponse: response,
    salesData: salesResponse
  }
}

// Llamar API de productos Shopify
async function callShopifyProducts(limit: number = 5) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/workflows/shopify/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ limit })
    })
    
    if (!response.ok) {
      throw new Error(`Shopify products error: ${response.status}`)
    }
    
    const result = await response.json()
    return result.data
    
  } catch (error: any) {
    throw new Error(`Failed to fetch products: ${error.message}`)
  }
}

// Llamar API de producto específico
async function callShopifyProductInfo(productId: string) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/workflows/shopify/product/${productId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    
    if (!response.ok) {
      throw new Error(`Product info error: ${response.status}`)
    }
    
    const result = await response.json()
    return result.data
    
  } catch (error: any) {
    // Si no existe el endpoint aún, retornar mensaje por defecto
    return {
      whatsappMessage: `📦 *Información del producto ID: ${productId}*\n\n⚠️ Funcionalidad en desarrollo.\nPor ahora, escribe "productos" para ver nuestro catálogo.\n\n*Verify* - ¡Pronto tendremos más detalles! 😊`,
      product: null
    }
  }
}

// GET endpoint para testing
export async function GET() {
  return createResponse({
    message: "Sales Coordinator API",
    version: "1.0.0",
    description: "Coordinates the complete sales flow: AI Agent → Intent Detection → Shopify Integration",
    workflow: {
      step1: "Sales Agent processes user message",
      step2: "Intent detection determines next action", 
      step3: "Execute corresponding Shopify operation",
      step4: "Return formatted response for WhatsApp"
    },
    intents_handled: [
      "show_products → Fetch and format product list",
      "create_order → Process order creation",
      "product_info → Get specific product details",
      "purchase_intent → Collect customer data",
      "conversation → Normal chat response"
    ]
  })
}