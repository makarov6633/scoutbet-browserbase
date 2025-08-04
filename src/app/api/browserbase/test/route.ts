import { NextRequest, NextResponse } from 'next/server'
import { testBrowserbaseConnection } from '@/lib/integrations/browserbase'

export async function POST(request: NextRequest) {
  try {
    console.log('🧪 [BROWSERBASE-TEST] Iniciando teste...')
    
    const { testType } = await request.json()
    
    switch (testType) {
      case 'connection':
        return await testConnection()
      case 'session-info':
        return await testSessionInfo()
      case 'full-test':
        return await runFullTest()
      default:
        return NextResponse.json(
          { error: 'Tipo de teste não reconhecido' },
          { status: 400 }
        )
    }
    
  } catch (error) {
    console.error('❌ [BROWSERBASE-TEST] Erro:', error)
    return NextResponse.json(
      { error: `Erro no teste: ${(error as Error).message}` },
      { status: 500 }
    )
  }
}

async function testConnection() {
  try {
    console.log('🔗 [BROWSERBASE-TEST] Testando conexão...')
    
    const result = await testBrowserbaseConnection()
    
    return NextResponse.json({
      success: result,
      testType: 'connection',
      message: result ? 'Conexão Browserbase OK' : 'Falha na conexão Browserbase'
    })
    
  } catch (error) {
    console.error('❌ [BROWSERBASE-TEST] Erro na conexão:', error)
    return NextResponse.json({
      success: false,
      testType: 'connection',
      error: (error as Error).message
    }, { status: 500 })
  }
}

async function testSessionInfo() {
  try {
    console.log('📊 [BROWSERBASE-TEST] Testando Session Info...')
    
    // Teste básico de conexão
    const result = await testBrowserbaseConnection()
    
    return NextResponse.json({
      success: result,
      testType: 'session-info',
      data: {
        connected: result,
        timestamp: new Date().toISOString()
      },
      message: result ? 'Session Info obtido com sucesso' : 'Falha ao obter Session Info'
    })
    
  } catch (error) {
    console.error('❌ [BROWSERBASE-TEST] Erro no Session Info:', error)
    return NextResponse.json({
      success: false,
      testType: 'session-info',
      error: (error as Error).message
    }, { status: 500 })
  }
}

async function runFullTest() {
  try {
    console.log('🚀 [BROWSERBASE-TEST] Executando teste completo...')
    
    const results = {
      connection: false,
      sessionInfo: false
    }
    
    // Testar conexão
    try {
      results.connection = await testBrowserbaseConnection()
    } catch (error) {
      results.connection = false
    }
    
    // Testar session info
    try {
      const sessionTest = await testSessionInfo()
      const sessionData = await sessionTest.json()
      results.sessionInfo = sessionData.success
    } catch (error) {
      results.sessionInfo = false
    }
    
    const passedTests = Object.values(results).filter(Boolean).length
    const totalTests = Object.keys(results).length
    
    return NextResponse.json({
      success: passedTests > 0,
      testType: 'full-test',
      data: results,
      summary: {
        passed: passedTests,
        total: totalTests,
        successRate: `${((passedTests / totalTests) * 100).toFixed(1)}%`
      },
      message: `Teste completo executado: ${passedTests}/${totalTests} testes passaram`
    })
    
  } catch (error) {
    console.error('❌ [BROWSERBASE-TEST] Erro no teste completo:', error)
    return NextResponse.json({
      success: false,
      testType: 'full-test',
      error: (error as Error).message
    }, { status: 500 })
  }
}