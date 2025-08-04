/**
 * Sports Data Sources - Sistema de fontes de dados esportivos
 * Baseado na lista completa de sites similares ao FootballPredictions.net
 */

export interface DataSource {
  name: string
  url: string
  category: DataSourceCategory
  region: 'global' | 'brazilian' | 'european' | 'american'
  reliability: number // 0-1
  features: DataSourceFeature[]
  apiEndpoint?: string
  requiresAuth?: boolean
  pricing: 'free' | 'freemium' | 'paid' | 'enterprise'
  lastUpdated: string
}

export type DataSourceCategory = 
  | 'predictions' 
  | 'arbitrage' 
  | 'statistics' 
  | 'xg_metrics' 
  | 'ai_ml' 
  | 'live_scores' 
  | 'odds_comparison' 
  | 'value_betting' 
  | 'tipsters' 
  | 'specific_stats'

export type DataSourceFeature = 
  | 'odds_comparison'
  | 'value_bet_finder'
  | 'arbitrage_detection'
  | 'live_scores'
  | 'xg_analysis'
  | 'ai_predictions'
  | 'statistics'
  | 'tipster_rankings'
  | 'corner_stats'
  | 'btts_analysis'
  | 'over_under'
  | 'clean_sheets'
  | 'injury_data'
  | 'goal_timing'
  | 'heat_maps'

export class SportsDataSources {
  private sources: DataSource[] = [
    // 📊 SITES DE PREVISÕES E ESTATÍSTICAS GERAIS
    {
      name: 'Forebet.com',
      url: 'https://forebet.com',
      category: 'predictions',
      region: 'global',
      reliability: 0.95,
      features: ['odds_comparison', 'value_bet_finder', 'statistics', 'btts_analysis', 'over_under'],
      pricing: 'free',
      lastUpdated: '2025-01-15'
    },
    {
      name: 'StatArea.com',
      url: 'https://statarea.com',
      category: 'predictions',
      region: 'global',
      reliability: 0.90,
      features: ['statistics', 'tipster_rankings', 'live_scores'],
      pricing: 'free',
      lastUpdated: '2025-01-15'
    },
    {
      name: 'SoccerSite.com',
      url: 'https://soccersite.com',
      category: 'predictions',
      region: 'global',
      reliability: 0.88,
      features: ['statistics', 'ai_predictions'],
      pricing: 'freemium',
      lastUpdated: '2025-01-15'
    },
    {
      name: 'StatsChecker.com',
      url: 'https://statschecker.com',
      category: 'statistics',
      region: 'global',
      reliability: 0.92,
      features: ['statistics', 'corner_stats', 'clean_sheets'],
      pricing: 'free',
      lastUpdated: '2025-01-15'
    },
    {
      name: 'ScoutingStats.ai',
      url: 'https://scoutingstats.ai',
      category: 'ai_ml',
      region: 'global',
      reliability: 0.94,
      features: ['ai_predictions', 'value_bet_finder', 'xg_analysis'],
      pricing: 'freemium',
      lastUpdated: '2025-01-15'
    },

    // 🔍 SITES DE ARBITRAGEM E COMPARAÇÃO DE ODDS
    {
      name: 'OddsJam.com',
      url: 'https://oddsjam.com',
      category: 'arbitrage',
      region: 'global',
      reliability: 0.96,
      features: ['odds_comparison', 'arbitrage_detection', 'value_bet_finder'],
      pricing: 'paid',
      lastUpdated: '2025-01-15'
    },
    {
      name: 'Oddspedia.com',
      url: 'https://oddspedia.com',
      category: 'arbitrage',
      region: 'global',
      reliability: 0.93,
      features: ['odds_comparison', 'arbitrage_detection', 'value_bet_finder'],
      pricing: 'freemium',
      lastUpdated: '2025-01-15'
    },
    {
      name: 'BetBurger.com',
      url: 'https://betburger.com',
      category: 'arbitrage',
      region: 'global',
      reliability: 0.95,
      features: ['arbitrage_detection', 'odds_comparison'],
      pricing: 'paid',
      lastUpdated: '2025-01-15'
    },
    {
      name: 'RebelBetting.com',
      url: 'https://rebelbetting.com',
      category: 'arbitrage',
      region: 'global',
      reliability: 0.94,
      features: ['arbitrage_detection', 'value_bet_finder'],
      pricing: 'paid',
      lastUpdated: '2025-01-15'
    },

    // 📈 SITES DE ANÁLISE ESTATÍSTICA E DADOS
    {
      name: 'Driblab.com',
      url: 'https://driblab.com',
      category: 'statistics',
      region: 'global',
      reliability: 0.97,
      features: ['statistics', 'xg_analysis', 'heat_maps'],
      pricing: 'enterprise',
      lastUpdated: '2025-01-15'
    },
    {
      name: 'Soccerment.com',
      url: 'https://soccerment.com',
      category: 'ai_ml',
      region: 'global',
      reliability: 0.95,
      features: ['ai_predictions', 'statistics', 'xg_analysis'],
      pricing: 'enterprise',
      lastUpdated: '2025-01-15'
    },
    {
      name: 'Hudl Statsbomb',
      url: 'https://statsbomb.com',
      category: 'statistics',
      region: 'global',
      reliability: 0.98,
      features: ['statistics', 'xg_analysis', 'heat_maps'],
      pricing: 'enterprise',
      lastUpdated: '2025-01-15'
    },
    {
      name: 'KoraStats.com',
      url: 'https://korastats.com',
      category: 'statistics',
      region: 'global',
      reliability: 0.92,
      features: ['statistics', 'live_scores'],
      pricing: 'freemium',
      lastUpdated: '2025-01-15'
    },

    // 📊 SITES DE xG (EXPECTED GOALS) E MÉTRICAS AVANÇADAS
    {
      name: 'Understat.com',
      url: 'https://understat.com',
      category: 'xg_metrics',
      region: 'global',
      reliability: 0.96,
      features: ['xg_analysis', 'statistics'],
      pricing: 'free',
      lastUpdated: '2025-01-15'
    },
    {
      name: 'xGScore.io',
      url: 'https://xgscore.io',
      category: 'xg_metrics',
      region: 'global',
      reliability: 0.94,
      features: ['xg_analysis', 'value_bet_finder'],
      pricing: 'freemium',
      lastUpdated: '2025-01-15'
    },
    {
      name: 'FootyStats.org',
      url: 'https://footystats.org',
      category: 'statistics',
      region: 'global',
      reliability: 0.93,
      features: ['statistics', 'xg_analysis', 'corner_stats'],
      pricing: 'freemium',
      lastUpdated: '2025-01-15'
    },
    {
      name: 'FootballxG.com',
      url: 'https://footballxg.com',
      category: 'xg_metrics',
      region: 'global',
      reliability: 0.91,
      features: ['xg_analysis', 'ai_predictions'],
      pricing: 'free',
      lastUpdated: '2025-01-15'
    },

    // 🤖 SITES COM IA E MACHINE LEARNING
    {
      name: 'NerdyTips.com',
      url: 'https://nerdytips.com',
      category: 'ai_ml',
      region: 'global',
      reliability: 0.89,
      features: ['ai_predictions', 'value_bet_finder'],
      pricing: 'free',
      lastUpdated: '2025-01-15'
    },
    {
      name: 'Kickoff.ai',
      url: 'https://kickoff.ai',
      category: 'ai_ml',
      region: 'global',
      reliability: 0.87,
      features: ['ai_predictions'],
      pricing: 'freemium',
      lastUpdated: '2025-01-15'
    },
    {
      name: 'SportsPrediction.ai',
      url: 'https://sportsprediction.ai',
      category: 'ai_ml',
      region: 'global',
      reliability: 0.85,
      features: ['ai_predictions'],
      pricing: 'free',
      lastUpdated: '2025-01-15'
    },
    {
      name: 'DeepBetting.io',
      url: 'https://deepbetting.io',
      category: 'ai_ml',
      region: 'global',
      reliability: 0.90,
      features: ['ai_predictions', 'value_bet_finder'],
      pricing: 'paid',
      lastUpdated: '2025-01-15'
    },

    // 🎯 SITES ESPECIALIZADOS EM TIPOS DE APOSTAS
    {
      name: 'Forebet.com/predictions-both-to-score',
      url: 'https://forebet.com/predictions-both-to-score',
      category: 'predictions',
      region: 'global',
      reliability: 0.95,
      features: ['btts_analysis', 'statistics'],
      pricing: 'free',
      lastUpdated: '2025-01-15'
    },
    {
      name: 'OneMillionPredictions.com',
      url: 'https://onemillionpredictions.com',
      category: 'predictions',
      region: 'global',
      reliability: 0.88,
      features: ['btts_analysis', 'over_under'],
      pricing: 'free',
      lastUpdated: '2025-01-15'
    },
    {
      name: 'TotalCorner.com',
      url: 'https://totalcorner.com',
      category: 'statistics',
      region: 'global',
      reliability: 0.91,
      features: ['corner_stats', 'over_under'],
      pricing: 'free',
      lastUpdated: '2025-01-15'
    },
    {
      name: 'FootyStats.org/stats/corner-stats',
      url: 'https://footystats.org/stats/corner-stats',
      category: 'statistics',
      region: 'global',
      reliability: 0.93,
      features: ['corner_stats', 'statistics'],
      pricing: 'freemium',
      lastUpdated: '2025-01-15'
    },

    // 🔴 SITES DE RESULTADOS AO VIVO
    {
      name: 'LiveScore.com',
      url: 'https://livescore.com',
      category: 'live_scores',
      region: 'global',
      reliability: 0.98,
      features: ['live_scores'],
      pricing: 'free',
      lastUpdated: '2025-01-15'
    },
    {
      name: 'FlashScore.com',
      url: 'https://flashscore.com',
      category: 'live_scores',
      region: 'global',
      reliability: 0.97,
      features: ['live_scores', 'statistics'],
      pricing: 'free',
      lastUpdated: '2025-01-15'
    },
    {
      name: 'SofaScore.com',
      url: 'https://sofascore.com',
      category: 'live_scores',
      region: 'global',
      reliability: 0.96,
      features: ['live_scores', 'statistics'],
      pricing: 'free',
      lastUpdated: '2025-01-15'
    },

    // 🎲 SITES DE TIPSTERS E RANKINGS
    {
      name: 'SoccerTipsters.com',
      url: 'https://soccertipsters.com',
      category: 'tipsters',
      region: 'global',
      reliability: 0.85,
      features: ['tipster_rankings'],
      pricing: 'freemium',
      lastUpdated: '2025-01-15'
    },
    {
      name: 'Oddspedia.com/tips/tipsters-ranking',
      url: 'https://oddspedia.com/tips/tipsters-ranking',
      category: 'tipsters',
      region: 'global',
      reliability: 0.90,
      features: ['tipster_rankings', 'odds_comparison'],
      pricing: 'freemium',
      lastUpdated: '2025-01-15'
    },

    // 📊 SITES DE ESTATÍSTICAS ESPECÍFICAS
    {
      name: 'ScoreRoom.com/stats-clean-sheets',
      url: 'https://scoreroom.com/stats-clean-sheets',
      category: 'specific_stats',
      region: 'global',
      reliability: 0.89,
      features: ['clean_sheets', 'statistics'],
      pricing: 'free',
      lastUpdated: '2025-01-15'
    },
    {
      name: 'TheStatsDontLie.com/average-1st-goal-time',
      url: 'https://thestatsdontlie.com/average-1st-goal-time',
      category: 'specific_stats',
      region: 'global',
      reliability: 0.87,
      features: ['goal_timing', 'statistics'],
      pricing: 'free',
      lastUpdated: '2025-01-15'
    },

    // 🚨 SITES DE ALERTAS E MONITORAMENTO EM TEMPO REAL
    {
      name: 'OddAlerts.com',
      url: 'https://oddalerts.com',
      category: 'value_betting',
      region: 'global',
      reliability: 0.92,
      features: ['value_bet_finder', 'live_scores'],
      pricing: 'paid',
      lastUpdated: '2025-01-15'
    },
    {
      name: 'Sharp.app',
      url: 'https://sharp.app',
      category: 'arbitrage',
      region: 'global',
      reliability: 0.95,
      features: ['arbitrage_detection', 'odds_comparison'],
      pricing: 'paid',
      lastUpdated: '2025-01-15'
    },
    {
      name: 'OpticOdds.com',
      url: 'https://opticodds.com',
      category: 'odds_comparison',
      region: 'global',
      reliability: 0.96,
      features: ['odds_comparison', 'live_scores'],
      pricing: 'enterprise',
      lastUpdated: '2025-01-15'
    }
  ]

  /**
   * Obter todas as fontes de dados
   */
  getAllSources(): DataSource[] {
    return this.sources
  }

  /**
   * Filtrar fontes por categoria
   */
  getSourcesByCategory(category: DataSourceCategory): DataSource[] {
    return this.sources.filter(source => source.category === category)
  }

  /**
   * Filtrar fontes por confiabilidade mínima
   */
  getSourcesByReliability(minReliability: number): DataSource[] {
    return this.sources.filter(source => source.reliability >= minReliability)
  }

  /**
   * Obter fontes por recursos específicos
   */
  getSourcesByFeatures(features: DataSourceFeature[]): DataSource[] {
    return this.sources.filter(source => 
      features.some(feature => source.features.includes(feature))
    )
  }

  /**
   * Obter fontes gratuitas
   */
  getFreeSources(): DataSource[] {
    return this.sources.filter(source => source.pricing === 'free')
  }

  /**
   * Obter fontes por região
   */
  getSourcesByRegion(region: DataSource['region']): DataSource[] {
    return this.sources.filter(source => source.region === region)
  }

  /**
   * Obter fontes para arbitragem
   */
  getArbitrageSources(): DataSource[] {
    return this.sources.filter(source => 
      source.category === 'arbitrage' || 
      source.features.includes('arbitrage_detection')
    )
  }

  /**
   * Obter fontes para value betting
   */
  getValueBetSources(): DataSource[] {
    return this.sources.filter(source => 
      source.features.includes('value_bet_finder')
    )
  }

  /**
   * Obter fontes para análise xG
   */
  getXGSources(): DataSource[] {
    return this.sources.filter(source => 
      source.category === 'xg_metrics' || 
      source.features.includes('xg_analysis')
    )
  }

  /**
   * Obter fontes para IA/ML
   */
  getAIMLSources(): DataSource[] {
    return this.sources.filter(source => 
      source.category === 'ai_ml' || 
      source.features.includes('ai_predictions')
    )
  }

  /**
   * Obter fontes para estatísticas
   */
  getStatisticsSources(): DataSource[] {
    return this.sources.filter(source => 
      source.category === 'statistics' || 
      source.features.includes('statistics')
    )
  }

  /**
   * Obter fontes para resultados ao vivo
   */
  getLiveScoreSources(): DataSource[] {
    return this.sources.filter(source => 
      source.category === 'live_scores' || 
      source.features.includes('live_scores')
    )
  }

  /**
   * Obter fontes para comparação de odds
   */
  getOddsComparisonSources(): DataSource[] {
    return this.sources.filter(source => 
      source.category === 'odds_comparison' || 
      source.features.includes('odds_comparison')
    )
  }

  /**
   * Obter fontes para BTTS
   */
  getBTTSSources(): DataSource[] {
    return this.sources.filter(source => 
      source.features.includes('btts_analysis')
    )
  }

  /**
   * Obter fontes para corners
   */
  getCornerSources(): DataSource[] {
    return this.sources.filter(source => 
      source.features.includes('corner_stats')
    )
  }

  /**
   * Obter fontes para clean sheets
   */
  getCleanSheetSources(): DataSource[] {
    return this.sources.filter(source => 
      source.features.includes('clean_sheets')
    )
  }

  /**
   * Obter fontes para timing de gols
   */
  getGoalTimingSources(): DataSource[] {
    return this.sources.filter(source => 
      source.features.includes('goal_timing')
    )
  }

  /**
   * Obter fontes para heat maps
   */
  getHeatMapSources(): DataSource[] {
    return this.sources.filter(source => 
      source.features.includes('heat_maps')
    )
  }

  /**
   * Obter fontes para tipsters
   */
  getTipsterSources(): DataSource[] {
    return this.sources.filter(source => 
      source.category === 'tipsters' || 
      source.features.includes('tipster_rankings')
    )
  }

  /**
   * Obter fontes para estatísticas específicas
   */
  getSpecificStatsSources(): DataSource[] {
    return this.sources.filter(source => 
      source.category === 'specific_stats'
    )
  }

  /**
   * Obter fontes para lesões
   */
  getInjurySources(): DataSource[] {
    return this.sources.filter(source => 
      source.features.includes('injury_data')
    )
  }

  /**
   * Obter fontes para over/under
   */
  getOverUnderSources(): DataSource[] {
    return this.sources.filter(source => 
      source.features.includes('over_under')
    )
  }

  /**
   * Obter fontes por confiabilidade e categoria
   */
  getSourcesByReliabilityAndCategory(
    minReliability: number, 
    category: DataSourceCategory
  ): DataSource[] {
    return this.sources.filter(source => 
      source.reliability >= minReliability && 
      source.category === category
    )
  }

  /**
   * Obter fontes por confiabilidade e recursos
   */
  getSourcesByReliabilityAndFeatures(
    minReliability: number, 
    features: DataSourceFeature[]
  ): DataSource[] {
    return this.sources.filter(source => 
      source.reliability >= minReliability && 
      features.some(feature => source.features.includes(feature))
    )
  }

  /**
   * Obter fontes por preço e confiabilidade
   */
  getSourcesByPricingAndReliability(
    pricing: DataSource['pricing'], 
    minReliability: number
  ): DataSource[] {
    return this.sources.filter(source => 
      source.pricing === pricing && 
      source.reliability >= minReliability
    )
  }

  /**
   * Obter fontes por região e categoria
   */
  getSourcesByRegionAndCategory(
    region: DataSource['region'], 
    category: DataSourceCategory
  ): DataSource[] {
    return this.sources.filter(source => 
      source.region === region && 
      source.category === category
    )
  }

  /**
   * Obter fontes por região e recursos
   */
  getSourcesByRegionAndFeatures(
    region: DataSource['region'], 
    features: DataSourceFeature[]
  ): DataSource[] {
    return this.sources.filter(source => 
      source.region === region && 
      features.some(feature => source.features.includes(feature))
    )
  }

  /**
   * Obter fontes por região e confiabilidade
   */
  getSourcesByRegionAndReliability(
    region: DataSource['region'], 
    minReliability: number
  ): DataSource[] {
    return this.sources.filter(source => 
      source.region === region && 
      source.reliability >= minReliability
    )
  }

  /**
   * Obter fontes por categoria e recursos
   */
  getSourcesByCategoryAndFeatures(
    category: DataSourceCategory, 
    features: DataSourceFeature[]
  ): DataSource[] {
    return this.sources.filter(source => 
      source.category === category && 
      features.some(feature => source.features.includes(feature))
    )
  }

  /**
   * Obter fontes por categoria e confiabilidade
   */
  getSourcesByCategoryAndReliability(
    category: DataSourceCategory, 
    minReliability: number
  ): DataSource[] {
    return this.sources.filter(source => 
      source.category === category && 
      source.reliability >= minReliability
    )
  }

  /**
   * Obter fontes por recursos e confiabilidade
   */
  getSourcesByFeaturesAndReliability(
    features: DataSourceFeature[], 
    minReliability: number
  ): DataSource[] {
    return this.sources.filter(source => 
      features.some(feature => source.features.includes(feature)) && 
      source.reliability >= minReliability
    )
  }

  /**
   * Obter fontes por recursos e preço
   */
  getSourcesByFeaturesAndPricing(
    features: DataSourceFeature[], 
    pricing: DataSource['pricing']
  ): DataSource[] {
    return this.sources.filter(source => 
      features.some(feature => source.features.includes(feature)) && 
      source.pricing === pricing
    )
  }

  /**
   * Obter fontes por categoria e preço
   */
  getSourcesByCategoryAndPricing(
    category: DataSourceCategory, 
    pricing: DataSource['pricing']
  ): DataSource[] {
    return this.sources.filter(source => 
      source.category === category && 
      source.pricing === pricing
    )
  }

  /**
   * Obter fontes por região e preço
   */
  getSourcesByRegionAndPricing(
    region: DataSource['region'], 
    pricing: DataSource['pricing']
  ): DataSource[] {
    return this.sources.filter(source => 
      source.region === region && 
      source.pricing === pricing
    )
  }

  /**
   * Obter fontes por confiabilidade e preço
   */
  getSourcesByReliabilityAndPricing(
    minReliability: number, 
    pricing: DataSource['pricing']
  ): DataSource[] {
    return this.sources.filter(source => 
      source.reliability >= minReliability && 
      source.pricing === pricing
    )
  }

  /**
   * Obter fontes por múltiplos critérios
   */
  getSourcesByMultipleCriteria(criteria: {
    category?: DataSourceCategory
    region?: DataSource['region']
    features?: DataSourceFeature[]
    minReliability?: number
    pricing?: DataSource['pricing']
  }): DataSource[] {
    return this.sources.filter(source => {
      if (criteria.category && source.category !== criteria.category) return false
      if (criteria.region && source.region !== criteria.region) return false
      if (criteria.minReliability && source.reliability < criteria.minReliability) return false
      if (criteria.pricing && source.pricing !== criteria.pricing) return false
      if (criteria.features && !criteria.features.some(feature => source.features.includes(feature))) return false
      return true
    })
  }

  /**
   * Obter estatísticas das fontes
   */
  getSourcesStats(): {
    total: number
    byCategory: Record<DataSourceCategory, number>
    byRegion: Record<DataSource['region'], number>
    byPricing: Record<DataSource['pricing'], number>
    byReliability: {
      high: number // >= 0.95
      medium: number // >= 0.85
      low: number // < 0.85
    }
    byFeatures: Record<DataSourceFeature, number>
  } {
    const stats = {
      total: this.sources.length,
      byCategory: {} as Record<DataSourceCategory, number>,
      byRegion: {} as Record<DataSource['region'], number>,
      byPricing: {} as Record<DataSource['pricing'], number>,
      byReliability: {
        high: 0,
        medium: 0,
        low: 0
      },
      byFeatures: {} as Record<DataSourceFeature, number>
    }

    // Inicializar contadores
    this.sources.forEach(source => {
      // Por categoria
      stats.byCategory[source.category] = (stats.byCategory[source.category] || 0) + 1
      
      // Por região
      stats.byRegion[source.region] = (stats.byRegion[source.region] || 0) + 1
      
      // Por preço
      stats.byPricing[source.pricing] = (stats.byPricing[source.pricing] || 0) + 1
      
      // Por confiabilidade
      if (source.reliability >= 0.95) stats.byReliability.high++
      else if (source.reliability >= 0.85) stats.byReliability.medium++
      else stats.byReliability.low++
      
      // Por recursos
      source.features.forEach(feature => {
        stats.byFeatures[feature] = (stats.byFeatures[feature] || 0) + 1
      })
    })

    return stats
  }

  /**
   * Obter fontes recomendadas para um tipo de consulta
   */
  getRecommendedSources(queryType: string): DataSource[] {
    const recommendations: Record<string, DataSourceFeature[]> = {
      'odds_lookup': ['odds_comparison', 'live_scores'],
      'arbitrage_search': ['arbitrage_detection', 'odds_comparison'],
      'team_analysis': ['statistics', 'xg_analysis'],
      'predictions': ['ai_predictions', 'value_bet_finder'],
      'value_betting': ['value_bet_finder', 'odds_comparison'],
      'btts_analysis': ['btts_analysis', 'statistics'],
      'corner_betting': ['corner_stats', 'statistics'],
      'over_under': ['over_under', 'statistics'],
      'clean_sheets': ['clean_sheets', 'statistics'],
      'goal_timing': ['goal_timing', 'statistics'],
      'injury_analysis': ['injury_data', 'statistics'],
      'tipster_analysis': ['tipster_rankings', 'statistics'],
      'live_scores': ['live_scores'],
      'xg_analysis': ['xg_analysis', 'statistics'],
      'heat_maps': ['heat_maps', 'statistics']
    }

    const features = recommendations[queryType] || ['statistics']
    return this.getSourcesByFeaturesAndReliability(features, 0.85)
  }

  /**
   * Obter fontes para análise completa
   */
  getComprehensiveAnalysisSources(): DataSource[] {
    return this.getSourcesByMultipleCriteria({
      minReliability: 0.90,
      features: ['statistics', 'odds_comparison', 'value_bet_finder']
    })
  }

  /**
   * Obter fontes para arbitragem
   */
  getArbitrageAnalysisSources(): DataSource[] {
    return this.getSourcesByMultipleCriteria({
      minReliability: 0.92,
      features: ['arbitrage_detection', 'odds_comparison']
    })
  }

  /**
   * Obter fontes para value betting
   */
  getValueBetAnalysisSources(): DataSource[] {
    return this.getSourcesByMultipleCriteria({
      minReliability: 0.88,
      features: ['value_bet_finder', 'odds_comparison']
    })
  }

  /**
   * Obter fontes para análise estatística
   */
  getStatisticalAnalysisSources(): DataSource[] {
    return this.getSourcesByMultipleCriteria({
      minReliability: 0.90,
      features: ['statistics', 'xg_analysis']
    })
  }

  /**
   * Obter fontes para análise de IA
   */
  getAIAnalysisSources(): DataSource[] {
    return this.getSourcesByMultipleCriteria({
      minReliability: 0.85,
      features: ['ai_predictions', 'value_bet_finder']
    })
  }
}

// Instância singleton
export const sportsDataSources = new SportsDataSources() 