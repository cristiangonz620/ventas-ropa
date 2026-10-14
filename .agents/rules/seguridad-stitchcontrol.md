# Reglas Permanentes de Desarrollo Seguro (StitchControl)
- RLS Obligatorio: Toda tabla en schema.sql debe tener ENABLE ROW LEVEL SECURITY y politicas que validen auth.uid().
- Prevencion XSS: Evita usar innerHTML con datos ingresados por usuarios en app.js; prefiere textContent o sanitizacion previa.
- Validacion Multimoneda: Todo calculo de abonos en USD o conversion a Bolivares (tasa BCV) debe validar que los montos sean >= 0 y la tasa > 0.
- Manejo de Errores: Envuelve todas las consultas a Supabase en bloques try/catch sin exponer trazas sensibles en consola.
