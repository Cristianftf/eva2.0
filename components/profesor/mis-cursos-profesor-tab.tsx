"use client"

import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useProfessorData } from "@/hooks/use-professor-data"
import { useConfirmationDialog } from "@/hooks/use-confirmation-dialog"
import { LoadingState, ErrorState, EmptyState, SkeletonGrid } from "@/components/ui/data-states"
import { BookOpen, Users, Edit, Trash2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

export function MisCursosProfesorTab() {
  const { cursos, loading, error, eliminarCurso, refetchCursos } = useProfessorData()
  const { confirm } = useConfirmationDialog()
  const { toast } = useToast()

  const handleDelete = async (id: string) => {
    const confirmed = await confirm("¿Estás seguro de eliminar este curso? Esta acción no se puede deshacer.")
    if (!confirmed) return

    try {
      const result = await eliminarCurso(id)
      if (result.success) {
        toast({
          title: "Curso eliminado",
          description: "El curso ha sido eliminado exitosamente.",
        })
      } else {
        toast({
          title: "Error",
          description: result.error || "Error al eliminar el curso",
          variant: "destructive",
        })
      }
    } catch (err) {
      toast({
        title: "Error de conexión",
        description: "No se pudo eliminar el curso. Inténtalo de nuevo.",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return <SkeletonGrid count={6} columns={3} />
  }

  if (error) {
    return <ErrorState error={error} onRetry={refetchCursos} />
  }

  if (!cursos || cursos.length === 0) {
    return (
      <EmptyState
        icon={BookOpen}
        title="No has creado ningún curso"
        description="Comienza creando tu primer curso para compartir conocimiento con tus estudiantes"
        action={{
          label: "Crear Primer Curso",
          onClick: () => {
            // Navigate to create course tab
            const createTab = document.querySelector('[value="crear-curso"]') as HTMLElement
            createTab?.click()
          }
        }}
      />
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
                <span>0 estudiantes</span> {/* TODO: Implementar conteo real de estudiantes */}
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