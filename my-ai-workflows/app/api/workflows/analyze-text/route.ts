// app/api/workflows/analyze-text/route.ts
// Template base siguiendo tu arquitectura propuesta

import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import { z } from 'zod'
import { logExecution, checkRateLimit, createResponse, createErrorResponse } from '@/lib/utils'

// Validación de input con Zod
const AnalyzeTextSchema = z.object({
  text: z.string().min(1, "Text is required").max(10000, "Text too long"),
  analysisType: z.enum(['sentiment', 'summary', 'keywords', 'tone']).default('sentiment'),
  options: z.object({
    language: z.string().default('es'),
    detailed: z.boolean().default(false)
  }).optional()
})

// Configuración de OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

export async function POST(request: NextRequest) {
  const startTime = Date.now()
  let userId: string | undefined
  
  try {
    // 1. Validar rate limiting
    const clientIP = request.headers.get('x-forwarded-for') || 'unknown'
    const rateLimit = checkRateLimit(clientIP, 100, 60000) // 100 requests per minute
    
    if (!rateLimit.allowed) {
      return createErrorResponse('Rate limit exceeded', 429)
    }
    
    // 2. Parsear y validar input
    const rawBody = await request.json()
    const validatedData = AnalyzeTextSchema.parse(rawBody)
    
    userId = rawBody.userId // Opcional para tracking
    
    // 3. Log inicio de ejecución
    await logExecution({
      workflow: 'analyze-text',
      userId,
      status: 'started',
      input: validatedData
    })
    
    // 4. Ejecutar workflow principal
    const result = await executeAnalyzeText(validatedData)
    
    // 5. Log éxito
    const executionTime = Date.now() - startTime
    await logExecution({
      workflow: 'analyze-text',
      userId,
      status: 'completed',
      output: result,
      duration: executionTime
    })
    
    // 6. Respuesta exitosa
    return createResponse({
      success: true,
      data: result,
      executionTime,
      metadata: {
        workflowName: 'analyze-text',
        version: '1.0.0',
        timestamp: new Date().toISOString()
      }
    })
    
  } catch (error: any) {
    // Log error
    const executionTime = Date.now() - startTime
    await logExecution({
      workflow: 'analyze-text',
      userId,
      status: 'failed',
      error: error.message,
      duration: executionTime
    })
    
    // Respuesta de error
    if (error instanceof z.ZodError) {
      return createErrorResponse(`Validation error: ${error.errors.map(e => e.message).join(', ')}`, 400)
    }
    
    return createErrorResponse(error.message || 'Internal server error', 500)
  }
}

async function executeAnalyzeText(params: z.infer<typeof AnalyzeTextSchema>) {
  const { text, analysisType, options } = params
  
  // Definir prompts según el tipo de análisis
  const prompts = {
    sentiment: `Analiza el sentimiento del siguiente texto en ${options?.language || 'español'}. 
                Responde SOLO con: POSITIVO, NEGATIVO, o NEUTRAL, seguido de una breve explicación.
                
                Texto: "${text}"`,
    
    summary: `Resume el siguiente texto en ${options?.language || 'español'}. 
              ${options?.detailed ? 'Proporciona un resumen detallado.' : 'Máximo 100 palabras.'}
              
              Texto: "${text}"`,
    
    keywords: `Extrae las palabras clave más importantes del siguiente texto en ${options?.language || 'español'}.
               Responde con una lista separada por comas.
               
               Texto: "${text}"`,
    
    tone: `Analiza el tono del siguiente texto en ${options?.language || 'español'}.
           Clasifica como: FORMAL, INFORMAL, PROFESIONAL, CASUAL, AGRESIVO, AMIGABLE, etc.
           
           Texto: "${text}"`
  }
  
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { 
          role: "system", 
          content: "Eres un experto analista de texto. Responde de manera concisa y precisa." 
        },
        { 
          role: "user", 
          content: prompts[analysisType] 
        }
      ],
      temperature: 0.3,
      max_tokens: options?.detailed ? 500 : 200
    })
    
    const analysis = completion.choices[0].message.content?.trim()
    
    return {
      analysis,
      analysisType,
      originalText: text.substring(0, 100) + (text.length > 100 ? '...' : ''),
      language: options?.language || 'es',
      model: completion.model,
      usage: {
        promptTokens: completion.usage?.prompt_tokens || 0,
        completionTokens: completion.usage?.completion_tokens || 0,
        totalTokens: completion.usage?.total_tokens || 0
      },
      estimatedCost: calculateCost(completion.usage?.total_tokens || 0, 'gpt-4')
    }
    
  } catch (error: any) {
    throw new Error(`OpenAI API error: ${error.message}`)
  }
}

// Helper para calcular costo aproximado
function calculateCost(tokens: number, model: string): number {
  const prices = {
    'gpt-4': 0.03 / 1000, // $0.03 per 1K tokens (approximation)
    'gpt-3.5-turbo': 0.002 / 1000
  }
  
  return tokens * (prices[model as keyof typeof prices] || prices['gpt-4'])
}

// Endpoint GET para testing
export async function GET() {
  return createResponse({
    message: "Analyze Text Workflow API",
    version: "1.0.0",
    endpoints: {
      POST: "/api/workflows/analyze-text"
    },
    params: {
      text: "string (required)",
      analysisType: "sentiment | summary | keywords | tone",
      options: {
        language: "string (default: es)",
        detailed: "boolean (default: false)"
      }
    }
  })
}