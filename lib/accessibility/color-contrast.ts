// Utilidades para verificar y mejorar el contraste de colores según WCAG 2.1

/**
 * Calcula la luminancia relativa de un color
 * @param color Color en formato hex (#rrggbb)
 * @returns Luminancia relativa (0-1)
 */
export function getLuminance(color: string): number {
  // Remover # si está presente
  const hex = color.replace('#', '')
  
  // Convertir a RGB
  const r = parseInt(hex.substr(0, 2), 16) / 255
  const g = parseInt(hex.substr(2, 2), 16) / 255
  const b = parseInt(hex.substr(4, 2), 16) / 255
  
  // Aplicar transformación para sRGB
  const rsRGB = r <= 0.03928 ? r / 12.92 : Math.pow((r + 0.055) / 1.055, 2.4)
  const gsRGB = g <= 0.03928 ? g / 12.92 : Math.pow((g + 0.055) / 1.055, 2.4)
  const bsRGB = b <= 0.03928 ? b / 12.92 : Math.pow((b + 0.055) / 1.055, 2.4)
  
  // Calcular luminancia
  return 0.2126 * rsRGB + 0.7152 * gsRGB + 0.0722 * bsRGB
}

/**
 * Calcula la relación de contraste entre dos colores
 * @param foregroundColor Color del primer plano
 * @param backgroundColor Color del fondo
 * @returns Relación de contraste (1-21)
 */
export function getContrastRatio(foregroundColor: string, backgroundColor: string): number {
  const lum1 = getLuminance(foregroundColor)
  const lum2 = getLuminance(backgroundColor)
  
  const brightest = Math.max(lum1, lum2)
  const darkest = Math.min(lum1, lum2)
  
  return (brightest + 0.05) / (darkest + 0.05)
}

/**
 * Verifica si un contraste cumple con WCAG 2.1
 * @param foregroundColor Color del primer plano
 * @param backgroundColor Color del fondo
 * @param level Nivel AA (4.5) o AAA (7.0)
 * @param isLargeText Si es texto grande (18pt+ o 14pt+ bold)
 * @returns true si cumple con las pautas
 */
export function meetsWCAGStandard(
  foregroundColor: string,
  backgroundColor: string,
  level: 'AA' | 'AAA' = 'AA',
  isLargeText: boolean = false
): boolean {
  const ratio = getContrastRatio(foregroundColor, backgroundColor)
  
  if (level === 'AA') {
    return isLargeText ? ratio >= 3.0 : ratio >= 4.5
  } else {
    return isLargeText ? ratio >= 4.5 : ratio >= 7.0
  }
}

/**
 * Encuentra el color de texto más oscuro o más claro que cumpla con WCAG
 * @param backgroundColor Color de fondo
 * @param preferredColors Colores preferidos para el texto
 * @param level Nivel WCAG
 * @returns Color que cumple con el contraste o null
 */
export function findAccessibleTextColor(
  backgroundColor: string,
  preferredColors: string[] = ['#000000', '#ffffff', '#1a1a1a', '#333333'],
  level: 'AA' | 'AAA' = 'AA'
): string | null {
  for (const color of preferredColors) {
    if (meetsWCAGStandard(color, backgroundColor, level)) {
      return color
    }
  }
  return null
}

/**
 * Sugiere colores accesibles para un fondo dado
 * @param backgroundColor Color de fondo
 * @param level Nivel WCAG
 * @returns Objeto con colores sugeridos
 */
export function suggestAccessibleColors(backgroundColor: string, level: 'AA' | 'AAA' = 'AA') {
  const black = '#000000'
  const white = '#ffffff'
  const darkGray = '#333333'
  const lightGray = '#f5f5f5'
  
  return {
    text: {
      normal: findAccessibleTextColor(backgroundColor, [black, darkGray, white], level),
      large: findAccessibleTextColor(backgroundColor, [black, darkGray], level === 'AA' ? 'AA' : 'AAA'),
    },
    borders: {
      subtle: meetsWCAGStandard('#666666', backgroundColor, level) ? '#666666' : 
              meetsWCAGStandard('#999999', backgroundColor, level) ? '#999999' : 
              meetsWCAGStandard('#cccccc', backgroundColor, level) ? '#cccccc' : '#000000',
    },
    backgrounds: {
      hover: meetsWCAGStandard('#f0f0f0', backgroundColor, level) ? '#f0f0f0' :
             meetsWCAGStandard('#e0e0e0', backgroundColor, level) ? '#e0e0e0' : '#ffffff',
      focus: meetsWCAGStandard('#e6f3ff', backgroundColor, level) ? '#e6f3ff' : '#ffffff',
    }
  }
}

/**
 * Paleta de colores accesibles predefinidos
 */
export const accessibleColorPalette = {
  // Colores de texto que funcionan sobre fondos claros
  textOnLight: {
    primary: '#1a1a1a',      // Contraste alto sobre blanco
    secondary: '#4a4a4a',    // Contraste AA sobre blanco
    muted: '#6b7280',        // Contraste AA sobre blanco
  },
  
  // Colores de texto que funcionan sobre fondos oscuros
  textOnDark: {
    primary: '#ffffff',      // Contraste alto sobre negro
    secondary: '#e5e5e5',    // Contraste AA sobre negro
    muted: '#d1d5db',        // Contraste AA sobre negro
  },
  
  // Colores de fondo accesibles
  backgrounds: {
    light: '#ffffff',        // Blanco puro
    subtle: '#f9fafb',       // Gris muy claro
    muted: '#f3f4f6',        // Gris claro
    hover: '#f0f0f0',        // Gris para hover
  },
  
  // Colores de bordes accesibles
  borders: {
    subtle: '#d1d5db',       // Borde suave que cumple AA
    medium: '#9ca3af',       // Borde medio que cumple AA
    strong: '#6b7280',       // Borde fuerte que cumple AA
  },
  
  // Estados interactivos accesibles
  interactive: {
    focus: '#3b82f6',        // Azul accesible para focus
    focusRing: '#1d4ed8',    // Azul oscuro para ring de focus
    hover: '#f3f4f6',        // Gris claro para hover
    active: '#e5e7eb',       // Gris medio para active
  }
}

/**
 * CSS custom properties para temas accesibles
 */
export const accessibleCSSVariables = {
  light: {
    '--background': accessibleColorPalette.backgrounds.light,
    '--foreground': accessibleColorPalette.textOnLight.primary,
    '--muted': accessibleColorPalette.backgrounds.subtle,
    '--muted-foreground': accessibleColorPalette.textOnLight.muted,
    '--border': accessibleColorPalette.borders.subtle,
    '--input': accessibleColorPalette.backgrounds.light,
    '--ring': accessibleColorPalette.interactive.focus,
    '--primary': accessibleColorPalette.textOnLight.primary,
    '--primary-foreground': accessibleColorPalette.backgrounds.light,
    '--secondary': accessibleColorPalette.backgrounds.muted,
    '--secondary-foreground': accessibleColorPalette.textOnLight.primary,
    '--accent': accessibleColorPalette.backgrounds.hover,
    '--accent-foreground': accessibleColorPalette.textOnLight.primary,
    '--destructive': '#dc2626',
    '--destructive-foreground': '#ffffff',
  },
  dark: {
    '--background': '#0a0a0a',
    '--foreground': accessibleColorPalette.textOnDark.primary,
    '--muted': '#262626',
    '--muted-foreground': accessibleColorPalette.textOnDark.muted,
    '--border': accessibleColorPalette.borders.medium,
    '--input': '#1a1a1a',
    '--ring': accessibleColorPalette.interactive.focus,
    '--primary': accessibleColorPalette.textOnDark.primary,
    '--primary-foreground': '#0a0a0a',
    '--secondary': '#262626',
    '--secondary-foreground': accessibleColorPalette.textOnDark.primary,
    '--accent': '#404040',
    '--accent-foreground': accessibleColorPalette.textOnDark.primary,
    '--destructive': '#f87171',
    '--destructive-foreground': '#0a0a0a',
  }
}

/**
 * Clase utility para elementos con contraste verificado
 */
export function getContrastClass(
  foreground: string,
  background: string,
  level: 'AA' | 'AAA' = 'AA'
): string {
  const meetsStandard = meetsWCAGStandard(foreground, background, level)
  
  if (!meetsStandard) {
    console.warn(
      `Contraste insuficiente: ${foreground} sobre ${background} no cumple WCAG ${level}`,
      `Ratio actual: ${getContrastRatio(foreground, background).toFixed(2)}`
    )
  }
  
  return meetsStandard ? 'contrast-verified' : 'contrast-warning'
}