// app/api/workflows/whatsapp/send-text/route.ts
// Envía mensajes de texto por WhatsApp

import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { logExecution, createResponse, createErrorResponse } from '@/lib/utils'

// Configuración WhatsApp (desde variables de entorno)
const WHATSAPP_CONFIG = {
  phoneNumberId: process.env.WHATSAPP_PHONE_NUMBER_ID || '723144527547373',
  accessToken: process.env.WHATSAPP_ACCESS_TOKEN || 'EAAYICP8tkeUBPO9EpACm9jct3hoLzPGeT0lq6IZBZAZBxZCYa6QKkpZAHJe3f6Ej3kTnf0Gba6Drm1y1VvNO3aeznulg4waD9A9NXtCe2LHCfeNvzs2ESexrMwCfWcW39GTH27p9Ex7IeDLW1166uNTZCZB9uutGiBuIcZB9oiILZCBGETxlJdbSOH0wvkK2zgGaVytO8o2MQd5vDdqZAc6RwTOfbU16BNSTzgZBCAv'
}

// Validación de input
const SendTextSchema = z.object({
  to: z.string().min(1, "Recipient phone number is required"),
  message: z.string().min(1, "Message text is required"),
  userId: z.string().optional()
})

export async function POST(request: NextRequest) {
  const startTime = Date.now()
  let userId: string | undefined
  
  try {
    // 1. Validar input
    const rawBody = await request.json()
    const validatedData = SendTextSchema.parse(rawBody)
    
    userId = validatedData.userId
    
    // 2. Log inicio
    await logExecution({
      workflow: 'whatsapp-send-text',
      userId,
      status: 'started',
      input: { to: validatedData.to, messageLength: validatedData.message.length }
    })
    
    // 3. Enviar mensaje
    const result = await sendWhatsAppText(validatedData.to, validatedData.message)
    
    // 4. Log éxito
    const executionTime = Date.now() - startTime
    await logExecution({
      workflow: 'whatsapp-send-text',
      userId,
      status: 'completed',
      output: result,
      duration: executionTime
    })
    
    return createResponse({
      success: true,
      data: result,
      executionTime,
      metadata: {
        workflowName: 'whatsapp-send-text',
        version: '1.0.0',
        timestamp: new Date().toISOString()
      }
    })
    
  } catch (error: any) {
    const executionTime = Date.now() - startTime
    await logExecution({
      workflow: 'whatsapp-send-text',
      userId,
      status: 'failed',
      error: error.message,
      duration: executionTime
    })
    
    if (error instanceof z.ZodError) {
      return createErrorResponse(`Validation error: ${error.errors.map(e => e.message).join(', ')}`, 400)
    }
    
    return createErrorResponse(error.message || 'Failed to send WhatsApp message', 500)
  }
}

async function sendWhatsAppText(to: string, message: string) {
  try {
    const response = await fetch(`https://graph.facebook.com/v18.0/${WHATSAPP_CONFIG.phoneNumberId}/messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${WHATSAPP_CONFIG.accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        to: to,
        type: 'text',
        text: {
          body: message
        }
      })
    })
    
    if (!response.ok) {
      const errorData = await response.text()
      throw new Error(`WhatsApp API error: ${response.status} ${errorData}`)
    }
    
    const result = await response.json()
    
    return {
      messageId: result.messages?.[0]?.id,
      status: 'sent',
      to: to,
      message: message,
      whatsappResponse: result
    }
    
  } catch (error: any) {
    throw new Error(`Failed to send WhatsApp message: ${error.message}`)
  }
}

// GET endpoint para testing
export async function GET() {
  return createResponse({
    message: "WhatsApp Send Text API",
    version: "1.0.0",
    description: "Send text messages via WhatsApp Business API",
    endpoints: {
      POST: "/api/workflows/whatsapp/send-text"
    },
    params: {
      to: "string (required) - Recipient phone number",
      message: "string (required) - Message text",
      userId: "string (optional) - User identifier"
    }
  })
}