import { NextRequest, NextResponse } from 'next/server'

// Configuración Shopify
// Configuración Shopify
const SHOPIFY_CONFIG = {
  shop: 'verify-test-111',
  accessToken: process.env.SHOPIFY_ACCESS_TOKEN || '',
  apiVersion: '2023-10'
};

export async function POST(request: NextRequest) {
  try {
    console.log('=== SHOPIFY ORDER CREATION ===')
    
    const body = await request.json()
    console.log('Request body:', JSON.stringify(body, null, 2))
    
    // Validación básica
    if (!body.customerData || !body.items) {
      throw new Error('Missing customerData or items')
    }
    
    const { customerData, items } = body
    
    // Construir datos del pedido para Shopify
    const orderData = {
      order: {
        line_items: items.map((item: any) => ({
          variant_id: parseInt(item.variant_id),
          quantity: item.quantity || 1,
          price: item.price
        })),
        // Crear customer nuevo o usar existente
        customer: {
          first_name: customerData.name.split(' ')[0] || customerData.name,
          last_name: customerData.name.split(' ').slice(1).join(' ') || '',
          email: customerData.email,
          phone: formatPhone(customerData.phone),
          accepts_marketing: false
        },
        shipping_address: {
          first_name: customerData.name.split(' ')[0] || customerData.name,
          last_name: customerData.name.split(' ').slice(1).join(' ') || '',
          address1: customerData.address,
          phone: formatPhone(customerData.phone),
          country: 'PE',
          province: 'Lima'
        },
        billing_address: {
          first_name: customerData.name.split(' ')[0] || customerData.name,
          last_name: customerData.name.split(' ').slice(1).join(' ') || '',
          address1: customerData.address,
          phone: formatPhone(customerData.phone),
          country: 'PE',
          province: 'Lima'
        },
        financial_status: 'pending',
        note: `Pedido WhatsApp Bot - Cliente: ${customerData.name} | Email: ${customerData.email} | Teléfono: ${customerData.phone} | ${new Date().toISOString()}`,
        tags: 'whatsapp-bot,automated-order',
        send_receipt: false,
        send_fulfillment_receipt: false
      }
    }
    
    console.log('Shopify order data:', JSON.stringify(orderData, null, 2))
    
    // Llamar a Shopify API
    const shopifyUrl = `https://${SHOPIFY_CONFIG.shop}.myshopify.com/admin/api/${SHOPIFY_CONFIG.apiVersion}/orders.json`
    
    const response = await fetch(shopifyUrl, {
      method: 'POST',
      headers: {
        'X-Shopify-Access-Token': SHOPIFY_CONFIG.accessToken,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(orderData)
    })
    
    console.log('Shopify response status:', response.status)
    
    if (!response.ok) {
      const errorData = await response.text()
      console.error('Shopify error:', errorData)
      throw new Error(`Shopify API error: ${response.status} ${errorData}`)
    }
    
    const result = await response.json()
    console.log('Shopify success:', result.order?.id)
    
    // Formatear respuesta para WhatsApp
    const whatsappMessage = formatOrderConfirmation(result.order)
    
    return NextResponse.json({
      success: true,
      data: {
        orderId: result.order?.id,
        orderNumber: result.order?.order_number || result.order?.name,
        total: result.order?.total_price,
        whatsappMessage,
        shopifyOrder: result.order
      },
      message: 'Order created successfully!'
    })
    
  } catch (error: any) {
    console.error('=== ORDER ERROR ===')
    console.error('Error:', error.message)
    
    return NextResponse.json({
      success: false,
      error: error.message,
      whatsappMessage: `❌ *Error al crear pedido*\n\n${error.message}\n\n*Verify* - Intenta nuevamente`
    }, { status: 500 })
  }
}

function formatPhone(phone: string): string {
  // Limpiar y formatear teléfono para Shopify
  let cleanPhone = phone.replace(/\D/g, '') // Solo números
  
  // Si no empieza con código de país, agregar +51 (Perú)
  if (!cleanPhone.startsWith('51') && cleanPhone.length === 9) {
    cleanPhone = '51' + cleanPhone
  }
  
  // Formato que acepta Shopify: +51xxxxxxxxx
  return '+' + cleanPhone
}

function formatOrderConfirmation(order: any): string {
  if (!order) {
    return `❌ *Error al crear el pedido*\n\n*Verify* - Por favor intenta nuevamente`
  }
  
  let mensaje = `🎉 *¡Pedido creado exitosamente!*\n\n`
  
  mensaje += `📋 *Detalles:*\n`
  mensaje += `🔢 Número: *#${order.order_number || order.name}*\n`
  
  if (order.created_at) {
    const fecha = new Date(order.created_at)
    mensaje += `📅 Fecha: *${fecha.toLocaleDateString('es-ES')}*\n`
  }
  
  if (order.line_items && order.line_items.length > 0) {
    mensaje += `\n🛒 *Productos:*\n`
    order.line_items.forEach((item: any, index: number) => {
      mensaje += `   ${index + 1}. ${item.title}\n`
      mensaje += `      Cantidad: ${item.quantity}\n`
      mensaje += `      Precio: $${item.price}\n`
    })
  }
  
  if (order.total_price) {
    mensaje += `\n💰 *Total: $${order.total_price}*\n\n`
  }
  
  mensaje += `📊 *Estado:* ⏳ Pendiente de pago\n\n`
  mensaje += `📞 *Próximos pasos:*\n`
  mensaje += `• Te contactaremos para confirmar\n`
  mensaje += `• Coordinaremos el pago\n`
  mensaje += `• Confirmaremos la entrega\n\n`
  mensaje += `*¡Gracias por confiar en Verify!* 😊`
  
  return mensaje
}

export async function GET() {
  return NextResponse.json({
    message: "Shopify Orders API - Working Version",
    version: "2.0.0",
    status: "ready",
    config: {
      shop: SHOPIFY_CONFIG.shop,
      hasToken: !!SHOPIFY_CONFIG.accessToken
    }
  })
}