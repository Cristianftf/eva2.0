"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Play, Pause, Volume2, VolumeX, Maximize, Minimize, SkipBack, SkipForward, FileText, Download } from "lucide-react"

interface MediaPlayerProps {
  url: string
  tipo: "video" | "audio" | "imagen" | "documento"
  titulo?: string
  nombreArchivo?: string
  autoplay?: boolean
  onComplete?: () => void
}

// Función para convertir URLs relativas a absolutas
const getAbsoluteUrl = (url: string) => {
  if (url.startsWith('http')) {
    return url
  }
  // Asumir que las URLs relativas son para el backend
  return `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}${url}`
}

export function MediaPlayer({ url, tipo, titulo, nombreArchivo, autoplay = false, onComplete }: MediaPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [isMuted, setIsMuted] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const mediaRef = useRef<HTMLVideoElement | HTMLAudioElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const media = mediaRef.current
    if (!media || tipo === "imagen" || tipo === "documento") return

    const updateTime = () => setCurrentTime(media.currentTime)
    const updateDuration = () => setDuration(media.duration)
    const handleEnded = () => {
      setIsPlaying(false)
      onComplete?.()
    }

    media.addEventListener("timeupdate", updateTime)
    media.addEventListener("loadedmetadata", updateDuration)
    media.addEventListener("ended", handleEnded)

    return () => {
      media.removeEventListener("timeupdate", updateTime)
      media.removeEventListener("loadedmetadata", updateDuration)
      media.removeEventListener("ended", handleEnded)
    }
  }, [onComplete, tipo])

  const togglePlay = () => {
    const media = mediaRef.current
    if (!media || tipo === "imagen" || tipo === "documento") return

    if (isPlaying) {
      media.pause()
    } else {
      media.play()
    }
    setIsPlaying(!isPlaying)
  }

  const handleSeek = (value: number[]) => {
    const media = mediaRef.current
    if (!media || tipo === "imagen" || tipo === "documento") return
    media.currentTime = value[0]
    setCurrentTime(value[0])
  }

  const handleVolumeChange = (value: number[]) => {
    const media = mediaRef.current
    if (!media || tipo === "imagen" || tipo === "documento") return
    const newVolume = value[0]
    media.volume = newVolume
    setVolume(newVolume)
    setIsMuted(newVolume === 0)
  }

  const toggleMute = () => {
    const media = mediaRef.current
    if (!media || tipo === "imagen" || tipo === "documento") return

    if (isMuted) {
      media.volume = volume || 0.5
      setIsMuted(false)
    } else {
      media.volume = 0
      setIsMuted(true)
    }
  }

  const toggleFullscreen = () => {
    const container = containerRef.current
    if (!container) return

    if (!isFullscreen) {
      if (container.requestFullscreen) {
        container.requestFullscreen()
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen()
      }
    }
    setIsFullscreen(!isFullscreen)
  }

  const skip = (seconds: number) => {
    const media = mediaRef.current
    if (!media || tipo === "imagen" || tipo === "documento") return
    media.currentTime = Math.max(0, Math.min(duration, currentTime + seconds))
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  // Renderizado condicional según el tipo de archivo
  const renderContent = () => {
    switch (tipo) {
      case "video":
        return (
          <video
            ref={mediaRef as React.RefObject<HTMLVideoElement>}
            src={getAbsoluteUrl(url)}
            className="w-full aspect-video bg-black"
            autoPlay={autoplay}
            onClick={togglePlay}
            controls={false} // Usamos nuestros controles personalizados
          />
        )

      case "audio":
        return (
          <div className="w-full aspect-video bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
            <audio ref={mediaRef as React.RefObject<HTMLAudioElement>} src={getAbsoluteUrl(url)} autoPlay={autoplay} />
            <div className="text-center">
              <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Volume2 className="h-12 w-12 text-primary" />
              </div>
              {titulo && <p className="text-lg font-medium text-balance">{titulo}</p>}
              {nombreArchivo && <p className="text-sm text-muted-foreground">{nombreArchivo}</p>}
            </div>
          </div>
        )

      case "imagen":
        return (
          <div className="w-full aspect-video bg-muted flex items-center justify-center">
            <img
              src={getAbsoluteUrl(url)}
              alt={titulo || nombreArchivo}
              className="max-w-full max-h-full object-contain"
              onLoad={() => onComplete?.()} // Marcar como completado al cargar
            />
          </div>
        )

      case "documento":
        return (
          <div className="w-full aspect-video bg-muted flex items-center justify-center">
            <div className="text-center">
              <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <FileText className="h-12 w-12 text-primary" />
              </div>
              <p className="text-lg font-medium mb-2">Documento</p>
              {nombreArchivo && <p className="text-sm text-muted-foreground mb-4">{nombreArchivo}</p>}
              <Button asChild>
                <a href={getAbsoluteUrl(url)} target="_blank" rel="noopener noreferrer" onClick={() => onComplete?.()}>
                  <Download className="h-4 w-4 mr-2" />
                  Descargar y Ver
                </a>
              </Button>
            </div>
          </div>
        )

      default:
        return (
          <div className="w-full aspect-video bg-muted flex items-center justify-center">
            <div className="text-center">
              <div className="h-24 w-24 rounded-full bg-muted-foreground/10 flex items-center justify-center mx-auto mb-4">
                <FileText className="h-12 w-12 text-muted-foreground" />
              </div>
              <p className="text-lg font-medium mb-2">Archivo no soportado</p>
              {nombreArchivo && <p className="text-sm text-muted-foreground">{nombreArchivo}</p>}
            </div>
          </div>
        )
    }
  }

  // Solo mostrar controles para video y audio
  const showControls = tipo === "video" || tipo === "audio"

  return (
    <Card ref={containerRef} className="overflow-hidden">
      <CardContent className="p-0">
        {renderContent()}

        {showControls && (
          <div className="p-4 space-y-4 bg-background">
            <div className="space-y-2">
              <Slider
                value={[currentTime]}
                max={duration || 100}
                step={0.1}
                onValueChange={handleSeek}
                className="cursor-pointer"
              />
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" onClick={() => skip(-10)}>
                  <SkipBack className="h-4 w-4" />
                </Button>
                <Button variant="default" size="icon" onClick={togglePlay}>
                  {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </Button>
                <Button variant="ghost" size="icon" onClick={() => skip(10)}>
                  <SkipForward className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" onClick={toggleMute}>
                  {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                </Button>
                <Slider
                  value={[isMuted ? 0 : volume]}
                  max={1}
                  step={0.01}
                  onValueChange={handleVolumeChange}
                  className="w-24 cursor-pointer"
                />
                {tipo === "video" && (
                  <Button variant="ghost" size="icon" onClick={toggleFullscreen}>
                    {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
