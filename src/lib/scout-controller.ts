import { PerplexityAIIntegration } from './integrations/perplexity';
import { BrowserbaseScout, discoverValueBets, ValueBetResult } from './integrations/browserbase';
import { OddsComparatorService } from './odds-comparator';

interface MatchAnalysisResult {
  success: boolean;
  data?: any;
  error?: string;
  details?: any;
  summary?: {
    message: string;
    comparison: any;
    executionTime: number;
  };
}

export default class ScoutController {
  private perplexityService: PerplexityAIIntegration;
  private browserbaseScout: BrowserbaseScout;
  private oddsComparator: OddsComparatorService;
  constructor() {
    this.perplexityService = new PerplexityAIIntegration();
    this.browserbaseScout = new BrowserbaseScout();
    this.oddsComparator = new OddsComparatorService();
  }

  /**
   * Busca as melhores odds para uma partida.
   * @param {string} match - A partida a ser pesquisada (ex: "Flamengo vs Palmeiras").
   * @returns {Promise<object>} - Um objeto com o resultado da busca.
   */
  async searchOdds(match: string): Promise<MatchAnalysisResult> {
    try {
      console.log(`[ScoutController] Iniciando busca de odds para: ${match}`);
      // A função discoverValueBets já retorna uma estrutura rica de dados de odds
      // Vamos reutilizá-la para buscar as odds e depois comparar.
      const results = await discoverValueBets(match);

      if (!results.success || !results.opportunities || results.opportunities.length === 0) {
        return { success: false, error: 'Nenhuma odd encontrada para a partida.', details: results.error };
      }

      // Usar o oddsComparator para analisar as odds encontradas
      const comparison = this.oddsComparator.compare(results.opportunities.map(op => op.opportunity));

      console.log(`[ScoutController] Odds comparadas para: ${match}`);

      return {
        success: true,
        data: results.opportunities,
        summary: {
          message: `Encontrei ${results.opportunities.length} oportunidades. A melhor odd para o favorito é ${comparison[0]?.bestOdd.toFixed(2) || 'N/A'}.`,
          comparison,
          executionTime: results.executionTime,
        },
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      console.error(`[ScoutController] Erro em searchOdds: ${errorMessage}`);
      return { success: false, error: 'Erro ao buscar odds.', details: errorMessage };
    }
  }

  /**
   * Realiza uma análise completa de uma partida usando IA.
   * @param {string} match - A partida a ser analisada.
   * @returns {Promise<object>} - Um objeto com a análise da IA.
   */
  async analyzeMatch(match: string) {
    try {
      console.log(`[ScoutController] Solicitando análise de IA para: ${match}`);
      const teams = match.split(/vs|x/i).map((t: string) => t.trim());
      if (teams.length < 2) {
        return { success: false, error: 'Formato da partida inválido. Use "Time A vs Time B".' };
      }

      const analysis = await this.perplexityService.getGameAnalysis(teams[0], teams[1]);

      console.log(`[ScoutController] Análise de IA recebida para: ${match}`);

      return {
        success: true,
        data: analysis,
        summary: {
          message: `Análise completa para ${match} gerada com sucesso.`,
        },
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      console.error(`[ScoutController] Erro em analyzeMatch: ${errorMessage}`);
      return { success: false, error: 'Erro ao gerar análise com IA.', details: errorMessage };
    }
  }

  /**
   * Encontra apostas de valor para uma partida.
   * @param {string} match - A partida a ser pesquisada.
   * @returns {Promise<object>} - Um objeto com as apostas de valor encontradas.
   */
  async findValueBets(match: string) {
    try {
      console.log(`[ScoutController] Buscando value bets para: ${match}`);
      const results = await discoverValueBets(match);

      if (!results.success || !results.opportunities || results.opportunities.length === 0) {
        return { success: false, error: 'Nenhuma aposta de valor encontrada.', details: results.error };
      }

      console.log(`[ScoutController] Value bets encontradas para: ${match}`);

      return {
        success: true,
        data: results.opportunities,
        summary: {
          message: `Encontrei ${results.opportunities.length} apostas de valor para ${match}.`,
          bestBet: results.summary.bestOpportunity,
          executionTime: results.executionTime,
        },
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      console.error(`[ScoutController] Erro em findValueBets: ${errorMessage}`);
      return { success: false, error: 'Erro ao buscar value bets.', details: errorMessage };
    }
  }
}