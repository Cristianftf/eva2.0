"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { GripVertical, CheckCircle2, XCircle, RotateCcw } from "lucide-react"
import type { ElementoOrdenar } from "@/lib/types/pregunta"

interface OrdenarElementosPreguntaProps {
  preguntaId: number
  textoPregunta: string
  elementos: ElementoOrdenar[]
  ordenSeleccionado?: number[]
  onOrdenSeleccionado: (preguntaId: number, orden: number[]) => void
  mostrarRespuesta?: boolean
  readonly?: boolean
}

interface ElementoConPosicion extends ElementoOrdenar {
  posicion: number
}

export function OrdenarElementosPregunta({
  preguntaId,
  textoPregunta,
  elementos,
  ordenSeleccionado = [],
  onOrdenSeleccionado,
  mostrarRespuesta = false,
  readonly = false
}: OrdenarElementosPreguntaProps) {
  const [elementosOrdenados, setElementosOrdenados] = useState<ElementoConPosicion[]>(
    elementos.map((el, index) => ({
      ...el,
      posicion: index
    }))
  )

  const manejarMoverArriba = (index: number) => {
    if (readonly || index === 0) return
    
    const nuevosElementos = [...elementosOrdenados]
    const temp = nuevosElementos[index]
    nuevosElementos[index] = nuevosElementos[index - 1]
    nuevosElementos[index - 1] = temp
    
    actualizarPosiciones(nuevosElementos)
  }

  const manejarMoverAbajo = (index: number) => {
    if (readonly || index === elementosOrdenados.length - 1) return
    
    const nuevosElementos = [...elementosOrdenados]
    const temp = nuevosElementos[index]
    nuevosElementos[index] = nuevosElementos[index + 1]
    nuevosElementos[index + 1] = temp
    
    actualizarPosiciones(nuevosElementos)
  }

  const manejarReiniciar = () => {
    if (readonly) return
    
    const elementosOriginales = elementos.map((el, index) => ({
      ...el,
      posicion: index
    }))
    setElementosOrdenados(elementosOriginales)
    onOrdenSeleccionado(preguntaId, elementosOriginales.map(el => el.id))
  }

  const actualizarPosiciones = (elementos: ElementoConPosicion[]) => {
    const elementosActualizados = elementos.map((el, index) => ({
      ...el,
      posicion: index
    }))
    
    setElementosOrdenados(elementosActualizados)
    const orden = elementosActualizados.map(el => el.id)
    onOrdenSeleccionado(preguntaId, orden)
  }

  const esOrdenCorrecto = ordenSeleccionado.length > 0 
    ? elementos.every((el, index) => 
        ordenSeleccionado[index] === el.id
      )
    : false

  const ordenCorrecto = elementos
    .sort((a, b) => a.ordenCorrecto - b.ordenCorrecto)
    .map(el => el.texto)

  return (
    <Card className="w-full">
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium leading-relaxed">
              {textoPregunta}
            </h3>
            {!readonly && (
              <Button
                variant="outline"
                size="sm"
                onClick={manejarReiniciar}
                className="gap-2"
              >
                <RotateCcw className="h-4 w-4" />
                Reiniciar
              </Button>
            )}
          </div>
          
          <div className="space-y-2">
            <Label>Ordena los siguientes elementos de menor a mayor importancia:</Label>
            
            <div className="space-y-2">
              {elementosOrdenados.map((elemento, index) => {
                const esPosicionCorrecta = mostrarRespuesta && ordenSeleccionado.length > 0
                  ? elementos.find(el => el.id === elemento.id)?.ordenCorrecto === index
                  : false

                return (
                  <div
                    key={elemento.id}
                    className={`
                      flex items-center gap-3 p-3 border rounded-lg transition-all
                      ${readonly ? 'cursor-default' : 'cursor-move hover:bg-accent'}
                      ${mostrarRespuesta && esPosicionCorrecta ? 'border-green-500 bg-green-50' : ''}
                      ${mostrarRespuesta && !esPosicionCorrecta && ordenSeleccionado.length > 0 ? 'border-red-500 bg-red-50' : ''}
                    `}
                  >
                    <div className="flex items-center gap-1">
                      <span className="text-sm font-medium text-muted-foreground min-w-[2rem]">
                        {index + 1}.
                      </span>
                      {!readonly && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => manejarMoverArriba(index)}
                          disabled={index === 0}
                          className="h-6 w-6 p-0"
                        >
                          ↑
                        </Button>
                      )}
                      {!readonly && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => manejarMoverAbajo(index)}
                          disabled={index === elementosOrdenados.length - 1}
                          className="h-6 w-6 p-0"
                        >
                          ↓
                        </Button>
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <span className="text-sm">{elemento.texto}</span>
                    </div>
                    
                    {mostrarRespuesta && ordenSeleccionado.length > 0 && (
                      <div className="flex items-center">
                        {esPosicionCorrecta ? (
                          <CheckCircle2 className="h-4 w-4 text-green-600" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-600" />
                        )}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
          
          {mostrarRespuesta && ordenSeleccionado.length > 0 && (
            <div className={`
              flex items-center gap-2 p-3 rounded-lg
              ${esOrdenCorrecto ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}
            `}>
              {esOrdenCorrecto ? (
                <CheckCircle2 className="h-5 w-5 text-green-600" />
              ) : (
                <XCircle className="h-5 w-5 text-red-600" />
              )}
              <span className="text-sm font-medium">
                {esOrdenCorrecto ? '¡Orden correcto!' : 'Orden incorrecto'}
              </span>
              {!esOrdenCorrecto && (
                <div className="text-sm">
                  <span className="font-medium">Orden correcto:</span> {ordenCorrecto.join(" → ")}
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}