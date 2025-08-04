// PRD Service - Professional Requirements Document for ScoutBet
// Both Perplexity AI and Browserbase MUST follow these guidelines

export interface PRDContext {
  userQuery: string;
  queryType: 'odds_lookup' | 'arbitrage_search' | 'team_analysis' | 'predictions' | 'general';
  userLevel: 'iniciante' | 'experiente' | 'profissional';
  browserbaseData?: any;
}

export class PRDService {
  
  /**
   * MASTER SYSTEM PROMPT - Base fundamental para toda comunicação
   */
  static getSystemPrompt(): string {
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
`;
  }

  /**
   * Determina o tipo de consulta baseado na entrada do usuário
   */
  static classifyQuery(userQuery: string): PRDContext['queryType'] {
    const query = userQuery.toLowerCase();
    
    if (query.includes('arbitragem') || query.includes('arbitrage')) {
      return 'arbitrage_search';
    }
    
    if (query.includes('odds') || query.includes('cotação')) {
      return 'odds_lookup';
    }
    
    if (query.includes('análise') || query.includes('analise') || 
        query.includes('como está') || query.includes('forma')) {
      return 'team_analysis';
    }
    
    if (query.includes('previsão') || query.includes('prever') || 
        query.includes('probabilidade')) {
      return 'predictions';
    }
    
    return 'general';
  }

  /**
   * Detecta o nível do usuário baseado na linguagem usada
   */
  static detectUserLevel(userQuery: string): PRDContext['userLevel'] {
    const query = userQuery.toLowerCase();
    
    // Termos técnicos indicam usuário experiente/profissional
    const technicalTerms = [
      'roi', 'edge', 'value bet', 'closing line', 'arbitragem',
      'probabilidade implícita', 'expected value', 'kelly criterion'
    ];
    
    if (technicalTerms.some(term => query.includes(term))) {
      return 'profissional';
    }
    
    // Termos intermediários
    const intermediateTerms = [
      'análise estatística', 'histórico', 'forma dos times', 'comparar odds'
    ];
    
    if (intermediateTerms.some(term => query.includes(term))) {
      return 'experiente';
    }
    
    return 'iniciante';
  }

  /**
   * Gera o prompt específico baseado no tipo de consulta
   */
  static getSpecificPrompt(context: PRDContext): string {
    const basePrompt = this.getSystemPrompt();
    
    switch (context.queryType) {
      case 'odds_lookup':
        return `${basePrompt}

### CONSULTA TIPO: Busca de Odds
DADOS BROWSERBASE: ${JSON.stringify(context.browserbaseData || 'PENDENTE')}

INSTRUÇÕES:
1. Apresente as melhores odds disponíveis em formato tabular
2. Calcule probabilidades implícitas para cada outcome
3. Compare com odds históricas para identificar movimentos
4. Identifique se há valor aparente em alguma seleção
5. Explique fatores que podem estar influenciando as odds

TEMPLATE DE RESPOSTA:
🎯 Melhores Odds Encontradas
📊 Análise de Movimento 
💡 Oportunidades de Valor
⚠️ Gestão de Risco
`;

      case 'arbitrage_search':
        return `${basePrompt}

### CONSULTA TIPO: Busca de Arbitragem
DADOS BROWSERBASE: ${JSON.stringify(context.browserbaseData || 'PENDENTE')}

INSTRUÇÕES:
1. Calcule todas as combinações possíveis de arbitragem
2. Ordene por ROI decrescente
3. Considere apenas oportunidades > 1.5% ROI
4. Calcule distribuição ótima de apostas
5. Avalie riscos práticos (limites, mudanças de odds)

TEMPLATE DE RESPOSTA:
🎯 Arbitragem Detectada
📊 Distribuição Ótima
💡 Viabilidade 
⚠️ Considerações Práticas
`;

      case 'team_analysis':
        return `${basePrompt}

### CONSULTA TIPO: Análise de Time/Jogo
DADOS BROWSERBASE: ${JSON.stringify(context.browserbaseData || 'PENDENTE')}

INSTRUÇÕES:
1. Analise forma atual de ambos os times
2. Compare estatísticas-chave relevantes para o mercado
3. Considere fatores contextuais (motivação, pressão, etc.)
4. Identifique padrões nos confrontos diretos
5. Forneça perspectiva para principais mercados

TEMPLATE DE RESPOSTA:
🎯 Análise do Confronto
📊 Forma e Estatísticas
💡 Insights para Apostas
⚠️ Fatores de Risco
`;

      default:
        return `${basePrompt}

### CONSULTA TIPO: Geral
DADOS BROWSERBASE: ${JSON.stringify(context.browserbaseData || 'PENDENTE')}

Responda de forma educativa e sempre inclua disclaimers apropriados.
`;
    }
  }

  /**
   * Aplica adaptações baseadas no nível do usuário
   */
  static adaptForUserLevel(prompt: string, userLevel: PRDContext['userLevel']): string {
    switch (userLevel) {
      case 'iniciante':
        return `${prompt}

### ADAPTAÇÃO PARA INICIANTE:
- Use linguagem simples e explicativa
- Defina termos técnicos quando usar
- Enfatize gestão de risco e educação
- Sugira stakes conservadoras (máximo 1-2% da banca)
- Inclua links ou sugestões para aprender mais
`;

      case 'experiente':
        return `${prompt}

### ADAPTAÇÃO PARA EXPERIENTE:
- Use linguagem técnica mas acessível
- Inclua estatísticas avançadas e comparações históricas
- Foque em análises aprofundadas e oportunidades de valor
- Sugira stakes moderadas (2-3% da banca)
`;

      case 'profissional':
        return `${prompt}

### ADAPTAÇÃO PARA PROFISSIONAL:
- Use linguagem técnica e precisa
- Inclua métricas avançadas (ROI, Kelly, intervalos de confiança)
- Foque em edge, arbitragens e modelos quantitativos
- Forneça análises de portfólio e gestão avançada
`;

      default:
        return prompt;
    }
  }

  /**
   * Valida se a resposta está conforme o PRD
   */
  static validateResponse(response: string, context: PRDContext): {
    isValid: boolean;
    errors: string[];
    warnings: string[];
  } {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Validações obrigatórias
    if (!response.includes('⚠️') && !response.includes('disclaimer')) {
      errors.push('FALTA_DISCLAIMER: Resposta deve incluir disclaimer de risco');
    }

    if (context.queryType === 'arbitrage_search' && !response.includes('ROI')) {
      errors.push('FALTA_ROI: Análise de arbitragem deve incluir cálculo de ROI');
    }

    if (context.browserbaseData && !response.includes('dados')) {
      warnings.push('DADOS_NAO_MENCIONADOS: Dados do Browserbase não foram referenciados');
    }

    // Verificar formato
    const hasProperFormat = response.includes('🎯') && response.includes('📊');
    if (!hasProperFormat) {
      warnings.push('FORMATO_INCONSISTENTE: Resposta não segue template padrão');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  /**
   * Gera disclaimers contextuais
   */
  static getContextualDisclaimers(queryType: PRDContext['queryType']): string {
    switch (queryType) {
          case 'arbitrage_search':
      return "⚠️ Importante: Oportunidades de arbitragem podem desaparecer rapidamente. Sempre verifique odds antes de apostar.";
    
    case 'predictions':
      return "⚠️ Importante: Previsões baseadas em dados históricos. Resultados passados não garantem resultados futuros.";
    
    case 'odds_lookup':
      return "⚠️ Importante: Apostas envolvem risco de perda total do capital investido.";
    
    default:
      return "⚠️ Importante: Aposte com responsabilidade. Nunca aposte mais do que pode se permitir perder.";
    }
  }

  /**
   * Cria contexto PRD completo para uma consulta
   */
  static createPRDContext(userQuery: string, browserbaseData?: any): PRDContext {
    return {
      userQuery,
      queryType: this.classifyQuery(userQuery),
      userLevel: this.detectUserLevel(userQuery),
      browserbaseData
    };
  }

  /**
   * Gera prompt final seguindo todas as diretrizes PRD
   */
  static generateFinalPrompt(userQuery: string, browserbaseData?: any): string {
    const context = this.createPRDContext(userQuery, browserbaseData);
    const specificPrompt = this.getSpecificPrompt(context);
    const adaptedPrompt = this.adaptForUserLevel(specificPrompt, context.userLevel);
    const disclaimer = this.getContextualDisclaimers(context.queryType);
    
    return `${adaptedPrompt}

### CONTEXTO ATUAL:
- Data/Hora: ${new Date().toLocaleString('pt-BR')}
- Consulta do usuário: "${userQuery}"
- Tipo detectado: ${context.queryType}
- Nível do usuário: ${context.userLevel}
- Dados Browserbase: ${browserbaseData ? 'DISPONÍVEIS' : 'AGUARDANDO'}

### DISCLAIMER OBRIGATÓRIO:
${disclaimer}

LEMBRE-SE: Browserbase é o motor de busca (dados reais), Perplexity AI apenas coordena e analisa.
`;
  }
}