"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/lib/context/auth.context"
import { mensajesService } from "@/lib/services/mensajes.service"
import { usuariosService } from "@/lib/services/usuarios.service"
import type { Mensaje, User } from "@/lib/types"
import { Search, Send, MessageSquare, Loader2 } from "lucide-react"

export default function ChatPage() {
  const { user } = useAuth()
  const [conversaciones, setConversaciones] = useState<User[]>([])
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [mensajes, setMensajes] = useState<Mensaje[]>([])
  const [nuevoMensaje, setNuevoMensaje] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [lastMessageId, setLastMessageId] = useState<string | null>(null)

  useEffect(() => {
    if (user) {
      loadConversaciones()

      // Actualizar lista de conversaciones cada 30 segundos
      const interval = setInterval(() => {
        loadConversaciones()
      }, 30000)

      return () => clearInterval(interval)
    }
  }, [user])

  useEffect(() => {
    if (selectedUser && user) {
      loadMensajes(selectedUser.id)

      // Actualizar mensajes cada 5 segundos
      const interval = setInterval(() => {
        loadMensajes(selectedUser.id)
      }, 5000)

      return () => clearInterval(interval)
    }
  }, [selectedUser, user])

  const loadConversaciones = async () => {
    setLoading(true)

    // Cargar usuarios disponibles para chat
    const result = await usuariosService.getChatContacts()

    if (result.success && result.data) {
      // Filtrar el usuario actual
      const otrosUsuarios = result.data.filter((u) => u.id !== user?.id)
      setConversaciones(otrosUsuarios)
    }

    setLoading(false)
  }

  const loadMensajes = async (otroUsuarioId: string) => {
    if (!user) return

    const result = await mensajesService.getConversacion(user.id, otroUsuarioId)

    if (result.success && result.data) {
      setMensajes(result.data)

      // Marcar mensajes como leídos
      result.data
        .filter((m) => m.destinatarioId === user.id && !m.leido)
        .forEach((m) => mensajesService.marcarLeido(m.id))
    }
  }

  const handleEnviarMensaje = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!nuevoMensaje.trim() || !selectedUser || !user) return

    setSending(true)

    const result = await mensajesService.enviar({
      remitenteId: user.id,
      destinatarioId: selectedUser.id,
      contenido: nuevoMensaje,
    })

    if (result.success && result.data) {
      setMensajes([...mensajes, result.data])
      setNuevoMensaje("")
    }

    setSending(false)
  }

  const filteredConversaciones = conversaciones.filter(
    (u) =>
      u.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getInitials = (nombre: string, apellido: string) => {
    return `${nombre.charAt(0)}${apellido.charAt(0)}`.toUpperCase()
  }

  const isUserOnline = (user: User) => {
    // Por ahora, consideramos que todos los usuarios están offline
    // En una implementación futura se podría agregar estado de conexión en tiempo real
    return false
  }

  return (
    <DashboardLayout>
      <Card className="h-[calc(100vh-12rem)]">
        <CardHeader>
          <CardTitle>Mensajes</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="grid md:grid-cols-3 h-[calc(100vh-16rem)]">
            {/* Sidebar - Lista de conversaciones */}
            <div className="border-r">
              <div className="p-4 border-b">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar contactos..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <ScrollArea className="h-[calc(100%-5rem)]">
                {loading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  </div>
                ) : filteredConversaciones.length === 0 ? (
                  <div className="text-center py-8 px-4">
                    <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">No hay contactos disponibles</p>
                  </div>
                ) : (
                  <div className="divide-y">
                    {filteredConversaciones.map((usuario) => (
                      <button
                        key={usuario.id}
                        onClick={() => setSelectedUser(usuario)}
                        className={`w-full p-4 flex items-center gap-3 hover:bg-muted/50 transition-colors ${
                          selectedUser?.id === usuario.id ? "bg-muted" : ""
                        }`}
                      >
                        <div className="relative">
                          <Avatar>
                            <AvatarFallback className="bg-primary text-primary-foreground">
                              {getInitials(usuario.nombre, usuario.apellido)}
                            </AvatarFallback>
                          </Avatar>
                        </div>
                        <div className="flex-1 text-left">
                          <div className="flex items-center justify-between mb-1">
                            <p className="font-medium text-sm">
                              {usuario.nombre} {usuario.apellido}
                            </p>
                            <div className="flex items-center gap-2">
                              <Badge variant="secondary" className="text-xs">
                                {usuario.rol}
                              </Badge>
                            </div>
                          </div>
                          <p className="text-xs text-muted-foreground truncate">{usuario.email}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </div>

            {/* Chat Area */}
            <div className="md:col-span-2 flex flex-col">
              {selectedUser ? (
                <>
                  {/* Chat Header */}
                  <div className="p-4 border-b flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {getInitials(selectedUser.nombre, selectedUser.apellido)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold">
                        {selectedUser.nombre} {selectedUser.apellido}
                      </p>
                      <p className="text-xs text-muted-foreground">{selectedUser.rol}</p>
                    </div>
                  </div>

                  {/* Messages */}
                  <ScrollArea className="flex-1 p-4">
                    <div className="space-y-4">
                      {mensajes.length === 0 ? (
                        <div className="text-center py-12">
                          <MessageSquare className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                          <p className="text-muted-foreground">No hay mensajes aún. Inicia la conversación</p>
                        </div>
                      ) : (
                        mensajes.map((mensaje) => {
                          const isOwn = mensaje.remitenteId === user?.id
                          return (
                            <div key={mensaje.id} className={`flex ${isOwn ? "justify-end" : "justify-start"}`}>
                              <div
                                className={`max-w-[70%] rounded-lg p-3 ${
                                  isOwn ? "bg-primary text-primary-foreground" : "bg-muted"
                                }`}
                              >
                                <p className="text-sm">{mensaje.contenido}</p>
                                <p
                                  className={`text-xs mt-1 ${
                                    isOwn ? "text-primary-foreground/70" : "text-muted-foreground"
                                  }`}
                                >
                                  {new Date(mensaje.fechaEnvio).toLocaleTimeString("es-ES", {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                                </p>
                              </div>
                            </div>
                          )
                        })
                      )}
                    </div>
                  </ScrollArea>

                  {/* Message Input */}
                  <div className="p-4 border-t">
                    <form onSubmit={handleEnviarMensaje} className="flex gap-2">
                      <Input
                        placeholder="Escribe un mensaje..."
                        value={nuevoMensaje}
                        onChange={(e) => setNuevoMensaje(e.target.value)}
                        disabled={sending}
                      />
                      <Button type="submit" disabled={sending || !nuevoMensaje.trim()}>
                        {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                      </Button>
                    </form>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <MessageSquare className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <p className="text-lg font-semibold mb-2">Selecciona una conversación</p>
                    <p className="text-muted-foreground">Elige un contacto para comenzar a chatear</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  )
}
