// Componente de monitoreo de cache para desarrollo
"use client"

import { useState, useEffect } from "react"
import { useQueryClient } from "@tanstack/react-query"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

interface CacheStats {
  totalQueries: number
  activeQueries: number
  staleQueries: number
  cacheSize: number
  queryDetails: Array<{
    key: string
    status: 'fresh' | 'stale' | 'fetching'
    observers: number
    dataSize: number
  }>
}

export function CacheStats() {
  const queryClient = useQueryClient()
  const [stats, setStats] = useState<CacheStats | null>(null)
  const [isOpen, setIsOpen] = useState(false)

  const getStats = (): CacheStats => {
    const cache = queryClient.getQueryCache()
    const queries = cache.getAll()
    
    const queryDetails = queries.map(query => {
      const key = JSON.stringify(query.options.queryKey)
      const dataSize = JSON.stringify(query.state.data).length
      const status = query.isStale() ? 'stale' : 'fresh'
      const observers = query.getObserversCount()
      
      return {
        key: query.options.queryKey.join(' > '),
        status: query.getObserversCount() > 0 ? 'fetching' : status,
        observers,
        dataSize: Math.round(dataSize / 1024 * 100) / 100 // KB
      }
    })

    return {
      totalQueries: queries.length,
      activeQueries: queries.filter(q => q.getObserversCount() > 0).length,
      staleQueries: queries.filter(q => q.isStale()).length,
      cacheSize: JSON.stringify(queryDetails).length,
      queryDetails: queryDetails.sort((a, b) => b.dataSize - a.dataSize)
    }
  }

  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') return
    
    const updateStats = () => {
      setStats(getStats())
    }
    
    // Actualizar stats cada 5 segundos
    const interval = setInterval(updateStats, 5000)
    updateStats() // Initial update
    
    return () => clearInterval(interval)
  }, [])

  const clearCache = () => {
    queryClient.clear()
    setStats(getStats())
  }

  const refetchAll = () => {
    queryClient.refetchQueries()
    setStats(getStats())
  }

  if (process.env.NODE_ENV !== 'development') return null

  if (!isOpen) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => setIsOpen(true)}
          className="bg-black text-white border-gray-600 hover:bg-gray-800"
        >
          Cache Stats
          {stats && (
            <Badge variant="secondary" className="ml-2">
              {stats.totalQueries}
            </Badge>
          )}
        </Button>
      </div>
    )
  }

  return (
    <Card className="fixed bottom-4 right-4 z-50 w-96 max-h-96 overflow-auto">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm">Cache Statistics</CardTitle>
          <div className="flex gap-1">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={refetchAll}
              className="h-6 px-2"
            >
              ↻
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={clearCache}
              className="h-6 px-2"
            >
              🗑
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setIsOpen(false)}
              className="h-6 px-2"
            >
              ✕
            </Button>
          </div>
        </div>
      </CardHeader>
      
      {stats && (
        <CardContent className="pt-0">
          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span>Total Queries:</span>
              <Badge variant="outline">{stats.totalQueries}</Badge>
            </div>
            <div className="flex justify-between">
              <span>Active:</span>
              <Badge variant="default">{stats.activeQueries}</Badge>
            </div>
            <div className="flex justify-between">
              <span>Stale:</span>
              <Badge variant="secondary">{stats.staleQueries}</Badge>
            </div>
            <div className="flex justify-between">
              <span>Cache Size:</span>
              <Badge variant="outline">{Math.round(stats.cacheSize / 1024)}KB</Badge>
            </div>
          </div>
          
          <Separator className="my-2" />
          
          <div className="space-y-1">
            <div className="font-semibold text-xs">Top Queries:</div>
            {stats.queryDetails.slice(0, 5).map((query, index) => (
              <div key={index} className="flex justify-between items-center text-xs">
                <div className="flex-1 truncate pr-2">
                  <span className="font-mono">{query.key}</span>
                </div>
                <div className="flex gap-1">
                  <Badge 
                    variant={query.status === 'fresh' ? 'default' : 'secondary'} 
                    className="text-xs px-1 py-0"
                  >
                    {query.status}
                  </Badge>
                  <Badge variant="outline" className="text-xs px-1 py-0">
                    {query.dataSize}KB
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      )}
    </Card>
  )
}

// Hook para usar stats de cache en otros componentes
export function useCacheStats() {
  const queryClient = useQueryClient()
  
  const getStats = () => {
    const cache = queryClient.getQueryCache()
    const queries = cache.getAll()
    
    return {
      totalQueries: queries.length,
      activeQueries: queries.filter(q => q.getObserversCount() > 0).length,
      staleQueries: queries.filter(q => q.isStale()).length,
      cacheSize: JSON.stringify(queries).length,
    }
  }
  
  return { getStats }
}