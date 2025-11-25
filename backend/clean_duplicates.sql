-- Script para eliminar usuarios duplicados por email, manteniendo el de menor ID
-- Ejecutar en PostgreSQL

-- Primero, identificar duplicados
SELECT email, COUNT(*) as count
FROM users
GROUP BY email
HAVING COUNT(*) > 1;

-- Eliminar duplicados, manteniendo el de menor ID
DELETE FROM users
WHERE id NOT IN (
    SELECT MIN(id)
    FROM users
    GROUP BY email
);

-- Verificar que ya no hay duplicados
SELECT email, COUNT(*) as count
FROM users
GROUP BY email
HAVING COUNT(*) > 1;