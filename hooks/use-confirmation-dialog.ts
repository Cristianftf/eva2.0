import { useState, useCallback } from 'react'

interface ConfirmationOptions {
  title: string
  description: string
  confirmText?: string
  cancelText?: string
  variant?: 'default' | 'destructive'
}

interface UseConfirmationDialogReturn {
  isOpen: boolean
  options: ConfirmationOptions | null
  confirm: (message: string) => Promise<boolean>
  confirmAdvanced: (options: ConfirmationOptions) => Promise<boolean>
  close: () => void
  handleConfirm: () => void
}

/**
 * Hook personalizado para manejar diálogos de confirmación
 * Reemplaza los window.confirm() con una experiencia más rica
 */
export function useConfirmationDialog(): UseConfirmationDialogReturn {
  const [isOpen, setIsOpen] = useState(false)
  const [options, setOptions] = useState<ConfirmationOptions | null>(null)
  const [resolvePromise, setResolvePromise] = useState<((value: boolean) => void) | null>(null)

  const confirm = useCallback((confirmationOptions: ConfirmationOptions): Promise<boolean> => {
    return new Promise((resolve) => {
      setOptions(confirmationOptions)
      setIsOpen(true)
      setResolvePromise(() => resolve)
    })
  }, [])

  const close = useCallback(() => {
    setIsOpen(false)
    setOptions(null)
    if (resolvePromise) {
      resolvePromise(false)
      setResolvePromise(null)
    }
  }, [resolvePromise])

  const handleConfirm = useCallback(() => {
    setIsOpen(false)
    setOptions(null)
    if (resolvePromise) {
      resolvePromise(true)
      setResolvePromise(null)
    }
  }, [resolvePromise])

  // Monkey patch para compatibilidad con código existente
  const confirmLegacy = useCallback(async (message: string): Promise<boolean> => {
    return confirm({
      title: 'Confirmar acción',
      description: message,
      confirmText: 'Confirmar',
      cancelText: 'Cancelar',
      variant: 'destructive'
    })
  }, [confirm])

  return {
    isOpen,
    options,
    confirm: confirmLegacy,
    close,
    // Métodos adicionales para uso avanzado
    confirmAdvanced: confirm,
    handleConfirm
  }
}