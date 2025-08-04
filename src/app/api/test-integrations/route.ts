import { NextRequest, NextResponse } from 'next/server'
import { perplexityAI } from '@/lib/perplexity-integration'
import { discoverValueBets } from '@/lib/integrations/browserbase'
import { sportsDataSources } from '@/lib/sports-data-sources'
import { directorAI } from '@/lib/director-ai-integration'

export async function POST(request: NextRequest) {
  try {
    console.log('🧪 [TEST API] Iniciando testes de integração...')
    
    const { testType } = await request.json()
    const results: any = {}
    
    // Teste Perplexity AI
    if (!testType || testType === 'perplexity') {
      console.log('🧠 [TEST API] Testando Perplexity AI...')
      try {
        const testResult = await perplexityAI.testConnection()
        results.perplexity = {
          success: testResult,
          message: testResult ? 'Conexão Perplexity AI OK' : 'Falha na conexão Perplexity AI'
        }
      } catch (error) {
        results.perplexity = {
          success: false,
          message: `Erro Perplexity AI: ${error instanceof Error ? error.message : 'Erro desconhecido'}`
        }
      }
    }
    
    // Teste Browserbase
    if (!testType || testType === 'browserbase') {
      console.log('🌐 [TEST API] Testando Browserbase...')
      try {
        const testResult = await discoverValueBets('test')
        results.browserbase = {
          success: testResult.success,
          message: testResult.success ? 'Browserbase funcionando' : 'Falha no Browserbase',
          opportunities: testResult.opportunities?.length || 0,
          executionTime: testResult.executionTime
        }
      } catch (error) {
        results.browserbase = {
          success: false,
          message: `Erro Browserbase: ${error instanceof Error ? error.message : 'Erro desconhecido'}`
        }
      }
    }
    
    // Teste Sports Data Sources
    if (!testType || testType === 'sports-data') {
      console.log('📊 [TEST API] Testando Sports Data Sources...')
      try {
        const stats = sportsDataSources.getSourcesStats()
        const arbitrageSources = sportsDataSources.getArbitrageSources()
        const valueBetSources = sportsDataSources.getValueBetSources()
        
        results.sportsData = {
          success: true,
          message: 'Sports Data Sources funcionando',
          stats,
          arbitrageSources: arbitrageSources.length,
          valueBetSources: valueBetSources.length
        }
      } catch (error) {
        results.sportsData = {
          success: false,
          message: `Erro Sports Data Sources: ${error instanceof Error ? error.message : 'Erro desconhecido'}`
        }
      }
    }
    
    // Teste Director.ai
    if (!testType || testType === 'director') {
      console.log('🎬 [TEST API] Testando Director.ai...')
      try {
        await directorAI.initialize()
        const workflow = await directorAI.createArbitrageWorkflow()
        const workflowStats = directorAI.getWorkflowStats()
        
        results.director = {
          success: true,
          message: 'Director.ai funcionando',
          workflowCreated: workflow.name,
          workflowStats
        }
      } catch (error) {
        results.director = {
          success: false,
          message: `Erro Director.ai: ${error instanceof Error ? error.message : 'Erro desconhecido'}`
        }
      }
    }
    
    // Teste completo do sistema
    if (!testType || testType === 'full') {
      console.log('🔄 [TEST API] Teste completo do sistema...')
      try {
        // Testar interpretação de intenção
        const intentionResult = await perplexityAI.interpretUserIntent('Quero odds do Flamengo vs Palmeiras')
        
        // Testar seleção de fontes
        const dataSources = sportsDataSources.getRecommendedSources('odds_lookup')
        
        // Testar busca de dados
        const browserbaseResult = await discoverValueBets('Flamengo vs Palmeiras')
        
        // Testar criação de workflow
        await directorAI.initialize()
        const workflow = await directorAI.createValueBetWorkflow()
        
        results.fullSystem = {
          success: true,
          message: 'Sistema completo funcionando',
          intentionResult,
          dataSourcesCount: dataSources.length,
          browserbaseSuccess: browserbaseResult.success,
          workflowCreated: workflow.name
        }
      } catch (error) {
        results.fullSystem = {
          success: false,
          message: `Erro sistema completo: ${error instanceof Error ? error.message : 'Erro desconhecido'}`
        }
      }
    }
    
    // Calcular status geral
    const allTests = Object.values(results)
    const successfulTests = allTests.filter((test: any) => test.success).length
    const totalTests = allTests.length
    const overallSuccess = totalTests > 0 ? (successfulTests / totalTests) * 100 : 0
    
    return NextResponse.json({
      success: overallSuccess >= 80,
      overallSuccess: `${overallSuccess.toFixed(1)}%`,
      tests: results,
      summary: {
        totalTests,
        successfulTests,
        failedTests: totalTests - successfulTests
      },
      timestamp: new Date().toISOString()
    })
    
  } catch (error) {
    console.error('❌ [TEST API] Erro nos testes:', error)
    return NextResponse.json({
      success: false,
      error: 'Erro interno nos testes',
      details: error instanceof Error ? error.message : 'Erro desconhecido'
    }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    console.log('📋 [TEST API] Obtendo informações do sistema...')
    
    const systemInfo = {
      environment: process.env.NODE_ENV || 'development',
      timestamp: new Date().toISOString(),
      services: {
        perplexity: !!process.env.PERPLEXITY_API_KEY,
        browserbase: !!process.env.BROWSERBASE_API_KEY,
        browserbaseProject: !!process.env.BROWSERBASE_PROJECT_ID
      },
      sportsDataSources: {
        total: sportsDataSources.getAllSources().length,
        categories: sportsDataSources.getSourcesStats().byCategory,
        regions: sportsDataSources.getSourcesStats().byRegion
      }
    }
    
    return NextResponse.json(systemInfo)
    
  } catch (error) {
    console.error('❌ [TEST API] Erro ao obter informações:', error)
    return NextResponse.json({
      error: 'Erro ao obter informações do sistema',
      details: error instanceof Error ? error.message : 'Erro desconhecido'
    }, { status: 500 })
  }
}