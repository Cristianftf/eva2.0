"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import { useAuth } from "@/lib/context/auth.context"
import { inscripcionesService } from "@/lib/services/inscripciones.service"
import type { Inscripcion } from "@/lib/types"
import { BookOpen, Clock, TrendingUp } from "lucide-react"

export function MisCursosTab() {
  const { user } = useAuth()
  const [inscripciones, setInscripciones] = useState<Inscripcion[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (user) {
      loadInscripciones()
    }
  }, [user])

  const loadInscripciones = async () => {
    if (!user) return

    setLoading(true)
    setError(null)

    const result = await inscripcionesService.getByEstudiante(user.id)

    if (result.success && result.data) {
      setInscripciones(result.data)
    } else {
      setError(result.error || "Error al cargar cursos")
    }

    setLoading(false)
  }

  if (loading) {
    return (
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-full" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-20 w-full" />
            </CardContent>
          </Card>
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

  if (inscripciones.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <BookOpen className="h-16 w-16 text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold mb-2">No estás inscrito en ningún curso</h3>
          <p className="text-muted-foreground mb-6 text-center">
            Explora los cursos disponibles y comienza tu aprendizaje
          </p>
          <Button>Ver Cursos Disponibles</Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {inscripciones.map((inscripcion) => (
        <Card key={inscripcion.id} className="flex flex-col">
          <CardHeader>
            <CardTitle className="text-lg">{inscripcion.cursoTitulo || "Curso"}</CardTitle>
            <CardDescription className="line-clamp-2">
              {inscripcion.cursoDescripcion || "Sin descripción"}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Progreso</span>
                <span className="font-medium">{inscripcion.progreso}%</span>
              </div>
              <Progress value={inscripcion.progreso} />

              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>12h</span>
                </div>
                <div className="flex items-center gap-1">
                  <TrendingUp className="h-4 w-4" />
                  <span>En progreso</span>
                </div>
              </div>
            </div>

            <Link href={`/estudiante/curso/${inscripcion.cursoId}`}>
              <Button className="w-full">Continuar Curso</Button>
            </Link>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
