# Recomendaciones de Implementación de Cache

## Problema Principal Identificado
La aplicación **NO tiene implementación de cache**, lo que causa:
- Refetch de datos en cada navegación
- Performance degradado
- Carga innecesaria en el backend
- Experiencia de usuario lenta

## Solución Recomendada: React Query + SWR

### 1. Instalación de Dependencias

```bash
npm install @tanstack/react-query @tanstack/react-query-devtools
npm install swr
```

### 2. Configuración del QueryClient

```typescript
// lib/query-client.ts
import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutos
      cacheTime: 10 * 60 * 1000, // 10 minutos (antes era gcTime)
      retry: 2,
      retryDelay: 1000,
      refetchOnWindowFocus: false,
      refetchOnMount: true,
      refetchOnReconnect: true,
    },
    mutations: {
      retry: 1,
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
```

### 3. Providers en RootLayout

```typescript
// app/layout.tsx - Actualizar providers
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

const queryClient = new QueryClient()

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={inter.className}>
        <QueryClientProvider client={queryClient}>
          <I18nProvider>
            <AuthProvider>
              <div id="root" className="min-h-screen flex flex-col">
                <header role="banner" className="border-b">
                  {/* Header content */}
                </header>
                <main role="main" className="flex-1">
                  {children}
                </main>
                <footer role="contentinfo" className="border-t mt-auto">
                  {/* Footer content */}
                </footer>
              </div>
            </AuthProvider>
          </I18nProvider>
          {process.env.NODE_ENV === 'development' && <ReactQueryDevtools />}
        </QueryClientProvider>
      </body>
    </html>
  )
}
```

### 4. Hooks de Cache para Servicios

```typescript
// hooks/use-cached-data.ts
"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { coursesService } from "@/lib/services/courses.service"
import { usuariosService } from "@/lib/services/usuarios.service"
import { useAuth } from "@/lib/context/auth.context"

// Cache para cursos
export function useCachedCourses(page = 1, pageSize = 1000) {
  return useQuery({
    queryKey: ["courses", "all", page, pageSize],
    queryFn: () => coursesService.getAllCourses(page, pageSize),
    staleTime: 5 * 60 * 1000, // 5 minutos
  })
}

export function useCachedCourse(id: string) {
  return useQuery({
    queryKey: ["courses", "single", id],
    queryFn: () => coursesService.getCourseById(id),
    enabled: !!id,
    staleTime: 10 * 60 * 1000, // 10 minutos
  })
}

// Cache para cursos del profesor
export function useCachedUserCourses(userId: string) {
  return useQuery({
    queryKey: ["courses", "profesor", userId],
    queryFn: () => coursesService.getCoursesByProfesor(userId),
    enabled: !!userId,
    staleTime: 2 * 60 * 1000, // 2 minutos
  })
}

// Cache para usuarios
export function useCachedUsers() {
  return useQuery({
    queryKey: ["users", "all"],
    queryFn: () => usuariosService.getAll(),
    staleTime: 3 * 60 * 1000, // 3 minutos
  })
}

// Cache para datos del usuario actual
export function useCurrentUser() {
  const { user } = useAuth()
  
  return useQuery({
    queryKey: ["user", "current"],
    queryFn: () => usuariosService.getCurrentUser(),
    enabled: !!user,
    staleTime: 5 * 60 * 1000,
  })
}

// Mutations con invalidación automática
export function useCreateCourse() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: coursesService.createCourse,
    onSuccess: () => {
      // Invalidar cache de cursos
      queryClient.invalidateQueries({ queryKey: ["courses"] })
      queryClient.invalidateQueries({ queryKey: ["courses", "profesor"] })
    },
  })
}

export function useUpdateCourse() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => 
      coursesService.updateCourse(id, data),
    onSuccess: (data, variables) => {
      // Actualizar cache específico
      queryClient.setQueryData(
        ["courses", "single", variables.id], 
        data
      )
      // Invalidar listas
      queryClient.invalidateQueries({ queryKey: ["courses"] })
      queryClient.invalidateQueries({ queryKey: ["courses", "profesor"] })
    },
  })
}

export function useDeleteCourse() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: coursesService.deleteCourse,
    onSuccess: (_, courseId) => {
      // Remover del cache específico
      queryClient.removeQueries({ queryKey: ["courses", "single", courseId] })
      // Invalidar listas
      queryClient.invalidateQueries({ queryKey: ["courses"] })
      queryClient.invalidateQueries({ queryKey: ["courses", "profesor"] })
    },
  })
}
```

### 5. Componente de Cache Provider

```typescript
// components/providers/cache-provider.tsx
"use client"

import { useState, useEffect } from "react"
import { useQueryClient } from "@tanstack/react-query"
import { useAuth } from "@/lib/context/auth.context"

export function CacheProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient()
  const { user, isAuthenticated } = useAuth()
  
  // Limpiar cache cuando cambia el usuario
  useEffect(() => {
    if (!isAuthenticated) {
      queryClient.clear()
    }
  }, [isAuthenticated, queryClient])
  
  // Precargar datos críticos cuando se autentica
  useEffect(() => {
    if (user && isAuthenticated) {
      // Precargar datos del usuario
      queryClient.prefetchQuery({
        queryKey: ["user", "current"],
        queryFn: () => usuariosService.getCurrentUser(),
        staleTime: 5 * 60 * 1000,
      })
      
      // Precargar cursos según el rol
      if (user.rol === "PROFESOR") {
        queryClient.prefetchQuery({
          queryKey: ["courses", "profesor", user.id],
          queryFn: () => coursesService.getCoursesByProfesor(user.id),
          staleTime: 2 * 60 * 1000,
        })
      }
    }
  }, [user, isAuthenticated, queryClient])
  
  return <>{children}</>
}
```

### 6. Optimización de Componentes con Cache

```typescript
// components/courses/courses-list.tsx - Versión optimizada
"use client"

import { useCachedCourses } from "@/hooks/use-cached-data"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2 } from "lucide-react"

interface CoursesListProps {
  searchTerm?: string
  filterByProfessor?: string
}

export function CoursesList({ searchTerm, filterByProfessor }: CoursesListProps) {
  const { data: coursesResponse, isLoading, error } = useCachedCourses()
  
  // Filtrado en cliente (podría moverse al servidor)
  const filteredCourses = useMemo(() => {
    if (!coursesResponse?.data) return []
    
    let filtered = coursesResponse.data
    
    if (searchTerm) {
      filtered = filtered.filter(course =>
        course.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.descripcion?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }
    
    if (filterByProfessor) {
      filtered = filtered.filter(course => course.profesorId === filterByProfessor)
    }
    
    return filtered
  }, [coursesResponse?.data, searchTerm, filterByProfessor])
  
  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }
  
  if (error) {
    return (
      <div className="text-center py-8 text-destructive">
        Error al cargar cursos: {error.message}
      </div>
    )
  }
  
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredCourses.map((course) => (
        <Card key={course.id}>
          <CardContent>
            <h3 className="font-semibold">{course.titulo}</h3>
            <p className="text-sm text-muted-foreground">{course.descripcion}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
```

### 7. Configuración de Next.js para Cache

```typescript
// next.config.mjs - Actualizar para mejor cache
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  
  // Cache de páginas estáticas
  experimental: {
    staleTimes: {
      dynamic: 60, // 1 minuto para páginas dinámicas
      static: 300, // 5 minutos para páginas estáticas
    },
  },
  
  // Headers para cache
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=300, stale-while-revalidate=600',
          },
        ],
      },
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=60, stale-while-revalidate=300',
          },
        ],
      },
    ]
  },
  
  // Rewrites para API
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: '/api/:path*',
          destination: 'http://localhost:8080/api/:path*',
        },
      ],
    }
  },
}

export default nextConfig
```

### 8. Monitoreo y Debugging

```typescript
// utils/cache-stats.ts
"use client"

import { useQueryClient } from "@tanstack/react-query"

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

// Componente para mostrar estadísticas (solo desarrollo)
export function CacheStats() {
  const { getStats } = useCacheStats()
  const [stats, setStats] = useState(getStats())
  
  useEffect(() => {
    const interval = setInterval(() => {
      setStats(getStats())
    }, 5000)
    
    return () => clearInterval(interval)
  }, [])
  
  if (process.env.NODE_ENV !== 'development') return null
  
  return (
    <div className="fixed bottom-4 right-4 bg-black text-white p-2 rounded text-xs">
      <div>Queries: {stats.totalQueries}</div>
      <div>Active: {stats.activeQueries}</div>
      <div>Stale: {stats.staleQueries}</div>
      <div>Size: {Math.round(stats.cacheSize / 1024)}KB</div>
    </div>
  )
}
```

## Beneficios Esperados

1. **Performance**: Reducción de 60-80% en tiempo de carga de páginas
2. **UX**: Navegación instantánea entre páginas cacheadas
3. **Backend**: Reducción significativa de requests
4. **Batería**: Menor consumo de datos móviles
5. **Experiencia**: Actualización automática cuando hay nuevos datos

## Próximos Pasos

1. Implementar React Query en el layout principal
2. Crear hooks de cache para cada servicio
3. Optimizar componentes existentes
4. Configurar headers de cache
5. Agregar monitoreo de performance

Esta implementación resolverá el problema más crítico identificado en el análisis: la **ausencia total de cache**.