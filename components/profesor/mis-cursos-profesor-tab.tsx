"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import { useAuth } from "@/lib/context/auth.context"
import { coursesService } from "@/lib/services/courses.service"
import type { Curso } from "@/lib/types"
import { BookOpen, Users, Edit, Trash2 } from "lucide-react"

export function MisCursosProfesorTab() {
  const { user } = useAuth()
  const [cursos, setCursos] = useState<Curso[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (user) {
      loadCursos()
    }
  }, [user])

  const loadCursos = async () => {
    if (!user) return

    setLoading(true)
    setError(null)

    try {
      const result = await coursesService.getCoursesByProfesor(user.id)

      if (result.success && result.data) {
        setCursos(result.data)
      } else {
        setError(result.error || "Error al cargar cursos")
      }
    } catch (err) {
      setError("Error de conexión al cargar cursos")
      console.error("Error loading professor courses:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("¿Estás seguro de eliminar este curso?")) return

    try {
      const result = await coursesService.deleteCourse(id)

      if (result.success) {
        setCursos(cursos.filter((c) => c.id !== id))
      } else {
        alert(result.error || "Error al eliminar curso")
      }
    } catch (err) {
      alert("Error de conexión al eliminar curso")
      console.error("Error deleting course:", err)
    }
  }

  if (loading) {
    return (
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-64" />
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  if (cursos.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <BookOpen className="h-16 w-16 text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold mb-2">No has creado ningún curso</h3>
          <p className="text-muted-foreground mb-6 text-center">
            Comienza creando tu primer curso para compartir conocimiento
          </p>
          <Button>Crear Primer Curso</Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {cursos.map((curso) => (
        <Card key={curso.id} className="flex flex-col">
          <CardHeader>
            <div className="flex items-start justify-between gap-2 mb-2">
              <BookOpen className="h-6 w-6 text-primary flex-shrink-0" />
              <Badge variant={curso.activo ? "default" : "secondary"}>{curso.activo ? "Activo" : "Inactivo"}</Badge>
            </div>
            <CardTitle className="text-lg">{curso.titulo}</CardTitle>
            <CardDescription className="line-clamp-2">{curso.descripcion}</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col justify-between space-y-4">
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                <span>{curso.estudiantesInscritos || 0} estudiantes</span>
              </div>
            </div>

            <div className="flex gap-2">
              <Link href={`/profesor/curso/${curso.id}`} className="flex-1">
                <Button className="w-full">
                  <Edit className="mr-2 h-4 w-4" />
                  Gestionar
                </Button>
              </Link>
              <Button variant="outline" size="icon" onClick={() => handleDelete(curso.id)}>
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}