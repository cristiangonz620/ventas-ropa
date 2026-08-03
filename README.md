# 🛍️ Control - Sistema de Gestión de Ventas por Encargo y Abonos

**StitchControl** es un sistema web ligero y responsivo diseñado para pequeños emprendimientos de comercio/ropa por encargo. Permite llevar el control de inventarios, costo de adquisición, precios de venta, clientes y un historial detallado de **abonos progresivos en divisas (USD)** con cálculo dinámico a **Bolívares (Bs.)** según la tasa oficial del Banco Central de Venezuela (BCV).

---

## 🚀 Características Principales

* 📦 **Gestión de Encargos:** Registro de productos con su costo de adquisición en USD y precio de venta final.
* 👤 **Control de Clientes:** Vinculación de pedidos por cliente con seguimiento del estado de la entrega.
* 💵 **Sistema de Abonos Progresivos:** Registro de pagos parciales descontando automáticamente el saldo pendiente.
* 🇻🇪 **Multimoneda en Tiempo Real (USD / Bs.):** Conversión instantánea de montos a Bolívares usando la tasa del día del BCV.
* 📜 **Historial de Pagos:** Modal interactivo para consultar todos los abonos realizados por cada encargo con fecha y método de pago.
* 📊 **Resumen Financiero:** Tarjetas de métricas con el balance global de cuentas por cobrar.

---

## 🛠️ Tecnologías Utilizadas

* **Frontend:** HTML5, JavaScript (ES6+), [Tailwind CSS](https://tailwindcss.com/) (CDN)
* **Backend & Base de Datos:** [Supabase](https://supabase.com/) (PostgreSQL)
* **Estilos & UI:** Layout completamente responsivo adaptado para dispositivos móviles y escritorio.

---

## 🗄️ Estructura de la Base de Datos (PostgreSQL)

El sistema utiliza cuatro tablas relacionales principales en Supabase:

* `clientes`: Información de contacto del comprador.
* `productos`: Descripción de la prenda, costo de compra ($) y precio de venta ($).
* `ventas`: Relación entre cliente, producto, monto total en $ y saldo pendiente.
* `abonos`: Historial de pagos parciales con la tasa BCV aplicada al momento de cada transacción.

---

## ⚙️ Configuración e Instalación

Al ser un frontend estático, **no necesitas instalar Node.js ni servidor local**.

