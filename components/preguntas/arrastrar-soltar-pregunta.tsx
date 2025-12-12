"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, XCircle, RotateCcw } from "lucide-react"
import type { ElementoArrastrar, DestinoArrastrar } from "@/lib/types/pregunta"

interface ArrastrarSoltarPreguntaProps {
  preguntaId: number
  textoPregunta: string
  elementos: ElementoArrastrar[]
  destinos: DestinoArrastrar[]
  asociaciones?: Record<string, string> // elementoId -> destinoId
  onAsociacionesCambiadas: (preguntaId: number, asociaciones: Record<string, string>) => void
  mostrarRespuesta?: boolean
  readonly?: boolean
}

export function ArrastrarSoltarPregunta({
  preguntaId,
  textoPregunta,
  elementos,
  destinos,
  asociaciones = {},
  onAsociacionesCambiadas,
  mostrarRespuesta = false,
  readonly = false
}: ArrastrarSoltarPreguntaProps) {
  const [elementosArrastrables, setElementosArrastrables] = useState<ElementoArrastrar[]>(
    elementos.filter(el => !Object.keys(asociaciones).includes(el.id.toString()))
  )
  const [elementosColocados, setElementosColocados] = useState<Record<string, ElementoArrastrar>>(
    Object.fromEntries(
      Object.entries(asociaciones).map(([elementoId, destinoId]) => {
        const elemento = elementos.find(el => el.id.toString() === elementoId)
        return [destinoId, elemento!].filter(([key, value]) => value !== undefined)
      }).flat()
    )
  )

  const manejarArrastrarInicio = (e: React.DragEvent, elemento: ElementoArrastrar) => {
    if (readonly) return
    e.dataTransfer.setData('text/plain', elemento.id.toString())
    e.dataTransfer.effectAllowed = 'move'
  }

  const manejarSoltar = (e: React.DragEvent, destinoId: string) => {
    if (readonly) return
    e.preventDefault()
    
    const elementoId = e.dataTransfer.getData('text/plain')
    if (!elementoId) return

    const elemento = elementos.find(el => el.id.toString() === elementoId)
    if (!elemento) return

    // Remover elemento de la lista de arrastrables
    setElementosArrastrables(prev => prev.filter(el => el.id.toString() !== elementoId))
    
    // Colocar en el destino
    setElementosColocados(prev => ({
      ...prev,
      [destinoId]: elemento
    }))

    // Actualizar asociaciones
    const nuevasAsociaciones = {
      ...asociaciones,
      [elementoId]: destinoId
    }
    onAsociacionesCambiadas(preguntaId, nuevasAsociaciones)
  }

  const manejarSoltarEnLista = (e: React.DragEvent) => {
    if (readonly) return
    e.preventDefault()
    
    const elementoId = e.dataTransfer.getData('text/plain')
    if (!elementoId) return

    // Remover de cualquier destino donde estuviera
    const nuevasAsociaciones = { ...asociaciones }
    delete nuevasAsociaciones[elementoId]
    
    setElementosColocados(prev => {
      const nuevo = { ...prev }
      Object.keys(nuevo).forEach(destinoId => {
        if (nuevo[destinoId]?.id.toString() === elementoId) {
          delete nuevo[destinoId]
        }
      })
      return nuevo
    })

    // Agregar a la lista de arrastrables
    const elemento = elementos.find(el => el.id.toString() === elementoId)
    if (elemento && !elementosArrastrables.find(el => el.id.toString() === elementoId)) {
      setElementosArrastrables(prev => [...prev, elemento])
    }

    onAsociacionesCambiadas(preguntaId, nuevasAsociaciones)
  }

  const manejarDragOver = (e: React.DragEvent) => {
    if (readonly) return
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const manejarRemoverDeDestino = (destinoId: string) => {
    if (readonly) return
    
    const elemento = elementosColocados[destinoId]
    if (!elemento) return

    // Remover del destino
    setElementosColocados(prev => {
      const nuevo = { ...prev }
      delete nuevo[destinoId]
      return nuevo
    })

    // Agregar a la lista de arrastrables
    setElementosArrastrables(prev => [...prev, elemento])

    // Actualizar asociaciones
    const nuevasAsociaciones = { ...asociaciones }
    delete nuevasAsociaciones[elemento.id.toString()]
    onAsociacionesCambiadas(preguntaId, nuevasAsociaciones)
  }

  const manejarReiniciar = () => {
    if (readonly) return
    
    setElementosArrastrables(elementos)
    setElementosColocados({})
    onAsociacionesCambiadas(preguntaId, {})
  }

  const esAsociacionCorrecta = (elementoId: string, destinoId: string) => {
    const destino = destinos.find(d => d.id.toString() === destinoId)
    return destino?.elementoCorrecto?.toString() === elementoId
  }

  const todasAsociacionesCorrectas = Object.entries(asociaciones).every(([elementoId, destinoId]) =>
    esAsociacionCorrecta(elementoId, destinoId)
  )

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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Lista de elementos arrastrables */}
            <div className="space-y-2">
              <Label>Elementos disponibles:</Label>
              <div
                className="min-h-[200px] p-4 border-2 border-dashed border-muted-foreground/25 rounded-lg bg-muted/20"
                onDrop={manejarSoltarEnLista}
                onDragOver={manejarDragOver}
              >
                <div className="space-y-2">
                  {elementosArrastrables.map((elemento) => (
                    <div
                      key={elemento.id}
                      draggable={!readonly}
                      onDragStart={(e) => manejarArrastrarInicio(e, elemento)}
                      className={`
                        p-3 bg-background border rounded-lg cursor-move transition-all
                        ${readonly ? 'cursor-default opacity-60' : 'hover:shadow-md'}
                        ${mostrarRespuesta && asociaciones[elemento.id.toString()] ? 
                          (esAsociacionCorrecta(elemento.id.toString(), asociaciones[elemento.id.toString()]) ?
                            'border-green-500 bg-green-50' : 'border-red-500 bg-red-50') : ''
                        }
                      `}
                    >
                      <span className="text-sm font-medium">{elemento.texto}</span>
                    </div>
                  ))}
                  {elementosArrastrables.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-8">
                      No hay elementos disponibles
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Destinos */}
            <div className="space-y-2">
              <Label>Relaciona cada elemento con su categoría:</Label>
              <div className="space-y-3">
                {destinos.map((destino) => {
                  const elementoColocado = elementosColocados[destino.id.toString()]
                  const esCorrecto = mostrarRespuesta && elementoColocado 
                    ? esAsociacionCorrecta(elementoColocado.id.toString(), destino.id.toString())
                    : false

                  return (
                    <div
                      key={destino.id}
                      className={`
                        p-4 border-2 border-dashed rounded-lg transition-all
                        ${elementoColocado ? 'border-solid' : 'border-muted-foreground/25'}
                        ${mostrarRespuesta && elementoColocado && esCorrecto ? 'border-green-500 bg-green-50' : ''}
                        ${mostrarRespuesta && elementoColocado && !esCorrecto ? 'border-red-500 bg-red-50' : ''}
                        ${readonly ? '' : 'hover:border-primary/50'}
                      `}
                      onDrop={(e) => manejarSoltar(e, destino.id.toString())}
                      onDragOver={manejarDragOver}
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-sm">{destino.texto}</h4>
                          {mostrarRespuesta && elementoColocado && (
                            <div className="flex items-center">
                              {esCorrecto ? (
                                <CheckCircle2 className="h-4 w-4 text-green-600" />
                              ) : (
                                <XCircle className="h-4 w-4 text-red-600" />
                              )}
                            </div>
                          )}
                        </div>
                        
                        {elementoColocado ? (
                          <div className="flex items-center justify-between p-2 bg-background border rounded">
                            <span className="text-sm">{elementoColocado.texto}</span>
                            {!readonly && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => manejarRemoverDeDestino(destino.id.toString())}
                                className="h-6 w-6 p-0"
                              >
                                ×
                              </Button>
                            )}
                          </div>
                        ) : (
                          <p className="text-sm text-muted-foreground italic">
                            Arrastra un elemento aquí
                          </p>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {mostrarRespuesta && Object.keys(asociaciones).length > 0 && (
            <div className={`
              flex items-center gap-2 p-3 rounded-lg
              ${todasAsociacionesCorrectas ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}
            `}>
              {todasAsociacionesCorrectas ? (
                <CheckCircle2 className="h-5 w-5 text-green-600" />
              ) : (
                <XCircle className="h-5 w-5 text-red-600" />
              )}
              <span className="text-sm font-medium">
                {todasAsociacionesCorrectas ? '¡Todas las asociaciones son correctas!' : 'Algunas asociaciones son incorrectas'}
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}