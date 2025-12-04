"use client"

import { ReactNode, useEffect } from 'react'
import { i18n, i18nConfig } from '@/lib/i18n'

interface I18nProviderProps {
  children: ReactNode
}

export function I18nProvider({ children }: I18nProviderProps) {
  useEffect(() => {
    i18n.init(i18nConfig)
  }, [])

  return <>{children}</>
}