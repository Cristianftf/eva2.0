"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { CheckCircle2, AlertCircle } from "lucide-react"
import type { Opcion } from "@/lib/types/pregunta"

interface SeleccionMultiplePreguntaProps {
  preguntaId: number
  textoPregunta: string
  opciones: Opcion[]
  respuestasSeleccionadas?: number[]
  onRespuestasSeleccionadas: (preguntaId: number, respuestas: number[]) => void
  mostrarRespuesta?: boolean
  readonly?: boolean
}

export function SeleccionMultiplePregunta({
  preguntaId,
  textoPregunta,
  opciones,
  respuestasSeleccionadas = [],
  onRespuestasSeleccionadas,
  mostrarRespuesta = false,
  readonly = false
}: SeleccionMultiplePreguntaProps) {
  
  const manejarSeleccion = (opcionId: number) => {
    if (readonly) return
    
    const nuevasRespuestas = respuestasSeleccionadas.includes(opcionId)
      ? respuestasSeleccionadas.filter(id => id !== opcionId)
      : [...respuestasSeleccionadas, opcionId]
    
    onRespuestasSeleccionadas(preguntaId, nuevasRespuestas)
  }
  
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium leading-relaxed">
            {textoPregunta}
          </h3>
          
          <div className="space-y-3">
            {opciones.map((opcion) => {
              const opcionId = Number(opcion.id)
              const esSeleccionada = respuestasSeleccionadas.includes(opcionId)
              const mostrarIndicador = mostrarRespuesta && esSeleccionada

              return (
                <div
                  key={opcion.id}
                  className={`
                    flex items-center space-x-3 rounded-lg border p-4 transition-all
                    ${readonly ? 'cursor-default' : 'cursor-pointer hover:bg-accent'}
                    ${mostrarIndicador && opcion.esCorrecta ? 'border-green-500 bg-green-50' : ''}
                    ${mostrarIndicador && !opcion.esCorrecta ? 'border-red-500 bg-red-50' : ''}
                    ${mostrarIndicador && opcion.esCorrecta ? 'ring-2 ring-green-200' : ''}
                  `}
                  onClick={() => !readonly && manejarSeleccion(opcionId)}
                >
                  <Checkbox
                    id={`pregunta-${preguntaId}-opcion-${opcion.id}`}
                    checked={esSeleccionada}
                    onCheckedChange={() => manejarSeleccion(opcionId)}
                    disabled={readonly}
                  />
                  <Label
                    htmlFor={`pregunta-${preguntaId}-opcion-${opcion.id}`}
                    className={`
                      flex-1 text-base cursor-pointer
                      ${readonly ? 'cursor-default' : ''}
                    `}
                  >
                    <div className="flex items-center justify-between">
                      <span>{opcion.texto}</span>
                      {mostrarIndicador && (
                        <div className="flex items-center">
                          {opcion.esCorrecta ? (
                            <CheckCircle2 className="h-5 w-5 text-green-600" />
                          ) : (
                            <AlertCircle className="h-5 w-5 text-red-600" />
                          )}
                        </div>
                      )}
                    </div>
                  </Label>
                </div>
              )
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}