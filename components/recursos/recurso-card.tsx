import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { RecursoConfiable } from "@/lib/types"
import { ExternalLink, BookOpen, Video, FileText, Code, Database, Globe } from "lucide-react"

interface RecursoCardProps {
  recurso: RecursoConfiable
}

const categoriaIcons: Record<string, typeof BookOpen> = {
  Documentación: BookOpen,
  Videos: Video,
  Artículos: FileText,
  Tutoriales: Code,
  "Bases de Datos": Database,
  General: Globe,
}

export function RecursoCard({ recurso }: RecursoCardProps) {
  const Icon = categoriaIcons[recurso.categoria || "General"] || Globe

  return (
    <Card className="flex flex-col h-full">
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
        {recurso.descripcion && <CardDescription className="text-pretty">{recurso.descripcion}</CardDescription>}
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
}
