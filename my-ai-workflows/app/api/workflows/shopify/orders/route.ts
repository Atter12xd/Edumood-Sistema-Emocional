//app/api/workflows/shopify/orders/route.ts
import { NextRequest, NextResponse } from 'next/server'

// ✅ FUNCIÓN PARA OBTENER TOKEN DINÁMICO (igual que en products)
async function getShopConfig(shopDomain: string) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const apiKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    
    if (!supabaseUrl || !apiKey) {
      throw new Error('Missing Supabase configuration')
    }
    
    const fullUrl = `${supabaseUrl}/rest/v1/tiendas?dominio_shopify=eq.${shopDomain}&select=token_shopify`
    
    const response = await fetch(fullUrl, {
      headers: {
        'apikey': apiKey,
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    })
    
    if (!response.ok) {
      throw new Error(`Supabase error: ${response.status}`)
    }
    
    const data = await response.json()
    const shopData = data[0]
    
    if (!shopData || !shopData.token_shopify) {
      throw new Error(`No access token found for shop: ${shopDomain}`)
    }
    
    const shopName = shopDomain.replace('.myshopify.com', '')
    
    return {
      shop: shopName,
      accessToken: shopData.token_shopify,
      apiVersion: '2023-10'
    }
    
  } catch (error: any) {
    console.error('Error getting shop config for orders:', error)
    throw new Error(`Failed to get shop configuration: ${error.message}`)
  }
}

// NUEVA FUNCIÓN: Manejar clientes duplicados
async function handleShopifyCustomerConflict(customerData: any, shopConfig: any) {
  try {
    console.log('🔄 Manejando conflicto de cliente duplicado')
    
    // Generar timestamp único para el teléfono
    const timestamp = Date.now().toString().slice(-4)
    const modifiedPhone = `${customerData.phone}_${timestamp}`
    
    console.log(`📞 Modificando teléfono: ${customerData.phone} → ${modifiedPhone}`)
    
    return {
      ...customerData,
      phone: modifiedPhone
    }
  } catch (error) {
    console.error('❌ Error manejando conflicto:', error)
    throw error
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('=== SHOPIFY ORDER CREATION ===')
    
    const body = await request.json()
    console.log('Request body:', JSON.stringify(body, null, 2))
    
    // Validación básica
    if (!body.customerData || !body.items || !body.shopDomain) {
      throw new Error('Missing customerData, items, or shopDomain')
    }
    
    const { customerData, items, shopDomain } = body
    
    // ✅ OBTENER CONFIGURACIÓN DINÁMICA
    const shopConfig = await getShopConfig(shopDomain)
    console.log(`🏪 Creating order for: ${shopDomain}`)
    
    // Construir datos del pedido para Shopify
    const orderData = {
      order: {
        line_items: items.map((item: any) => ({
          variant_id: parseInt(item.variant_id),
          quantity: item.quantity || 1,
          price: item.price
        })),
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
        note: `Pedido ChatBot - Cliente: ${customerData.name} | Email: ${customerData.email} | Teléfono: ${customerData.phone} | ${new Date().toISOString()}`,
        tags: 'chatbot-order,automated-order',
        send_receipt: false,
        send_fulfillment_receipt: false
      }
    }
    
    console.log('Shopify order data:', JSON.stringify(orderData, null, 2))
    
    // ✅ LLAMAR A SHOPIFY API CON CONFIGURACIÓN DINÁMICA
const shopifyUrl = `https://${shopConfig.shop}.myshopify.com/admin/api/${shopConfig.apiVersion}/orders.json`

// NUEVO: Primer intento de crear pedido
let response = await fetch(shopifyUrl, {
  method: 'POST',
  headers: {
    'X-Shopify-Access-Token': shopConfig.accessToken,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(orderData)
})

console.log('Shopify response status:', response.status)

// NUEVO: Manejar error de teléfono duplicado
if (!response.ok) {
  const errorData = await response.text()
  console.error('Shopify error primera tentativa:', errorData)
  
  // Detectar error de teléfono duplicado
  if (response.status === 422 && errorData.includes('phone') && errorData.includes('already been taken')) {
    console.log('🔄 Detectado error de teléfono duplicado, reintentando...')
    
    // Modificar datos del cliente
    const modifiedCustomerData = await handleShopifyCustomerConflict(customerData, shopConfig)
    
    // Reconstruir orderData con nuevo teléfono
    orderData.order.customer.phone = formatPhone(modifiedCustomerData.phone)
    orderData.order.shipping_address.phone = formatPhone(modifiedCustomerData.phone)
    orderData.order.billing_address.phone = formatPhone(modifiedCustomerData.phone)
    orderData.order.note = `Pedido ChatBot - Cliente: ${modifiedCustomerData.name} | Email: ${modifiedCustomerData.email} | Teléfono: ${modifiedCustomerData.phone} | ${new Date().toISOString()}`
    
    console.log('Reintentando con datos modificados:', JSON.stringify(orderData, null, 2))
    
    // Segundo intento
    response = await fetch(shopifyUrl, {
      method: 'POST',
      headers: {
        'X-Shopify-Access-Token': shopConfig.accessToken,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(orderData)
    })
    
    if (!response.ok) {
      const secondErrorData = await response.text()
      console.error('Shopify error segundo intento:', secondErrorData)
      throw new Error(`Shopify API error (segundo intento): ${response.status} - ${secondErrorData}`)
    }
    
    console.log('✅ Pedido creado exitosamente en segundo intento')
  } else {
    throw new Error(`Shopify API error: ${response.status} - ${errorData}`)
  }
}

const result = await response.json()
    console.log('Shopify success:', result.order?.id)
    
    // Formatear respuesta
    const webMessage = formatOrderConfirmation(result.order)
    
    return NextResponse.json({
      success: true,
      data: {
        orderId: result.order?.id,
        orderNumber: result.order?.order_number || result.order?.name,
        total: result.order?.total_price,
        webMessage,
        shopifyOrder: result.order
      },
      message: 'Order created successfully!'
    })
    
  } catch (error: any) {
  console.error('=== ORDER ERROR ===')
  console.error('Error:', error.message)
  
  // Mejorar mensaje de error según el tipo
  let errorMessage = '❌ **Error al crear el pedido**\n\n'
  
  if (error.message.includes('phone') && error.message.includes('already been taken')) {
    errorMessage += 'El número de teléfono ya está registrado. '
    errorMessage += 'Hemos intentado procesar tu pedido automáticamente.\n\n'
    errorMessage += 'Si persiste el problema, contacta con soporte.'
  } else if (error.message.includes('variant_id')) {
    errorMessage += 'Producto no encontrado o agotado.\n\n'
    errorMessage += 'Por favor selecciona otro producto.'
  } else if (error.message.includes('access token')) {
    errorMessage += 'Error de configuración de la tienda.\n\n'
    errorMessage += 'Contacta con soporte técnico.'
  } else {
    errorMessage += error.message + '\n\n'
    errorMessage += 'Intenta nuevamente por favor.'
  }
  
  return NextResponse.json({
    success: false,
    error: error.message,
    webMessage: errorMessage
  }, { status: 500 })
}
}

function formatPhone(phone: string): string {
  let cleanPhone = phone.replace(/\D/g, '')
  
  if (!cleanPhone.startsWith('51') && cleanPhone.length === 9) {
    cleanPhone = '51' + cleanPhone
  }
  
  return '+' + cleanPhone
}

function formatOrderConfirmation(order: any): string {
  if (!order) {
    return `❌ *Error al crear el pedido*\n\nPor favor intenta nuevamente`
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
  mensaje += `*¡Gracias por tu compra!* 😊`
  
  return mensaje
}

export async function GET() {
  return NextResponse.json({
    message: "Shopify Orders API - Dynamic Version",
    version: "3.0.0",
    status: "ready",
    description: "Creates orders dynamically for any shop domain"
  })
}