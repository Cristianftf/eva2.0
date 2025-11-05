"use client"

import { useState } from "react"
import { useAuth } from "@/lib/context/auth.context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/components/ui/use-toast"
import { Bell, Sun, Trash2 } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export default function ConfiguracionPage() {
  const { user } = useAuth()
  const { toast } = useToast()

  const [notificaciones, setNotificaciones] = useState({
    email: true,
    push: true,
    mensajes: true,
    cursos: true,
    calificaciones: true,
  })

  const [preferencias, setPreferencias] = useState({
    tema: "system",
    idioma: "es",
    zona: "America/Mexico_City",
  })

  const handleNotificacionChange = (key: string, value: boolean) => {
    setNotificaciones({ ...notificaciones, [key]: value })
    toast({
      title: "Configuración actualizada",
      description: "Tus preferencias de notificaciones han sido guardadas",
    })
  }

  const handlePreferenciaChange = (key: string, value: string) => {
    setPreferencias({ ...preferencias, [key]: value })
    toast({
      title: "Configuración actualizada",
      description: "Tus preferencias han sido guardadas",
    })
  }

  const eliminarCuenta = () => {
    toast({
      title: "Cuenta eliminada",
      description: "Tu cuenta ha sido eliminada permanentemente",
      variant: "destructive",
    })
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-balance">Configuración</h1>
        <p className="text-muted-foreground mt-1">Personaliza tu experiencia en la plataforma</p>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              <CardTitle>Notificaciones</CardTitle>
            </div>
            <CardDescription>Configura cómo y cuándo quieres recibir notificaciones</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="notif-email" className="text-base">
                  Notificaciones por Email
                </Label>
                <p className="text-sm text-muted-foreground">
                  Recibe actualizaciones importantes por correo electrónico
                </p>
              </div>
              <Switch
                id="notif-email"
                checked={notificaciones.email}
                onCheckedChange={(checked) => handleNotificacionChange("email", checked)}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="notif-push" className="text-base">
                  Notificaciones Push
                </Label>
                <p className="text-sm text-muted-foreground">Recibe notificaciones en tiempo real en tu navegador</p>
              </div>
              <Switch
                id="notif-push"
                checked={notificaciones.push}
                onCheckedChange={(checked) => handleNotificacionChange("push", checked)}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="notif-mensajes" className="text-base">
                  Mensajes y Chat
                </Label>
                <p className="text-sm text-muted-foreground">
                  Notificaciones de nuevos mensajes de profesores y estudiantes
                </p>
              </div>
              <Switch
                id="notif-mensajes"
                checked={notificaciones.mensajes}
                onCheckedChange={(checked) => handleNotificacionChange("mensajes", checked)}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="notif-cursos" className="text-base">
                  Actualizaciones de Cursos
                </Label>
                <p className="text-sm text-muted-foreground">
                  Notificaciones sobre nuevo contenido y cambios en tus cursos
                </p>
              </div>
              <Switch
                id="notif-cursos"
                checked={notificaciones.cursos}
                onCheckedChange={(checked) => handleNotificacionChange("cursos", checked)}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="notif-calificaciones" className="text-base">
                  Calificaciones
                </Label>
                <p className="text-sm text-muted-foreground">Notificaciones cuando recibas nuevas calificaciones</p>
              </div>
              <Switch
                id="notif-calificaciones"
                checked={notificaciones.calificaciones}
                onCheckedChange={(checked) => handleNotificacionChange("calificaciones", checked)}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Sun className="h-5 w-5" />
              <CardTitle>Apariencia y Preferencias</CardTitle>
            </div>
            <CardDescription>Personaliza la apariencia de la plataforma</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="tema">Tema</Label>
              <Select value={preferencias.tema} onValueChange={(value) => handlePreferenciaChange("tema", value)}>
                <SelectTrigger id="tema">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Claro</SelectItem>
                  <SelectItem value="dark">Oscuro</SelectItem>
                  <SelectItem value="system">Sistema</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">Selecciona el tema de color de la interfaz</p>
            </div>

            <Separator />

            <div className="space-y-2">
              <Label htmlFor="idioma">Idioma</Label>
              <Select value={preferencias.idioma} onValueChange={(value) => handlePreferenciaChange("idioma", value)}>
                <SelectTrigger id="idioma">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="es">Español</SelectItem>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="pt">Português</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">Idioma de la interfaz de usuario</p>
            </div>

            <Separator />

            <div className="space-y-2">
              <Label htmlFor="zona">Zona Horaria</Label>
              <Select value={preferencias.zona} onValueChange={(value) => handlePreferenciaChange("zona", value)}>
                <SelectTrigger id="zona">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="America/Mexico_City">Ciudad de México (GMT-6)</SelectItem>
                  <SelectItem value="America/Bogota">Bogotá (GMT-5)</SelectItem>
                  <SelectItem value="America/Argentina/Buenos_Aires">Buenos Aires (GMT-3)</SelectItem>
                  <SelectItem value="Europe/Madrid">Madrid (GMT+1)</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">Zona horaria para fechas y horarios</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-destructive">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Trash2 className="h-5 w-5 text-destructive" />
              <CardTitle className="text-destructive">Zona de Peligro</CardTitle>
            </div>
            <CardDescription>Acciones irreversibles en tu cuenta</CardDescription>
          </CardHeader>
          <CardContent>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="w-full">
                  Eliminar mi cuenta
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>¿Estás completamente seguro?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Esta acción no se puede deshacer. Esto eliminará permanentemente tu cuenta y todos tus datos
                    asociados, incluyendo cursos, calificaciones y mensajes.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={eliminarCuenta}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Sí, eliminar mi cuenta
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
