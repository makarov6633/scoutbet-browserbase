'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Globe, Search, Database, CheckCircle, Clock, Wifi, Eye, MousePointer, Zap, Network } from 'lucide-react'

interface LoadingProps {
  match: string
  onComplete?: () => void
  estimatedTime?: number
}

interface WebNavigationStep {
  id: string
  category: string
  description: string
  status: 'pending' | 'connecting' | 'navigating' | 'scraping' | 'completed' | 'failed'
  icon: React.ReactNode
  duration?: number
}

export default function Loading({ match, onComplete, estimatedTime = 18000 }: LoadingProps) {
  const [progress, setProgress] = useState(0)
  const [currentStep, setCurrentStep] = useState(0)
  const [navigationSteps, setNavigationSteps] = useState<WebNavigationStep[]>([
    {
      id: 'global-odds',
      category: 'Comparadores Globais',
      description: 'Buscando odds de múltiplas casas de apostas',
      status: 'pending',
      icon: <Globe className="w-4 h-4" />
    },
    {
      id: 'value-bets',
      category: 'Análise de Value',
      description: 'Identificando oportunidades de arbitragem',
      status: 'pending',
      icon: <Search className="w-4 h-4" />
    },
    {
      id: 'historical-data',
      category: 'Dados Históricos',
      description: 'Coletando estatísticas e tendências',
      status: 'pending',
      icon: <Database className="w-4 h-4" />
    },
    {
      id: 'live-odds',
      category: 'Odds em Tempo Real',
      description: 'Monitorando variações de odds',
      status: 'pending',
      icon: <Eye className="w-4 h-4" />
    },
    {
      id: 'market-analysis',
      category: 'Análise de Mercado',
      description: 'Verificando movimentações do mercado',
      status: 'pending',
      icon: <Network className="w-4 h-4" />
    }
  ])
  const [browserActions, setBrowserActions] = useState<string[]>([])

  // Simular navegação web real
      useEffect(() => {
    const totalSteps = navigationSteps.length
    const stepDuration = estimatedTime / totalSteps
    
    let stepIndex = 0
    let isCancelled = false
    
    const webActions = [
        "🌐 Inicializando navegador...",
        "🔗 Conectando aos servidores...",
        "📡 Estabelecendo conexão segura...",
        "🌍 Navegando pela web em tempo real...",
        "🔍 Buscando dados em múltiplas fontes...",
        "📊 Extraindo informações atualizadas...",
        "⚡ Processando dados em tempo real...",
        "✅ Dados coletados com sucesso!"
      ]
    
    const processStep = () => {
      if (isCancelled || stepIndex >= totalSteps) {
        if (!isCancelled) {
          setProgress(100)
          setTimeout(() => {
            onComplete?.()
          }, 500)
        }
        return
      }

      const step = navigationSteps[stepIndex]
      
      // Fase 1: Conectando
      setNavigationSteps(prev => prev.map((s, i) => 
        i === stepIndex ? { ...s, status: 'connecting' } : s
      ))
      setBrowserActions(prev => [...prev, `🔗 Conectando a fontes de ${step.category.toLowerCase()}...`])
      setCurrentStep(stepIndex)
      
      setTimeout(() => {
        // Fase 2: Navegando
        setNavigationSteps(prev => prev.map((s, i) => 
          i === stepIndex ? { ...s, status: 'navigating' } : s
        ))
        setBrowserActions(prev => [...prev, `🌐 Navegando por múltiplas fontes...`])
        
        setTimeout(() => {
          // Fase 3: Fazendo scraping
          setNavigationSteps(prev => prev.map((s, i) => 
            i === stepIndex ? { ...s, status: 'scraping' } : s
          ))
          setBrowserActions(prev => [...prev, `👁️ ${step.description}`])
          
          setTimeout(() => {
            // Fase 4: Completo
            const duration = Math.floor(Math.random() * 4000) + 2000 // 2-6s
            setNavigationSteps(prev => prev.map((s, i) => 
              i === stepIndex ? { ...s, status: 'completed', duration } : s
            ))
            setBrowserActions(prev => [...prev, `✅ ${step.category} concluído (${(duration/1000).toFixed(1)}s)`])
            
            setProgress(((stepIndex + 1) / totalSteps) * 100)
            stepIndex++
            
            if (stepIndex < totalSteps) {
              setTimeout(processStep, 800)
            } else {
              setTimeout(() => {
                if (!isCancelled) {
                  setProgress(100)
                  setTimeout(() => {
                    onComplete?.()
                  }, 500)
                }
              }, 1000)
            }
          }, stepDuration * 0.6)
        }, stepDuration * 0.2)
      }, stepDuration * 0.2)
    }

    // Iniciar após 300ms
    const timeout = setTimeout(processStep, 300)
    
    return () => {
      isCancelled = true
      clearTimeout(timeout)
    }
  }, [estimatedTime, onComplete])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connecting': return 'text-blue-400 bg-blue-900/20 border-blue-500/30'
      case 'navigating': return 'text-yellow-400 bg-yellow-900/20 border-yellow-500/30'
      case 'scraping': return 'text-orange-400 bg-orange-900/20 border-orange-500/30'
      case 'completed': return 'text-green-400 bg-green-900/20 border-green-500/30'
      case 'failed': return 'text-red-400 bg-red-900/20 border-red-500/30'
      default: return 'text-slate-400 bg-slate-900/20 border-slate-500/30'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connecting': return <Wifi className="w-4 h-4 animate-pulse" />
      case 'navigating': return <Globe className="w-4 h-4 animate-spin" />
      case 'scraping': return <Eye className="w-4 h-4 animate-bounce" />
      case 'completed': return <CheckCircle className="w-4 h-4" />
      default: return <Clock className="w-4 h-4" />
    }
  }

  return (
    <Card className="p-6 bg-gradient-to-br from-slate-900/80 via-blue-950/20 to-slate-900/80 border-slate-700/50 backdrop-blur-sm">
      {/* Header do Navegador */}
      <div className="mb-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg border border-blue-500/30">
            <Globe className="w-6 h-6 text-blue-400 animate-pulse" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-100">
              Navegando
            </h3>
            <p className="text-sm text-slate-300/70">
              Coletando dados reais para: <span className="font-medium text-blue-300">{match}</span>
            </p>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-300/70">
            <span>Progresso da navegação</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-1.5 bg-slate-700/50" />
        </div>
      </div>

      {/* Categorias sendo analisadas */}
      <div className="space-y-3 mb-6">
        <h4 className="text-sm font-medium text-slate-200 flex items-center space-x-2">
          <MousePointer className="w-4 h-4" />
          <span>Fontes sendo analisadas</span>
        </h4>
        
        {navigationSteps.map((step, index) => (
          <div
            key={step.id}
            className={`p-3 rounded-lg border transition-all duration-300 ${
              index === currentStep && (step.status === 'connecting' || step.status === 'navigating' || step.status === 'scraping')
                ? 'ring-2 ring-blue-500/30 shadow-lg shadow-blue-500/10' 
                : ''
            } ${getStatusColor(step.status)}`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {getStatusIcon(step.status)}
                <div>
                  <div className="font-medium text-sm text-slate-100">{step.category}</div>
                  <div className="text-xs text-slate-300/70">{step.description}</div>
                </div>
              </div>
              
              {step.duration && (
                <Badge variant="outline" className="text-xs border-slate-600 text-slate-300">
                  {(step.duration / 1000).toFixed(1)}s
                </Badge>
              )}
            </div>
            
            {step.status === 'scraping' && index === currentStep && (
              <div className="mt-2">
                <div className="flex items-center space-x-2 text-xs text-blue-300">
                  <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-ping"></div>
                  <span>Extraindo dados em tempo real...</span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Log de navegação */}
      <div className="border-t border-slate-700/30 pt-4">
        <div className="bg-slate-900/30 rounded-lg p-3 border border-slate-700/30">
          <div className="flex items-center space-x-2 mb-2">
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
            <span className="text-xs font-medium text-slate-200">Log de Navegação</span>
          </div>
          
          <div className="space-y-1 font-mono text-xs">
            {browserActions.slice(-4).map((action, index) => (
              <div 
                key={index} 
                className={`text-slate-300 ${
                  index === browserActions.length - 1 ? 'text-blue-300' : ''
                }`}
              >
                {action}
              </div>
            ))}
            
            {browserActions.length === 0 && (
              <div className="text-slate-500 animate-pulse">
                🌐 Inicializando navegador...
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-4 text-center">
        <div className="text-xs text-slate-400">
          <Clock className="w-3 h-3 inline mr-1" />
          {Math.round((100 - progress) * (estimatedTime / 100000))}s restantes
        </div>
      </div>
    </Card>
  )
}