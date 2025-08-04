'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Send, Bot, User, TrendingUp, Target, Zap, Brain } from 'lucide-react'
import Image from 'next/image'
import OddsDisplay from './OddsDisplay'
import MatchAnalysis from './MatchAnalysis'
import ValueBetDisplay from './ValueBetDisplay'
import Loading from './Loading'

interface Message {
  id: string
  content: string
  sender: 'user' | 'bot'
  timestamp: Date
  type?: 'analysis' | 'bet' | 'general' | 'value_bet'
  oddsData?: any
  analysisData?: any
  valueBetData?: any
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: `🎯 Olá! Sou o ScoutBot, seu assistente de apostas esportivas.

Posso navegar automaticamente em casas de apostas para buscar:

• Odds em tempo real de múltiplas casas
• Análises detalhadas de jogos e estatísticas
• Comparações e identificação de value bets
• Recomendações baseadas em IA

Exemplos de comandos:
- "Analise o jogo Brasil vs Argentina"
- "Busque odds para Flamengo vs Palmeiras"
- "Compare as odds do Real Madrid vs Barcelona"

Como posso te ajudar hoje?`,
      sender: 'bot',
      timestamp: new Date(),
      type: 'general'
    }
  ])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showQuiz, setShowQuiz] = useState(false)
  const [currentMatch, setCurrentMatch] = useState('')
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // 🎮 Helper functions para quiz interativo
  const detectNeedsQuiz = (input: string): boolean => {
    const triggerWords = [
      'analise', 'analyse', 'analizar', 'analysis',
      'jogo', 'game', 'match', 'confronto',
      'odds', 'apostas', 'bet', 'betting',
      'vs', 'x', 'contra', 'against'
    ]
    
    const inputLower = input.toLowerCase()
    return triggerWords.some(word => inputLower.includes(word)) && 
           inputLower.length > 10 && // Evitar triggers em consultas muito simples
           !detectValueBetRequest(input) // Não mostrar quiz se for pedido de value bet
  }
  
  // 💰 Detectar pedidos de value bets
  const detectValueBetRequest = (input: string): boolean => {
    const valueBetTriggers = [
      'value bet', 'valuebet', 'value-bet',
      'oportunidade', 'opportunity', 'opportunities',
      'melhor aposta', 'best bet', 'melhores apostas',
      'valor', 'value', 'vantagem', 'advantage'
    ]
    
    const inputLower = input.toLowerCase()
    return valueBetTriggers.some(word => inputLower.includes(word))
  }

  const extractMatchFromInput = (input: string): string => {
    // Tentar extrair nomes de times do input
    const teamPatterns = [
      /(\w+)\s*(?:vs|x|contra|against)\s*(\w+)/i,
      /jogo\s+(.+?)(?:\s|$)/i,
      /odds\s+(.+?)(?:\s|$)/i,
      /analise?\s+(.+?)(?:\s|$)/i
    ]
    
    for (const pattern of teamPatterns) {
      const match = input.match(pattern)
      if (match) {
        return match[1] + (match[2] ? ` vs ${match[2]}` : '')
      }
    }
    
    return 'o jogo solicitado'
  }

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: 'user',
      timestamp: new Date(),
      type: 'general'
    }

    setMessages(prev => [...prev, userMessage])
    const currentInput = inputValue
    setInputValue('')
    setIsLoading(true)

    // 🎮 Detectar se deve mostrar quiz interativo
    const needsQuiz = detectNeedsQuiz(currentInput)
    const isValueBetRequest = detectValueBetRequest(currentInput)
    
    if (needsQuiz) {
      const match = extractMatchFromInput(currentInput)
      setCurrentMatch(match)
      setShowQuiz(true)
    } else if (isValueBetRequest) {
      const match = extractMatchFromInput(currentInput)
      if (match) {
        findValueBets(match)
      }
    }

    try {
      // Chamar API do chat
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: currentInput,
          userId: 'user-123' // Em produção, usar ID real do usuário
        }),
      })

      const data = await response.json()
      console.log('📋 Resposta da API:', data)

      if (response.ok && data.result) {
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: data.result,
          sender: 'bot',
          timestamp: new Date(),
          type: data.tipoConsulta || 'general'
        }
        setMessages(prev => [...prev, botMessage])
      } else {
        console.error('❌ Erro na resposta:', data)
        throw new Error(data.error || 'Resposta vazia do servidor')
      }
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error)
      const errorMessage: Message = {
        id: (Date.now() + 2).toString(),
        content: 'Desculpe, ocorreu um erro ao processar sua mensagem. Tente novamente.',
        sender: 'bot',
        timestamp: new Date(),
        type: 'general'
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
      setShowQuiz(false) // ✅ Esconder quiz quando resposta chegar
    }
  }

  const searchOdds = async (match: string) => {
    try {
      const response = await fetch('/api/scout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'search_odds',
          target: '',
          params: {}
        }),
      })

      const data = await response.json()

      if (response.ok) {
        const oddsMessage: Message = {
          id: (Date.now() + 3).toString(),
          content: `🎯 Encontrei odds para ${data.match} em ${data.results?.length || 0} casas de apostas:`,
          sender: 'bot',
          timestamp: new Date(),
          type: 'bet',
          oddsData: data
        }
        setMessages(prev => [...prev, oddsMessage])
      }
    } catch (error) {
      console.error('Erro ao buscar odds:', error)
    }
  }

  const analyzeMatch = async (match: string) => {
    try {
      const response = await fetch('/api/scout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'analyze_match',
          target: '',
          params: {}
        }),
      })

      const data = await response.json()

      if (response.ok) {
        const analysisMessage: Message = {
          id: (Date.now() + 4).toString(),
          content: `📊 Análise completa do jogo ${match}:`,
          sender: 'bot',
          timestamp: new Date(),
          type: 'analysis',
          analysisData: data.analysis
        }
        setMessages(prev => [...prev, analysisMessage])
      }
    } catch (error) {
      console.error('Erro ao analisar jogo:', error)
    }
  }

  const findValueBets = async (match: string) => {
    try {
      const response = await fetch('/api/scout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'find_value_bets',
          target: '',
          params: {}
        }),
      })

      const data = await response.json()

      if (response.ok) {
        const valueBetMessage: Message = {
          id: (Date.now() + 5).toString(),
          content: `💰 Value Bets encontradas para ${match}:`,
          sender: 'bot',
          timestamp: new Date(),
          type: 'value_bet',
          valueBetData: data.data
        }
        setMessages(prev => [...prev, valueBetMessage])
      }
    } catch (error) {
      console.error('Erro ao buscar value bets:', error)
    }
  }

  const formatOddsResponse = (data: any) => {
    if (!data.results || data.results.length === 0) {
      return 'Não foi possível encontrar odds para este jogo no momento.'
    }

    let response = `🎯 Odds encontradas para ${data.match}:\n\n`

    data.results.forEach((result: any) => {
      response += `${result.bookmaker}\n`
      response += `Casa: ${result.odds.home} | Empate: ${result.odds.draw} | Visitante: ${result.odds.away}\n\n`
    })

    if (data.summary?.bestOdds) {
      response += `🏆 Melhores Odds:\n`
      response += `Casa: ${data.summary.bestOdds.home}\n`
      response += `Empate: ${data.summary.bestOdds.draw}\n`
      response += `Visitante: ${data.summary.bestOdds.away}`
    }

    return response
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const getMessageIcon = (type?: string) => {
    switch (type) {
      case 'analysis':
        return <TrendingUp className="w-4 h-4" />
      case 'bet':
        return <Target className="w-4 h-4" />
      case 'value_bet':
        return <Zap className="w-4 h-4" />
      default:
        return <Bot className="w-4 h-4" />
    }
  }

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Factory.ai inspired header with animated background */}
      <div className="relative border-b border-orange-900/20 bg-gradient-to-r from-slate-950 via-orange-950/10 to-slate-950 backdrop-blur-sm">
        {/* Animated gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-orange-600/5 via-orange-500/10 to-orange-600/5 animate-pulse"></div>
        
        <div className="relative flex items-center justify-between p-6">
          <div className="flex items-center space-x-6">
            {/* Mascot Integration */}
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-orange-600 to-orange-400 rounded-xl blur opacity-30 group-hover:opacity-50 transition duration-1000 group-hover:duration-200 animate-pulse"></div>
              <div className="relative w-14 h-14 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-1">
                <img
                  src="/mascot.png"
                  alt="ScoutBet AI Mascot"
                  className="w-full h-full object-cover rounded-lg"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/mascot.svg';
                  }}
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center space-x-3">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-400 via-orange-300 to-orange-500 bg-clip-text text-transparent">
                  ScoutBet
                </h1>
                <div className="flex items-center space-x-1">
                  <Brain className="w-4 h-4 text-orange-400 animate-pulse" />
                  <Zap className="w-3 h-3 text-orange-500" />
                </div>
              </div>
              <p className="text-sm text-orange-200/60 font-medium tracking-wide">
                AI-Powered Sports Analytics Platform
              </p>
            </div>
          </div>

          {/* Version indicator */}
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <div className="text-xs text-orange-200/40 font-mono">v2.0.1</div>
              <div className="text-xs text-orange-300/60">AI Assistant Active</div>
            </div>
          </div>
        </div>
      </div>

      {/* Messages - Factory.ai inspired bento-style layout */}
      <ScrollArea className="flex-1 p-6 bg-gradient-to-b from-transparent via-slate-950/20 to-transparent" ref={scrollAreaRef}>
        <div className="space-y-8 max-w-6xl mx-auto">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex items-start space-x-6 group ${
                message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
              }`}
            >
              <div className="relative">
                <Avatar className="w-12 h-12 border-2 border-orange-900/30 shadow-lg">
                  <AvatarFallback className={`${
                    message.sender === 'user'
                      ? 'bg-gradient-to-br from-blue-600 via-blue-500 to-purple-600 text-white'
                      : 'bg-gradient-to-br from-orange-600 via-orange-500 to-orange-700 text-white'
                  } transition-all duration-300 group-hover:scale-105`}>
                    {message.sender === 'user' ? <User className="w-6 h-6" /> : getMessageIcon(message.type)}
                  </AvatarFallback>
                </Avatar>
                {/* Animated ring for bot messages */}
                {message.sender === 'bot' && (
                  <div className="absolute -inset-1 bg-gradient-to-r from-orange-600 to-orange-400 rounded-full blur opacity-20 group-hover:opacity-40 transition duration-300"></div>
                )}
              </div>

              <div className={`max-w-[85%] ${message.sender === 'user' ? 'text-right' : ''}`}>
                <div className="flex items-center space-x-3 mb-3">
                  <p className="text-sm font-semibold text-orange-100">
                    {message.sender === 'user' ? 'Você' : 'ScoutBot AI'}
                  </p>
                  <p className="text-xs text-orange-200/50 font-mono">
                    {typeof window !== 'undefined' ? 
                      message.timestamp.toLocaleTimeString('pt-BR', {
                        hour: '2-digit',
                        minute: '2-digit'
                      }) : 
                      message.timestamp.toTimeString().slice(0, 5)
                    }
                  </p>
                  {message.type && message.type !== 'general' && (
                    <Badge variant="outline" className="text-xs border-orange-500/20 text-orange-300/80 bg-orange-950/30 hover:bg-orange-950/50 transition-colors">
                      {message.type === 'analysis' ? '📊 Análise' : 
                       message.type === 'bet' ? '🎯 Odds' : 
                       message.type === 'value_bet' ? '💰 Value Bet' : '💬 Geral'}
                    </Badge>
                  )}
                </div>

                <Card className={`p-6 backdrop-blur-sm transition-all duration-300 hover:shadow-xl hover:shadow-orange-900/10 ${
                  message.sender === 'user'
                    ? 'bg-gradient-to-br from-slate-900/80 via-blue-950/30 to-slate-900/80 text-white border-blue-800/30 hover:border-blue-700/50'
                    : 'bg-gradient-to-br from-slate-900/60 via-orange-950/20 to-slate-900/60 text-orange-50 border-orange-800/20 hover:border-orange-700/40'
                } group-hover:scale-[1.01]`}>
                  <p className="text-sm leading-relaxed whitespace-pre-wrap font-medium">{message.content}</p>

                  {/* Enhanced odds component integration */}
                  {message.oddsData && (
                    <div className="mt-6">
                      <OddsDisplay data={message.oddsData} />
                    </div>
                  )}

                  {/* Enhanced analysis component integration */}
                  {message.analysisData && (
                    <div className="mt-6">
                      <MatchAnalysis data={message.analysisData} />
                    </div>
                  )}
                  
                  {/* Value Bet component integration */}
                  {message.valueBetData && (
                    <div className="mt-6">
                      <ValueBetDisplay data={message.valueBetData} />
                    </div>
                  )}
                </Card>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex items-start space-x-6 group">
              <div className="relative">
                <Avatar className="w-12 h-12 border-2 border-orange-900/30 shadow-lg">
                  <AvatarFallback className="bg-gradient-to-br from-orange-600 via-orange-500 to-orange-700 text-white">
                    <Bot className="w-6 h-6 animate-pulse" />
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -inset-1 bg-gradient-to-r from-orange-600 to-orange-400 rounded-full blur opacity-40 animate-pulse"></div>
              </div>
              <div className="max-w-[85%]">
                <div className="flex items-center space-x-3 mb-3">
                  <p className="text-sm font-semibold text-orange-100">ScoutBot AI</p>
                </div>
                
                {/* 🌐 NAVEGAÇÃO VISUAL */}
                {showQuiz ? (
                  <div className="mt-4 flex flex-col gap-2">
                    <p className="text-sm text-orange-300/80">Escolha uma opção para {currentMatch}:</p>
                    <div className="flex flex-wrap gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="bg-orange-950/30 hover:bg-orange-950/50 text-orange-300/80 border-orange-500/20"
                        onClick={() => searchOdds(currentMatch)}
                      >
                        <Target className="w-4 h-4 mr-2" /> Ver odds
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="bg-orange-950/30 hover:bg-orange-950/50 text-orange-300/80 border-orange-500/20"
                        onClick={() => analyzeMatch(currentMatch)}
                      >
                        <TrendingUp className="w-4 h-4 mr-2" /> Analisar jogo
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="bg-orange-950/30 hover:bg-orange-950/50 text-orange-300/80 border-orange-500/20"
                        onClick={() => findValueBets(currentMatch)}
                      >
                        <Zap className="w-4 h-4 mr-2" /> Value Bets
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Loading
                    match={currentMatch || 'partida'}
                    onComplete={() => {}}
                    estimatedTime={15}
                  />
                )}
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Enhanced input section - Factory.ai inspired */}
      <div className="relative border-t border-orange-900/20 bg-gradient-to-r from-slate-950 via-orange-950/5 to-slate-950 backdrop-blur-sm">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-600/3 via-orange-500/5 to-orange-600/3"></div>
        
        <div className="relative max-w-6xl mx-auto p-6">
          <div className="flex space-x-4">
            <div className="flex-1 relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-600 to-orange-400 rounded-xl blur opacity-20 group-focus-within:opacity-40 transition duration-300"></div>
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Digite sua análise... Ex: 'Analise o jogo Brasil vs Argentina'"
                className="relative bg-gradient-to-r from-slate-900/80 to-slate-800/80 border-orange-800/30 text-orange-50 placeholder-orange-200/40 focus:border-orange-500/50 focus:ring-orange-500/20 h-14 text-base font-medium backdrop-blur-sm transition-all duration-300 focus:bg-slate-900/90"
                disabled={isLoading}
              />
            </div>
            <Button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isLoading}
              className="relative group bg-gradient-to-r from-orange-600 via-orange-500 to-orange-600 hover:from-orange-700 hover:via-orange-600 hover:to-orange-700 text-white h-14 px-8 font-semibold shadow-lg hover:shadow-orange-500/25 transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
            >
              <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-600 to-orange-400 rounded-lg blur opacity-30 group-hover:opacity-50 transition duration-300"></div>
              <div className="relative flex items-center space-x-2">
                <Send className="w-5 h-5" />
                <span className="hidden sm:inline">Enviar</span>
              </div>
            </Button>
          </div>
          
          <div className="flex items-center justify-between mt-5">
            <div className="flex items-center space-x-4">
              <p className="text-xs text-orange-200/60 font-medium">
                🤖 ScoutBot analisa automaticamente dados esportivos
              </p>

            </div>
            <div className="flex items-center space-x-6 text-xs text-orange-200/40 font-mono">
              <span className="hidden md:inline">⌘ + Enter para enviar</span>
              <span className="hidden md:inline">Shift + Enter para nova linha</span>
              <span>v2.0.1</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
