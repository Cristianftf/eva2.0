"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"

interface SkipLinksProps {
  links: Array<{
    href: string
    label: string
  }>
}

export function SkipLinks({ links }: SkipLinksProps) {
  const [isVisible, setIsVisible] = useState(false)

  // Mostrar skip links cuando se detecta navegación por teclado
  const handleFocus = () => setIsVisible(true)
  const handleBlur = () => setIsVisible(false)

  return (
    <div
      className={`
        fixed top-0 left-0 z-50 transition-opacity duration-200
        ${isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}
      `}
      onFocus={handleFocus}
      onBlur={handleBlur}
    >
      <nav
        role="navigation"
        aria-label="Enlaces de salto"
        className="bg-primary text-primary-foreground p-2 shadow-lg"
      >
        <ul className="flex gap-4">
          {links.map((link, index) => (
            <li key={index}>
              <Button
                asChild
                variant="secondary"
                size="sm"
                className="h-auto py-2 px-3 text-sm font-medium"
              >
                <a
                  href={link.href}
                  className="underline focus:outline-none focus:ring-2 focus:ring-primary-foreground focus:ring-offset-2"
                >
                  {link.label}
                </a>
              </Button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  )
}

// Hook para detectar navegación por teclado
export function useKeyboardNavigation() {
  const [isUsingKeyboard, setIsUsingKeyboard] = useState(false)

  if (typeof window !== 'undefined') {
    // Detectar cuando se usa teclado
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Tab' || e.key === 'Enter' || e.key === ' ') {
        setIsUsingKeyboard(true)
      }
    })

    // Detectar cuando se usa mouse
    window.addEventListener('mousedown', () => {
      setIsUsingKeyboard(false)
    })
  }

  return isUsingKeyboard
}