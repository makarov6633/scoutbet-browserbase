import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { TrendingUp, Trophy, Target } from 'lucide-react'

interface OddsData {
  bookmaker: string
  match: string
  odds: {
    home: string
    draw: string
    away: string
  }
  timestamp: string
}

interface OddsDisplayProps {
  data: {
    match: string
    results: OddsData[]
    summary?: {
      bestOdds: {
        home: number
        draw: number
        away: number
      }
      totalBookmakers: number
    }
  }
}

export default function OddsDisplay({ data }: OddsDisplayProps) {
  const { match, results, summary } = data

  const getBestOddStyle = (currentOdd: string, bestOdd: number, type: 'home' | 'draw' | 'away') => {
    const current = parseFloat(currentOdd)
    const best = bestOdd

    if (Math.abs(current - best) < 0.01) {
      return 'bg-gradient-to-r from-green-600/30 to-emerald-600/30 text-green-300 border-green-500/40 font-bold shadow-lg shadow-green-500/20 hover:shadow-green-500/30 transition-all duration-300'
    }
    return 'bg-gradient-to-r from-slate-800/50 to-slate-700/50 text-orange-200 border-orange-800/20 hover:border-orange-700/30 transition-all duration-300'
  }

  return (
    <div className="space-y-8 mt-6">
      {/* Enhanced header - Factory.ai inspired */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-orange-600 to-orange-400 rounded-xl blur opacity-30 group-hover:opacity-50 transition duration-300"></div>
            <div className="relative w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
              <Target className="w-5 h-5 text-white" />
            </div>
          </div>
          <div className="space-y-1">
            <h3 className="text-xl font-bold bg-gradient-to-r from-orange-300 to-orange-400 bg-clip-text text-transparent">
              Odds em Tempo Real
            </h3>
            <p className="text-sm text-orange-200/70 font-medium">{match}</p>
          </div>
        </div>
        <Badge variant="secondary" className="bg-gradient-to-r from-orange-950/50 to-orange-900/50 text-orange-300 border-orange-500/30 px-4 py-2 font-semibold backdrop-blur-sm">
          🏢 {results.length} casas de apostas
        </Badge>
      </div>

      {/* Enhanced odds grid - Factory.ai bento-style */}
      <div className="grid gap-6">
        {results.map((result, index) => (
          <Card key={index} className="group bg-gradient-to-br from-slate-900/60 via-orange-950/10 to-slate-900/60 border-orange-800/20 p-6 hover:border-orange-700/40 transition-all duration-300 hover:shadow-xl hover:shadow-orange-900/10 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg blur opacity-30 group-hover:opacity-50 transition duration-300"></div>
                  <div className="relative w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center shadow-lg">
                    <span className="text-sm font-bold text-white">{result.bookmaker.charAt(0)}</span>
                  </div>
                </div>
                <h4 className="font-bold text-orange-100 text-lg">{result.bookmaker}</h4>
              </div>
              <Badge variant="outline" className="text-xs text-orange-200/70 border-orange-700/30 bg-orange-950/30 font-mono">
                🕒 {new Date(result.timestamp).toLocaleTimeString('pt-BR', {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </Badge>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center space-y-3">
                <p className="text-sm text-orange-200/70 font-semibold">🏠 Casa</p>
                <Badge
                  className={`w-full justify-center py-3 text-base font-bold transition-all duration-300 hover:scale-105 ${
                    summary ? getBestOddStyle(result.odds.home, summary.bestOdds.home, 'home') : 'bg-gradient-to-r from-slate-800/50 to-slate-700/50 text-orange-200 border-orange-800/20'
                  }`}
                >
                  {result.odds.home}
                </Badge>
              </div>

              <div className="text-center space-y-3">
                <p className="text-sm text-orange-200/70 font-semibold">⚖️ Empate</p>
                <Badge
                  className={`w-full justify-center py-3 text-base font-bold transition-all duration-300 hover:scale-105 ${
                    summary ? getBestOddStyle(result.odds.draw, summary.bestOdds.draw, 'draw') : 'bg-gradient-to-r from-slate-800/50 to-slate-700/50 text-orange-200 border-orange-800/20'
                  }`}
                >
                  {result.odds.draw}
                </Badge>
              </div>

              <div className="text-center space-y-3">
                <p className="text-sm text-orange-200/70 font-semibold">✈️ Visitante</p>
                <Badge
                  className={`w-full justify-center py-3 text-base font-bold transition-all duration-300 hover:scale-105 ${
                    summary ? getBestOddStyle(result.odds.away, summary.bestOdds.away, 'away') : 'bg-gradient-to-r from-slate-800/50 to-slate-700/50 text-orange-200 border-orange-800/20'
                  }`}
                >
                  {result.odds.away}
                </Badge>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Enhanced summary section */}
      {summary && (
        <Card className="relative group bg-gradient-to-br from-green-950/40 via-emerald-950/30 to-green-950/40 border-green-500/40 p-6 backdrop-blur-sm">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl blur opacity-20 group-hover:opacity-30 transition duration-300"></div>
          
          <div className="relative">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center shadow-lg">
                <Trophy className="w-5 h-5 text-white" />
              </div>
              <h4 className="font-bold text-green-300 text-xl">Melhores Odds Disponíveis</h4>
            </div>
            
            <div className="grid grid-cols-3 gap-6 mb-6">
              <div className="text-center space-y-2">
                <p className="text-sm text-green-200/70 font-semibold">🏠 Casa</p>
                <div className="bg-gradient-to-r from-green-900/40 to-emerald-900/40 border border-green-500/30 rounded-lg p-3">
                  <p className="text-2xl font-bold text-green-300">{summary.bestOdds.home.toFixed(2)}</p>
                </div>
              </div>
              
              <div className="text-center space-y-2">
                <p className="text-sm text-green-200/70 font-semibold">⚖️ Empate</p>
                <div className="bg-gradient-to-r from-green-900/40 to-emerald-900/40 border border-green-500/30 rounded-lg p-3">
                  <p className="text-2xl font-bold text-green-300">{summary.bestOdds.draw.toFixed(2)}</p>
                </div>
              </div>
              
              <div className="text-center space-y-2">
                <p className="text-sm text-green-200/70 font-semibold">✈️ Visitante</p>
                <div className="bg-gradient-to-r from-green-900/40 to-emerald-900/40 border border-green-500/30 rounded-lg p-3">
                  <p className="text-2xl font-bold text-green-300">{summary.bestOdds.away.toFixed(2)}</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-center pt-4 border-t border-green-500/20">
              <TrendingUp className="w-5 h-5 text-green-400 mr-3" />
              <p className="text-sm text-green-300 font-medium">
                📊 Análise comparativa entre {summary.totalBookmakers} casas de apostas
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}
