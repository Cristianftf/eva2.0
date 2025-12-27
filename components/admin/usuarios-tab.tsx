"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { usuariosService } from "@/lib/services/usuarios.service"
import type { User } from "@/lib/types"
import { Search, UserPlus, Edit, Trash2, Loader2, AlertTriangle, CheckCircle } from "lucide-react"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"

export function UsuariosTab() {
  const [usuarios, setUsuarios] = useState<User[]>([])
  const [filteredUsuarios, setFilteredUsuarios] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedRol, setSelectedRol] = useState<string>("TODOS")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [transferDialogOpen, setTransferDialogOpen] = useState(false)
  const [usuarioToDelete, setUsuarioToDelete] = useState<User | null>(null)
  const [usuarioToTransfer, setUsuarioToTransfer] = useState<User | null>(null)
  const [editingUsuario, setEditingUsuario] = useState<User | null>(null)
  const [formData, setFormData] = useState({
    email: "",
    nombre: "",
    apellido: "",
    rol: "ESTUDIANTE" as User["rol"],
    password: "",
  })
  const [submitting, setSubmitting] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [transferring, setTransferring] = useState(false)
  const [selectedNewProfesor, setSelectedNewProfesor] = useState<string>("")
  const [cursosAsociadosInfo, setCursosAsociadosInfo] = useState<any>(null)
  const [loadingCursosInfo, setLoadingCursosInfo] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    loadUsuarios()
  }, [])

  useEffect(() => {
    filterUsuarios()
  }, [searchTerm, selectedRol, usuarios])

  const loadUsuarios = async () => {
    setLoading(true)
    setError(null)

    const result = await usuariosService.getAll()

    if (result.success && result.data) {
      setUsuarios(result.data)
    } else {
      setError(result.error || "Error al cargar usuarios")
    }

    setLoading(false)
  }

  const filterUsuarios = () => {
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

    setFilteredUsuarios(filtered)
  }

  const handleDeleteClick = async (usuario: User) => {
    setUsuarioToDelete(usuario)
    setDeleteDialogOpen(true)
    
    // Cargar información de cursos asociados
    setLoadingCursosInfo(true)
    try {
      const info = await usuariosService.getCursosAsociados(String(usuario.id))
      if (info.success && info.data) {
        setCursosAsociadosInfo(info.data)
      }
    } catch (error) {
      console.error("Error al cargar cursos asociados:", error)
    } finally {
      setLoadingCursosInfo(false)
    }
  }

  const handleDeleteConfirm = async () => {
    if (!usuarioToDelete) return

    setDeleting(true)
    try {
      const result = await usuariosService.delete(String(usuarioToDelete.id))

      if (result.success) {
        setUsuarios(usuarios.filter((u) => u.id !== usuarioToDelete.id))
        toast({
          title: "Usuario eliminado",
          description: "El usuario ha sido marcado como inactivo correctamente.",
          variant: "default",
        })
        setDeleteDialogOpen(false)
        setUsuarioToDelete(null)
        setCursosAsociadosInfo(null)
      } else {
        // Manejar respuesta de error detallada del backend
        const errorData = result.data as any
        if (errorData?.error && errorData?.cursosAsociados > 0) {
          // Usuario tiene cursos - mostrar opción de transferencia
          toast({
            title: "No se puede eliminar",
            description: errorData.error,
            variant: "destructive",
          })
          setDeleteDialogOpen(false)
          // Abrir diálogo de transferencia
          setUsuarioToTransfer(usuarioToDelete)
          setTransferDialogOpen(true)
        } else {
          toast({
            title: "Error al eliminar",
            description: errorData?.error || result.error || "Error desconocido",
            variant: "destructive",
          })
        }
      }
    } catch (error) {
      toast({
        title: "Error de conexión",
        description: "No se pudo conectar con el servidor",
        variant: "destructive",
      })
    } finally {
      setDeleting(false)
    }
  }

  const handleTransferCursos = async () => {
    if (!usuarioToTransfer || !selectedNewProfesor) return

    setTransferring(true)
    try {
      const result = await usuariosService.transferirCursos({
        profesorActualId: String(usuarioToTransfer.id),
        nuevoProfesorId: selectedNewProfesor
      })

      if (result.success) {
        toast({
          title: "Cursos transferidos",
          description: "Los cursos han sido transferidos exitosamente al nuevo profesor.",
          variant: "default",
        })
        setTransferDialogOpen(false)
        setUsuarioToTransfer(null)
        setSelectedNewProfesor("")
        // Recargar usuarios para actualizar la información
        loadUsuarios()
      } else {
        toast({
          title: "Error al transferir",
          description: result.error || "No se pudieron transferir los cursos",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error de conexión",
        description: "No se pudo conectar con el servidor",
        variant: "destructive",
      })
    } finally {
      setTransferring(false)
    }
  }

  const handleCreateUsuario = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    const result = await usuariosService.create({
      ...formData,
      activo: true,
    })

    if (result.success && result.data) {
      setUsuarios([...usuarios, result.data])
      setDialogOpen(false)
      resetForm()
      toast({
        title: "Usuario creado",
        description: "El nuevo usuario ha sido creado exitosamente.",
        variant: "default",
      })
    } else {
      toast({
        title: "Error al crear usuario",
        description: result.error || "Error al crear el usuario",
        variant: "destructive",
      })
    }

    setSubmitting(false)
  }

  const handleEditUsuario = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingUsuario) return

    setSubmitting(true)

    const result = await usuariosService.update(String(editingUsuario.id), {
      nombre: formData.nombre,
      apellido: formData.apellido,
      email: formData.email,
      rol: formData.rol,
    })

    if (result.success && result.data) {
      setUsuarios(usuarios.map(u => u.id === editingUsuario.id ? result.data! : u))
      setDialogOpen(false)
      setEditingUsuario(null)
      resetForm()
      toast({
        title: "Usuario actualizado",
        description: "Los datos del usuario han sido actualizados correctamente.",
        variant: "default",
      })
    } else {
      toast({
        title: "Error al actualizar",
        description: result.error || "Error al actualizar el usuario",
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

  const getProfesoresDisponibles = () => {
    return usuarios.filter(u => u.rol === "PROFESOR" && 
      (!usuarioToTransfer || u.id !== usuarioToTransfer.id))
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

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Table */}
        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
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
                {filteredUsuarios.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      No se encontraron usuarios
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsuarios.map((usuario) => (
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
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="sm" onClick={() => handleDeleteClick(usuario)}>
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>¿Eliminar usuario?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Esta acción marcará al usuario como inactivo. Los datos se conservarán pero no podrá acceder al sistema.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction onClick={handleDeleteConfirm} disabled={deleting}>
                                  {deleting ? (
                                    <>
                                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                      Eliminando...
                                    </>
                                  ) : (
                                    "Eliminar"
                                  )}
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        )}

        {/* Diálogo de transferencia de cursos */}
        <Dialog open={transferDialogOpen} onOpenChange={setTransferDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Transferir Cursos</DialogTitle>
              <DialogDescription>
                {usuarioToTransfer && 
                  `${usuarioToTransfer.nombre} ${usuarioToTransfer.apellido} tiene cursos asociados. ` +
                  "Selecciona un nuevo profesor para transferir los cursos antes de eliminarlo."
                }
              </DialogDescription>
            </DialogHeader>
            
            {cursosAsociadosInfo && (
              <div className="space-y-4">
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    El usuario tiene {cursosAsociadosInfo.cursosAsociados} curso(s) asociado(s).
                    Debes transferir los cursos antes de poder eliminarlo.
                  </AlertDescription>
                </Alert>

                <div className="space-y-2">
                  <Label>Seleccionar nuevo profesor</Label>
                  <Select value={selectedNewProfesor} onValueChange={setSelectedNewProfesor}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona un profesor" />
                    </SelectTrigger>
                    <SelectContent>
                      {getProfesoresDisponibles().map((profesor) => (
                        <SelectItem key={profesor.id} value={String(profesor.id)}>
                          {profesor.nombre} {profesor.apellido} ({profesor.email})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            <DialogFooter>
              <Button variant="outline" onClick={() => setTransferDialogOpen(false)}>
                Cancelar
              </Button>
              <Button 
                onClick={handleTransferCursos} 
                disabled={!selectedNewProfesor || transferring}
              >
                {transferring ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Transfiriendo...
                  </>
                ) : (
                  <>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Transferir Cursos
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}
