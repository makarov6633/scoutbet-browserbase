const PerplexityService = require('./perplexity-service');
const { BrowserbaseScout, discoverValueBets } = require('./browserbase');
const { oddsComparator } = require('./odds-comparator');

class ScoutController {
  constructor() {
    this.perplexityService = new PerplexityService();
    this.browserbaseScout = new BrowserbaseScout();
  }

  /**
   * Busca as melhores odds para uma partida.
   * @param {string} match - A partida a ser pesquisada (ex: "Flamengo vs Palmeiras").
   * @returns {Promise<object>} - Um objeto com o resultado da busca.
   */
  async searchOdds(match) {
    try {
      console.log(`[ScoutController] Iniciando busca de odds para: ${match}`);
      // A função discoverValueBets já retorna uma estrutura rica de dados de odds
      // Vamos reutilizá-la para buscar as odds e depois comparar.
      const results = await discoverValueBets(match);

      if (!results.success || !results.opportunities || results.opportunities.length === 0) {
        return { success: false, error: 'Nenhuma odd encontrada para a partida.', details: results.error };
      }

      // Usar o oddsComparator para analisar as odds encontradas
      const comparison = oddsComparator.compare(results.opportunities.map(op => op.opportunity));

      console.log(`[ScoutController] Odds comparadas para: ${match}`);

      return {
        success: true,
        data: results.opportunities,
        summary: {
          message: `Encontrei ${results.opportunities.length} oportunidades. A melhor odd para o favorito é ${comparison.bestOverallOdd.toFixed(2)}.`,
          comparison,
          executionTime: results.executionTime,
        },
      };
    } catch (error) {
      console.error(`[ScoutController] Erro em searchOdds:`, error);
      return { success: false, error: 'Erro ao buscar odds.', details: error.message };
    }
  }

  /**
   * Realiza uma análise completa de uma partida usando IA.
   * @param {string} match - A partida a ser analisada.
   * @returns {Promise<object>} - Um objeto com a análise da IA.
   */
  async analyzeMatch(match) {
    try {
      console.log(`[ScoutController] Solicitando análise de IA para: ${match}`);
      const teams = match.split(/vs|x/i).map(t => t.trim());
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
      console.error(`[ScoutController] Erro em analyzeMatch:`, error);
      return { success: false, error: 'Erro ao gerar análise com IA.', details: error.message };
    }
  }

  /**
   * Encontra apostas de valor para uma partida.
   * @param {string} match - A partida a ser pesquisada.
   * @returns {Promise<object>} - Um objeto com as apostas de valor encontradas.
   */
  async findValueBets(match) {
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
      console.error(`[ScoutController] Erro em findValueBets:`, error);
      return { success: false, error: 'Erro ao buscar value bets.', details: error.message };
    }
  }
}

module.exports = ScoutController;