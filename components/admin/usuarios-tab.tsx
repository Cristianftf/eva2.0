"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAdminData } from "@/hooks/use-admin-data"
import { useConfirmationDialog } from "@/hooks/use-confirmation-dialog"
import { LoadingState, ErrorState, EmptyState } from "@/components/ui/data-states"
import { Search, UserPlus, Edit, Trash2, Loader2 } from "lucide-react"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import type { User } from "@/lib/types"

export function UsuariosTab() {
  const { usuarios, loading, error, crearUsuario, actualizarUsuario, eliminarUsuario, refetchUsuarios } = useAdminData()
  const { confirm } = useConfirmationDialog()
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedRol, setSelectedRol] = useState<string>("TODOS")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingUsuario, setEditingUsuario] = useState<User | null>(null)
  const [formData, setFormData] = useState({
    email: "",
    nombre: "",
    apellido: "",
    rol: "ESTUDIANTE" as User["rol"],
    password: "",
  })
  const [submitting, setSubmitting] = useState(false)

  // Filtrar usuarios usando useMemo para optimización
  const filteredUsuarios = useMemo(() => {
    if (!usuarios) return []

    let filtered = usuarios

    if (searchTerm) {
      filtered = filtered.filter(
        (u) =>
          u.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
          u.apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
          u.email.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (selectedRol !== "TODOS") {
      filtered = filtered.filter((u) => u.rol === selectedRol)
    }

    return filtered
  }, [usuarios, searchTerm, selectedRol])

  const handleDelete = async (id: string) => {
    const confirmed = await confirm("¿Estás seguro de eliminar este usuario? Esta acción no se puede deshacer.")
    if (!confirmed) return

    try {
      const result = await eliminarUsuario(id)
      if (result.success) {
        toast({
          title: "Usuario eliminado",
          description: "El usuario ha sido eliminado exitosamente.",
        })
      } else {
        toast({
          title: "Error",
          description: result.error || "Error al eliminar el usuario",
          variant: "destructive",
        })
      }
    } catch (err) {
      toast({
        title: "Error de conexión",
        description: "No se pudo eliminar el usuario. Inténtalo de nuevo.",
        variant: "destructive",
      })
    }
  }

  const handleCreateUsuario = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const result = await crearUsuario({
        ...formData,
        activo: true,
      })

      if (result.success) {
        toast({
          title: "Usuario creado",
          description: "El usuario ha sido creado exitosamente.",
        })
        setDialogOpen(false)
        resetForm()
      } else {
        toast({
          title: "Error",
          description: result.error || "Error al crear el usuario",
          variant: "destructive",
        })
      }
    } catch (err) {
      toast({
        title: "Error de conexión",
        description: "No se pudo crear el usuario. Inténtalo de nuevo.",
        variant: "destructive",
      })
    }

    setSubmitting(false)
  }

  const handleEditUsuario = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingUsuario) return

    setSubmitting(true)

    try {
      const result = await actualizarUsuario(editingUsuario.id, {
        nombre: formData.nombre,
        apellido: formData.apellido,
        email: formData.email,
        rol: formData.rol,
      })

      if (result.success) {
        toast({
          title: "Usuario actualizado",
          description: "Los datos del usuario han sido actualizados.",
        })
        setDialogOpen(false)
        setEditingUsuario(null)
        resetForm()
      } else {
        toast({
          title: "Error",
          description: result.error || "Error al actualizar el usuario",
          variant: "destructive",
        })
      }
    } catch (err) {
      toast({
        title: "Error de conexión",
        description: "No se pudo actualizar el usuario. Inténtalo de nuevo.",
        variant: "destructive",
      })
    }

    setSubmitting(false)
  }

  const resetForm = () => {
    setFormData({
      email: "",
      nombre: "",
      apellido: "",
      rol: "ESTUDIANTE",
      password: "",
    })
  }

  const openCreateDialog = () => {
    setEditingUsuario(null)
    resetForm()
    setDialogOpen(true)
  }

  const openEditDialog = (usuario: User) => {
    setEditingUsuario(usuario)
    setFormData({
      email: usuario.email,
      nombre: usuario.nombre,
      apellido: usuario.apellido,
      rol: usuario.rol,
      password: "",
    })
    setDialogOpen(true)
  }

  const getRolBadgeVariant = (rol: string) => {
    switch (rol) {
      case "ADMIN":
        return "destructive"
      case "PROFESOR":
        return "default"
      case "ESTUDIANTE":
        return "secondary"
      default:
        return "outline"
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Gestión de Usuarios</CardTitle>
            <CardDescription>Administra todos los usuarios de la plataforma</CardDescription>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={openCreateDialog}>
                <UserPlus className="mr-2 h-4 w-4" />
                Nuevo Usuario
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingUsuario ? "Editar Usuario" : "Crear Nuevo Usuario"}</DialogTitle>
                <DialogDescription>
                  {editingUsuario ? "Modifica los datos del usuario" : "Completa los datos del nuevo usuario"}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={editingUsuario ? handleEditUsuario : handleCreateUsuario}>
                <div className="space-y-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="nombre">Nombre</Label>
                      <Input
                        id="nombre"
                        value={formData.nombre}
                        onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="apellido">Apellido</Label>
                      <Input
                        id="apellido"
                        value={formData.apellido}
                        onChange={(e) => setFormData({ ...formData, apellido: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="rol">Rol</Label>
                    <Select
                      value={formData.rol}
                      onValueChange={(value) => setFormData({ ...formData, rol: value as User["rol"] })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona un rol" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ESTUDIANTE">Estudiante</SelectItem>
                        <SelectItem value="PROFESOR">Profesor</SelectItem>
                        <SelectItem value="ADMIN">Administrador</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {!editingUsuario && (
                    <div className="space-y-2">
                      <Label htmlFor="password">Contraseña</Label>
                      <Input
                        id="password"
                        type="password"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        required
                        minLength={6}
                      />
                    </div>
                  )}
                </div>
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit" disabled={submitting}>
                    {submitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {editingUsuario ? "Actualizando..." : "Creando..."}
                      </>
                    ) : (
                      editingUsuario ? "Actualizar" : "Crear"
                    )}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Filters */}
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nombre o email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={selectedRol} onValueChange={setSelectedRol}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filtrar por rol" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="TODOS">Todos los roles</SelectItem>
              <SelectItem value="ADMIN">Administrador</SelectItem>
              <SelectItem value="PROFESOR">Profesor</SelectItem>
              <SelectItem value="ESTUDIANTE">Estudiante</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {error && <ErrorState error={error} onRetry={refetchUsuarios} />}

        {/* Table */}
        {loading ? (
          <LoadingState message="Cargando usuarios..." />
        ) : filteredUsuarios.length === 0 ? (
          <EmptyState
            icon={UserPlus}
            title="No se encontraron usuarios"
            description={searchTerm || selectedRol !== "TODOS" ? "Intenta con otros filtros de búsqueda" : "No hay usuarios registrados en el sistema"}
          />
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Rol</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Fecha Registro</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsuarios.map((usuario) => (
                  <TableRow key={usuario.id}>
                    <TableCell className="font-medium">
                      {usuario.nombre} {usuario.apellido}
                    </TableCell>
                    <TableCell>{usuario.email}</TableCell>
                    <TableCell>
                      <Badge variant={getRolBadgeVariant(usuario.rol)}>{usuario.rol}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={usuario.activo ? "default" : "secondary"}>
                        {usuario.activo ? "Activo" : "Inactivo"}
                      </Badge>
                    </TableCell>
                    <TableCell>{new Date(usuario.fechaRegistro).toLocaleDateString("es-ES")}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm" onClick={() => openEditDialog(usuario)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(usuario.id)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
