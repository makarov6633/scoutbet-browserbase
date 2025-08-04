/**
 * OddsComparatorService - Engine para descobrir value bets através de comparadores
 * Substitui busca direta em casas por agregadores inteligentes
 */

export interface ValueBetOpportunity {
  match: string
  league: string
  country: string
  market: string
  bestOdd: number
  averageOdd: number
  valuePercent: number
  bookmaker: string
  probability: number
  confidence: 'high' | 'medium' | 'low'
  matchTime: string
  directLink?: string
}

export interface ComparatorSite {
  name: string
  url: string
  region: string
  strategy: 'global' | 'brazilian' | 'european'
  reliability: number
}

export class OddsComparatorService {
  /**
   * Compara odds entre diferentes oportunidades de apostas
   */
  compare(opportunities: ValueBetOpportunity[]) {
    return opportunities.map(opportunity => ({
      ...opportunity,
      valueScore: this.calculateValueScore(opportunity)
    })).sort((a, b) => b.valueScore - a.valueScore)
  }

  private calculateValueScore(opportunity: ValueBetOpportunity): number {
    const valueWeight = 0.4
    const confidenceWeight = 0.3
    const reliabilityWeight = 0.3

    const valueScore = opportunity.valuePercent / 100
    const confidenceScore = opportunity.confidence === 'high' ? 1 : 
                           opportunity.confidence === 'medium' ? 0.6 : 0.3
    const reliabilityScore = this.getBookmakerReliability(opportunity.bookmaker)

    return (valueScore * valueWeight) + 
           (confidenceScore * confidenceWeight) + 
           (reliabilityScore * reliabilityWeight)
  }

  private getBookmakerReliability(bookmaker: string): number {
    const reliabilityMap: {[key: string]: number} = {
      'bet365': 0.95,
      'betfair': 0.93,
      'williamhill': 0.92,
      'pinnacle': 0.94,
      'default': 0.85
    }
    return reliabilityMap[bookmaker.toLowerCase()] || reliabilityMap.default
  }

  private comparatorSites: ComparatorSite[] = [
    {
      name: 'Oddspedia',
      url: 'https://oddspedia.com/br/odds',
      region: 'global',
      strategy: 'global',
      reliability: 0.95
    },
    {
      name: 'OddsScanner',
      url: 'https://oddsscanner.com/br/futebol',
      region: 'brazilian',
      strategy: 'brazilian',
      reliability: 0.90
    },
    {
      name: 'OddsChecker',
      url: 'https://www.oddschecker.com/br/',
      region: 'global',
      strategy: 'european',
      reliability: 0.88
    },
    {
      name: 'OddsAgora',
      url: 'https://www.oddsagora.com.br/',
      region: 'brazilian',
      strategy: 'brazilian',
      reliability: 0.85
    },
    {
      name: 'SportyTrader',
      url: 'https://www.sportytrader.com/pt-br/odds/',
      region: 'global',
      strategy: 'global',
      reliability: 0.87
    }
  ]

  /**
   * Descobrir value bets através de comparadores
   */
  async discoverValueBets(query?: string): Promise<ValueBetOpportunity[]> {
    console.log('🔍 [COMPARATOR] Iniciando descoberta de value bets...')
    
    const opportunities: ValueBetOpportunity[] = []
    
    // Estratégia multi-site paralela
    const searchPromises = this.comparatorSites.map(site => 
      this.searchSite(site, query).catch(error => {
        console.warn(`⚠️ [COMPARATOR] Falha em ${site.name}:`, error.message)
        return []
      })
    )
    
    const results = await Promise.all(searchPromises)
    
    // Consolidar todas as oportunidades
    results.forEach(siteOpportunities => {
      opportunities.push(...siteOpportunities)
    })
    
    // Filtrar e ranquear por valor
    const valueBets = this.filterAndRankOpportunities(opportunities)
    
    console.log(`✅ [COMPARATOR] Descobertas ${valueBets.length} oportunidades de valor`)
    
    return valueBets
  }

  /**
   * Buscar oportunidades em um site específico
   */
  private async searchSite(site: ComparatorSite, query?: string): Promise<ValueBetOpportunity[]> {
    console.log(`🌐 [COMPARATOR] Buscando em ${site.name}...`)
    
    try {
      // Simular busca específica por estratégia
      switch (site.strategy) {
        case 'global':
          return await this.searchGlobalStrategy(site, query)
        case 'brazilian':
          return await this.searchBrazilianStrategy(site, query)
        case 'european':
          return await this.searchEuropeanStrategy(site, query)
        default:
          return []
      }
    } catch (error) {
      console.error(`❌ [COMPARATOR] Erro em ${site.name}:`, error)
      return []
    }
  }

  /**
   * Estratégia de busca global
   */
  private async searchGlobalStrategy(site: ComparatorSite, query?: string): Promise<ValueBetOpportunity[]> {
    // Buscar dados reais - sem dados fictícios
    console.log(`🔍 [ODDS COMPARATOR] Buscando dados reais em ${site.name}...`)
    
    // Retornar array vazio - dados reais virão do Stagehand
    return []
  }

  /**
   * Estratégia de busca brasileira
   */
  private async searchBrazilianStrategy(site: ComparatorSite, query?: string): Promise<ValueBetOpportunity[]> {
    // Buscar dados reais - sem dados fictícios
    console.log(`🔍 [ODDS COMPARATOR] Buscando dados reais brasileiros em ${site.name}...`)
    
    // Retornar array vazio - dados reais virão do Stagehand
    return []
  }

  /**
   * Estratégia de busca europeia
   */
  private async searchEuropeanStrategy(site: ComparatorSite, query?: string): Promise<ValueBetOpportunity[]> {
    // Buscar dados reais - sem dados fictícios
    console.log(`🔍 [ODDS COMPARATOR] Buscando dados reais europeus em ${site.name}...`)
    
    // Retornar array vazio - dados reais virão do Stagehand
    return []
  }

  /**
   * Filtrar e ranquear oportunidades por valor
   */
  private filterAndRankOpportunities(opportunities: ValueBetOpportunity[]): ValueBetOpportunity[] {
    return opportunities
      .filter(opp => opp.valuePercent >= 10) // Mínimo 10% de valor
      .sort((a, b) => {
        // Ordenar por: valor% > confiança > probabilidade
        if (a.valuePercent !== b.valuePercent) {
          return b.valuePercent - a.valuePercent
        }
        
        const confidenceScore = { high: 3, medium: 2, low: 1 }
        if (a.confidence !== b.confidence) {
          return confidenceScore[b.confidence] - confidenceScore[a.confidence]
        }
        
        return b.probability - a.probability
      })
      .slice(0, 10) // Top 10 oportunidades
  }

  /**
   * Ajustar confiança baseada na confiabilidade do site
   */
  private adjustConfidenceByReliability(
    confidence: 'high' | 'medium' | 'low', 
    reliability: number
  ): 'high' | 'medium' | 'low' {
    if (reliability >= 0.90) {
      return confidence
    } else if (reliability >= 0.85) {
      return confidence === 'high' ? 'medium' : confidence
    } else {
      return confidence === 'high' ? 'medium' : 'low'
    }
  }

  /**
   * Obter estatísticas do comparador
   */
  getStats(): {
    totalSites: number
    averageReliability: number
    strategiesUsed: string[]
  } {
    return {
      totalSites: this.comparatorSites.length,
      averageReliability: this.comparatorSites.reduce((sum, site) => sum + site.reliability, 0) / this.comparatorSites.length,
      strategiesUsed: [...new Set(this.comparatorSites.map(site => site.strategy))]
    }
  }
}

// Instância singleton
export const oddsComparator = new OddsComparatorService()