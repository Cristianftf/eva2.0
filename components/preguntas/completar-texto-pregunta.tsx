"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { CheckCircle2, XCircle, HelpCircle } from "lucide-react"
import type { RespuestaReferencia } from "@/lib/types/pregunta"

interface CompletarTextoPreguntaProps {
  preguntaId: number
  textoPregunta: string
  respuestasReferencia?: RespuestaReferencia[]
  respuestaIngresada?: string
  onRespuestaIngresada: (preguntaId: number, respuesta: string) => void
  mostrarRespuesta?: boolean
  readonly?: boolean
  multilinea?: boolean
}

export function CompletarTextoPregunta({
  preguntaId,
  textoPregunta,
  respuestasReferencia = [],
  respuestaIngresada = "",
  onRespuestaIngresada,
  mostrarRespuesta = false,
  readonly = false,
  multilinea = false
}: CompletarTextoPreguntaProps) {
  const [valor, setValor] = useState(respuestaIngresada)
  const [mostrarAyuda, setMostrarAyuda] = useState(false)

  const manejarCambio = (nuevoValor: string) => {
    if (readonly) return
    
    setValor(nuevoValor)
    onRespuestaIngresada(preguntaId, nuevoValor)
  }

  const esCorrecta = respuestaIngresada && respuestasReferencia.length > 0 
    ? respuestasReferencia.some(ref => {
        const valorCorrecto = ref.valor || ref.texto || ""
        return valorCorrecto.toLowerCase().trim() === respuestaIngresada.toLowerCase().trim()
      })
    : false

  return (
    <Card className="w-full">
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium leading-relaxed">
              {textoPregunta}
            </h3>
            {respuestasReferencia.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setMostrarAyuda(!mostrarAyuda)}
                className="h-8 w-8 p-0"
              >
                <HelpCircle className="h-4 w-4" />
              </Button>
            )}
          </div>
          
          {mostrarAyuda && respuestasReferencia.length > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <h4 className="text-sm font-medium text-blue-900 mb-2">
                Respuestas de referencia:
              </h4>
              <ul className="text-sm text-blue-800 space-y-1">
                {respuestasReferencia.map((ref) => (
                  <li key={ref.id}>
                    • {ref.valor || ref.texto}
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor={`pregunta-${preguntaId}-texto`}>
              Tu respuesta:
            </Label>
            
            {multilinea ? (
              <Textarea
                id={`pregunta-${preguntaId}-texto`}
                value={valor}
                onChange={(e) => manejarCambio(e.target.value)}
                disabled={readonly}
                placeholder="Escribe tu respuesta aquí..."
                className={`
                  min-h-[100px]
                  ${mostrarRespuesta && respuestaIngresada ? (
                    esCorrecta ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'
                  ) : ''}
                `}
              />
            ) : (
              <Input
                id={`pregunta-${preguntaId}-texto`}
                type="text"
                value={valor}
                onChange={(e) => manejarCambio(e.target.value)}
                disabled={readonly}
                placeholder="Escribe tu respuesta aquí..."
                className={`
                  ${mostrarRespuesta && respuestaIngresada ? (
                    esCorrecta ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'
                  ) : ''}
                `}
              />
            )}
          </div>
          
          {mostrarRespuesta && respuestaIngresada && (
            <div className={`
              flex items-center gap-2 p-3 rounded-lg
              ${esCorrecta ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}
            `}>
              {esCorrecta ? (
                <CheckCircle2 className="h-5 w-5 text-green-600" />
              ) : (
                <XCircle className="h-5 w-5 text-red-600" />
              )}
              <span className="text-sm font-medium">
                {esCorrecta ? '¡Correcto!' : 'Incorrecto'}
              </span>
              {!esCorrecta && respuestasReferencia.length > 0 && (
                <span className="text-sm">
                  Respuesta correcta: {respuestasReferencia[0].valor || respuestasReferencia[0].texto}
                </span>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}