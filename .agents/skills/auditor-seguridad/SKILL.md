---
name: auditor-seguridad
description: Audita el codigo frontend (JS/HTML) y SQL (Supabase) buscando vulnerabilidades XSS, fugas de llaves y errores en RLS.
---

# Goal
Realizar una auditoria exhaustiva de seguridad sobre los archivos del proyecto antes de subir cambios a GitHub Pages.

# Instructions
1. Revisa supabaseClient.js y app.js: verifica que solo se use anon key, reemplaza innerHTML inseguros por textContent y valida montos USD/BCV mayores a cero.
2. Revisa schema.sql: comprueba que todas las tablas tengan RLS habilitado y politicas con auth.uid().
3. Entrega un reporte por severidad (Alta, Media, Baja) y propon los cambios en el codigo.
