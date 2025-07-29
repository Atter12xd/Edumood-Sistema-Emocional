// app/api/webhook-public/route.ts
// Versión ultra simple para WhatsApp

export async function GET(request: Request) {
  const url = new URL(request.url)
  const mode = url.searchParams.get('hub.mode')
  const token = url.searchParams.get('hub.verify_token')
  const challenge = url.searchParams.get('hub.challenge')
  
  // Log para debug
  console.log('Verification request:', { mode, token, challenge })
  
  if (mode === 'subscribe' && token === 'verify_token_2025') {
    console.log('✅ Verification successful')
    return new Response(challenge, {
      status: 200,
      headers: { 'Content-Type': 'text/plain' }
    })
  }
  
  console.log('❌ Verification failed')
  return new Response('Forbidden', { status: 403 })
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    console.log('📱 WhatsApp message:', body)
    
    return new Response('OK', {
      status: 200,
      headers: { 'Content-Type': 'text/plain' }
    })
  } catch (error) {
    console.log('Error:', error)
    return new Response('Error', { status: 500 })
  }
}