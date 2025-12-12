"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { CheckCircle2, XCircle } from "lucide-react"
import type { OpcionRespuesta } from "@/lib/types/pregunta"

interface VerdaderoFalsoPreguntaProps {
  preguntaId: number
  textoPregunta: string
  opciones: OpcionRespuesta[]
  respuestaSeleccionada?: number
  onRespuestaSeleccionada: (preguntaId: number, respuestaId: number) => void
  mostrarRespuesta?: boolean
  readonly?: boolean
}

export function VerdaderoFalsoPregunta({
  preguntaId,
  textoPregunta,
  opciones,
  respuestaSeleccionada,
  onRespuestaSeleccionada,
  mostrarRespuesta = false,
  readonly = false
}: VerdaderoFalsoPreguntaProps) {
  const [valorSeleccionado, setValorSeleccionado] = useState<string>(
    respuestaSeleccionada?.toString() || ""
  )

  const manejarCambio = (valor: string) => {
    if (readonly) return
    
    setValorSeleccionado(valor)
    onRespuestaSeleccionada(preguntaId, parseInt(valor))
  }

  return (
    <Card className="w-full">
      <CardContent className="pt-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium leading-relaxed">
            {textoPregunta}
          </h3>
          
          <RadioGroup
            value={valorSeleccionado}
            onValueChange={manejarCambio}
            disabled={readonly}
            className="space-y-3"
          >
            {opciones.map((opcion) => {
              const esSeleccionada = valorSeleccionado === opcion.id.toString()
              const esCorrecta = opcion.esCorrecta
              const mostrarIndicador = mostrarRespuesta && esSeleccionada

              return (
                <div
                  key={opcion.id}
                  className={`
                    flex items-center space-x-3 rounded-lg border p-4 transition-all
                    ${readonly ? 'cursor-default' : 'cursor-pointer hover:bg-accent'}
                    ${mostrarIndicador && esCorrecta ? 'border-green-500 bg-green-50' : ''}
                    ${mostrarIndicador && !esCorrecta ? 'border-red-500 bg-red-50' : ''}
                    ${mostrarIndicador && esCorrecta ? 'ring-2 ring-green-200' : ''}
                  `}
                  onClick={() => !readonly && manejarCambio(opcion.id.toString())}
                >
                  <RadioGroupItem 
                    value={opcion.id.toString()} 
                    id={`pregunta-${preguntaId}-opcion-${opcion.id}`}
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
                          {esCorrecta ? (
                            <CheckCircle2 className="h-5 w-5 text-green-600" />
                          ) : (
                            <XCircle className="h-5 w-5 text-red-600" />
                          )}
                        </div>
                      )}
                    </div>
                  </Label>
                </div>
              )
            })}
          </RadioGroup>
        </div>
      </CardContent>
    </Card>
  )
}