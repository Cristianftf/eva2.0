import { useState, useEffect, useCallback } from 'react'
import type { ApiResponse } from '@/lib/types'

interface UseAsyncDataOptions<T> {
  enabled?: boolean
  onSuccess?: (data: T) => void
  onError?: (error: string) => void
  dependencies?: any[]
}

interface UseAsyncDataReturn<T> {
  data: T | null
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
  setData: (data: T | null) => void
  setError: (error: string | null) => void
}

/**
 * Hook personalizado para manejar operaciones asíncronas de datos
 * Proporciona loading, error handling y refetch automático
 */
export function useAsyncData<T>(
  asyncFn: () => Promise<ApiResponse<T>>,
  options: UseAsyncDataOptions<T> = {}
): UseAsyncDataReturn<T> {
  const {
    enabled = true,
    onSuccess,
    onError,
    dependencies = []
  } = options

  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const execute = useCallback(async () => {
    if (!enabled) return

    setLoading(true)
    setError(null)

    try {
      const result = await asyncFn()

      if (result.success && result.data) {
        setData(result.data)
        onSuccess?.(result.data)
      } else {
        const errorMsg = result.error || 'Error desconocido'
        setError(errorMsg)
        onError?.(errorMsg)
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Error de conexión'
      setError(errorMsg)
      onError?.(errorMsg)
    } finally {
      setLoading(false)
    }
  }, [asyncFn, enabled, onSuccess, onError])

  useEffect(() => {
    execute()
  }, [execute, ...dependencies])

  return {
    data,
    loading,
    error,
    refetch: execute,
    setData,
    setError
  }
}