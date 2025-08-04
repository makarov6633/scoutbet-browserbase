const { Perplexity } = require("@ai-sdk/perplexity");

class PerplexityService {
  constructor() {
    this.perplexity = new Perplexity({
      apiKey: process.env.PERPLEXITY_API_KEY,
    });
  }

  async getGameAnalysis(team1, team2) {
    const prompt = `You are a sports betting analyst. Your task is to analyze the upcoming game between ${team1} and ${team2}. Provide a detailed analysis of the game, including:

*   **Historical data:** Head-to-head record, recent form, and any other relevant historical data.
*   **Statistical analysis:** Key stats for each team, such as goals scored, goals conceded, and xG.
*   **Betting odds:** The current odds for the game from at least three different bookmakers.
*   **Value bet identification:** Identify any potential value bets based on your analysis.
*   **Recommendation:** Provide a recommendation on which team to bet on, and why.

Your analysis should be well-structured, easy to read, and provide actionable insights for the user.`;

    const response = await this.perplexity.generate(prompt);

    return response;
  }

  async getOddsComparison(team1, team2, bookmakers) {
    const prompt = `You are a sports betting expert. Your task is to compare the odds for the upcoming game between ${team1} and ${team2} from the following bookmakers: ${bookmakers.join(", ")}.

Provide a table that shows the odds for each betting market (e.g., 1x2, Over/Under, etc.) from each bookmaker. Highlight the best odds for each market.

Your response should be clear, concise, and help the user to quickly identify the best odds for their bets.`;

    const response = await this.perplexity.generate(prompt);

    return response;
  }

  async getValueBets() {
    const prompt = `You are a value betting specialist. Your task is to find value bets for today's games. To do this, you will need to:

1.  **Get a list of today's games.**
2.  **For each game, get the odds from at least three different bookmakers.**
3.  **Calculate the implied probability for each outcome.**
4.  **Compare the implied probability with your own assessment of the probability of each outcome.**
5.  **If the implied probability is significantly lower than your own assessment, then you have found a value bet.**

Present the value bets in a table that includes the game, the betting market, the bookmaker, the odds, and the perceived value.

Your response should be clear, concise, and help the user to quickly identify profitable betting opportunities.`;

    const response = await this.perplexity.generate(prompt);

    return response;
  }

  async getArbitrageOpportunities() {
    const prompt = `You are an arbitrage betting expert. Your task is to find arbitrage opportunities for today's games. To do this, you will need to:

1.  **Get a list of today's games.**
2.  **For each game, get the odds from at least three different bookmakers.**
3.  **For each game, check if there is an arbitrage opportunity. An arbitrage opportunity exists if you can bet on all possible outcomes of a game and make a profit, regardless of the result.**
4.  **If you find an arbitrage opportunity, calculate the potential profit.**

Present the arbitrage opportunities in a table that includes the game, the betting market, a list of bookmakers, the odds, and the potential profit.

Your response should be clear, concise, and help the user to quickly identify guaranteed profit opportunities.`;

    const response = await this.perplexity.generate(prompt);

    return response;
  }
}

module.exports = PerplexityService;
