"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import { contenidoEducativoService } from "@/lib/services/contenido-educativo.service"
import type { TipoContenido } from "@/lib/types/contenido-educativo"
import type { ContenidoEducativo } from "@/lib/types/contenido-educativo"
import { 
  getTipoContenidoDisplay, 
  getNivelDificultadDisplay,
  getTipoContenidoColor,
  getNivelDificultadColor 
} from "@/lib/types/contenido-educativo"
import { 
  Search, 
  Shield, 
  Database, 
  Scissors, 
  BookOpen,
  ExternalLink,
  Play,
  CheckCircle2,
  AlertCircle
} from "lucide-react"

// Componentes específicos para cada tipo de contenido
import { OperadoresBooleanosViewer } from "./operadores-booleanos-viewer"
import { CraapViewer } from "./craap-viewer"
import { MotoresBusquedaViewer } from "./motores-busqueda-viewer"
import { TruncamientosViewer } from "./truncamientos-viewer"

interface ContenidoEducativoViewerProps {
  cursoId: number
  tipo?: TipoContenido
  mostrarSoloActivos?: boolean
  className?: string
}

export function ContenidoEducativoViewer({ 
  cursoId, 
  tipo, 
  mostrarSoloActivos = true,
  className = ""
}: ContenidoEducativoViewerProps) {
  const [contenidos, setContenidos] = useState<ContenidoEducativo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [tipoSeleccionado, setTipoSeleccionado] = useState<TipoContenido | null>(tipo || null)

  useEffect(() => {
    loadContenidoEducativo()
  }, [cursoId, tipo])

  const loadContenidoEducativo = async () => {
    setLoading(true)
    setError(null)

    try {
      let result
      if (tipo) {
        result = await contenidoEducativoService.obtenerContenidoPorCursoYTipo(cursoId, tipo)
      } else {
        result = await contenidoEducativoService.obtenerContenidoPorCurso(cursoId)
      }

      if (result.success && result.data) {
        const contenidoFiltrado = mostrarSoloActivos 
          ? result.data.filter(c => c.activo)
          : result.data
        setContenidos(contenidoFiltrado)
      } else {
        setError(result.error || "Error al cargar contenido educativo")
      }
    } catch (err) {
      setError("Error de conexión al cargar contenido educativo")
    } finally {
      setLoading(false)
    }
  }

  const getIconForTipo = (tipoContenido: TipoContenido) => {
    switch (tipoContenido) {
      case 'OPERADORES_BOOLEANOS':
        return Search
      case 'CRAAP':
        return Shield
      case 'MOTORES_BUSQUEDA':
        return Database
      case 'TRUNCAMIENTOS':
        return Scissors
      case 'BASES_DATOS_CIENTIFICAS':
        return BookOpen
      default:
        return BookOpen
    }
  }

  const renderTipoContent = (contenido: ContenidoEducativo) => {
    switch (contenido.tipoContenido) {
      case 'OPERADORES_BOOLEANOS':
        return <OperadoresBooleanosViewer contenido={contenido} />
      case 'CRAAP':
        return <CraapViewer contenido={contenido} />
      case 'MOTORES_BUSQUEDA':
        return <MotoresBusquedaViewer contenido={contenido} />
      case 'TRUNCAMIENTOS':
        return <TruncamientosViewer contenido={contenido} />
      default:
        return (
          <div className="prose prose-sm max-w-none">
            <div dangerouslySetInnerHTML={{ __html: contenido.contenidoHtml }} />
            {contenido.ejemplos && (
              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-2">Ejemplos:</h4>
                <p className="text-blue-800">{contenido.ejemplos}</p>
              </div>
            )}
            {contenido.ejercicios && (
              <div className="mt-4 p-4 bg-green-50 rounded-lg">
                <h4 className="font-semibold text-green-900 mb-2">Ejercicios:</h4>
                <p className="text-green-800">{contenido.ejercicios}</p>
              </div>
            )}
          </div>
        )
    }
  }

  if (loading) {
    return (
      <div className={`space-y-4 ${className}`}>
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive" className={className}>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  if (contenidos.length === 0) {
    return (
      <Card className={className}>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <BookOpen className="h-16 w-16 text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold mb-2">No hay contenido educativo disponible</h3>
          <p className="text-muted-foreground text-center">
            Este curso aún no tiene contenido de competencia informacional configurado.
          </p>
        </CardContent>
      </Card>
    )
  }

  // Si se especifica un tipo, mostrar solo ese contenido
  if (tipo) {
    const contenido = contenidos[0]
    const Icon = getIconForTipo(tipo)
    
    return (
      <Card className={className}>
        <CardHeader>
          <div className="flex items-center gap-3">
            <Icon className="h-6 w-6 text-primary" />
            <div>
              <CardTitle className="flex items-center gap-2">
                {contenido.titulo}
                <Badge className={getTipoContenidoColor(contenido.tipoContenido)}>
                  {getTipoContenidoDisplay(contenido.tipoContenido)}
                </Badge>
                {contenido.nivelDificultad && (
                  <Badge variant="outline" className={getNivelDificultadColor(contenido.nivelDificultad)}>
                    {getNivelDificultadDisplay(contenido.nivelDificultad)}
                  </Badge>
                )}
              </CardTitle>
              <CardDescription>{contenido.descripcion}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {renderTipoContent(contenido)}
        </CardContent>
      </Card>
    )
  }

  // Agrupar contenidos por tipo
  const contenidosPorTipo = contenidos.reduce((acc, contenido) => {
    if (!acc[contenido.tipoContenido]) {
      acc[contenido.tipoContenido] = []
    }
    acc[contenido.tipoContenido].push(contenido)
    return acc
  }, {} as Record<TipoContenido, ContenidoEducativo[]>)

  const tiposDisponibles = Object.keys(contenidosPorTipo) as TipoContenido[]

  return (
    <div className={className}>
      <Tabs value={tipoSeleccionado || tiposDisponibles[0]} onValueChange={(value) => setTipoSeleccionado(value as TipoContenido)}>
        <TabsList className="grid w-full" style={{ gridTemplateColumns: `repeat(${tiposDisponibles.length}, 1fr)` }}>
          {tiposDisponibles.map((tipoContenido) => {
            const Icon = getIconForTipo(tipoContenido)
            const contenido = contenidosPorTipo[tipoContenido][0]
            
            return (
              <TabsTrigger key={tipoContenido} value={tipoContenido} className="flex items-center gap-2">
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline">{getTipoContenidoDisplay(tipoContenido)}</span>
              </TabsTrigger>
            )
          })}
        </TabsList>

        {tiposDisponibles.map((tipoContenido) => {
          const contenidosDelTipo = contenidosPorTipo[tipoContenido]
          
          return (
            <TabsContent key={tipoContenido} value={tipoContenido} className="space-y-4">
              {contenidosDelTipo.map((contenido, index) => (
                <Card key={contenido.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          {contenido.activo ? (
                            <CheckCircle2 className="h-5 w-5 text-green-600" />
                          ) : (
                            <AlertCircle className="h-5 w-5 text-yellow-600" />
                          )}
                          <Badge variant={contenido.activo ? "default" : "secondary"}>
                            {contenido.activo ? "Activo" : "Inactivo"}
                          </Badge>
                        </div>
                        {contenido.orden && (
                          <Badge variant="outline">Módulo {contenido.orden}</Badge>
                        )}
                      </div>
                      {contenido.nivelDificultad && (
                        <Badge className={getNivelDificultadColor(contenido.nivelDificultad)}>
                          {getNivelDificultadDisplay(contenido.nivelDificultad)}
                        </Badge>
                      )}
                    </div>
                    <CardTitle className="text-xl">{contenido.titulo}</CardTitle>
                    <CardDescription>{contenido.descripcion}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {renderTipoContent(contenido)}
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
          )
        })}
      </Tabs>
    </div>
  )
}