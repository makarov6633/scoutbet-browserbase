/**
 * Perplexity AI Integration - Sistema de IA avançado
 * Baseado na documentação oficial do Perplexity AI Sonar
 */

export interface PerplexityMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

export interface PerplexityRequest {
  model: 'sonar' | 'sonar-small' | 'mixtral-8x7b-instruct' | 'codellama-34b-instruct'
  messages: PerplexityMessage[]
  max_tokens?: number
  temperature?: number
  top_p?: number
  top_k?: number
  presence_penalty?: number
  frequency_penalty?: number
  return_citations?: boolean
  return_images?: boolean
  return_related_questions?: boolean
}

export interface PerplexityResponse {
  id: string
  model: string
  created: number
  object: string
  choices: Array<{
    index: number
    message: {
      role: string
      content: string
    }
    finish_reason: string
  }>
  usage: {
    prompt_tokens: number
    completion_tokens: number
    total_tokens: number
  }
}

export interface PerplexityError {
  error: {
    message: string
    type: string
    code: string
  }
}

export class PerplexityAIIntegration {
  private apiKey: string
  private baseUrl = 'https://api.perplexity.ai'
  private defaultModel = 'sonar'

  constructor() {
    this.apiKey = process.env.PERPLEXITY_API_KEY || ''
    if (!this.apiKey) {
      throw new Error('PERPLEXITY_API_KEY não configurada')
    }
  }

  /**
   * Chamar API da Perplexity
   */
  async callAPI(request: PerplexityRequest): Promise<PerplexityResponse> {
    try {
      console.log('🧠 [PERPLEXITY] Fazendo chamada para API...')

      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: request.model || this.defaultModel,
          messages: request.messages,
          max_tokens: request.max_tokens || 1000,
          temperature: request.temperature || 0.3,
          top_p: request.top_p || 0.9,
          top_k: request.top_k || 40,
          presence_penalty: request.presence_penalty || 0,
          frequency_penalty: request.frequency_penalty || 0,
          return_citations: request.return_citations || false,
          return_images: request.return_images || false,
          return_related_questions: request.return_related_questions || false
        }),
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error('❌ [PERPLEXITY] API error:', response.status, errorText)
        throw new Error(`Perplexity API error: ${response.status} - ${errorText}`)
      }

      const data: PerplexityResponse = await response.json()
      console.log('✅ [PERPLEXITY] Resposta recebida com sucesso')
      
      return data
    } catch (error) {
      console.error('❌ [PERPLEXITY] Erro na chamada:', error)
      throw error
    }
  }

  /**
   * Interpretar intenção do usuário
   */
  async interpretUserIntent(userMessage: string): Promise<{
    tipo_consulta: string
    query: string
    explicacao: string
    confidence: number
  }> {
    const prompt = `Você é um assistente especializado em classificar consultas de apostas esportivas. Analise a mensagem do usuário e retorne em JSON:

{
  "tipo_consulta": "odds_lookup|arbitrage_search|team_analysis|predictions|value_betting|statistical_analysis|xg_analysis|live_scores|tipster_analysis|general",
  "query": "query otimizada para busca",
  "explicacao": "breve explicação da classificação",
  "confidence": 0.95
}

Exemplo: "Quero odds do Flamengo vs Palmeiras"
Resposta: {"tipo_consulta": "odds_lookup", "query": "Flamengo vs Palmeiras odds", "explicacao": "Busca de odds para jogo específico", "confidence": 0.95}

Se não for possível identificar, retorne: {"tipo_consulta": "general", "query": "", "explicacao": "Consulta geral", "confidence": 0.5}`

    try {
      const response = await this.callAPI({
        model: 'sonar',
        messages: [
          { role: 'system', content: prompt },
          { role: 'user', content: userMessage }
        ],
        max_tokens: 200,
        temperature: 0.1
      })

      const content = response.choices[0]?.message?.content || ''
      const result = JSON.parse(content)

      return {
        tipo_consulta: result.tipo_consulta || 'general',
        query: result.query || userMessage,
        explicacao: result.explicacao || 'Consulta não classificada',
        confidence: result.confidence || 0.5
      }
    } catch (error) {
      console.error('❌ [PERPLEXITY] Erro na interpretação de intenção:', error)
      return {
        tipo_consulta: 'general',
        query: userMessage,
        explicacao: 'Erro na interpretação',
        confidence: 0.3
      }
    }
  }

  /**
   * Analisar confronto entre times
   */
  async getGameAnalysis(team1: string, team2: string): Promise<string> {
    const prompt = `Analise o confronto entre ${team1} e ${team2}. Considere:
- Histórico recente
- Força do elenco atual
- Lesões e desfalques
- Momento da temporada
- Motivação e objetivos

Forneça uma análise detalhada com probabilidades estimadas.`

    try {
      const response = await this.callAPI({
        model: 'sonar',
        messages: [
          { role: 'user', content: prompt }
        ],
        max_tokens: 1000,
        temperature: 0.3
      })

      return response.choices[0]?.message?.content || 'Não foi possível analisar o confronto.'
    } catch (error) {
      console.error('❌ [PERPLEXITY] Erro na análise do confronto:', error)
      throw error
    }
  }

  /**
   * Gerar resposta final com dados do Browserbase
   */
  async generateFinalResponse(
    userMessage: string, 
    browserbaseData: any, 
    context?: string
  ): Promise<string> {
    const systemPrompt = this.generateSystemPrompt(context)
    
    const userPrompt = `
Mensagem do usuário: ${userMessage}

Dados reais obtidos via Browserbase:
${JSON.stringify(browserbaseData, null, 2)}

Gere uma resposta completa e profissional baseada nos dados reais fornecidos.
`

    try {
      const response = await this.callAPI({
        model: 'sonar',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        max_tokens: 1500,
        temperature: 0.3
      })

      return response.choices[0]?.message?.content || 'Não foi possível gerar uma resposta.'
    } catch (error) {
      console.error('❌ [PERPLEXITY] Erro na geração da resposta:', error)
      return 'Desculpe, ocorreu um erro ao processar sua solicitação.'
    }
  }

  /**
   * Gerar prompt do sistema
   */
  private generateSystemPrompt(context?: string): string {
    return `
Você é o ScoutBet, o assistente de IA mais avançado para apostas esportivas no Brasil.

### IDENTIDADE E PERSONALIDADE
- Especialista confiável em apostas esportivas com conhecimento profundo
- Comunicação clara, direta e sempre baseada em dados
- Tom profissional mas acessível, adaptando-se ao nível do usuário
- Proativo em educar sobre gestão de risco e apostas responsáveis

### RESPONSABILIDADES PRINCIPAIS
1. **ANÁLISE DE DADOS**: Interpretar odds, estatísticas, tendências e padrões
2. **DETECÇÃO DE VALOR**: Identificar oportunidades com valor positivo esperado
3. **GESTÃO DE RISCO**: Orientar sobre bankroll management e stakes apropriados
4. **EDUCAÇÃO**: Explicar conceitos de forma didática e progressiva
5. **DISCLAIMER**: Sempre mencionar riscos e limitações das apostas

### DIRETRIZES FUNDAMENTAIS
- Sempre cite fontes de dados quando disponível
- Use probabilidades e estatísticas para embasar análises
- Seja transparente sobre limitações e incertezas
- Adapte linguagem técnica ao nível demonstrado pelo usuário
- Priorize apostas de valor sobre "dicas quentes"
- Enfatize gestão de banca e apostas responsáveis

### FORMATO DE RESPOSTA PADRÃO
Use sempre esta estrutura quando aplicável:
🎯 RESPOSTA DIRETA (máximo 2 linhas)
📊 ANÁLISE (dados e contexto relevantes)
💡 RECOMENDAÇÃO (ação sugerida baseada na análise)
⚠️ GESTÃO DE RISCO (stake sugerido e disclaimer)

### POLÍTICA DE DADOS
- APENAS DADOS REAIS obtidos via Browserbase
- NUNCA usar simulações ou dados inventados
- Se dados indisponíveis: comunicar claramente e sugerir alternativas
- Browserbase é o motor de busca, Perplexity AI apenas coordena e analisa

### CONTEXTO ESPECÍFICO
${context || 'Análise geral de apostas esportivas'}

### EXEMPLOS DE RESPOSTAS PROFISSIONAIS

Para arbitragem:
"🎯 Encontrei 3 oportunidades de arbitragem com lucro garantido entre 2-5%.

📊 Dados coletados de 8 casas de apostas em tempo real:
- Flamengo vs Palmeiras: 2.3% de lucro garantido
- Real Madrid vs Barcelona: 1.8% de lucro garantido
- Manchester City vs Liverpool: 4.2% de lucro garantido

💡 Recomendo aproveitar a oportunidade do Manchester City vs Liverpool com stake de R$ 100 em cada casa.

⚠️ GESTÃO DE RISCO: Stake máximo 2% do bankroll. Arbitragem é livre de risco mas requer execução rápida."

Para value betting:
"🎯 Identifiquei 2 value bets com valor esperado positivo.

📊 Análise baseada em dados históricos e odds atuais:
- Santos vs Corinthians: EV +8.5% (odds 2.15 vs probabilidade real 46%)
- Grêmio vs Internacional: EV +12.3% (odds 3.40 vs probabilidade real 29%)

💡 Recomendo apostar R$ 50 no Santos e R$ 30 no Grêmio.

⚠️ GESTÃO DE RISCO: Stakes baseados em 1-2% do bankroll. Value betting tem risco mas expectativa positiva a longo prazo."
`
  }

  /**
   * Analisar dados de arbitragem
   */
  async analyzeArbitrageData(data: any): Promise<string> {
    const prompt = `
Analise os seguintes dados de arbitragem e forneça insights profissionais:

${JSON.stringify(data, null, 2)}

Forneça:
1. Oportunidades identificadas
2. Percentuais de lucro
3. Recomendações de stake
4. Riscos e considerações
`

    try {
      const response = await this.callAPI({
        model: 'sonar',
        messages: [
          { role: 'system', content: this.generateSystemPrompt('Análise de arbitragem') },
          { role: 'user', content: prompt }
        ],
        max_tokens: 1000,
        temperature: 0.2
      })

      return response.choices[0]?.message?.content || 'Erro na análise de arbitragem.'
    } catch (error) {
      console.error('❌ [PERPLEXITY] Erro na análise de arbitragem:', error)
      return 'Erro ao analisar dados de arbitragem.'
    }
  }

  /**
   * Analisar dados de value betting
   */
  async analyzeValueBetData(data: any): Promise<string> {
    const prompt = `
Analise os seguintes dados de value betting e forneça insights profissionais:

${JSON.stringify(data, null, 2)}

Forneça:
1. Oportunidades de valor identificadas
2. Cálculos de expected value
3. Recomendações de stake
4. Análise de risco
`

    try {
      const response = await this.callAPI({
        model: 'sonar',
        messages: [
          { role: 'system', content: this.generateSystemPrompt('Análise de value betting') },
          { role: 'user', content: prompt }
        ],
        max_tokens: 1000,
        temperature: 0.2
      })

      return response.choices[0]?.message?.content || 'Erro na análise de value betting.'
    } catch (error) {
      console.error('❌ [PERPLEXITY] Erro na análise de value betting:', error)
      return 'Erro ao analisar dados de value betting.'
    }
  }

  /**
   * Analisar dados estatísticos
   */
  async analyzeStatisticalData(data: any): Promise<string> {
    const prompt = `
Analise os seguintes dados estatísticos e forneça insights profissionais:

${JSON.stringify(data, null, 2)}

Forneça:
1. Tendências identificadas
2. Insights estatísticos
3. Recomendações de apostas
4. Limitações dos dados
`

    try {
      const response = await this.callAPI({
        model: 'sonar',
        messages: [
          { role: 'system', content: this.generateSystemPrompt('Análise estatística') },
          { role: 'user', content: prompt }
        ],
        max_tokens: 1000,
        temperature: 0.2
      })

      return response.choices[0]?.message?.content || 'Erro na análise estatística.'
    } catch (error) {
      console.error('❌ [PERPLEXITY] Erro na análise estatística:', error)
      return 'Erro ao analisar dados estatísticos.'
    }
  }

  /**
   * Analisar dados de xG
   */
  async analyzeXGData(data: any): Promise<string> {
    const prompt = `
Analise os seguintes dados de Expected Goals (xG) e forneça insights profissionais:

${JSON.stringify(data, null, 2)}

Forneça:
1. Análise de xG vs gols reais
2. Oportunidades de over/under
3. Insights de performance
4. Recomendações de apostas
`

    try {
      const response = await this.callAPI({
        model: 'sonar',
        messages: [
          { role: 'system', content: this.generateSystemPrompt('Análise de xG') },
          { role: 'user', content: prompt }
        ],
        max_tokens: 1000,
        temperature: 0.2
      })

      return response.choices[0]?.message?.content || 'Erro na análise de xG.'
    } catch (error) {
      console.error('❌ [PERPLEXITY] Erro na análise de xG:', error)
      return 'Erro ao analisar dados de xG.'
    }
  }

  /**
   * Gerar relatório executivo
   */
  async generateExecutiveReport(data: any): Promise<string> {
    const prompt = `
Gere um relatório executivo profissional baseado nos seguintes dados:

${JSON.stringify(data, null, 2)}

O relatório deve incluir:
1. Resumo executivo
2. Principais descobertas
3. Oportunidades identificadas
4. Recomendações estratégicas
5. Análise de risco
6. Próximos passos
`

    try {
      const response = await this.callAPI({
        model: 'sonar',
        messages: [
          { role: 'system', content: this.generateSystemPrompt('Relatório executivo') },
          { role: 'user', content: prompt }
        ],
        max_tokens: 1500,
        temperature: 0.3
      })

      return response.choices[0]?.message?.content || 'Erro na geração do relatório.'
    } catch (error) {
      console.error('❌ [PERPLEXITY] Erro na geração do relatório:', error)
      return 'Erro ao gerar relatório executivo.'
    }
  }

  /**
   * Testar conexão com Perplexity
   */
  async testConnection(): Promise<boolean> {
    try {
      const response = await this.callAPI({
        model: 'sonar-small',
        messages: [
          { role: 'user', content: 'Teste de conexão' }
        ],
        max_tokens: 10
      })

      return response.choices.length > 0
    } catch (error) {
      console.error('❌ [PERPLEXITY] Erro no teste de conexão:', error)
      return false
    }
  }

  /**
   * Obter estatísticas de uso
   */
  async getUsageStats(): Promise<{
    totalTokens: number
    promptTokens: number
    completionTokens: number
    requests: number
  }> {
    // Em uma implementação real, você manteria essas estatísticas
    return {
      totalTokens: 0,
      promptTokens: 0,
      completionTokens: 0,
      requests: 0
    }
  }
}

// Instância singleton
export const perplexityAI = new PerplexityAIIntegration()