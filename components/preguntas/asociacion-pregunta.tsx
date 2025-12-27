"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { CheckCircle2, AlertCircle } from "lucide-react"
import { useState } from "react"
import type { Opcion, Destino } from "@/lib/types/pregunta"

interface AsociacionPreguntaProps {
  preguntaId: number
  textoPregunta: string
  elementos: Opcion[]
  destinos: Destino[]
  asociaciones?: Record<string, string>
  onAsociacionesCambiadas: (preguntaId: number, asociaciones: Record<string, string>) => void
  mostrarRespuesta?: boolean
  readonly?: boolean
}

export function AsociacionPregunta({
  preguntaId,
  textoPregunta,
  elementos,
  destinos,
  asociaciones = {},
  onAsociacionesCambiadas,
  mostrarRespuesta = false,
  readonly = false
}: AsociacionPreguntaProps) {
  
  const [seleccionActual, setSeleccionActual] = useState<string | null>(null)
  
  const manejarSeleccionElemento = (elementoId: string) => {
    if (readonly) return
    setSeleccionActual(elementoId)
  }
  
  const manejarAsociacion = (destinoId: string) => {
    if (readonly || !seleccionActual) return
    
    const nuevasAsociaciones = {
      ...asociaciones,
      [`elemento_${destinoId}`]: seleccionActual
    }
    
    onAsociacionesCambiadas(preguntaId, nuevasAsociaciones)
    setSeleccionActual(null)
  }
  
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium leading-relaxed">
            {textoPregunta}
          </h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium">Elementos</h4>
              <div className="grid grid-cols-2 gap-2">
                {elementos.map((elemento) => (
                  <Button
                    key={elemento.id}
                    variant={seleccionActual === elemento.id.toString() ? "default" : "outline"}
                    onClick={() => manejarSeleccionElemento(elemento.id.toString())}
                    disabled={readonly}
                    className={`justify-start ${readonly ? 'cursor-default' : ''}`}
                  >
                    {elemento.texto}
                  </Button>
                ))}
              </div>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium">Destinos</h4>
              <div className="grid grid-cols-2 gap-2">
                {destinos.map((destino) => {
                  const elementoAsociado = asociaciones[`elemento_${destino.id}`]
                  const elemento = elementos.find(e => e.id.toString() === elementoAsociado)
                  const mostrarIndicador = mostrarRespuesta && elementoAsociado

                  return (
                    <div
                      key={destino.id}
                      className={`border rounded-lg p-2 min-h-[60px] flex items-center justify-center
                        ${mostrarIndicador && destino.elementoCorrecto === elementoAsociado ? 'border-green-500 bg-green-50' : ''}
                        ${mostrarIndicador && destino.elementoCorrecto !== elementoAsociado ? 'border-red-500 bg-red-50' : ''}
                      `}
                      onClick={() => !readonly && manejarAsociacion(destino.id.toString())}
                    >
                      {elemento ? (
                        <div className="flex items-center gap-2">
                          <span>{elemento.texto}</span>
                          {mostrarIndicador && (
                            destino.elementoCorrecto === elementoAsociado ? (
                              <CheckCircle2 className="h-4 w-4 text-green-600" />
                            ) : (
                              <AlertCircle className="h-4 w-4 text-red-600" />
                            )
                          )}
                        </div>
                      ) : (
                        <span className="text-muted-foreground">Vacío</span>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}