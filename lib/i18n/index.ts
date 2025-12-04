"use client"

import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

const resources = {
  es: {
    translation: {
      // Navegación
      "nav.home": "Inicio",
      "nav.dashboard": "Panel",
      "nav.courses": "Cursos",
      "nav.profile": "Perfil",
      "nav.logout": "Cerrar Sesión",

      // Autenticación
      "auth.login": "Iniciar Sesión",
      "auth.register": "Registrarse",
      "auth.email": "Correo electrónico",
      "auth.password": "Contraseña",
      "auth.confirmPassword": "Confirmar contraseña",
      "auth.forgotPassword": "Olvidé mi contraseña",
      "auth.noAccount": "¿No tienes cuenta?",
      "auth.hasAccount": "¿Ya tienes cuenta?",

      // Dashboard
      "dashboard.welcome": "Bienvenido",
      "dashboard.myCourses": "Mis Cursos",
      "dashboard.availableCourses": "Cursos Disponibles",
      "dashboard.myGrades": "Mis Calificaciones",

      // Cursos
      "courses.title": "Título",
      "courses.description": "Descripción",
      "courses.enroll": "Inscribirse",
      "courses.start": "Comenzar",
      "courses.progress": "Progreso",

      // Simulador
      "simulator.title": "Simulador de Búsqueda",
      "simulator.description": "Practica técnicas de búsqueda avanzada",
      "simulator.search": "Buscar",
      "simulator.results": "Resultados",
      "simulator.reliable": "Confiable",
      "simulator.notReliable": "No Confiable",

      // Cuestionarios
      "quiz.start": "Comenzar Cuestionario",
      "quiz.submit": "Enviar Respuestas",
      "quiz.timeLeft": "Tiempo restante",

      // Mensajes generales
      "common.save": "Guardar",
      "common.cancel": "Cancelar",
      "common.delete": "Eliminar",
      "common.edit": "Editar",
      "common.loading": "Cargando...",
      "common.error": "Error",
      "common.success": "Éxito",
      "common.confirm": "¿Estás seguro?"
    }
  },
  en: {
    translation: {
      // Navigation
      "nav.home": "Home",
      "nav.dashboard": "Dashboard",
      "nav.courses": "Courses",
      "nav.profile": "Profile",
      "nav.logout": "Logout",

      // Authentication
      "auth.login": "Login",
      "auth.register": "Register",
      "auth.email": "Email",
      "auth.password": "Password",
      "auth.confirmPassword": "Confirm password",
      "auth.forgotPassword": "Forgot password",
      "auth.noAccount": "Don't have an account?",
      "auth.hasAccount": "Already have an account?",

      // Dashboard
      "dashboard.welcome": "Welcome",
      "dashboard.myCourses": "My Courses",
      "dashboard.availableCourses": "Available Courses",
      "dashboard.myGrades": "My Grades",

      // Courses
      "courses.title": "Title",
      "courses.description": "Description",
      "courses.enroll": "Enroll",
      "courses.start": "Start",
      "courses.progress": "Progress",

      // Simulator
      "simulator.title": "Search Simulator",
      "simulator.description": "Practice advanced search techniques",
      "simulator.search": "Search",
      "simulator.results": "Results",
      "simulator.reliable": "Reliable",
      "simulator.notReliable": "Not Reliable",

      // Quizzes
      "quiz.start": "Start Quiz",
      "quiz.submit": "Submit Answers",
      "quiz.timeLeft": "Time left",

      // General messages
      "common.save": "Save",
      "common.cancel": "Cancel",
      "common.delete": "Delete",
      "common.edit": "Edit",
      "common.loading": "Loading...",
      "common.error": "Error",
      "common.success": "Success",
      "common.confirm": "Are you sure?"
    }
  }
}

export { i18n, resources }

export const i18nConfig = {
  resources,
  fallbackLng: 'es',
  debug: process.env.NODE_ENV === 'development',

  interpolation: {
    escapeValue: false,
  },

  detection: {
    order: ['localStorage', 'navigator', 'htmlTag'],
    caches: ['localStorage'],
  },
}