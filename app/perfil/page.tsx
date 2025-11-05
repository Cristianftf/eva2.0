"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/context/auth.context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Spinner } from "@/components/ui/spinner"
import { useToast } from "@/components/ui/use-toast"
import { authService } from "@/lib/services/auth.service"
import { User, Camera, Mail, Phone, MapPin, Shield } from "lucide-react"

export default function PerfilPage() {
  const { user, updateUser } = useAuth()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [guardando, setGuardando] = useState(false)

  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    email: "",
    telefono: "",
    direccion: "",
    biografia: "",
  })

  const [passwordData, setPasswordData] = useState({
    passwordActual: "",
    passwordNueva: "",
    confirmarPassword: "",
  })

  useEffect(() => {
    if (user) {
      setFormData({
        nombre: user.nombre || "",
        apellido: user.apellido || "",
        email: user.email || "",
        telefono: user.telefono || "",
        direccion: user.direccion || "",
        biografia: user.biografia || "",
      })
    }
  }, [user])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value,
    })
  }

  const guardarPerfil = async () => {
    setGuardando(true)
    try {
      const updatedUser = await authService.actualizarPerfil(formData)
      updateUser(updatedUser)
      toast({
        title: "Perfil actualizado",
        description: "Tus datos han sido guardados exitosamente",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo actualizar el perfil",
        variant: "destructive",
      })
    } finally {
      setGuardando(false)
    }
  }

  const cambiarPassword = async () => {
    if (passwordData.passwordNueva !== passwordData.confirmarPassword) {
      toast({
        title: "Error",
        description: "Las contraseñas no coinciden",
        variant: "destructive",
      })
      return
    }

    if (passwordData.passwordNueva.length < 8) {
      toast({
        title: "Error",
        description: "La contraseña debe tener al menos 8 caracteres",
        variant: "destructive",
      })
      return
    }

    setGuardando(true)
    try {
      await authService.cambiarPassword(passwordData.passwordActual, passwordData.passwordNueva)
      toast({
        title: "Contraseña actualizada",
        description: "Tu contraseña ha sido cambiada exitosamente",
      })
      setPasswordData({
        passwordActual: "",
        passwordNueva: "",
        confirmarPassword: "",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo cambiar la contraseña",
        variant: "destructive",
      })
    } finally {
      setGuardando(false)
    }
  }

  const subirFoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setLoading(true)
    try {
      const updatedUser = await authService.subirFotoPerfil(file)
      updateUser(updatedUser)
      toast({
        title: "Foto actualizada",
        description: "Tu foto de perfil ha sido actualizada",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo subir la foto",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner className="h-8 w-8" />
      </div>
    )
  }

  const iniciales = `${user.nombre?.[0] || ""}${user.apellido?.[0] || ""}`.toUpperCase()
  const rolLabel = user.rol === "ADMIN" ? "Administrador" : user.rol === "PROFESOR" ? "Profesor" : "Estudiante"

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-balance">Mi Perfil</h1>
        <p className="text-muted-foreground mt-1">Gestiona tu información personal y configuración</p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Foto de Perfil</CardTitle>
            <CardDescription>Actualiza tu foto de perfil</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-6">
              <div className="relative">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={user.fotoPerfil || "/placeholder.svg"} alt={user.nombre} />
                  <AvatarFallback className="text-2xl">{iniciales}</AvatarFallback>
                </Avatar>
                {loading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-background/80 rounded-full">
                    <Spinner className="h-6 w-6" />
                  </div>
                )}
              </div>
              <div className="flex-1">
                <Label htmlFor="foto-perfil" className="cursor-pointer">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                    <Camera className="h-4 w-4" />
                    <span>JPG, PNG o GIF (máx. 2MB)</span>
                  </div>
                  <Input id="foto-perfil" type="file" accept="image/*" onChange={subirFoto} className="hidden" />
                  <Button variant="outline" size="sm" asChild>
                    <span>Cambiar foto</span>
                  </Button>
                </Label>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="informacion" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="informacion">Información Personal</TabsTrigger>
            <TabsTrigger value="seguridad">Seguridad</TabsTrigger>
          </TabsList>

          <TabsContent value="informacion" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Información Personal</CardTitle>
                <CardDescription>Actualiza tus datos personales</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="nombre">Nombre</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="nombre"
                        name="nombre"
                        value={formData.nombre}
                        onChange={handleInputChange}
                        className="pl-9"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="apellido">Apellido</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="apellido"
                        name="apellido"
                        value={formData.apellido}
                        onChange={handleInputChange}
                        className="pl-9"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Correo Electrónico</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="pl-9"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="telefono">Teléfono</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="telefono"
                      name="telefono"
                      value={formData.telefono}
                      onChange={handleInputChange}
                      className="pl-9"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="direccion">Dirección</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="direccion"
                      name="direccion"
                      value={formData.direccion}
                      onChange={handleInputChange}
                      className="pl-9"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="biografia">Biografía</Label>
                  <Textarea
                    id="biografia"
                    name="biografia"
                    value={formData.biografia}
                    onChange={handleInputChange}
                    rows={4}
                    placeholder="Cuéntanos sobre ti..."
                  />
                </div>

                <div className="flex items-center gap-4 pt-4 border-t">
                  <Shield className="h-5 w-5 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Rol: {rolLabel}</p>
                    <p className="text-xs text-muted-foreground">
                      Miembro desde{" "}
                      {new Date(user.fechaRegistro || "").toLocaleDateString("es-ES", {
                        year: "numeric",
                        month: "long",
                      })}
                    </p>
                  </div>
                </div>
              </CardContent>
              <CardContent>
                <Button onClick={guardarPerfil} disabled={guardando} className="w-full">
                  {guardando ? (
                    <>
                      <Spinner className="mr-2 h-4 w-4" />
                      Guardando...
                    </>
                  ) : (
                    "Guardar Cambios"
                  )}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="seguridad" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Cambiar Contraseña</CardTitle>
                <CardDescription>Actualiza tu contraseña para mantener tu cuenta segura</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="passwordActual">Contraseña Actual</Label>
                  <Input
                    id="passwordActual"
                    name="passwordActual"
                    type="password"
                    value={passwordData.passwordActual}
                    onChange={handlePasswordChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="passwordNueva">Nueva Contraseña</Label>
                  <Input
                    id="passwordNueva"
                    name="passwordNueva"
                    type="password"
                    value={passwordData.passwordNueva}
                    onChange={handlePasswordChange}
                  />
                  <p className="text-xs text-muted-foreground">Mínimo 8 caracteres</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmarPassword">Confirmar Nueva Contraseña</Label>
                  <Input
                    id="confirmarPassword"
                    name="confirmarPassword"
                    type="password"
                    value={passwordData.confirmarPassword}
                    onChange={handlePasswordChange}
                  />
                </div>
              </CardContent>
              <CardContent>
                <Button onClick={cambiarPassword} disabled={guardando} className="w-full">
                  {guardando ? (
                    <>
                      <Spinner className="mr-2 h-4 w-4" />
                      Cambiando...
                    </>
                  ) : (
                    "Cambiar Contraseña"
                  )}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
