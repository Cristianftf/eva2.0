"use client"

import { Card, CardContent } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { CheckCircle2, AlertCircle } from "lucide-react"
import { PreguntaData, TipoPregunta, RespuestaEstudiante } from "@/lib/types/pregunta"
import { VerdaderoFalsoPregunta } from "./verdadero-falso-pregunta"
import { CompletarTextoPregunta } from "./completar-texto-pregunta"
import { OrdenarElementosPregunta } from "./ordenar-elementos-pregunta"
import { ArrastrarSoltarPregunta } from "./arrastrar-soltar-pregunta"

interface PreguntaFactoryProps {
  pregunta: PreguntaData
  respuesta?: RespuestaEstudiante
  onRespuestaSeleccionada: (respuesta: RespuestaEstudiante) => void
  mostrarRespuesta?: boolean
  readonly?: boolean
}

export function PreguntaFactory({
  pregunta,
  respuesta,
  onRespuestaSeleccionada,
  mostrarRespuesta = false,
  readonly = false
}: PreguntaFactoryProps) {
  
  const manejarRespuestaNumerica = (preguntaId: number, valor: number) => {
    onRespuestaSeleccionada({
      preguntaId,
      respuesta: valor
    })
  }

  const manejarRespuestaTexto = (preguntaId: number, valor: string) => {
    onRespuestaSeleccionada({
      preguntaId,
      respuesta: valor
    })
  }

  const manejarRespuestaArray = (preguntaId: number, valor: number[]) => {
    onRespuestaSeleccionada({
      preguntaId,
      respuesta: valor
    })
  }

  const manejarRespuestaObjeto = (preguntaId: number, valor: Record<string, any>) => {
    onRespuestaSeleccionada({
      preguntaId,
      respuesta: valor
    })
  }

  const obtenerRespuestaActual = () => {
    if (!respuesta) return undefined
    return respuesta.respuesta
  }

  // Convertir pregunta.id a number para operaciones que lo requieren
  const preguntaIdNum = Number(pregunta.id)

  switch (pregunta.tipo) {
    case TipoPregunta.OPCION_MULTIPLE:
      return (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium leading-relaxed">
                {pregunta.texto}
              </h3>
               
              <RadioGroup
                value={obtenerRespuestaActual()?.toString() || ""}
                onValueChange={(value) => manejarRespuestaNumerica(preguntaIdNum, parseInt(value))}
                disabled={readonly}
                className="space-y-3"
              >
                <div className="space-y-3">
                  {pregunta.opciones?.map((opcion) => {
                    const esSeleccionada = obtenerRespuestaActual()?.toString() === opcion.id.toString()
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
                        onClick={() => !readonly && manejarRespuestaNumerica(preguntaIdNum, Number(opcion.id))}
                      >
                        <RadioGroupItem
                          value={opcion.id.toString()}
                          id={`pregunta-${pregunta.id}-opcion-${opcion.id}`}
                          disabled={readonly}
                        />
                        <Label
                          htmlFor={`pregunta-${pregunta.id}-opcion-${opcion.id}`}
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
              </RadioGroup>
            </div>
          </CardContent>
        </Card>
      )

    case TipoPregunta.VERDADERO_FALSO:
      return (
        <VerdaderoFalsoPregunta
          preguntaId={preguntaIdNum}
          textoPregunta={pregunta.texto}
          opciones={pregunta.opciones || []}
          respuestaSeleccionada={obtenerRespuestaActual() as number}
          onRespuestaSeleccionada={manejarRespuestaNumerica}
          mostrarRespuesta={mostrarRespuesta}
          readonly={readonly}
        />
      )

    case TipoPregunta.COMPLETAR_TEXTO:
      return (
        <CompletarTextoPregunta
          preguntaId={preguntaIdNum}
          textoPregunta={pregunta.texto}
          respuestasReferencia={pregunta.respuestasReferencia}
          respuestaIngresada={obtenerRespuestaActual() as string}
          onRespuestaIngresada={manejarRespuestaTexto}
          mostrarRespuesta={mostrarRespuesta}
          readonly={readonly}
        />
      )

    case TipoPregunta.ORDENAR_ELEMENTOS:
      return (
        <OrdenarElementosPregunta
          preguntaId={preguntaIdNum}
          textoPregunta={pregunta.texto}
          elementos={pregunta.elementosOrdenar || []}
          ordenSeleccionado={obtenerRespuestaActual() as number[]}
          onOrdenSeleccionado={manejarRespuestaArray}
          mostrarRespuesta={mostrarRespuesta}
          readonly={readonly}
        />
      )

    case TipoPregunta.ARRASTRAR_SOLTAR:
      return (
        <ArrastrarSoltarPregunta
          preguntaId={preguntaIdNum}
          textoPregunta={pregunta.texto}
          elementos={pregunta.elementosArrastrar || []}
          destinos={pregunta.destinos || []}
          asociaciones={obtenerRespuestaActual() as Record<string, string>}
          onAsociacionesCambiadas={manejarRespuestaObjeto}
          mostrarRespuesta={mostrarRespuesta}
          readonly={readonly}
        />
      )

    default:
      return (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-muted-foreground">
              <p>Tipo de pregunta no soportado: {pregunta.tipo}</p>
            </div>
          </CardContent>
        </Card>
      )
  }
}
