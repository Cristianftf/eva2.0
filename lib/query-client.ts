// Configuración del QueryClient para React Query
import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutos
     
      retry: (failureCount, error: any) => {
        // No retry en errores de autenticación
        if (error?.message?.includes('401') || error?.message?.includes('403')) {
          return false
        }
        // No retry en errores del servidor
        if (error?.message?.includes('500')) {
          return false
        }
        // Retry hasta 3 veces para otros errores
        return failureCount < 3
      },
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
      refetchOnWindowFocus: false,
      refetchOnMount: true,
      refetchOnReconnect: true,
      networkMode: 'online', // Solo hacer requests cuando hay conexión
    },
    mutations: {
      retry: (failureCount, error: any) => {
        // No retry en errores de validación
        if (error?.message?.includes('400')) {
          return false
        }
        return failureCount < 1
      },
      networkMode: 'online',
    },
  },
})

// Configuración específica para desarrollo
if (process.env.NODE_ENV === 'development') {
  queryClient.setDefaultOptions({
    queries: {
      ...queryClient.getDefaultOptions().queries,
      staleTime: 30 * 1000, // 30 segundos en desarrollo
    }
  })
}

export default queryClient