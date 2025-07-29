// app/api/webhooks/whatsapp/route.ts
// Recibe mensajes de WhatsApp (replica del WhatsApp Trigger de n8n)

import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { logExecution, createResponse, createErrorResponse } from '@/lib/utils'

// Configuración WhatsApp (de tu n8n)
const WHATSAPP_CONFIG = {
  verifyToken: process.env.WHATSAPP_VERIFY_TOKEN || 'verify_token_2025',
  phoneNumberId: process.env.WHATSAPP_PHONE_NUMBER_ID || '723144527547373',
  accessToken: process.env.WHATSAPP_ACCESS_TOKEN || 'EAAYICP8tkeUBPO9EpACm9jct3hoLzPGeT0lq6IZBZAZBxZCYa6QKkpZAHJe3f6Ej3kTnf0Gba6Drm1y1VvNO3aeznulg4waD9A9NXtCe2LHCfeNvzs2ESexrMwCfWcW39GTH27p9Ex7IeDLW1166uNTZCZB9uutGiBuIcZB9oiILZCBGETxlJdbSOH0wvkK2zgGaVytO8o2MQd5vDdqZAc6RwTOfbU16BNSTzgZBCAv'
}

// Schema para validar mensajes de WhatsApp
const WhatsAppMessageSchema = z.object({
  object: z.string(),
  entry: z.array(z.object({
    id: z.string(),
    changes: z.array(z.object({
      value: z.object({
        messaging_product: z.string(),
        metadata: z.object({
          display_phone_number: z.string(),
          phone_number_id: z.string()
        }),
        contacts: z.array(z.object({
          profile: z.object({
            name: z.string()
          }),
          wa_id: z.string()
        })).optional(),
        messages: z.array(z.object({
          from: z.string(),
          id: z.string(),
          timestamp: z.string(),
          text: z.object({
            body: z.string()
          }).optional(),
          audio: z.object({
            id: z.string(),
            mime_type: z.string()
          }).optional(),
          image: z.object({
            id: z.string(),
            mime_type: z.string(),
            caption: z.string().optional()
          }).optional()
        })).optional()
      })
    }))
  }))
})

// GET - Verificación del webhook (requerido por WhatsApp)
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  
  const mode = searchParams.get('hub.mode')
  const token = searchParams.get('hub.verify_token')
  const challenge = searchParams.get('hub.challenge')
  
  // Verificar que el token coincide
  if (mode === 'subscribe' && token === WHATSAPP_CONFIG.verifyToken) {
    console.log('WhatsApp webhook verified successfully')
    return new NextResponse(challenge, { status: 200 })
  }
  
  return new NextResponse('Verification failed', { status: 403 })
}

// POST - Recibir mensajes
export async function POST(request: NextRequest) {
  const startTime = Date.now()
  
  try {
    // 1. Parsear body de WhatsApp
    const body = await request.json()
    console.log('WhatsApp webhook received:', JSON.stringify(body, null, 2))
    
    // 2. Validar estructura
    const validatedData = WhatsAppMessageSchema.parse(body)
    
    // 3. Extraer mensajes
    const entry = validatedData.entry[0]
    const changes = entry.changes[0]
    const value = changes.value
    
    // 4. Verificar si hay mensajes
    if (!value.messages || value.messages.length === 0) {
      console.log('No messages in webhook')
      return createResponse({ success: true, message: 'No messages to process' })
    }
    
    const message = value.messages[0]
    const contacts = value.contacts || []
    const contact = contacts[0]
    
    // 5. Log recepción del mensaje
    await logExecution({
      workflow: 'whatsapp-webhook',
      status: 'started',
      input: { 
        from: message.from, 
        messageId: message.id,
        messageType: getMessageType(message)
      }
    })
    
    // 6. Procesar según tipo de mensaje (igual que tu Switch de n8n)
    const processedMessage = await processIncomingMessage(message, contact, value)
    
    // 7. Llamar al Sales Coordinator
    const response = await callSalesCoordinator(processedMessage)
    
    // 8. Enviar respuesta por WhatsApp
    await sendWhatsAppResponse(message.from, response)
    
    // 9. Log éxito
    const executionTime = Date.now() - startTime
    await logExecution({
      workflow: 'whatsapp-webhook',
      status: 'completed',
      output: { response: response.data.message },
      duration: executionTime
    })
    
    return createResponse({
      success: true,
      message: 'Message processed successfully',
      executionTime
    })
    
  } catch (error: any) {
    console.error('WhatsApp webhook error:', error)
    
    const executionTime = Date.now() - startTime
    await logExecution({
      workflow: 'whatsapp-webhook',
      status: 'failed',
      error: error.message,
      duration: executionTime
    })
    
    // Siempre responder 200 a WhatsApp para evitar reintentos
    return createResponse({
      success: false,
      error: error.message
    })
  }
}

// Procesar mensaje entrante (replica del Switch de n8n)
async function processIncomingMessage(message: any, contact: any, value: any) {
  const messageType = getMessageType(message)
  
  switch (messageType) {
    case 'text':
      // Mensaje de texto normal
      return {
        text: message.text.body,
        messageType: 'text',
        userId: message.from,
        sessionId: `whatsapp_${message.from}`,
        context: {
          contact: contact,
          whatsappData: {
            messageId: message.id,
            timestamp: message.timestamp,
            phoneNumberId: value.metadata.phone_number_id
          }
        }
      }
    
    case 'audio':
      // Audio - necesitará transcripción
      return {
        text: '[AUDIO_MESSAGE]', // Placeholder por ahora
        messageType: 'audio',
        userId: message.from,
        sessionId: `whatsapp_${message.from}`,
        audioData: {
          id: message.audio.id,
          mimeType: message.audio.mime_type
        },
        context: {
          contact: contact,
          whatsappData: {
            messageId: message.id,
            timestamp: message.timestamp,
            phoneNumberId: value.metadata.phone_number_id
          }
        }
      }
    
    case 'image':
      // Imagen - necesitará análisis
      return {
        text: message.image.caption || '[IMAGE_MESSAGE]',
        messageType: 'image',
        userId: message.from,
        sessionId: `whatsapp_${message.from}`,
        imageData: {
          id: message.image.id,
          mimeType: message.image.mime_type,
          caption: message.image.caption
        },
        context: {
          contact: contact,
          whatsappData: {
            messageId: message.id,
            timestamp: message.timestamp,
            phoneNumberId: value.metadata.phone_number_id
          }
        }
      }
    
    default:
      throw new Error(`Unsupported message type: ${messageType}`)
  }
}

// Determinar tipo de mensaje
function getMessageType(message: any): string {
  if (message.text) return 'text'
  if (message.audio) return 'audio'
  if (message.image) return 'image'
  return 'unknown'
}

// Llamar al Sales Coordinator
async function callSalesCoordinator(messageData: any) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/workflows/sales-coordinator`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(messageData)
    })
    
    if (!response.ok) {
      throw new Error(`Sales coordinator error: ${response.status}`)
    }
    
    return await response.json()
    
  } catch (error: any) {
    throw new Error(`Failed to call sales coordinator: ${error.message}`)
  }
}

// Enviar respuesta por WhatsApp
async function sendWhatsAppResponse(to: string, coordinatorResponse: any) {
  const message = coordinatorResponse.data.message
  
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
    console.log('WhatsApp message sent:', result)
    
    return result
    
  } catch (error: any) {
    console.error('Failed to send WhatsApp message:', error)
    throw error
  }
}