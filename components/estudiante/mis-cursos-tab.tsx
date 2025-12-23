"use client"

import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { useStudentData } from "@/hooks/use-student-data"
import { LoadingState, ErrorState, EmptyState, SkeletonGrid } from "@/components/ui/data-states"
import { BookOpen, Clock, TrendingUp } from "lucide-react"

export function MisCursosTab() {
  const { cursosInscritos, loading, error, refetchCursosInscritos } = useStudentData()

  if (loading) {
    return <SkeletonGrid count={6} columns={3} />
  }

  if (error) {
    return <ErrorState error={error} onRetry={refetchCursosInscritos} />
  }

  if (!cursosInscritos || cursosInscritos.length === 0) {
    return (
      <EmptyState
        icon={BookOpen}
        title="No estás inscrito en ningún curso"
        description="Explora los cursos disponibles y comienza tu aprendizaje"
        action={{
          label: "Ver Cursos Disponibles",
          onClick: () => {
            // Navigate to available courses tab
            const availableTab = document.querySelector('[value="disponibles"]') as HTMLElement
            availableTab?.click()
          }
        }}
      />
    )
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {cursosInscritos.map((inscripcion) => (
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
