import { NextRequest, NextResponse } from 'next/server'
import { PRDService } from '@/lib/prd-service'
import { perplexityAI } from '@/lib/perplexity-integration'
import { discoverValueBets, ValueBetResult } from '@/lib/integrations/browserbase'
import { sportsDataSources } from '@/lib/sports-data-sources'
import { directorAI } from '@/lib/director-ai-integration'

// Configuração de headers para UTF-8
const headers = {
  'Content-Type': 'application/json; charset=utf-8',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}

export async function POST(request: NextRequest) {
  try {
    console.log('🚀 [CHAT API] Iniciando processamento com sistema integrado...')
    
    const { message } = await request.json()
    if (!message) {
      return NextResponse.json({ error: 'Mensagem é obrigatória' }, { 
        status: 400,
        headers
      })
    }
    
    console.log('📝 [CHAT API] Mensagem recebida:', message)
    
    if (!process.env.PERPLEXITY_API_KEY) {
      return NextResponse.json({ error: 'Chave da Perplexity não configurada' }, { 
        status: 500,
        headers
      })
    }

    // 1. Interpretação de intenção com Perplexity AI
    console.log('🧠 [CHAT API] Interpretando intenção com Perplexity AI...')
    
    let intentionResult
    try {
      intentionResult = await perplexityAI.interpretUserIntent(message)
      console.log('✅ [CHAT API] Intenção interpretada:', intentionResult)
    } catch (error) {
      console.error('❌ [CHAT API] Erro na interpretação:', error)
      return NextResponse.json({
        error: 'Erro ao interpretar a intenção da consulta.',
        details: error instanceof Error ? error.message : 'Erro desconhecido'
      }, { 
        status: 500,
        headers
      })
    }
    
    const tipoConsulta = intentionResult.tipo_consulta
    const query = intentionResult.query
    const confidence = intentionResult.confidence
    
    console.log('🔍 [CHAT API] Tipo de consulta:', tipoConsulta)
    console.log('🔍 [CHAT API] Query:', query)
    console.log('🔍 [CHAT API] Confiança:', confidence)

    // 2. Selecionar fontes de dados apropriadas
    console.log('📊 [CHAT API] Selecionando fontes de dados...')
    
    let dataSources
    try {
      dataSources = sportsDataSources.getRecommendedSources(tipoConsulta)
      console.log(`✅ [CHAT API] Selecionadas ${dataSources.length} fontes de dados`)
    } catch (error) {
      console.error('❌ [CHAT API] Erro ao selecionar fontes:', error)
      dataSources = sportsDataSources.getComprehensiveAnalysisSources()
    }

    // 3. Busca real obrigatória no Browserbase
    console.log('🌐 [CHAT API] Iniciando busca no Browserbase...')
    
    let dadosReais: ValueBetResult
    try {
      const startTime = Date.now()
      dadosReais = await discoverValueBets(query)
      const executionTime = Date.now() - startTime
      
      dadosReais.executionTime = executionTime
      dadosReais.dataSources = dataSources
      
      console.log(`✅ [CHAT API] Dados reais obtidos via Browserbase (${executionTime}ms)`)
    } catch (err) {
      console.error('❌ [CHAT API] Erro ao obter dados reais:', err)
      return NextResponse.json({ error: 'Falha ao obter dados reais. Tente novamente mais tarde.' }, { 
        status: 502,
        headers
      })
    }

    // 4. Criar workflow do Director.ai se necessário
    let directorWorkflow
    if (tipoConsulta === 'arbitrage_search' || tipoConsulta === 'value_betting') {
      try {
        console.log('🎬 [CHAT API] Criando workflow do Director.ai...')
        
        if (tipoConsulta === 'arbitrage_search') {
          directorWorkflow = await directorAI.createArbitrageWorkflow()
        } else {
          directorWorkflow = await directorAI.createValueBetWorkflow()
        }
        
        console.log('✅ [CHAT API] Workflow do Director.ai criado:', directorWorkflow.name)
      } catch (error) {
        console.error('❌ [CHAT API] Erro ao criar workflow do Director.ai:', error)
        // Continuar sem Director.ai
      }
    }

    // 5. Análise específica baseada no tipo de consulta
    let analysisResult
    try {
      switch (tipoConsulta) {
        case 'arbitrage_search':
          analysisResult = await perplexityAI.analyzeArbitrageData(dadosReais)
          break
        case 'value_betting':
          analysisResult = await perplexityAI.analyzeValueBetData(dadosReais)
          break
        case 'statistical_analysis':
          analysisResult = await perplexityAI.analyzeStatisticalData(dadosReais)
          break
        case 'xg_analysis':
          analysisResult = await perplexityAI.analyzeXGData(dadosReais)
          break
        default:
          analysisResult = await perplexityAI.generateFinalResponse(message, dadosReais)
      }
      
      console.log('✅ [CHAT API] Análise específica concluída')
    } catch (error) {
      console.error('❌ [CHAT API] Erro na análise específica:', error)
      analysisResult = await perplexityAI.generateFinalResponse(message, dadosReais)
    }

    // 6. Gerar resposta final
    console.log('🤖 [CHAT API] Gerando resposta final...')
    
    let finalResponse
    try {
      finalResponse = await perplexityAI.generateFinalResponse(message, {
        ...dadosReais,
        analysis: analysisResult,
        directorWorkflow: directorWorkflow ? {
          id: directorWorkflow.id,
          name: directorWorkflow.name,
          status: directorWorkflow.status
        } : null
      })
      
      console.log('✅ [CHAT API] Resposta final gerada com sucesso')
    } catch (error) {
      console.error('❌ [CHAT API] Erro na geração da resposta final:', error)
      return NextResponse.json({ 
        error: 'Erro ao gerar resposta.',
        details: error instanceof Error ? error.message : 'Erro desconhecido'
      }, { 
        status: 500,
        headers
      })
    }
    
    const resposta = finalResponse || "Não foi possível gerar uma resposta."
    
    // 7. Executar workflow do Director.ai se disponível
    let directorResult
    if (directorWorkflow) {
      try {
        console.log('🎬 [CHAT API] Executando workflow do Director.ai...')
        directorResult = await directorAI.executeWorkflow(directorWorkflow.id, {
          query,
          dataSources: dataSources.map((ds: { name: string }) => ds.name)
        })
        console.log('✅ [CHAT API] Workflow do Director.ai executado')
      } catch (error) {
        console.error('❌ [CHAT API] Erro ao executar workflow do Director.ai:', error)
        // Continuar sem resultado do Director.ai
      }
    }
    
    return NextResponse.json({ 
      result: resposta, 
      dadosReais, 
      tipoConsulta, 
      query,
      confidence,
      dataSources: dataSources.map((ds: { name: string, category: string, reliability: number }) => ({
        name: ds.name,
        category: ds.category,
        reliability: ds.reliability
      })),
      directorWorkflow: directorWorkflow ? {
        id: directorWorkflow.id,
        name: directorWorkflow.name,
        status: directorWorkflow.status,
        result: directorResult
      } : null,
      model: 'perplexity-sonar',
      timestamp: new Date().toISOString()
    }, {
      headers
    })
    
  } catch (error) {
    console.error('❌ [CHAT API] Erro interno:', error)
    return NextResponse.json({ 
      error: 'Erro interno do servidor',
      details: error instanceof Error ? error.message : 'Erro desconhecido'
    }, { 
      status: 500,
      headers
    })
  }
}

export async function OPTIONS(request: NextRequest) {
  return NextResponse.json({}, { headers })
}

