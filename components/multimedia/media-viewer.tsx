"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { FileText, Video, Music, Image, ExternalLink, Download, AlertCircle } from "lucide-react"
import type { MultimediaItem } from "@/lib/types"

interface MediaViewerProps {
  media: MultimediaItem
  className?: string
}

export function MediaViewer({ media, className }: MediaViewerProps) {
  const [error, setError] = useState<string | null>(null)

  const getIcon = () => {
    switch (media.tipo) {
      case "video":
        return <Video className="h-5 w-5" />
      case "audio":
        return <Music className="h-5 w-5" />
      case "imagen":
        return <Image className="h-5 w-5" />
      case "documento":
        return <FileText className="h-5 w-5" />
      default:
        return <FileText className="h-5 w-5" />
    }
  }

  const getTypeColor = () => {
    switch (media.tipo) {
      case "video":
        return "bg-red-100 text-red-800"
      case "audio":
        return "bg-purple-100 text-purple-800"
      case "imagen":
        return "bg-green-100 text-green-800"
      case "documento":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const renderMediaContent = () => {
    try {
      switch (media.tipo) {
        case "video":
          return (
            <div className="aspect-video bg-black rounded-lg overflow-hidden">
              <video
                controls
                className="w-full h-full"
                preload="metadata"
                onError={() => setError("Error al cargar el video")}
              >
                <source src={media.url} type="video/mp4" />
                <source src={media.url} type="video/webm" />
                <source src={media.url} type="video/ogg" />
                Tu navegador no soporta la reproducción de video.
              </video>
            </div>
          )

        case "audio":
          return (
            <div className="bg-gray-50 p-4 rounded-lg">
              <audio
                controls
                className="w-full"
                onError={() => setError("Error al cargar el audio")}
              >
                <source src={media.url} type="audio/mp3" />
                <source src={media.url} type="audio/wav" />
                <source src={media.url} type="audio/ogg" />
                Tu navegador no soporta la reproducción de audio.
              </audio>
            </div>
          )

        case "imagen":
          return (
            <div className="bg-gray-50 p-4 rounded-lg">
              <img
                src={media.url}
                alt={media.titulo}
                className="max-w-full h-auto rounded-lg shadow-md"
                onError={() => setError("Error al cargar la imagen")}
              />
            </div>
          )

        case "documento":
          // Para documentos, mostrar un iframe si es posible, o un enlace de descarga
          if (media.url.includes('.pdf') || media.url.includes('.doc') || media.url.includes('.txt')) {
            return (
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-center">
                  <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-sm text-gray-600 mb-4">
                    Documento disponible para visualización
                  </p>
                  <div className="flex gap-2 justify-center">
                    <Button asChild variant="outline" size="sm">
                      <a href={media.url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="mr-2 h-4 w-4" />
                        Ver en nueva pestaña
                      </a>
                    </Button>
                    <Button asChild variant="outline" size="sm">
                      <a href={media.url} download>
                        <Download className="mr-2 h-4 w-4" />
                        Descargar
                      </a>
                    </Button>
                  </div>
                </div>
              </div>
            )
          }

          // Para otros tipos de documentos
          return (
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-center">
                <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p className="text-sm text-gray-600 mb-4">
                  Archivo disponible para descarga
                </p>
                <Button asChild variant="outline">
                  <a href={media.url} download>
                    <Download className="mr-2 h-4 w-4" />
                    Descargar archivo
                  </a>
                </Button>
              </div>
            </div>
          )

        default:
          return (
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-center">
                <ExternalLink className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p className="text-sm text-gray-600 mb-4">
                  Contenido multimedia no soportado directamente
                </p>
                <Button asChild variant="outline">
                  <a href={media.url} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Abrir enlace externo
                  </a>
                </Button>
              </div>
            </div>
          )
      }
    } catch (err) {
      setError("Error al procesar el contenido multimedia")
      return null
    }
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            {getIcon()}
            <CardTitle className="text-lg">{media.titulo}</CardTitle>
          </div>
          <Badge className={getTypeColor()}>
            {media.tipo.charAt(0).toUpperCase() + media.tipo.slice(1)}
          </Badge>
        </div>

        {media.duracion && (
          <div className="text-sm text-muted-foreground">
            Duración: {Math.floor(media.duracion / 60)}:{(media.duracion % 60).toString().padStart(2, '0')}
          </div>
        )}

        {media.tamanio && (
          <div className="text-sm text-muted-foreground">
            Tamaño: {(media.tamanio / 1024 / 1024).toFixed(2)} MB
          </div>
        )}
      </CardHeader>

      <CardContent>
        {error ? (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : (
          renderMediaContent()
        )}
      </CardContent>
    </Card>
  )
}
