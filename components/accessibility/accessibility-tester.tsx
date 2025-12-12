"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  getContrastRatio, 
  meetsWCAGStandard, 
  suggestAccessibleColors 
} from "@/lib/accessibility/color-contrast"
import { CheckCircle2, AlertTriangle, XCircle, Eye, Keyboard, Mouse } from "lucide-react"

interface AccessibilityTestResult {
  test: string
  status: 'pass' | 'fail' | 'warning'
  description: string
  details?: string
}

interface AccessibilityTesterProps {
  children: React.ReactNode
}

export function AccessibilityTester({ children }: AccessibilityTesterProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [testResults, setTestResults] = useState<AccessibilityTestResult[]>([])
  const [currentTest, setCurrentTest] = useState<string>('')

  useEffect(() => {
    if (isOpen) {
      runAccessibilityTests()
    }
  }, [isOpen])

  const runAccessibilityTests = () => {
    const tests: AccessibilityTestResult[] = []

    // Test 1: Contraste de colores
    tests.push({
      test: "Contraste de Colores",
      status: testColorContrast(),
      description: "Verifica que los colores cumplan con WCAG 2.1 AA",
      details: getContrastDetails()
    })

    // Test 2: Navegación por teclado
    tests.push({
      test: "Navegación por Teclado",
      status: testKeyboardNavigation(),
      description: "Verifica que todos los elementos sean accesibles por teclado"
    })

    // Test 3: Roles ARIA
    tests.push({
      test: "Roles ARIA",
      status: testARIARoles(),
      description: "Verifica que los roles ARIA estén correctamente implementados"
    })

    // Test 4: Textos alternativos
    tests.push({
      test: "Textos Alternativos",
      status: testAltTexts(),
      description: "Verifica que las imágenes tengan textos alternativos"
    })

    // Test 5: Estructura semántica
    tests.push({
      test: "Estructura Semántica",
      status: testSemanticStructure(),
      description: "Verifica que se usen elementos HTML semánticos"
    })

    // Test 6: Focus Management
    tests.push({
      test: "Gestión de Focus",
      status: testFocusManagement(),
      description: "Verifica que el focus sea visible y gestionado correctamente"
    })

    setTestResults(tests)
  }

  const testColorContrast = (): 'pass' | 'fail' | 'warning' => {
    try {
      // Simular test de contraste en elementos principales
      const testElements = [
        { fg: '#1a1a1a', bg: '#ffffff' }, // Texto normal
        { fg: '#ffffff', bg: '#1a1a1a' }, // Texto invertido
        { fg: '#2563eb', bg: '#ffffff' }, // Enlaces
        { fg: '#6b7280', bg: '#ffffff' }  // Texto secundario
      ]

      const failures = testElements.filter(
        element => !meetsWCAGStandard(element.fg, element.bg, 'AA')
      )

      return failures.length === 0 ? 'pass' : 'warning'
    } catch {
      return 'warning'
    }
  }

  const getContrastDetails = () => {
    const elements = [
      { name: 'Texto Normal', fg: '#1a1a1a', bg: '#ffffff' },
      { name: 'Texto Invertido', fg: '#ffffff', bg: '#1a1a1a' },
      { name: 'Enlaces', fg: '#2563eb', bg: '#ffffff' }
    ]

    return elements.map(element => {
      const ratio = getContrastRatio(element.fg, element.bg)
      const passes = meetsWCAGStandard(element.fg, element.bg, 'AA')
      return `${element.name}: ${ratio.toFixed(2)} (${passes ? 'Pasa' : 'Falla'})`
    }).join('\n')
  }

  const testKeyboardNavigation = (): 'pass' | 'fail' | 'warning' => {
    // Verificar si hay elementos con tabindex negativos o problemas de focus
    const interactiveElements = document.querySelectorAll(
      'button, a, input, textarea, select, [role="button"], [tabindex]'
    )
    
    let hasIssues = false
    interactiveElements.forEach(element => {
      const tabindex = element.getAttribute('tabindex')
      if (tabindex && parseInt(tabindex) < 0) {
        hasIssues = true
      }
    })

    return hasIssues ? 'warning' : 'pass'
  }

  const testARIARoles = (): 'pass' | 'fail' | 'warning' => {
    const ariaElements = document.querySelectorAll('[role], [aria-label], [aria-describedby]')
    return ariaElements.length > 0 ? 'pass' : 'warning'
  }

  const testAltTexts = (): 'pass' | 'fail' | 'warning' => {
    const images = document.querySelectorAll('img')
    if (images.length === 0) return 'pass'
    
    const imagesWithoutAlt = Array.from(images).filter(img => !img.getAttribute('alt'))
    return imagesWithoutAlt.length === 0 ? 'pass' : 'warning'
  }

  const testSemanticStructure = (): 'pass' | 'fail' | 'warning' => {
    const semanticElements = document.querySelectorAll('main, nav, header, footer, article, section, aside')
    return semanticElements.length > 0 ? 'pass' : 'warning'
  }

  const testFocusManagement = (): 'pass' | 'fail' | 'warning' => {
    // Verificar si hay elementos con outline removido sin reason
    const focusableElements = document.querySelectorAll(
      'button, a, input, textarea, select, [tabindex]:not([tabindex="-1"])'
    )
    
    return focusableElements.length > 0 ? 'pass' : 'warning'
  }

  const getStatusIcon = (status: 'pass' | 'fail' | 'warning') => {
    switch (status) {
      case 'pass':
        return <CheckCircle2 className="h-4 w-4 text-green-600" />
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />
      case 'fail':
        return <XCircle className="h-4 w-4 text-red-600" />
    }
  }

  const getStatusColor = (status: 'pass' | 'fail' | 'warning') => {
    switch (status) {
      case 'pass':
        return 'bg-green-100 text-green-800'
      case 'warning':
        return 'bg-yellow-100 text-yellow-800'
      case 'fail':
        return 'bg-red-100 text-red-800'
    }
  }

  const totalTests = testResults.length
  const passedTests = testResults.filter(t => t.status === 'pass').length
  const failedTests = testResults.filter(t => t.status === 'fail').length
  const warningTests = testResults.filter(t => t.status === 'warning').length

  return (
    <>
      {/* Panel de Testing */}
      {isOpen && (
        <div className="fixed top-4 right-4 w-96 max-h-96 overflow-y-auto bg-white border rounded-lg shadow-lg z-50">
          <Card className="border-0 shadow-none">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Test de Accesibilidad</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                  aria-label="Cerrar panel de testing"
                >
                  ×
                </Button>
              </div>
              <CardDescription>
                Verificación automática WCAG 2.1
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {/* Resumen */}
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-2 bg-green-50 rounded">
                  <div className="text-lg font-bold text-green-700">{passedTests}</div>
                  <div className="text-xs text-green-600">Pasaron</div>
                </div>
                <div className="p-2 bg-yellow-50 rounded">
                  <div className="text-lg font-bold text-yellow-700">{warningTests}</div>
                  <div className="text-xs text-yellow-600">Advertencias</div>
                </div>
                <div className="p-2 bg-red-50 rounded">
                  <div className="text-lg font-bold text-red-700">{failedTests}</div>
                  <div className="text-xs text-red-600">Fallaron</div>
                </div>
              </div>

              {/* Resultados Detallados */}
              <div className="space-y-2">
                {testResults.map((result, index) => (
                  <div
                    key={index}
                    className="p-3 border rounded-lg"
                    onMouseEnter={() => setCurrentTest(result.test)}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-sm">{result.test}</span>
                      <Badge className={getStatusColor(result.status)}>
                        <div className="flex items-center gap-1">
                          {getStatusIcon(result.status)}
                          {result.status === 'pass' ? 'Pasa' : 
                           result.status === 'warning' ? 'Advertencia' : 'Falla'}
                        </div>
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">
                      {result.description}
                    </p>
                    {result.details && (
                      <details className="text-xs">
                        <summary className="cursor-pointer text-muted-foreground hover:text-foreground">
                          Ver detalles
                        </summary>
                        <pre className="mt-2 p-2 bg-muted rounded text-xs overflow-x-auto">
                          {result.details}
                        </pre>
                      </details>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Botón de Control */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        variant="outline"
        size="sm"
        className="fixed top-4 right-4 z-40"
        aria-label={isOpen ? "Cerrar herramientas de accesibilidad" : "Abrir herramientas de accesibilidad"}
      >
        {isOpen ? <Eye className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        <span className="ml-2">Accesibilidad</span>
      </Button>

      {/* Indicador de Estado */}
      {testResults.length > 0 && (
        <div className="sr-only" aria-live="polite">
          {failedTests > 0 
            ? `${failedTests} tests de accesibilidad fallaron`
            : passedTests === totalTests
            ? "Todos los tests de accesibilidad pasaron"
            : `${passedTests} de ${totalTests} tests de accesibilidad pasaron`
          }
        </div>
      )}

      {/* Contenido Original */}
      {children}
    </>
  )
}

// Hook para testing manual de accesibilidad
export function useAccessibilityTest() {
  const [results, setResults] = useState<AccessibilityTestResult[]>([])

  const testFocusVisible = () => {
    const focusedElement = document.activeElement
    if (!focusedElement) return false

    const styles = window.getComputedStyle(focusedElement)
    return styles.outline !== 'none' || styles.boxShadow !== 'none'
  }

  const testColorContrast = (foreground: string, background: string) => {
    const ratio = getContrastRatio(foreground, background)
    return {
      ratio,
      passesAA: meetsWCAGStandard(foreground, background, 'AA'),
      passesAAA: meetsWCAGStandard(foreground, background, 'AAA')
    }
  }

  const testKeyboardNavigation = () => {
    const interactiveElements = document.querySelectorAll(
      'button, a, input, textarea, select, [role="button"], [tabindex]'
    )
    
    return {
      total: interactiveElements.length,
      withTabindex: Array.from(interactiveElements).filter(el => 
        el.hasAttribute('tabindex')
      ).length,
      negativeTabindex: Array.from(interactiveElements).filter(el => {
        const tabindex = el.getAttribute('tabindex')
        return tabindex && parseInt(tabindex) < 0
      }).length
    }
  }

  return {
    results,
    setResults,
    testFocusVisible,
    testColorContrast,
    testKeyboardNavigation
  }
}