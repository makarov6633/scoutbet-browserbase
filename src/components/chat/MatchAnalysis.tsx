import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { TrendingUp, Trophy, Target, BarChart3, Users, Clock } from 'lucide-react'

interface MatchAnalysisProps {
  data: {
    match: string
    teams: {
      home: string
      away: string
    }
    analysis: {
      homeForm: string[]
      awayForm: string[]
      headToHead: {
        totalGames: number
        homeWins: number
        draws: number
        awayWins: number
      }
      keyStats: {
        homeGoalsPerGame: string
        awayGoalsPerGame: string
        homeDefense: string
        awayDefense: string
      }
    }
    prediction: {
      winner: string
      confidence: string
      recommendedBets: Array<{
        type: string
        bet: string
        odds: string
        confidence: string
      }>
    }
    timestamp: string
  }
}

export default function MatchAnalysis({ data }: MatchAnalysisProps) {
  const { match, teams, analysis, prediction } = data

  const getFormColor = (result: string) => {
    switch (result) {
      case 'V': return 'bg-green-500 text-white'
      case 'E': return 'bg-yellow-500 text-black'
      case 'D': return 'bg-red-500 text-white'
      default: return 'bg-gray-500 text-white'
    }
  }

  const getConfidenceColor = (confidence: string) => {
    switch (confidence.toLowerCase()) {
      case 'alta': return 'bg-green-500/20 text-green-400 border-green-500/30'
      case 'média': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
      case 'baixa': return 'bg-red-500/20 text-red-400 border-red-500/30'
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    }
  }

  return (
    <div className="space-y-8 mt-6">
      {/* Enhanced header - Factory.ai inspired */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl blur opacity-30 group-hover:opacity-50 transition duration-300"></div>
            <div className="relative w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <BarChart3 className="w-5 h-5 text-white" />
            </div>
          </div>
          <div className="space-y-1">
            <h3 className="text-xl font-bold bg-gradient-to-r from-blue-300 to-purple-400 bg-clip-text text-transparent">
              Análise Técnica Completa
            </h3>
            <p className="text-sm text-orange-200/70 font-medium">{match}</p>
          </div>
        </div>
        <Badge variant="secondary" className="bg-gradient-to-r from-blue-950/50 to-purple-950/50 text-blue-300 border-blue-500/30 px-4 py-2 font-semibold backdrop-blur-sm">
          <Clock className="w-4 h-4 mr-2" />
          🤖 AI Analysis
        </Badge>
      </div>

      {/* Enhanced teams form section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="group bg-gradient-to-br from-slate-900/60 via-green-950/10 to-slate-900/60 border-green-800/20 p-6 hover:border-green-700/40 transition-all duration-300 hover:shadow-xl hover:shadow-green-900/10 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-6">
            <h4 className="font-bold text-orange-100 text-lg">{teams.home}</h4>
            <Badge variant="outline" className="text-xs text-green-300 border-green-700/30 bg-green-950/30 font-semibold">
              🏠 Casa
            </Badge>
          </div>
          <div className="flex space-x-2 mb-6">
            {analysis.homeForm.map((result, index) => (
              <div
                key={index}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shadow-lg transition-all duration-300 hover:scale-110 ${getFormColor(result)}`}
              >
                {result}
              </div>
            ))}
          </div>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between items-center p-3 bg-slate-800/30 rounded-lg border border-green-800/20">
              <span className="text-orange-200/70 font-medium">⚽ Gols/Jogo:</span>
              <span className="text-green-300 font-bold text-base">{analysis.keyStats.homeGoalsPerGame}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-slate-800/30 rounded-lg border border-green-800/20">
              <span className="text-orange-200/70 font-medium">🛡️ Defesa:</span>
              <span className="text-green-300 font-bold text-base">{analysis.keyStats.homeDefense}</span>
            </div>
          </div>
        </Card>

        <Card className="group bg-gradient-to-br from-slate-900/60 via-red-950/10 to-slate-900/60 border-red-800/20 p-6 hover:border-red-700/40 transition-all duration-300 hover:shadow-xl hover:shadow-red-900/10 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-6">
            <h4 className="font-bold text-orange-100 text-lg">{teams.away}</h4>
            <Badge variant="outline" className="text-xs text-red-300 border-red-700/30 bg-red-950/30 font-semibold">
              ✈️ Visitante
            </Badge>
          </div>
          <div className="flex space-x-2 mb-6">
            {analysis.awayForm.map((result, index) => (
              <div
                key={index}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shadow-lg transition-all duration-300 hover:scale-110 ${getFormColor(result)}`}
              >
                {result}
              </div>
            ))}
          </div>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between items-center p-3 bg-slate-800/30 rounded-lg border border-red-800/20">
              <span className="text-orange-200/70 font-medium">⚽ Gols/Jogo:</span>
              <span className="text-red-300 font-bold text-base">{analysis.keyStats.awayGoalsPerGame}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-slate-800/30 rounded-lg border border-red-800/20">
              <span className="text-orange-200/70 font-medium">🛡️ Defesa:</span>
              <span className="text-red-300 font-bold text-base">{analysis.keyStats.awayDefense}</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Enhanced Head to Head section */}
      <Card className="bg-gradient-to-br from-slate-900/60 via-blue-950/10 to-slate-900/60 border-blue-800/20 p-6 backdrop-blur-sm">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-lg">
            <Users className="w-5 h-5 text-white" />
          </div>
          <h4 className="font-bold text-blue-300 text-xl">Histórico de Confrontos</h4>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="space-y-3">
            <div className="bg-gradient-to-r from-blue-900/40 to-blue-800/40 border border-blue-500/30 rounded-lg p-4">
              <p className="text-3xl font-bold text-blue-300">{analysis.headToHead.totalGames}</p>
            </div>
            <p className="text-sm text-blue-200/70 font-semibold">📊 Total</p>
          </div>
          <div className="space-y-3">
            <div className="bg-gradient-to-r from-green-900/40 to-green-800/40 border border-green-500/30 rounded-lg p-4">
              <p className="text-3xl font-bold text-green-300">{analysis.headToHead.homeWins}</p>
            </div>
            <p className="text-sm text-green-200/70 font-semibold">🏠 Vitórias Casa</p>
          </div>
          <div className="space-y-3">
            <div className="bg-gradient-to-r from-yellow-900/40 to-yellow-800/40 border border-yellow-500/30 rounded-lg p-4">
              <p className="text-3xl font-bold text-yellow-300">{analysis.headToHead.draws}</p>
            </div>
            <p className="text-sm text-yellow-200/70 font-semibold">⚖️ Empates</p>
          </div>
          <div className="space-y-3">
            <div className="bg-gradient-to-r from-red-900/40 to-red-800/40 border border-red-500/30 rounded-lg p-4">
              <p className="text-3xl font-bold text-red-300">{analysis.headToHead.awayWins}</p>
            </div>
            <p className="text-sm text-red-200/70 font-semibold">✈️ Vitórias Visitante</p>
          </div>
        </div>
      </Card>

      {/* Enhanced AI Prediction section */}
      <Card className="relative group bg-gradient-to-br from-purple-950/40 via-indigo-950/30 to-purple-950/40 border-purple-500/40 p-6 backdrop-blur-sm">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl blur opacity-20 group-hover:opacity-30 transition duration-300"></div>
        
        <div className="relative">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-lg flex items-center justify-center shadow-lg">
              <Trophy className="w-5 h-5 text-white" />
            </div>
            <h4 className="font-bold text-purple-300 text-xl">Predição da IA</h4>
          </div>
          
          <div className="flex items-center justify-between mb-6">
            <div className="space-y-2">
              <p className="text-xl font-bold text-purple-200">🏆 Favorito: {prediction.winner}</p>
              <p className="text-sm text-purple-300/70 font-medium">📊 Confiança: {prediction.confidence}</p>
            </div>
            <Badge className="bg-gradient-to-r from-purple-950/50 to-indigo-950/50 text-purple-300 border-purple-500/30 px-4 py-2 font-semibold">
              <TrendingUp className="w-4 h-4 mr-2" />
              🧠 AI Analysis
            </Badge>
          </div>
          
          {/* Enhanced recommended bets */}
          <div className="space-y-4">
            <h5 className="text-lg font-bold text-purple-200 mb-4">💡 Apostas Recomendadas:</h5>
            {prediction.recommendedBets.map((bet, index) => (
              <div key={index} className="group/bet flex items-center justify-between p-4 bg-gradient-to-r from-slate-800/40 to-slate-700/40 rounded-lg border border-purple-800/20 hover:border-purple-700/40 transition-all duration-300">
                <div className="space-y-1">
                  <p className="text-base font-bold text-purple-100">{bet.type}</p>
                  <p className="text-sm text-purple-200/70 font-medium">{bet.bet}</p>
                </div>
                <div className="flex items-center space-x-3">
                  <Badge variant="outline" className="text-sm text-purple-200 border-purple-600/30 bg-purple-950/30 font-bold px-3 py-1">
                    🎯 {bet.odds}
                  </Badge>
                  <Badge className={`text-sm font-semibold px-3 py-1 ${getConfidenceColor(bet.confidence)}`}>
                    {bet.confidence}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  )
}
