
import { NextRequest, NextResponse } from 'next/server';
import ScoutController from '@/lib/scout-controller';

const controller = new ScoutController();

export async function POST(request: NextRequest) {
  try {
    const { action, target, params } = await request.json();

    if (!action || !target) {
      return NextResponse.json({ error: 'Parâmetros "action" e "target" são obrigatórios' }, { status: 400 });
    }

    console.log(`🎯 [SCOUT API] Action: ${action}, Target: ${target}`);

    let results;

    switch (action) {
      case 'search_odds':
        results = await controller.searchOdds(target);
        break;
      case 'analyze_match':
        results = await controller.analyzeMatch(target);
        break;
      case 'find_value_bets':
        results = await controller.findValueBets(target);
        break;
      default:
        return NextResponse.json({ error: `Ação desconhecida: ${action}` }, { status: 400 });
    }

    if (!results.success) {
      return NextResponse.json({ success: false, error: results.error || 'Ocorreu um erro no processamento.', details: results.details }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      match: target,
      action: action,
      data: results.data,
      summary: results.summary,
    });

  } catch (error) {
    console.error('❌ [SCOUT API] Erro geral:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Erro inesperado no servidor.',
        details: error instanceof Error ? error.message : 'Erro desconhecido',
      },
      { status: 500 }
    );
  }
}
