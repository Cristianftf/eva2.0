-- Actualizar tabla recursos para incluir campos avanzados de salud
ALTER TABLE recursos ADD COLUMN IF NOT EXISTS imagen VARCHAR(500);
ALTER TABLE recursos ADD COLUMN IF NOT EXISTS contenido TEXT;
ALTER TABLE recursos ADD COLUMN IF NOT EXISTS especialidad VARCHAR(100);
ALTER TABLE recursos ADD COLUMN IF NOT EXISTS urgencia VARCHAR(20) CHECK (urgencia IN ('baja', 'media', 'alta'));
ALTER TABLE recursos ADD COLUMN IF NOT EXISTS tipo VARCHAR(20) CHECK (tipo IN ('prevencion', 'diagnostico', 'tratamiento', 'seguimiento'));
ALTER TABLE recursos ADD COLUMN IF NOT EXISTS fuente VARCHAR(100);
ALTER TABLE recursos ADD COLUMN IF NOT EXISTS fecha_creacion TIMESTAMP;
ALTER TABLE recursos ADD COLUMN IF NOT EXISTS verificado BOOLEAN DEFAULT FALSE;
ALTER TABLE recursos ADD COLUMN IF NOT EXISTS tags TEXT;

-- Actualizar registros existentes
UPDATE recursos SET
    fecha_creacion = fecha_agregado,
    verificado = FALSE
WHERE fecha_creacion IS NULL;

-- Agregar restricciones NOT NULL donde sea necesario
ALTER TABLE recursos ALTER COLUMN titulo SET NOT NULL;
ALTER TABLE recursos ALTER COLUMN url SET NOT NULL;
ALTER TABLE recursos ALTER COLUMN verificado SET DEFAULT FALSE;
ALTER TABLE recursos ALTER COLUMN verificado SET NOT NULL;