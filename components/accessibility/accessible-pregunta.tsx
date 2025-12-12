"use client"

import { useEffect, useRef } from "react"
import { PreguntaFactory } from "@/components/preguntas/pregunta-factory"
import type { PreguntaData, RespuestaEstudiante } from "@/lib/types/pregunta"

interface AccessiblePreguntaProps {
  pregunta: PreguntaData
  respuesta?: RespuestaEstudiante
  onRespuestaSeleccionada: (respuesta: RespuestaEstudiante) => void
  mostrarRespuesta?: boolean
  readonly?: boolean
  ariaLabel?: string
  ariaDescription?: string
}

export function AccessiblePregunta({
  pregunta,
  respuesta,
  onRespuestaSeleccionada,
  mostrarRespuesta = false,
  readonly = false,
  ariaLabel,
  ariaDescription
}: AccessiblePreguntaProps) {
  const preguntaRef = useRef<HTMLDivElement>(null)
  const tituloRef = useRef<HTMLHeadingElement>(null)

  // Anunciar cambios de estado para lectores de pantalla
  useEffect(() => {
    if (respuesta && tituloRef.current) {
      // Crear live region para anuncios
      const liveRegion = document.createElement('div')
      liveRegion.setAttribute('aria-live', 'polite')
      liveRegion.setAttribute('aria-atomic', 'true')
      liveRegion.className = 'sr-only'
      liveRegion.textContent = `Pregunta respondida: ${pregunta.texto}`
      
      document.body.appendChild(liveRegion)
      
      // Limpiar después del anuncio
      setTimeout(() => {
        document.body.removeChild(liveRegion)
      }, 1000)
    }
  }, [respuesta, pregunta.texto])

  // Enfocar la pregunta cuando cambia
  useEffect(() => {
    if (tituloRef.current && !readonly) {
      tituloRef.current.focus()
    }
  }, [pregunta.id, readonly])

  const handleRespuestaSeleccionada = (respuestaData: RespuestaEstudiante) => {
    onRespuestaSeleccionada(respuestaData)
  }

  return (
    <div 
      ref={preguntaRef}
      className="pregunta-accesible"
      role="group"
      aria-labelledby={`pregunta-titulo-${pregunta.id}`}
      aria-describedby={ariaDescription ? `pregunta-desc-${pregunta.id}` : undefined}
    >
      <h2 
        ref={tituloRef}
        id={`pregunta-titulo-${pregunta.id}`}
        className="text-xl font-medium leading-relaxed mb-4 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
        tabIndex={-1}
      >
        <span className="sr-only">Pregunta {pregunta.id}: </span>
        {pregunta.texto}
      </h2>

      {ariaDescription && (
        <div 
          id={`pregunta-desc-${pregunta.id}`}
          className="sr-only"
        >
          {ariaDescription}
        </div>
      )}

      <div 
        className="tipo-pregunta-info sr-only"
        aria-label={`Tipo de pregunta: ${pregunta.tipoDescripcion}`}
      >
        Esta es una pregunta de {pregunta.tipoDescripcion.toLowerCase()}
        {pregunta.opciones && (
          <span> con {pregunta.opciones.length} opciones disponibles</span>
        )}
        {pregunta.elementosOrdenar && (
          <span> con {pregunta.elementosOrdenar.length} elementos para ordenar</span>
        )}
        {pregunta.elementosArrastrar && (
          <span> con {pregunta.elementosArrastrar.length} elementos para arrastrar</span>
        )}
        {pregunta.respuestasReferencia && (
          <span> con {pregunta.respuestasReferencia.length} respuestas de referencia</span>
        )}
      </div>

      <PreguntaFactory
        pregunta={pregunta}
        respuesta={respuesta}
        onRespuestaSeleccionada={handleRespuestaSeleccionada}
        mostrarRespuesta={mostrarRespuesta}
        readonly={readonly}
      />

      {/* Información adicional para lectores de pantalla */}
      <div className="sr-only" aria-live="polite">
        {respuesta ? (
          <span>Esta pregunta ya tiene una respuesta seleccionada</span>
        ) : (
          <span>Esta pregunta aún no ha sido respondida</span>
        )}
      </div>
    </div>
  )
}

// Componente para navegación por teclado en cuestionarios
interface KeyboardNavigationProps {
  totalPreguntas: number
  preguntaActual: number
  onPreguntaCambiar: (index: number) => void
  preguntasRespondidas: Set<number>
}

export function KeyboardNavigation({
  totalPreguntas,
  preguntaActual,
  onPreguntaCambiar,
  preguntasRespondidas
}: KeyboardNavigationProps) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowLeft':
        e.preventDefault()
        if (preguntaActual > 0) {
          onPreguntaCambiar(preguntaActual - 1)
        }
        break
      case 'ArrowRight':
        e.preventDefault()
        if (preguntaActual < totalPreguntas - 1) {
          onPreguntaCambiar(preguntaActual + 1)
        }
        break
      case 'Home':
        e.preventDefault()
        onPreguntaCambiar(0)
        break
      case 'End':
        e.preventDefault()
        onPreguntaCambiar(totalPreguntas - 1)
        break
    }
  }

  return (
    <div
      className="sr-only"
      role="navigation"
      aria-label="Navegación del cuestionario"
      tabIndex={-1}
      onKeyDown={handleKeyDown}
    >
      <p>
        Navegación por teclado disponible. Use las flechas izquierda y derecha 
        para navegar entre preguntas, o Home y End para ir a la primera o última pregunta.
      </p>
      <p>
        Pregunta actual: {preguntaActual + 1} de {totalPreguntas}
      </p>
      <p>
        Preguntas respondidas: {preguntasRespondidas.size} de {totalPreguntas}
      </p>
    </div>
  )
}