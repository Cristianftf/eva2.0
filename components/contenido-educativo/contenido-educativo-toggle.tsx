"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { ContenidoCursoTab } from "../profesor/contenido-curso-tab"
import { ContenidoCursoTabEnhanced } from "./contenido-curso-tab-enhanced"
import { BookOpen, Zap, AlertCircle } from "lucide-react"

interface ContenidoEducativoToggleProps {
  cursoId: string
}

export function ContenidoEducativoToggle({ cursoId }: ContenidoEducativoToggleProps) {
  const [usarContenidoEducativo, setUsarContenidoEducativo] = useState(false)

  return (
    <div className="space-y-4">
      {/* Toggle para seleccionar modo */}
      <Card className="border-dashed">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-blue-600" />
                <CardTitle className="text-lg">Modo de Contenido</CardTitle>
              </div>
              <Badge variant={usarContenidoEducativo ? "default" : "secondary"}>
                {usarContenidoEducativo ? "Mejorado" : "Original"}
              </Badge>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground">Original</span>
              <Switch
                checked={usarContenidoEducativo}
                onCheckedChange={setUsarContenidoEducativo}
              />
              <span className="text-sm text-muted-foreground">Mejorado</span>
            </div>
          </div>
          <CardDescription>
            {usarContenidoEducativo 
              ? "Modo mejorado: Incluye contenido educativo de Competencia Informacional"
              : "Modo original: Solo temas y multimedia tradicionales"
            }
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Información sobre las mejoras */}
      {usarContenidoEducativo && (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <Zap className="h-5 w-5 text-blue-600 mt-0.5" />
              <div className="space-y-2">
                <h4 className="font-semibold text-blue-900">Nuevas Funcionalidades Incluidas:</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• <strong>Módulos de Competencia Informacional:</strong> Operadores booleanos, evaluación CRAAP, motores de búsqueda, truncamientos</li>
                  <li>• <strong>Contenido Interactivo:</strong> Simuladores y herramientas de práctica</li>
                  <li>• <strong>Organización Mejorada:</strong> Pestañas para separar temas tradicionales de contenido CI</li>
                  <li>• <strong>Compatibilidad Total:</strong> Mantiene toda la funcionalidad existente</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Alerta sobre funcionalidad nueva */}
      <Card className="border-yellow-200 bg-yellow-50">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
            <div className="space-y-1">
              <h4 className="font-semibold text-yellow-900">Nota sobre el Contenido de CI:</h4>
              <p className="text-sm text-yellow-800">
                El contenido educativo de Competencia Informacional debe ser creado previamente en el backend. 
                Si no aparece contenido, verifica que existan módulos de CI configurados para este curso.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Renderizar el componente seleccionado */}
      {usarContenidoEducativo ? (
        <ContenidoCursoTabEnhanced cursoId={cursoId} />
      ) : (
        <ContenidoCursoTab cursoId={cursoId} />
      )}
    </div>
  )
}