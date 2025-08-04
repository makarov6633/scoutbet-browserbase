import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json()
    
    return NextResponse.json({
      success: true,
      message: `Teste funcionando! Mensagem recebida: ${message}`,
      timestamp: new Date().toISOString(),
      env: {
        perplexityKey: !!process.env.PERPLEXITY_API_KEY,
        browserbaseKey: !!process.env.BROWSERBASE_API_KEY,
        browserbaseProject: !!process.env.BROWSERBASE_PROJECT_ID
      }
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido'
    }, { status: 500 })
  }
} 