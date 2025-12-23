"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Spinner } from "@/components/ui/spinner"
import { useToast } from "@/components/ui/use-toast"
import { cuestionariosService } from "@/lib/services/cuestionarios.service"
import { PreguntaFactory } from "@/components/preguntas/pregunta-factory"
import type { Cuestionario, Pregunta } from "@/lib/types"
import type { PreguntaData, RespuestaEstudiante } from "@/lib/types/pregunta"
import { Clock, CheckCircle2, AlertCircle } from "lucide-react"

export default function TomarCuestionarioPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [cuestionario, setCuestionario] = useState<Cuestionario | null>(null)
  const [preguntas, setPreguntas] = useState<PreguntaData[]>([])
  const [respuestas, setRespuestas] = useState<Record<number, RespuestaEstudiante>>({})
  const [preguntaActual, setPreguntaActual] = useState(0)
  const [tiempoRestante, setTiempoRestante] = useState<number | null>(null)
  const [enviando, setEnviando] = useState(false)
  const [loading, setLoading] = useState(true)
  const [resultado, setResultado] = useState<{ calificacion: number; aprobado: boolean; detallesRespuestas?: any[] } | null>(null)
  const [modoRevision, setModoRevision] = useState(false)

  useEffect(() => {
    cargarCuestionario()
  }, [params.id])

  useEffect(() => {
    if (tiempoRestante === null || tiempoRestante <= 0) return

    const timer = setInterval(() => {
      setTiempoRestante((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(timer)
          enviarCuestionario()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [tiempoRestante])

  const cargarCuestionario = async () => {
    try {
      const data = await cuestionariosService.obtenerCuestionario(Number(params.id))
      setCuestionario(data)
      
      // Usar el nuevo método para obtener preguntas detalladas
      const preguntasDetalladas = await cuestionariosService.obtenerPreguntasDetalladas(Number(params.id))
      setPreguntas(preguntasDetalladas)
      
      if (data.duracionMinutos) {
        setTiempoRestante(data.duracionMinutos * 60)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo cargar el cuestionario",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const manejarRespuestaSeleccionada = (respuesta: RespuestaEstudiante) => {
    setRespuestas((prev) => ({
      ...prev,
      [respuesta.preguntaId]: respuesta,
    }))
  }

  const siguientePregunta = () => {
    if (preguntaActual < preguntas.length - 1) {
      setPreguntaActual(preguntaActual + 1)
    }
  }

  const preguntaAnterior = () => {
    if (preguntaActual > 0) {
      setPreguntaActual(preguntaActual - 1)
    }
  }

  const enviarCuestionario = async () => {
    // Validar que todas las preguntas tengan respuesta
    const preguntasSinRespuesta = preguntas.filter(p => !respuestas[p.id])
    if (preguntasSinRespuesta.length > 0) {
      toast({
        title: "Preguntas sin responder",
        description: `Faltan ${preguntasSinRespuesta.length} pregunta(s) por responder`,
        variant: "destructive",
      })
      return
    }

    setEnviando(true)
    try {
      const respuestasArray = Object.values(respuestas)

      // Verificar que todas las respuestas sean válidas
      const respuestasInvalidas = respuestasArray.filter(r => r.respuesta === null || r.respuesta === undefined)
      if (respuestasInvalidas.length > 0) {
        toast({
          title: "Respuestas inválidas",
          description: "Algunas respuestas no son válidas. Por favor, revísalas.",
          variant: "destructive",
        })
        return
      }

      const resultadoEnvio = await cuestionariosService.enviarRespuestasCompletas(
        Number(params.id),
        respuestasArray
      )

      setResultado(resultadoEnvio)
      setModoRevision(true)

      toast({
        title: "Cuestionario enviado exitosamente",
        description: `Calificación: ${resultadoEnvio.calificacion}% - ${resultadoEnvio.aprobado ? 'Aprobado' : 'Reprobado'}`,
      })
    } catch (error: any) {
      console.error("Error al enviar cuestionario:", error)
      toast({
        title: "Error al enviar cuestionario",
        description: error.message || "Ocurrió un error inesperado. Inténtalo de nuevo.",
        variant: "destructive",
      })
    } finally {
      setEnviando(false)
    }
  }

  const formatearTiempo = (segundos: number) => {
    const minutos = Math.floor(segundos / 60)
    const segs = segundos % 60
    return `${minutos}:${segs.toString().padStart(2, "0")}`
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner className="h-8 w-8" />
      </div>
    )
  }

  if (!cuestionario) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Cuestionario no encontrado</CardTitle>
            <CardDescription>El cuestionario que buscas no existe</CardDescription>
          </CardHeader>
          <CardFooter>
            <Button onClick={() => router.back()}>Volver</Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  const pregunta = preguntas[preguntaActual]
  const progreso = ((preguntaActual + 1) / preguntas.length) * 100
  const respuestasCompletadas = Object.keys(respuestas).length
  const respuestaActual = respuestas[pregunta.id]

  if (modoRevision && resultado) {
    return (
      <div className="container mx-auto py-8 px-4 max-w-4xl">
        <div className="mb-6 space-y-4">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-balance">{cuestionario.titulo}</h1>
            <p className="text-muted-foreground mt-1">{cuestionario.descripcion}</p>
          </div>

          <Card className="text-center">
            <CardHeader>
              <CardTitle className="text-2xl">Resultado Final</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-6xl font-bold">
                  {resultado.calificacion}%
                </div>
                <div className={`text-xl font-semibold ${resultado.aprobado ? 'text-green-600' : 'text-red-600'}`}>
                  {resultado.aprobado ? 'APROBADO' : 'REPROBADO'}
                </div>
                <div className="text-muted-foreground">
                  Respuestas correctas: {resultado.detallesRespuestas?.filter(d => d.esCorrecta).length || 0} de {preguntas.length}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <h2 className="text-xl font-semibold">Revisión de Respuestas</h2>
          {preguntas.map((pregunta, index) => {
            const detalle = resultado.detallesRespuestas?.find(d => d.preguntaId === pregunta.id)
            const respuestaEstudiante = respuestas[pregunta.id]

            return (
              <Card key={pregunta.id} className={detalle?.esCorrecta ? 'border-green-200' : 'border-red-200'}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Pregunta {index + 1}</CardTitle>
                    {detalle?.esCorrecta ? (
                      <CheckCircle2 className="h-6 w-6 text-green-600" />
                    ) : (
                      <AlertCircle className="h-6 w-6 text-red-600" />
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <PreguntaFactory
                    pregunta={pregunta}
                    respuesta={respuestaEstudiante}
                    onRespuestaSeleccionada={() => {}}
                    mostrarRespuesta={true}
                    readonly={true}
                  />
                  {!detalle?.esCorrecta && (
                    <div className="mt-4 p-4 bg-red-50 rounded-lg">
                      <p className="font-semibold text-red-800">Respuesta correcta:</p>
                      <p className="text-red-700">{detalle?.respuestaCorrecta || 'Ver explicación arriba'}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div className="mt-8 text-center">
          <Button onClick={() => router.push("/estudiante/dashboard")}>
            Volver al Dashboard
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <div className="mb-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-balance">{cuestionario.titulo}</h1>
            <p className="text-muted-foreground mt-1">{cuestionario.descripcion}</p>
          </div>
          {tiempoRestante !== null && !modoRevision && (
            <Card className={tiempoRestante < 300 ? "border-destructive" : ""}>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2">
                  <Clock className={`h-5 w-5 ${tiempoRestante < 300 ? "text-destructive" : "text-muted-foreground"}`} />
                  <span className={`text-2xl font-bold ${tiempoRestante < 300 ? "text-destructive" : ""}`}>
                    {formatearTiempo(tiempoRestante)}
                  </span>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>
              Pregunta {preguntaActual + 1} de {preguntas.length}
            </span>
            <span>
              {respuestasCompletadas} de {preguntas.length} respondidas
            </span>
          </div>
          <Progress value={progreso} className="h-2" />
        </div>
      </div>

      {pregunta && (
        <>
          <PreguntaFactory
            pregunta={pregunta}
            respuesta={respuestaActual}
            onRespuestaSeleccionada={manejarRespuestaSeleccionada}
            readonly={enviando}
          />
          
          <CardFooter className="flex items-center justify-between px-0">
            <Button variant="outline" onClick={preguntaAnterior} disabled={preguntaActual === 0}>
              Anterior
            </Button>

            <div className="flex items-center gap-2">
              {respuestaActual ? (
                <CheckCircle2 className="h-5 w-5 text-green-600" />
              ) : (
                <AlertCircle className="h-5 w-5 text-yellow-600" />
              )}
            </div>

            {preguntaActual < preguntas.length - 1 ? (
              <Button onClick={siguientePregunta}>Siguiente</Button>
            ) : (
              <Button onClick={enviarCuestionario} disabled={enviando || respuestasCompletadas < preguntas.length}>
                {enviando ? (
                  <>
                    <Spinner className="mr-2 h-4 w-4" />
                    Enviando...
                  </>
                ) : (
                  "Enviar Cuestionario"
                )}
              </Button>
            )}
          </CardFooter>
        </>
      )}

      <div className="mt-6 grid grid-cols-5 sm:grid-cols-10 gap-2">
        {preguntas.map((p, index) => (
          <Button
            key={p.id}
            variant={index === preguntaActual ? "default" : respuestas[p.id] ? "secondary" : "outline"}
            size="sm"
            onClick={() => setPreguntaActual(index)}
            className="aspect-square"
          >
            {index + 1}
          </Button>
        ))}
      </div>
    </div>
  )
}
