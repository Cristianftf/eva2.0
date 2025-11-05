"use client"

import { useEffect, useState } from "react"
import { MainNav } from "@/components/layout/main-nav"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import { recursosService } from "@/lib/services/recursos.service"
import type { RecursoConfiable } from "@/lib/types"
import { ExternalLink, Search, BookOpen, Video, FileText, Code, Database, Globe } from "lucide-react"

const categoriaIcons: Record<string, typeof BookOpen> = {
  Documentación: BookOpen,
  Videos: Video,
  Artículos: FileText,
  Tutoriales: Code,
  "Bases de Datos": Database,
  General: Globe,
}

export default function RecursosPage() {
  const [recursos, setRecursos] = useState<RecursoConfiable[]>([])
  const [filteredRecursos, setFilteredRecursos] = useState<RecursoConfiable[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategoria, setSelectedCategoria] = useState<string | null>(null)

  useEffect(() => {
    loadRecursos()
  }, [])

  useEffect(() => {
    filterRecursos()
  }, [searchTerm, selectedCategoria, recursos])

  const loadRecursos = async () => {
    setLoading(true)
    setError(null)

    const result = await recursosService.getAll()

    if (result.success && result.data) {
      setRecursos(result.data)
      setFilteredRecursos(result.data)
    } else {
      setError(result.error || "Error al cargar recursos")
    }

    setLoading(false)
  }

  const filterRecursos = () => {
    let filtered = recursos

    // Filtrar por búsqueda
    if (searchTerm) {
      filtered = filtered.filter(
        (recurso) =>
          recurso.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
          recurso.descripcion?.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Filtrar por categoría
    if (selectedCategoria) {
      filtered = filtered.filter((recurso) => recurso.categoria === selectedCategoria)
    }

    setFilteredRecursos(filtered)
  }

  const categorias = Array.from(new Set(recursos.map((r) => r.categoria).filter(Boolean)))

  const getIconForCategoria = (categoria: string) => {
    const Icon = categoriaIcons[categoria] || Globe
    return Icon
  }

  return (
    <div className="min-h-screen bg-background">
      <MainNav />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 text-balance">Recursos Confiables</h1>
          <p className="text-lg text-muted-foreground text-pretty">
            Explora nuestra colección curada de recursos educativos de alta calidad
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar recursos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Category Filters */}
          {categorias.length > 0 && (
            <div className="flex flex-wrap gap-2">
              <Button
                variant={selectedCategoria === null ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategoria(null)}
              >
                Todas
              </Button>
              {categorias.map((categoria) => (
                <Button
                  key={categoria}
                  variant={selectedCategoria === categoria ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategoria(categoria)}
                >
                  {categoria}
                </Button>
              ))}
            </div>
          )}
        </div>

        {/* Error State */}
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Loading State */}
        {loading && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-10 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Resources Grid */}
        {!loading && filteredRecursos.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRecursos.map((recurso) => {
              const Icon = getIconForCategoria(recurso.categoria || "General")
              return (
                <Card key={recurso.id} className="flex flex-col">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <Icon className="h-6 w-6 text-primary flex-shrink-0" />
                      {recurso.categoria && (
                        <Badge variant="secondary" className="text-xs">
                          {recurso.categoria}
                        </Badge>
                      )}
                    </div>
                    <CardTitle className="text-lg text-balance">{recurso.titulo}</CardTitle>
                    {recurso.descripcion && (
                      <CardDescription className="text-pretty">{recurso.descripcion}</CardDescription>
                    )}
                  </CardHeader>
                  <CardContent className="mt-auto">
                    <a href={recurso.url} target="_blank" rel="noopener noreferrer" className="block">
                      <Button className="w-full bg-transparent" variant="outline">
                        <ExternalLink className="mr-2 h-4 w-4" />
                        Visitar Recurso
                      </Button>
                    </a>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredRecursos.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No se encontraron recursos</h3>
            <p className="text-muted-foreground mb-6">
              {searchTerm || selectedCategoria
                ? "Intenta ajustar tus filtros de búsqueda"
                : "Aún no hay recursos disponibles"}
            </p>
            {(searchTerm || selectedCategoria) && (
              <Button
                onClick={() => {
                  setSearchTerm("")
                  setSelectedCategoria(null)
                }}
              >
                Limpiar Filtros
              </Button>
            )}
          </div>
        )}

        {/* Info Section */}
        <div className="mt-16 bg-muted/30 rounded-lg p-8">
          <h2 className="text-2xl font-bold mb-4">¿Por qué recursos confiables?</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-2">Calidad Verificada</h3>
              <p className="text-muted-foreground text-pretty">
                Todos los recursos han sido revisados y verificados por nuestro equipo educativo para garantizar
                información precisa y actualizada.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Fuentes Autorizadas</h3>
              <p className="text-muted-foreground text-pretty">
                Priorizamos contenido de instituciones educativas reconocidas, expertos en la materia y plataformas de
                aprendizaje establecidas.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Actualización Constante</h3>
              <p className="text-muted-foreground text-pretty">
                Revisamos y actualizamos regularmente nuestra colección para mantener la relevancia y precisión del
                contenido.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Diversidad de Formatos</h3>
              <p className="text-muted-foreground text-pretty">
                Ofrecemos recursos en múltiples formatos: documentación, videos, artículos, tutoriales y más para
                adaptarnos a diferentes estilos de aprendizaje.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
