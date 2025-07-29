// lib/utils.ts
import { createServerSupabaseClient } from './supabase'

export interface WorkflowExecution {
  workflow: string
  userId?: string
  status: 'started' | 'completed' | 'failed'
  input?: any
  output?: any
  error?: string
  duration?: number
  timestamp?: string
}

// Función para registrar ejecuciones de workflows
export const logExecution = async (execution: WorkflowExecution) => {
  const supabase = createServerSupabaseClient()
  
  try {
    const { error } = await supabase
      .from('workflow_logs')
      .insert({
        workflow_name: execution.workflow,
        user_id: execution.userId,
        status: execution.status,
        input_data: execution.input,
        output_data: execution.output,
        error_message: execution.error,
        duration_ms: execution.duration,
        created_at: new Date().toISOString()
      })
    
    if (error) {
      console.error('Error logging execution:', error)
    }
  } catch (err) {
    console.error('Failed to log execution:', err)
  }
}

// Función para validar API key
export const validateApiKey = async (apiKey: string) => {
  if (!apiKey) {
    throw new Error('API key required')
  }
  
  const supabase = createServerSupabaseClient()
  const { data, error } = await supabase
    .from('api_keys')
    .select('user_id, is_active')
    .eq('key_hash', hashApiKey(apiKey))
    .single()
  
  if (error || !data || !data.is_active) {
    throw new Error('Invalid or inactive API key')
  }
  
  return data.user_id
}

// Hash simple para API keys (en producción usar bcrypt)
const hashApiKey = (key: string): string => {
  return Buffer.from(key).toString('base64')
}

// Rate limiting simple (en memoria, para producción usar Redis)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

export const checkRateLimit = (identifier: string, limit: number = 100, windowMs: number = 60000) => {
  const now = Date.now()
  const key = identifier
  
  if (!rateLimitStore.has(key)) {
    rateLimitStore.set(key, { count: 1, resetTime: now + windowMs })
    return { allowed: true, remaining: limit - 1 }
  }
  
  const record = rateLimitStore.get(key)!
  
  if (now > record.resetTime) {
    record.count = 1
    record.resetTime = now + windowMs
    return { allowed: true, remaining: limit - 1 }
  }
  
  if (record.count >= limit) {
    return { allowed: false, remaining: 0, resetTime: record.resetTime }
  }
  
  record.count++
  return { allowed: true, remaining: limit - record.count }
}

// Helper para respuestas consistentes
export const createResponse = (data: any, status: number = 200) => {
  return Response.json(data, { status })
}

export const createErrorResponse = (message: string, status: number = 500) => {
  return Response.json({ 
    success: false, 
    error: message 
  }, { status })
}