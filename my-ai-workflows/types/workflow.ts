// types/workflow.ts

// Tipos base para workflows
export interface WorkflowRequest {
  userId?: string
  apiKey?: string
  [key: string]: any
}

export interface WorkflowResponse {
  success: boolean
  data?: any
  error?: string
  executionTime?: number
  metadata?: {
    workflowName: string
    version: string
    timestamp: string
  }
}

// Tipos para logging
export interface WorkflowLog {
  id: string
  workflow_name: string
  user_id?: string
  status: 'started' | 'completed' | 'failed'
  input_data?: any
  output_data?: any
  error_message?: string
  duration_ms?: number
  created_at: string
}

// Tipos para API Keys
export interface ApiKey {
  id: string
  key_hash: string
  user_id: string
  name: string
  is_active: boolean
  created_at: string
  last_used?: string
}

// Tipos específicos para workflows de IA
export interface AIWorkflowParams {
  prompt: string
  model?: string
  temperature?: number
  max_tokens?: number
  system_message?: string
}

export interface AIWorkflowResult {
  result: string
  model: string
  usage: {
    prompt_tokens: number
    completion_tokens: number
    total_tokens: number
  }
  cost?: number
}

// Tipos para procesamiento de datos
export interface DataProcessingParams {
  data: any[]
  operation: 'filter' | 'transform' | 'aggregate' | 'validate'
  options?: any
}

export interface DataProcessingResult {
  processedData: any[]
  summary: {
    inputCount: number
    outputCount: number
    errors: string[]
  }
}

// Tipos para webhooks
export interface WebhookPayload {
  event: string
  timestamp: string
  data: any
  signature?: string
}

// Tipos para cron jobs
export interface CronJobResult {
  success: boolean
  itemsProcessed: number
  errors: string[]
  duration: number
  nextRun?: string
}