const { Browserbase } = require("@browserbasehq/sdk");

class BrowserbaseService {
  constructor() {
    this.browserbase = new Browserbase();
  }

  async getOdds(url) {
    const session = await this.browserbase.sessions.create({ projectId: process.env.BROWSERBASE_PROJECT_ID, stealth: true });

    await session.page.goto(url);

    // For now, we'll just return some dummy data
    const odds = [
      {
        bookmaker: "Bookmaker A",
        odds: {
          "1x2": {
            "1": 2.5,
            "x": 3.5,
            "2": 2.8,
          },
          "Over/Under": {
            "Over 2.5": 1.9,
            "Under 2.5": 1.9,
          },
        },
      },
      {
        bookmaker: "Bookmaker B",
        odds: {
          "1x2": {
            "1": 2.6,
            "x": 3.4,
            "2": 2.7,
          },
          "Over/Under": {
            "Over 2.5": 1.85,
            "Under 2.5": 1.95,
          },
        },
      },
      {
        bookmaker: "Bookmaker C",
        odds: {
          "1x2": {
            "1": 2.4,
            "x": 3.6,
            "2": 2.9,
          },
          "Over/Under": {
            "Over 2.5": 1.95,
            "Under 2.5": 1.85,
          },
        },
      },
    ];

    await session.close();

    return odds;
  }
}

module.exports = BrowserbaseService;
