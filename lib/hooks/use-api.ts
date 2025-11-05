"use client"

import { useState, useCallback } from "react"
import type { ApiResponse } from "@/lib/types"

interface UseApiOptions {
  onSuccess?: (data: unknown) => void
  onError?: (error: string) => void
}

export function useApi<T>(apiFunction: (...args: unknown[]) => Promise<ApiResponse<T>>, options?: UseApiOptions) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const execute = useCallback(
    async (...args: unknown[]) => {
      setLoading(true)
      setError(null)

      try {
        const response = await apiFunction(...args)

        if (response.success && response.data) {
          setData(response.data)
          options?.onSuccess?.(response.data)
          return { success: true, data: response.data }
        } else {
          const errorMessage = response.error || "Error desconocido"
          setError(errorMessage)
          options?.onError?.(errorMessage)
          return { success: false, error: errorMessage }
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Error desconocido"
        setError(errorMessage)
        options?.onError?.(errorMessage)
        return { success: false, error: errorMessage }
      } finally {
        setLoading(false)
      }
    },
    [apiFunction, options],
  )

  const reset = useCallback(() => {
    setData(null)
    setError(null)
    setLoading(false)
  }, [])

  return {
    data,
    loading,
    error,
    execute,
    reset,
  }
}
