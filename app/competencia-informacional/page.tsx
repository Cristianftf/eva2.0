'use client'

import { useEffect, useState } from 'react'
import { MainNav } from '@/components/layout/main-nav'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Skeleton } from '@/components/ui/skeleton'
import { contenidoEducativoService } from '@/lib/services/contenido-educativo.service'
import type { ContenidoEducativo, TipoContenido } from '@/lib/types/contenido-educativo'
import { 
  getTipoContenidoDisplay, 
  getNivelDificultadDisplay,
  getTipoContenidoColor,
  getNivelDificultadColor 
} from '@/lib/types/contenido-educativo'
import { 
  BookOpen, 
  Search, 
  Filter, 
  CheckCircle2, 
  AlertCircle, 
  ChevronRight,
  Brain,
  Database,
  Target,
  Zap
} from 'lucide-react'

const iconosPorTipo: Record<TipoContenido, React.ComponentType<{ className?: string }>> = {
  'OPERADORES_BOOLEANOS': Brain,
  'CRAAP': Target,
  'MOTORES_BUSQUEDA': Search,
  'TRUNCAMIENTOS': Zap,
  'BASES_DATOS_CIENTIFICAS': Database
}

export default function CompetenciaInformacionalPage() {
  const [contenido, setContenido] = useState<{
    operadoresBooleanos: ContenidoEducativo[]
    craap: ContenidoEducativo[]
    motoresBusqueda: ContenidoEducativo[]
    truncamientos: ContenidoEducativo[]
  }>({
    operadoresBooleanos: [],
    craap: [],
    motoresBusqueda: [],
    truncamientos: []
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [cursoId] = useState(1) // ID del curso de CI por defecto

  useEffect(() => {
    loadContenido()
  }, [])

  const loadContenido = async () => {
    setLoading(true)
    setError(null)

    try {
      const result = await contenidoEducativoService.obtenerContenidoCICompleto(cursoId)
      
      if (result.success && result.data) {
        setContenido(result.data)
      } else {
        setError(result.error || 'Error al cargar contenido educativo')
      }
    } catch (err) {
      setError('Error de conexión al cargar el contenido')
    }

    setLoading(false)
  }

  const crearContenidoOperadores = async () => {
    try {
      const result = await contenidoEducativoService.crearContenidoOperadoresBooleanos(cursoId)
      if (result.success) {
        await loadContenido() // Recargar contenido
      }
    } catch (err) {
      console.error('Error creando contenido:', err)
    }
  }

  const renderContenidoCard = (item: ContenidoEducativo) => {
    const Icono = iconosPorTipo[item.tipoContenido as TipoContenido]
    
    return (
      <Card key={item.id} className="hover:shadow-lg transition-shadow cursor-pointer">
        <CardHeader>
          <div className="flex items-start justify-between gap-2">
            <Icono className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
            <div className="flex flex-wrap gap-2">
              <Badge className={getTipoContenidoColor(item.tipoContenido)}>
                {getTipoContenidoDisplay(item.tipoContenido)}
              </Badge>
              <Badge className={getNivelDificultadColor(item.nivelDificultad)}>
                {getNivelDificultadDisplay(item.nivelDificultad)}
              </Badge>
            </div>
          </div>
          <CardTitle className="text-xl">{item.titulo}</CardTitle>
          <CardDescription className="text-base">
            {item.descripcion}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Contenido HTML */}
            {item.contenidoHtml && (
              <div 
                className="prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: item.contenidoHtml }}
              />
            )}
            
            {/* Ejemplos */}
            {item.ejemplos && (
              <div>
                <h4 className="font-semibold mb-2">Ejemplos:</h4>
                <div 
                  className="prose prose-sm max-w-none bg-blue-50 p-4 rounded-lg"
                  dangerouslySetInnerHTML={{ __html: item.ejemplos }}
                />
              </div>
            )}
            
            {/* Ejercicios */}
            {item.ejercicios && (
              <div>
                <h4 className="font-semibold mb-2">Ejercicios:</h4>
                <div 
                  className="prose prose-sm max-w-none bg-green-50 p-4 rounded-lg"
                  dangerouslySetInnerHTML={{ __html: item.ejercicios }}
                />
              </div>
            )}
            
            <div className="flex items-center justify-between pt-4 border-t">
              <div className="text-sm text-muted-foreground">
                Orden: {item.orden}
              </div>
              <Button variant="outline" size="sm">
                Continuar
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <MainNav />
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <Skeleton className="h-10 w-96 mb-2" />
            <Skeleton className="h-6 w-[600px]" />
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-32 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <MainNav />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Competencia Informacional</h1>
          <p className="text-lg text-muted-foreground mb-6">
            Domina las habilidades esenciales para buscar, evaluar y utilizar información de manera efectiva
          </p>

          {/* Estadísticas */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-blue-600" />
                <span className="text-sm font-medium text-blue-800">Operadores Booleanos</span>
              </div>
              <div className="text-2xl font-bold text-blue-900">{contenido.operadoresBooleanos.length}</div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center gap-2">
                <Target className="h-5 w-5 text-green-600" />
                <span className="text-sm font-medium text-green-800">Evaluación CRAAP</span>
              </div>
              <div className="text-2xl font-bold text-green-900">{contenido.craap.length}</div>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="flex items-center gap-2">
                <Search className="h-5 w-5 text-purple-600" />
                <span className="text-sm font-medium text-purple-800">Motores de Búsqueda</span>
              </div>
              <div className="text-2xl font-bold text-purple-900">{contenido.motoresBusqueda.length}</div>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg">
              <div className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-orange-600" />
                <span className="text-sm font-medium text-orange-800">Truncamientos</span>
              </div>
              <div className="text-2xl font-bold text-orange-900">{contenido.truncamientos.length}</div>
            </div>
          </div>

          {/* Error State */}
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Estado vacío */}
          {contenido.operadoresBooleanos.length === 0 && 
           contenido.craap.length === 0 && 
           contenido.motoresBusqueda.length === 0 && 
           contenido.truncamientos.length === 0 && !loading && (
            <div className="text-center py-12 bg-muted/30 rounded-lg">
              <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No hay contenido educativo disponible</h3>
              <p className="text-muted-foreground mb-6">
                El contenido de Competencia Informacional aún no ha sido creado para este curso.
              </p>
              <Button onClick={crearContenidoOperadores} className="bg-blue-600 hover:bg-blue-700">
                <Brain className="mr-2 h-4 w-4" />
                Crear Contenido de Operadores Booleanos
              </Button>
            </div>
          )}
        </div>

        {/* Tabs de contenido */}
        {(contenido.operadoresBooleanos.length > 0 || 
          contenido.craap.length > 0 || 
          contenido.motoresBusqueda.length > 0 || 
          contenido.truncamientos.length > 0) && (
          <Tabs defaultValue="operadores" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="operadores" className="flex items-center gap-2">
                <Brain className="h-4 w-4" />
                Operadores Booleanos ({contenido.operadoresBooleanos.length})
              </TabsTrigger>
              <TabsTrigger value="craap" className="flex items-center gap-2">
                <Target className="h-4 w-4" />
                Evaluación CRAAP ({contenido.craap.length})
              </TabsTrigger>
              <TabsTrigger value="motores" className="flex items-center gap-2">
                <Search className="h-4 w-4" />
                Motores de Búsqueda ({contenido.motoresBusqueda.length})
              </TabsTrigger>
              <TabsTrigger value="truncamientos" className="flex items-center gap-2">
                <Zap className="h-4 w-4" />
                Truncamientos ({contenido.truncamientos.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="operadores" className="space-y-6">
              {contenido.operadoresBooleanos.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {contenido.operadoresBooleanos.map(renderContenidoCard)}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Button onClick={crearContenidoOperadores} variant="outline">
                    <Brain className="mr-2 h-4 w-4" />
                    Crear Contenido de Operadores Booleanos
                  </Button>
                </div>
              )}
            </TabsContent>

            <TabsContent value="craap" className="space-y-6">
              {contenido.craap.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {contenido.craap.map(renderContenidoCard)}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Button variant="outline" disabled>
                    <Target className="mr-2 h-4 w-4" />
                    Próximamente: Contenido CRAAP
                  </Button>
                </div>
              )}
            </TabsContent>

            <TabsContent value="motores" className="space-y-6">
              {contenido.motoresBusqueda.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {contenido.motoresBusqueda.map(renderContenidoCard)}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Button variant="outline" disabled>
                    <Search className="mr-2 h-4 w-4" />
                    Próximamente: Motores de Búsqueda
                  </Button>
                </div>
              )}
            </TabsContent>

            <TabsContent value="truncamientos" className="space-y-6">
              {contenido.truncamientos.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {contenido.truncamientos.map(renderContenidoCard)}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Button variant="outline" disabled>
                    <Zap className="mr-2 h-4 w-4" />
                    Próximamente: Truncamientos
                  </Button>
                </div>
              )}
            </TabsContent>
          </Tabs>
        )}

        {/* Info Section */}
        <div className="mt-16 bg-muted/30 rounded-lg p-8">
          <h2 className="text-2xl font-bold mb-4">¿Qué es la Competencia Informacional?</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-2">Habilidades de Búsqueda</h3>
              <p className="text-muted-foreground">
                Aprende a formular estrategias de búsqueda efectivas usando operadores booleanos, 
                truncamientos y técnicas avanzadas para encontrar información relevante.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Evaluación Crítica</h3>
              <p className="text-muted-foreground">
                Desarrolla la capacidad de evaluar la calidad, relevancia y credibilidad de las fuentes 
                utilizando criterios como CRAAP (Currency, Relevance, Authority, Accuracy, Purpose).
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Uso Ético</h3>
              <p className="text-muted-foreground">
                Comprende la importancia del uso responsable de la información, incluyendo la citación 
                correcta y el respeto por los derechos de autor.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Gestión de Información</h3>
              <p className="text-muted-foreground">
                Organiza y gestiona eficientemente la información recopilada para facilitar su 
                recuperación y uso posterior en proyectos académicos y profesionales.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}