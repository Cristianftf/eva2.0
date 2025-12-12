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
    setEnviando(true)
    try {
      const respuestasArray = Object.values(respuestas)

      const resultado = await cuestionariosService.enviarRespuestasCompletas(
        Number(params.id),
        respuestasArray
      )

      toast({
        title: "Cuestionario enviado",
        description: `Calificación: ${resultado.calificacion}% - ${resultado.aprobado ? 'Aprobado' : 'Reprobado'}`,
      })

      router.push("/estudiante/dashboard")
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo enviar el cuestionario",
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

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <div className="mb-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-balance">{cuestionario.titulo}</h1>
            <p className="text-muted-foreground mt-1">{cuestionario.descripcion}</p>
          </div>
          {tiempoRestante !== null && (
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
