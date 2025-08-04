import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    success: true,
    message: 'API de teste funcionando!',
    timestamp: new Date().toISOString()
  })
}

export async function POST(request: NextRequest) {
  try {
    console.log('🧪 [TEST] POST request recebido')

    const body = await request.json()
    console.log('📋 [TEST] Body:', body)

    return NextResponse.json({
      success: true,
      message: 'POST funcionando!',
      receivedBody: body,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('❌ [TEST] Erro no POST:', error)

    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}
