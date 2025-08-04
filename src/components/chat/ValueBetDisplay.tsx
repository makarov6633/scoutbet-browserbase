'use client'

import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Zap, TrendingUp, Target, ArrowUpRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ValueBetDisplayProps {
  data: any
}

export default function ValueBetDisplay({ data }: ValueBetDisplayProps) {
  if (!data || !Array.isArray(data.opportunities) || data.opportunities.length === 0) {
    return (
      <Card className="p-4 my-2 bg-muted/50 text-center">
        <p>Nenhuma value bet encontrada.</p>
      </Card>
    )
  }

  return (
    <Card className="p-4 my-2 bg-muted/50 overflow-hidden">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-green-500" />
          <h3 className="font-semibold">Value Bets Encontradas</h3>
        </div>
        <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-200">
          {data.opportunities.length} oportunidades
        </Badge>
      </div>

      <div className="space-y-3">
        {data.opportunities.map((bet: any, index: number) => (
          <Card key={index} className="p-3 border border-green-200 bg-white">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-medium text-sm">{bet.match}</h4>
                <p className="text-xs text-muted-foreground">{bet.league}</p>
              </div>
              <Badge className="bg-green-500 hover:bg-green-600">
                {bet.valuePercent}% Value
              </Badge>
            </div>
            
            <div className="mt-2 grid grid-cols-2 gap-2">
              <div className="flex items-center gap-1">
                <Target className="h-4 w-4 text-blue-500" />
                <span className="text-sm">{bet.market}</span>
              </div>
              <div className="flex items-center gap-1">
                <TrendingUp className="h-4 w-4 text-green-500" />
                <span className="text-sm font-medium">{bet.bestOdd}</span>
              </div>
            </div>
            
            <div className="mt-2 flex justify-between items-center">
              <div className="text-xs text-muted-foreground">
                <span className="font-medium">{bet.bookmaker}</span> • Confiança: {bet.confidence}%
              </div>
              <Button size="sm" variant="outline" className="h-7 text-xs gap-1">
                <ArrowUpRight className="h-3 w-3" /> Apostar
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {data.summary && (
        <div className="mt-4 text-sm border-t border-border pt-3">
          <p className="font-medium">Resumo:</p>
          <p className="text-muted-foreground text-xs mt-1">{data.summary}</p>
        </div>
      )}
    </Card>
  )
}