import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { RecursoConfiable } from "@/lib/types"
import { ExternalLink, BookOpen, Video, FileText, Code, Database, Globe, Shield, AlertTriangle, Stethoscope, Heart } from "lucide-react"

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
  "Primeros Auxilios": Heart,
  "Salud Pública": Shield,
  Cardiología: Heart,
  "Salud Mental": Shield,
  Nutrición: Shield,
  Inmunología: Shield,
}

export function RecursoCard({ recurso }: RecursoCardProps) {
  const Icon = categoriaIcons[recurso.categoria || "General"] || Globe

  const getUrgencyIcon = (urgencia?: string) => {
    switch (urgencia) {
      case 'alta':
        return <AlertTriangle className="h-4 w-4 text-red-500" />
      case 'media':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      default:
        return null
    }
  }

  const getUrgencyColor = (urgencia?: string) => {
    switch (urgencia) {
      case 'alta':
        return 'border-red-200 bg-red-50'
      case 'media':
        return 'border-yellow-200 bg-yellow-50'
      default:
        return ''
    }
  }

  return (
    <Card className={`flex flex-col h-full ${getUrgencyColor(recurso.urgencia)}`}>
      <CardHeader>
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            <Icon className="h-6 w-6 text-primary flex-shrink-0" />
            {getUrgencyIcon(recurso.urgencia)}
          </div>
          <div className="flex flex-wrap gap-1">
            {recurso.categoria && (
              <Badge variant="secondary" className="text-xs">
                {recurso.categoria}
              </Badge>
            )}
            {recurso.especialidad && (
              <Badge variant="outline" className="text-xs flex items-center gap-1">
                <Stethoscope className="h-3 w-3" />
                {recurso.especialidad}
              </Badge>
            )}
            {recurso.verificado && (
              <Badge variant="default" className="text-xs bg-green-100 text-green-800">
                Verificado
              </Badge>
            )}
          </div>
        </div>
        <CardTitle className="text-lg text-balance">{recurso.titulo}</CardTitle>
        {recurso.descripcion && <CardDescription className="text-pretty">{recurso.descripcion}</CardDescription>}
        {recurso.contenido && (
          <p className="text-sm text-gray-600 mt-2 line-clamp-2">{recurso.contenido}</p>
        )}
        {recurso.tags && recurso.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {recurso.tags.slice(0, 3).map((tag, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </CardHeader>
      <CardContent className="mt-auto">
        <div className="flex items-center justify-between mb-2">
          {recurso.fuente && (
            <span className="text-xs text-muted-foreground">{recurso.fuente}</span>
          )}
          {recurso.fechaCreacion && (
            <span className="text-xs text-muted-foreground">
              {new Date(recurso.fechaCreacion).toLocaleDateString()}
            </span>
          )}
        </div>
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
