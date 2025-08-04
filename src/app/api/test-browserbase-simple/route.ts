import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  try {
    console.log('🧪 [TEST] Testando API simples...')

    // Verificar variáveis de ambiente
    const apiKey = process.env.BROWSERBASE_API_KEY
    const projectId = process.env.BROWSERBASE_PROJECT_ID

    console.log('🔑 [TEST] API Key exists:', !!apiKey)
    console.log('🆔 [TEST] Project ID exists:', !!projectId)

    return NextResponse.json({
      success: true,
      message: 'API funcionando!',
      environment: {
        apiKeyExists: !!apiKey,
        projectIdExists: !!projectId,
        nodeEnv: process.env.NODE_ENV
      },
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('❌ [TEST] Erro:', error)

    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}
