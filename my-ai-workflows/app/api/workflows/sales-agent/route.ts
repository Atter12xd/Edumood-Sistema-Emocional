// app/api/workflows/sales-agent/route.ts
// Replica del AI Agent de n8n para ventas de Verify

import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import { z } from 'zod'
import { logExecution, checkRateLimit, createResponse, createErrorResponse } from '@/lib/utils'

// Validación de input
const SalesAgentSchema = z.object({
  text: z.string().min(1, "Text is required"),
  userId: z.string().optional(),
  sessionId: z.string().optional(), // Para memory/contexto
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

// Configuración OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

// PROMPT EXACTO de tu n8n (adaptado)
const SALES_PROMPT = `
Prompt para Asistente de Ventas de Verify
Eres un asistente de ventas profesional y amable que trabaja exclusivamente para Verify, una tienda de productos en Shopify. Tu misión principal es ayudar a los clientes a cerrar ventas y brindar información sobre los productos de la tienda.

IDENTIDAD Y CONTEXTO

Nombre: Asistente de Verify
Empresa: Verify (tienda Shopify)
Fecha actual: ${new Date().toLocaleDateString('es-ES')}
Idioma de atención: Español únicamente
Objetivo principal: Cerrar ventas y ayudar con pedidos

COMPORTAMIENTO OBLIGATORIO
SIEMPRE HACER:

Saludar mencionando que eres de Verify
Ejemplo: "¡Hola! Soy el asistente de Verify. ¿En qué puedo ayudarte hoy?"

Despedirse identificándote como de Verify
Ejemplo: "¡Gracias por contactar a Verify! Espero haberte ayudado."

Ser amable y profesional en todo momento
Enfocar todas las respuestas hacia la venta

Hacer preguntas para entender las necesidades del cliente
Sugerir productos relevantes
Guiar hacia la compra

Responder solo temas relacionados con:
Productos de la tienda
Proceso de pedidos
Información de la empresa Verify
Consultas sobre compras
Dudas sobre Shopify relacionadas con la tienda

RESTRICCIONES IMPORTANTES:
Si hablan en otro idioma:
"Disculpa, pero Verify atiende únicamente en español por ahora. ¿Podrías escribirme en español para ayudarte mejor?"

Si preguntan temas fuera de contexto:
"Disculpa, pero ese es un tema irrelevante para Shopify o Verify. Solo respondo preguntas y ayudo a cerrar ventas de nuestra empresa. ¿Te interesa conocer algún producto en particular?"

ESTRATEGIA DE VENTAS
Técnicas a usar:

Preguntas calificadoras:
"¿Qué tipo de producto estás buscando?"
"¿Es para uso personal o como regalo?"
"¿Tienes algún presupuesto en mente?"

Crear urgencia:
Mencionar ofertas limitadas
Disponibilidad de stock
Promociones especiales

Manejo de objeciones:
Escuchar la preocupación
Ofrecer soluciones
Redirigir hacia los beneficios

Cierre de venta:
Guiar paso a paso el proceso de pedido
Ofrecer múltiples opciones de pago
Confirmar detalles de envío

PROCESO DE PEDIDO - RECOLECCIÓN DE DATOS:

Cuando un cliente muestre interés en comprar un producto (diga cosas como "me interesa", "quiero", "me gusta"), ANTES de activar la palabra clave "pedido", debes:

1. CONFIRMAR EL PRODUCTO:
   "¡Excelente elección! La [nombre del producto] por $[precio] es una gran opción."

2. SOLICITAR DATOS OBLIGATORIOS:
   "Para procesar tu pedido necesito algunos datos:
   
   📝 Nombre completo:
   📧 Email:
   📱 Teléfono:
   📍 Dirección de entrega:
   
   ¿Podrías proporcionarme esta información?"

3. SOLO DESPUÉS de que el cliente proporcione TODOS los datos, responde con:
   "pedido"

FUNCIONALIDADES SHOPIFY - CRÍTICO:

SI el usuario dice EXACTAMENTE estas palabras, responde SOLO con la palabra clave:

1. Si dicen: "productos" o "que productos tienes" o "dame los productos"
   RESPONDE SOLO: "productos"

2. Si dicen: "catálogo" o "ver catálogo"
   RESPONDE SOLO: "catálogo"

3. Si dicen algo como: "información ID:12345" o "detalles ID:12345"
   RESPONDE SOLO: "información producto ID:12345"

4. Si dicen: "comprar" o "hacer pedido" o "quiero comprar" Y ya tienes todos los datos del cliente
   RESPONDE SOLO: "pedido"

PARA CUALQUIER OTRA CONVERSACIÓN NORMAL (saludos, preguntas generales), responde normalmente SIN usar estas palabras clave.

Pregunta del usuario:
`

export async function POST(request: NextRequest) {
  const startTime = Date.now()
  let userId: string | undefined
  let sessionId: string | undefined
  
  try {
    // 1. Rate limiting
    const clientIP = request.headers.get('x-forwarded-for') || 'unknown'
    const rateLimit = checkRateLimit(clientIP, 200, 60000) // 200 req/min para ventas
    
    if (!rateLimit.allowed) {
      return createErrorResponse('Rate limit exceeded', 429)
    }
    
    // 2. Validar input
    const rawBody = await request.json()
    const validatedData = SalesAgentSchema.parse(rawBody)
    
    userId = validatedData.userId
    sessionId = validatedData.sessionId || `session_${Date.now()}`
    
    // 3. Log inicio
    await logExecution({
      workflow: 'sales-agent',
      userId,
      status: 'started',
      input: { text: validatedData.text, sessionId }
    })
    
    // 4. Ejecutar AI Sales Agent
    const result = await executeSalesAgent(validatedData)
    
    // 5. Log éxito
    const executionTime = Date.now() - startTime
    await logExecution({
      workflow: 'sales-agent',
      userId,
      status: 'completed',
      output: result,
      duration: executionTime
    })
    
    // 6. Respuesta
    return createResponse({
      success: true,
      data: result,
      executionTime,
      sessionId,
      metadata: {
        workflowName: 'sales-agent',
        version: '1.0.0',
        timestamp: new Date().toISOString()
      }
    })
    
  } catch (error: any) {
    const executionTime = Date.now() - startTime
    await logExecution({
      workflow: 'sales-agent',
      userId,
      status: 'failed',
      error: error.message,
      duration: executionTime
    })
    
    if (error instanceof z.ZodError) {
      return createErrorResponse(`Validation error: ${error.errors.map(e => e.message).join(', ')}`, 400)
    }
    
    return createErrorResponse(error.message || 'Internal server error', 500)
  }
}

async function executeSalesAgent(params: z.infer<typeof SalesAgentSchema>) {
  const { text, context } = params
  
  // Construir contexto de conversación
  let conversationContext = ""
  if (context?.previousMessages && context.previousMessages.length > 0) {
    conversationContext = `\n\nCONTEXTO DE CONVERSACIÓN PREVIA:\n${context.previousMessages.join('\n')}\n`
  }
  
  // Datos del cliente si están disponibles
  let customerInfo = ""
  if (context?.customerData) {
    const data = context.customerData
    customerInfo = `\n\nDATOS DEL CLIENTE:\n`
    if (data.name) customerInfo += `Nombre: ${data.name}\n`
    if (data.phone) customerInfo += `Teléfono: ${data.phone}\n`
    if (data.email) customerInfo += `Email: ${data.email}\n`
    if (data.address) customerInfo += `Dirección: ${data.address}\n`
  }
  
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { 
          role: "system", 
          content: SALES_PROMPT + conversationContext + customerInfo
        },
        { 
          role: "user", 
          content: text 
        }
      ],
      temperature: 0.7, // Un poco de creatividad para ventas
      max_tokens: 500
    })
    
    const response = completion.choices[0].message.content?.trim() || ""
    
    // Detectar intenciones especiales (como en tu Switch de n8n)
    const intent = detectIntent(response)
    
    return {
      response,
      intent,
      conversationFlow: determineNextStep(intent, response),
      model: completion.model,
      usage: {
        promptTokens: completion.usage?.prompt_tokens || 0,
        completionTokens: completion.usage?.completion_tokens || 0,
        totalTokens: completion.usage?.total_tokens || 0
      },
      estimatedCost: calculateCost(completion.usage?.total_tokens || 0, 'gpt-4'),
      sessionId: params.sessionId,
      timestamp: new Date().toISOString()
    }
    
  } catch (error: any) {
    throw new Error(`OpenAI API error: ${error.message}`)
  }
}

// Detectar intenciones (replica de tu Switch en n8n)
function detectIntent(response: string): string {
  const lowerResponse = response.toLowerCase().trim()
  
  // Palabras clave exactas de tu n8n
  if (lowerResponse === 'productos' || lowerResponse === 'catálogo') {
    return 'show_products'
  }
  
  if (lowerResponse === 'pedido' || lowerResponse.includes('pedido')) {
    return 'create_order'
  }
  
  if (lowerResponse.startsWith('información producto id:')) {
    return 'product_info'
  }
  
  if (lowerResponse.includes('comprar') || lowerResponse.includes('quiero')) {
    return 'purchase_intent'
  }
  
  return 'conversation'
}

// Determinar próximo paso en el flujo
function determineNextStep(intent: string, response: string): object {
  switch (intent) {
    case 'show_products':
      return {
        nextAction: 'fetch_shopify_products',
        endpoint: '/api/workflows/shopify/products'
      }
    
    case 'create_order':
      return {
        nextAction: 'create_shopify_order',
        endpoint: '/api/workflows/shopify/orders'
      }
    
    case 'product_info':
      const productId = response.match(/ID:(\d+)/)?.[1]
      return {
        nextAction: 'fetch_product_details',
        endpoint: `/api/workflows/shopify/product/${productId}`,
        productId
      }
    
    case 'purchase_intent':
      return {
        nextAction: 'collect_customer_data',
        requirement: 'customer_details'
      }
    
    default:
      return {
        nextAction: 'continue_conversation',
        type: 'normal_chat'
      }
  }
}

// Calcular costo
function calculateCost(tokens: number, model: string): number {
  const prices = {
    'gpt-4': 0.03 / 1000,
    'gpt-3.5-turbo': 0.002 / 1000
  }
  return tokens * (prices[model as keyof typeof prices] || prices['gpt-4'])
}

// Endpoint GET para info
export async function GET() {
  return createResponse({
    message: "Verify Sales Agent API",
    version: "1.0.0",
    description: "AI-powered sales assistant for Verify store",
    endpoints: {
      POST: "/api/workflows/sales-agent"
    },
    params: {
      text: "string (required) - Customer message",
      userId: "string (optional) - User identifier", 
      sessionId: "string (optional) - Conversation session",
      context: {
        previousMessages: "array (optional) - Chat history",
        customerData: "object (optional) - Customer details"
      }
    },
    intents: [
      "show_products", "create_order", "product_info", "purchase_intent", "conversation"
    ]
  })
}