-- ==========================================
-- ESQUEMA DE BASE DE DATOS (Supabase / PostgreSQL)
-- Proyecto: Ventas y Abonos - Ropa por Encargo
-- ==========================================

-- Habilitar extensión para generar UUIDs si no está habilitada
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Tabla de Clientes
CREATE TABLE IF NOT EXISTS clientes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre TEXT NOT NULL,
    telefono TEXT,
    creado_en TIMESTAMPTZ DEFAULT now()
);

-- Indexar por nombre para búsquedas rápidas
CREATE INDEX IF NOT EXISTS idx_clientes_nombre ON clientes(nombre);

-- ==========================================
-- ACTUALIZACIÓN / MIGRACIÓN RÁPIDA (Si ya tenías las tablas creadas):
-- Ejecuta la siguiente línea en tu SQL Editor para actualizar la tabla:
-- ALTER TABLE productos ADD COLUMN IF NOT EXISTS imagen_url TEXT;
-- ==========================================

-- 2. Tabla de Productos
CREATE TABLE IF NOT EXISTS productos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    descripcion TEXT NOT NULL,
    precio_costo_usd NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    precio_venta_usd NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    estado TEXT NOT NULL DEFAULT 'encargado',
    imagen_url TEXT, -- URL de la imagen del producto
    creado_en TIMESTAMPTZ DEFAULT now(),
    CONSTRAINT chk_estado_producto CHECK (estado IN ('disponible', 'encargado', 'entregado'))
);

-- 3. Tabla de Ventas
CREATE TABLE IF NOT EXISTS ventas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cliente_id UUID REFERENCES clientes(id) ON DELETE CASCADE NOT NULL,
    producto_id UUID REFERENCES productos(id) ON DELETE CASCADE NOT NULL,
    monto_total_usd NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    saldo_pendiente_usd NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    estado_pago TEXT NOT NULL DEFAULT 'pendiente',
    creado_en TIMESTAMPTZ DEFAULT now(),
    CONSTRAINT chk_estado_pago CHECK (estado_pago IN ('pendiente', 'parcial', 'completado'))
);

-- 4. Tabla de Abonos
CREATE TABLE IF NOT EXISTS abonos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    venta_id UUID REFERENCES ventas(id) ON DELETE CASCADE NOT NULL,
    monto_usd NUMERIC(10, 2) NOT NULL,
    tasa_bcv_dia NUMERIC(10, 4) NOT NULL,
    monto_bs NUMERIC(15, 2) NOT NULL,
    metodo_pago TEXT NOT NULL,
    fecha TIMESTAMPTZ DEFAULT now()
);

-- ==========================================
-- VISTAS AUXILIARES PARA CONSULTAS FÁCILES
-- ==========================================

-- Eliminar la vista si ya existe para evitar errores de columnas
DROP VIEW IF EXISTS vista_ventas_detalladas;

-- Vista detallada con "security_invoker = true" para respetar políticas RLS
CREATE VIEW vista_ventas_detalladas WITH (security_invoker = true) AS
SELECT 
    v.id AS venta_id,
    c.id AS cliente_id,
    c.nombre AS cliente_nombre,
    c.telefono AS cliente_telefono,
    p.id AS producto_id,
    p.descripcion AS producto_descripcion,
    p.precio_costo_usd,
    p.precio_venta_usd,
    p.imagen_url, -- Incluida imagen_url
    v.monto_total_usd,
    v.saldo_pendiente_usd,
    (v.monto_total_usd - v.saldo_pendiente_usd) AS monto_abonado_usd,
    v.estado_pago,
    p.estado AS producto_estado,
    v.creado_en AS fecha_venta
FROM ventas v
JOIN clientes c ON v.cliente_id = c.id
JOIN productos p ON v.producto_id = p.id;

-- ==========================================
-- POLÍTICAS RLS (Seguridad a Nivel de Fila)
-- ==========================================

ALTER TABLE clientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE productos ENABLE ROW LEVEL SECURITY;
ALTER TABLE ventas ENABLE ROW LEVEL SECURITY;
ALTER TABLE abonos ENABLE ROW LEVEL SECURITY;

-- Eliminar políticas previas si existen para permitir re-ejecución sin errores
DROP POLICY IF EXISTS "Permitir lectura y escritura pública en clientes" ON clientes;
DROP POLICY IF EXISTS "Permitir lectura y escritura pública en productos" ON productos;
DROP POLICY IF EXISTS "Permitir lectura y escritura pública en ventas" ON ventas;
DROP POLICY IF EXISTS "Permitir lectura y escritura pública en abonos" ON abonos;

DROP POLICY IF EXISTS "Permitir acceso completo solo a usuarios autenticados en clientes" ON clientes;
DROP POLICY IF EXISTS "Permitir acceso completo solo a usuarios autenticados en productos" ON productos;
DROP POLICY IF EXISTS "Permitir acceso completo solo a usuarios autenticados en ventas" ON ventas;
DROP POLICY IF EXISTS "Permitir acceso completo solo a usuarios autenticados en abonos" ON abonos;

-- Crear políticas de acceso seguro (solo usuarios autenticados)
CREATE POLICY "Permitir acceso completo solo a usuarios autenticados en clientes" ON clientes FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Permitir acceso completo solo a usuarios autenticados en productos" ON productos FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Permitir acceso completo solo a usuarios autenticados en ventas" ON ventas FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Permitir acceso completo solo a usuarios autenticados en abonos" ON abonos FOR ALL TO authenticated USING (true) WITH CHECK (true);
