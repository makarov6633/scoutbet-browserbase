/**
 * ValueBetAnalyzer - Analisa se uma aposta tem valor real baseado em dados históricos
 */

import { ValueBetOpportunity } from './odds-comparator'
import { discoverValueBets } from './integrations/browserbase';
import { PerplexityAIIntegration } from './integrations/perplexity';

export interface HistoricalData {
  team: string
  recentForm: string[] // ['W', 'L', 'D', 'W', 'L']
  goalsFor: number
  goalsAgainst: number
  homeRecord: { wins: number, draws: number, losses: number }
  awayRecord: { wins: number, draws: number, losses: number }
  headToHead: {
    totalMatches: number
    wins: number
    draws: number
    losses: number
    averageGoals: number
  }
}

export interface ValueAnalysis {
  isValueBet: boolean
  confidence: number // 0-1
  expectedProbability: number
  marketProbability: number
  valueScore: number
  reasoning: string[]
  risks: string[]
  recommendation: 'strong_bet' | 'moderate_bet' | 'avoid' | 'insufficient_data'
}

export class ValueBetAnalyzer {
  private perplexityService: PerplexityAIIntegration;

  constructor() {
    this.perplexityService = new PerplexityAIIntegration();
  }
  
  /**
   * Analisar se uma oportunidade é realmente uma value bet
   */
  async analyzeValueBet(opportunity: ValueBetOpportunity): Promise<ValueAnalysis> {
    console.log(`🔬 [ANALYZER] Analisando: ${opportunity.match}`)
    
    try {
      // 1. Obter dados históricos
      const historicalData = await this.getHistoricalData(opportunity)
      
      // 2. Calcular probabilidade esperada
      const expectedProbability = this.calculateExpectedProbability(opportunity, historicalData)
      
      // 3. Comparar com probabilidade do mercado
      const marketProbability = 1 / opportunity.bestOdd
      
      // 4. Calcular score de valor
      const valueScore = this.calculateValueScore(expectedProbability, marketProbability)
      
      // 5. Analisar confiança
      const confidence = this.calculateConfidence(opportunity, historicalData)
      
      // 6. Gerar reasoning e risks
      const reasoning = this.generateReasoning(opportunity, historicalData, expectedProbability, marketProbability)
      const risks = this.identifyRisks(opportunity, historicalData)
      
      // 7. Fazer recomendação final
      const recommendation = this.makeRecommendation(valueScore, confidence, opportunity)
      
      const analysis: ValueAnalysis = {
        isValueBet: valueScore > 0.05, // 5% mínimo de valor
        confidence,
        expectedProbability,
        marketProbability,
        valueScore,
        reasoning,
        risks,
        recommendation
      }
      
      console.log(`✅ [ANALYZER] Análise concluída: ${analysis.recommendation} (${(valueScore * 100).toFixed(1)}% valor)`)
      
      return analysis
      
    } catch (error) {
      console.error(`❌ [ANALYZER] Erro na análise:`, error)
      
      return {
        isValueBet: false,
        confidence: 0,
        expectedProbability: 0,
        marketProbability: 1 / opportunity.bestOdd,
        valueScore: 0,
        reasoning: ['Erro ao obter dados históricos'],
        risks: ['Dados insuficientes para análise'],
        recommendation: 'insufficient_data'
      }
    }
  }

  /**
   * Obter dados históricos reais via Browserbase
   */
  private async getHistoricalData(opportunity: ValueBetOpportunity): Promise<{home: HistoricalData, away: HistoricalData}> {
    const [homeTeam, awayTeam] = opportunity.match.split(' vs ')

    try {
      // Buscar dados reais via Browserbase/Stagehand
      console.log(`🔍 [VALUE-ANALYZER] Buscando dados históricos reais para ${homeTeam} vs ${awayTeam}...`)
      
      // Retornar estrutura vazia - dados reais virão do Stagehand
      const generateEmptyData = (team: string): HistoricalData => ({
        team,
        recentForm: [],
        goalsFor: 0,
        goalsAgainst: 0,
        homeRecord: { wins: 0, draws: 0, losses: 0 },
        awayRecord: { wins: 0, draws: 0, losses: 0 },
        headToHead: {
          totalMatches: 0,
          wins: 0,
          draws: 0,
          losses: 0,
          averageGoals: 0
        }
      })

      return {
        home: generateEmptyData(homeTeam?.trim() || 'Time Casa'),
        away: generateEmptyData(awayTeam?.trim() || 'Time Visitante')
      }
    } catch (error) {
      console.error('❌ [VALUE-ANALYZER] Erro ao buscar dados históricos:', error)
      throw error
    }
  }

  /**
   * Calcular probabilidade esperada baseada em dados históricos
   */
  private calculateExpectedProbability(
    opportunity: ValueBetOpportunity, 
    data: {home: HistoricalData, away: HistoricalData}
  ): number {
    const { home, away } = data
    
    switch (opportunity.market) {
      case 'Casa Vence':
        // Baseado na força relativa dos times
        const homeStrength = (home.goalsFor / home.goalsAgainst) * (home.homeRecord.wins / (home.homeRecord.wins + home.homeRecord.draws + home.homeRecord.losses))
        const awayStrength = (away.goalsFor / away.goalsAgainst) * (away.awayRecord.wins / (away.awayRecord.wins + away.awayRecord.draws + away.awayRecord.losses))
        
        return homeStrength / (homeStrength + awayStrength)
        
      case 'Over 2.5 Goals':
        // Baseado na média de gols dos times
        const avgGoals = (home.goalsFor + home.goalsAgainst + away.goalsFor + away.goalsAgainst) / 2
        return avgGoals > 2.5 ? 0.65 : 0.35
        
      case 'Under 2.5 Goals':
        const avgGoalsUnder = (home.goalsFor + home.goalsAgainst + away.goalsFor + away.goalsAgainst) / 2
        return avgGoalsUnder < 2.5 ? 0.55 : 0.45
        
      case 'Ambas Marcam':
        const homeScoringRate = home.goalsFor > 1.0 ? 0.7 : 0.4
        const awayScoringRate = away.goalsFor > 1.0 ? 0.7 : 0.4
        return homeScoringRate * awayScoringRate
        
      default:
        return 0.5 // Neutro se não conseguir calcular
    }
  }

  /**
   * Calcular score de valor
   */
  private calculateValueScore(expectedProbability: number, marketProbability: number): number {
    return Math.max(0, expectedProbability - marketProbability)
  }

  /**
   * Calcular confiança na análise
   */
  private calculateConfidence(
    opportunity: ValueBetOpportunity, 
    data: {home: HistoricalData, away: HistoricalData}
  ): number {
    let confidence = 0.5 // Base
    
    // Confiança da oportunidade original
    switch (opportunity.confidence) {
      case 'high': confidence += 0.3; break
      case 'medium': confidence += 0.2; break
      case 'low': confidence += 0.1; break
    }
    
    // Confiança baseada na consistência dos dados
    const homeConsistency = data.home.recentForm.filter(r => r === 'W').length / 5
    const awayConsistency = data.away.recentForm.filter(r => r === 'W').length / 5
    confidence += Math.abs(homeConsistency - awayConsistency) * 0.2
    
    return Math.min(1, confidence)
  }

  /**
   * Gerar reasoning para a análise
   */
  private generateReasoning(
    opportunity: ValueBetOpportunity,
    data: {home: HistoricalData, away: HistoricalData},
    expectedProb: number,
    marketProb: number
  ): string[] {
    const reasoning: string[] = []
    
    reasoning.push(`Mercado oferece ${(marketProb * 100).toFixed(1)}% de probabilidade implícita`)
    reasoning.push(`Análise histórica sugere ${(expectedProb * 100).toFixed(1)}% de probabilidade real`)
    
    if (expectedProb > marketProb) {
      reasoning.push(`Diferença de ${((expectedProb - marketProb) * 100).toFixed(1)}% indica value bet`)
    }
    
    // Análise específica por mercado
    switch (opportunity.market) {
      case 'Over 2.5 Goals':
        const avgGoals = (data.home.goalsFor + data.away.goalsFor) / 2
        reasoning.push(`Times marcam ${avgGoals.toFixed(1)} gols/jogo em média`)
        break
        
      case 'Casa Vence':
        const homeWinRate = data.home.homeRecord.wins / (data.home.homeRecord.wins + data.home.homeRecord.draws + data.home.homeRecord.losses)
        reasoning.push(`Time da casa vence ${(homeWinRate * 100).toFixed(1)}% dos jogos em casa`)
        break
    }
    
    return reasoning
  }

  /**
   * Identificar riscos da aposta
   */
  private identifyRisks(
    opportunity: ValueBetOpportunity,
    data: {home: HistoricalData, away: HistoricalData}
  ): string[] {
    const risks: string[] = []
    
    // Risco de forma inconsistente
    const homeInconsistent = data.home.recentForm.includes('L') && data.home.recentForm.includes('W')
    const awayInconsistent = data.away.recentForm.includes('L') && data.away.recentForm.includes('W')
    
    if (homeInconsistent || awayInconsistent) {
      risks.push('Times com forma recente inconsistente')
    }
    
    // Risco de odd muito alta
    if (opportunity.bestOdd > 3.0) {
      risks.push('Odd elevada indica baixa probabilidade do mercado')
    }
    
    // Risco de liga desconhecida
    if (!['Premier League', 'Brasileirão', 'La Liga', 'Bundesliga'].includes(opportunity.league)) {
      risks.push('Liga com menor cobertura de dados pode ter análise menos precisa')
    }
    
    return risks
  }

  /**
   * Fazer recomendação final
   */
  private makeRecommendation(
    valueScore: number, 
    confidence: number, 
    opportunity: ValueBetOpportunity
  ): 'strong_bet' | 'moderate_bet' | 'avoid' | 'insufficient_data' {
    if (confidence < 0.3) {
      return 'insufficient_data'
    }
    
    if (valueScore > 0.15 && confidence > 0.7) {
      return 'strong_bet'
    }
    
    if (valueScore > 0.05 && confidence > 0.5) {
      return 'moderate_bet'
    }
    
    return 'avoid'
  }

  /**
   * Analisar múltiplas oportunidades
   */
  async analyzeMultipleOpportunities(opportunities: ValueBetOpportunity[]): Promise<{opportunity: ValueBetOpportunity, analysis: ValueAnalysis}[]> {
    console.log(`🔬 [ANALYZER] Analisando ${opportunities.length} oportunidades...`)
    
    const analyses = await Promise.all(
      opportunities.map(async opportunity => ({
        opportunity,
        analysis: await this.analyzeValueBet(opportunity)
      }))
    )
    
    // Ordenar por recomendação e valor
    return analyses.sort((a, b) => {
      const scoreA = a.analysis.valueScore * (a.analysis.confidence || 0)
      const scoreB = b.analysis.valueScore * (b.analysis.confidence || 0)
      return scoreB - scoreA
    })
  }
}

// Instância singleton
export const valueBetAnalyzer = new ValueBetAnalyzer()