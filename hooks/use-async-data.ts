import { useState, useEffect, useCallback, useRef } from 'react'
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

  const asyncFnRef = useRef(asyncFn)
  const onSuccessRef = useRef(onSuccess)
  const onErrorRef = useRef(onError)

  asyncFnRef.current = asyncFn
  onSuccessRef.current = onSuccess
  onErrorRef.current = onError

  const execute = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const result = await asyncFnRef.current()

      if (result.success && result.data) {
        setData(result.data)
        onSuccessRef.current?.(result.data)
      } else {
        const errorMsg = result.error || 'Error desconocido'
        setError(errorMsg)
        onErrorRef.current?.(errorMsg)
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Error de conexión'
      setError(errorMsg)
      onErrorRef.current?.(errorMsg)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (enabled) {
      execute()
    }
  }, [execute, enabled, ...dependencies])

  return {
    data,
    loading,
    error,
    refetch: execute,
    setData,
    setError
  }
}