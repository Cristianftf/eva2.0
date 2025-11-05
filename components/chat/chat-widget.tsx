"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useAuth } from "@/lib/context/auth.context"
import { mensajesService } from "@/lib/services/mensajes.service"
import type { Mensaje } from "@/lib/types"
import { MessageSquare, X, Send, Minimize2 } from "lucide-react"

interface ChatWidgetProps {
  destinatarioId: string
  destinatarioNombre: string
}

export function ChatWidget({ destinatarioId, destinatarioNombre }: ChatWidgetProps) {
  const { user } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [mensajes, setMensajes] = useState<Mensaje[]>([])
  const [nuevoMensaje, setNuevoMensaje] = useState("")

  useEffect(() => {
    if (isOpen && user) {
      loadMensajes()
    }
  }, [isOpen, user])

  const loadMensajes = async () => {
    if (!user) return

    const result = await mensajesService.getConversacion(user.id, destinatarioId)

    if (result.success && result.data) {
      setMensajes(result.data)
    }
  }

  const handleEnviar = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!nuevoMensaje.trim() || !user) return

    const result = await mensajesService.enviar({
      remitenteId: user.id,
      destinatarioId,
      contenido: nuevoMensaje,
    })

    if (result.success && result.data) {
      setMensajes([...mensajes, result.data])
      setNuevoMensaje("")
    }
  }

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 rounded-full h-14 w-14 shadow-lg"
        size="icon"
      >
        <MessageSquare className="h-6 w-6" />
      </Button>
    )
  }

  return (
    <Card className="fixed bottom-4 right-4 w-96 shadow-2xl">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <CardTitle className="text-base">Chat con {destinatarioNombre}</CardTitle>
        <div className="flex gap-1">
          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setIsMinimized(!isMinimized)}>
            <Minimize2 className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setIsOpen(false)}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      {!isMinimized && (
        <CardContent className="p-0">
          <ScrollArea className="h-80 p-4">
            <div className="space-y-3">
              {mensajes.map((mensaje) => {
                const isOwn = mensaje.remitenteId === user?.id
                return (
                  <div key={mensaje.id} className={`flex ${isOwn ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[80%] rounded-lg p-2 text-sm ${
                        isOwn ? "bg-primary text-primary-foreground" : "bg-muted"
                      }`}
                    >
                      <p>{mensaje.contenido}</p>
                      <p className={`text-xs mt-1 ${isOwn ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                        {new Date(mensaje.fechaEnvio).toLocaleTimeString("es-ES", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </ScrollArea>

          <div className="p-3 border-t">
            <form onSubmit={handleEnviar} className="flex gap-2">
              <Input
                placeholder="Escribe un mensaje..."
                value={nuevoMensaje}
                onChange={(e) => setNuevoMensaje(e.target.value)}
                className="text-sm"
              />
              <Button type="submit" size="icon" disabled={!nuevoMensaje.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </CardContent>
      )}
    </Card>
  )
}
