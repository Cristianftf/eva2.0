package com.backendeva.backend.model;

/**
 * Enum que define los tipos de pregunta disponibles en el sistema
 * Cumple con RF4 - Selección de tipos de preguntas
 */
public enum TipoPregunta {
    
    /**
     * Pregunta de opción múltiple - el estudiante selecciona una opción entre varias disponibles
     */
    OPCION_MULTIPLE("opcion_multiple", "Opción Múltiple"),
    
    /**
     * Pregunta de verdadero o falso - el estudiante selecciona entre dos opciones
     */
    VERDADERO_FALSO("verdadero_falso", "Verdadero/Falso"),
    
    /**
     * Pregunta de arrastrar y soltar - el estudiante ordena elementos o los asocia
     */
    ARRASTRAR_SOLTAR("arrastrar_soltar", "Arrastrar y Soltar"),
    
    /**
     * Pregunta de completar texto - el estudiante escribe una respuesta
     */
    COMPLETAR_TEXTO("completar_texto", "Completar Texto"),
    
    /**
     * Pregunta de ordenar elementos - el estudiante ordena una lista de elementos
     */
    ORDENAR_ELEMENTOS("ordenar_elementos", "Ordenar Elementos"),

    /**
     * Pregunta de respuesta corta - el estudiante escribe una respuesta breve
     */
    RESPUESTA_CORTA("respuesta_corta", "Respuesta Corta");

    private final String codigo;
    private final String descripcion;
    
    /**
     * Constructor del enum
     * @param codigo Código único del tipo de pregunta
     * @param descripcion Descripción legible del tipo
     */
    TipoPregunta(String codigo, String descripcion) {
        this.codigo = codigo;
        this.descripcion = descripcion;
    }
    
    /**
     * Obtiene el código del tipo de pregunta
     * @return Código único
     */
    public String getCodigo() {
        return codigo;
    }
    
    /**
     * Obtiene la descripción del tipo de pregunta
     * @return Descripción legible
     */
    public String getDescripcion() {
        return descripcion;
    }
    
    /**
     * Obtiene el enum por su código
     * @param codigo Código del tipo de pregunta
     * @return TipoPregunta correspondiente o null si no existe
     */
    public static TipoPregunta fromCodigo(String codigo) {
        for (TipoPregunta tipo : values()) {
            if (tipo.getCodigo().equals(codigo)) {
                return tipo;
            }
        }
        return null;
    }
    
    /**
     * Verifica si el tipo de pregunta requiere configuración adicional
     * @return true si requiere configuración especial
     */
    public boolean requiereConfiguracionAdicional() {
        return this == ARRASTRAR_SOLTAR || this == ORDENAR_ELEMENTOS;
    }
    
    /**
     * Obtiene el número máximo de respuestas permitidas para este tipo
     * @return Número máximo de respuestas
     */
    public int getMaximoRespuestas() {
        switch (this) {
            case VERDADERO_FALSO:
                return 2;
            case OPCION_MULTIPLE:
                return 10; // Arbitrario, configurable
            case COMPLETAR_TEXTO:
            case RESPUESTA_CORTA:
                return 1;
            case ARRASTRAR_SOLTAR:
            case ORDENAR_ELEMENTOS:
                return 20; // Para listas de elementos
            default:
                return 5;
        }
    }
}