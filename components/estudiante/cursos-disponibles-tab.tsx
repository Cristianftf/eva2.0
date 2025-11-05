"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import { useAuth } from "@/lib/context/auth.context"
import { cursosService } from "@/lib/services/courses.service"
import { inscripcionesService } from "@/lib/services/inscripciones.service"
import type { Curso } from "@/lib/types"
import { Search, BookOpen, Clock, Users } from "lucide-react"

export function CursosDisponiblesTab() {
  const { user } = useAuth()
  const [cursos, setCursos] = useState<Curso[]>([])
  const [filteredCursos, setFilteredCursos] = useState<Curso[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [inscribiendo, setInscribiendo] = useState<string | null>(null)

  useEffect(() => {
    loadCursos()
  }, [])

  useEffect(() => {
    filterCursos()
  }, [searchTerm, cursos])

  const loadCursos = async () => {
    setLoading(true)
    setError(null)

    const result = await cursosService.getAll()

    if (result.success && result.data) {
      setCursos(result.data.filter((c) => c.activo))
    } else {
      setError(result.error || "Error al cargar cursos")
    }

    setLoading(false)
  }

  const filterCursos = () => {
    let filtered = cursos

    if (searchTerm) {
      filtered = filtered.filter(
        (c) =>
          c.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
          c.descripcion?.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    setFilteredCursos(filtered)
  }

  const handleInscribir = async (cursoId: string) => {
    if (!user) return

    setInscribiendo(cursoId)

    const result = await inscripcionesService.inscribir(cursoId, user.id)

    if (result.success) {
      alert("Te has inscrito exitosamente al curso")
    } else {
      alert(result.error || "Error al inscribirse al curso")
    }

    setInscribiendo(null)
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-full" />
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-64" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar cursos..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Courses Grid */}
      {filteredCursos.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <BookOpen className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No se encontraron cursos</h3>
            <p className="text-muted-foreground">Intenta con otros términos de búsqueda</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCursos.map((curso) => (
            <Card key={curso.id} className="flex flex-col">
              <CardHeader>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <BookOpen className="h-6 w-6 text-primary flex-shrink-0" />
                  <Badge variant="secondary">Disponible</Badge>
                </div>
                <CardTitle className="text-lg">{curso.titulo}</CardTitle>
                <CardDescription className="line-clamp-3">{curso.descripcion}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col justify-between space-y-4">
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>12h</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span>45 estudiantes</span>
                  </div>
                </div>

                <Button
                  className="w-full"
                  onClick={() => handleInscribir(curso.id)}
                  disabled={inscribiendo === curso.id}
                >
                  {inscribiendo === curso.id ? "Inscribiendo..." : "Inscribirse"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
