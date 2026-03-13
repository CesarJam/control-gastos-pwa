# Control de Gastos - PWA

Aplicación Web Progresiva (PWA) desarrollada para la gestión detallada de finanzas personales. Permite registrar, clasificar y consultar ingresos y gastos estructurados por año, mes y quincena, ofreciendo un balance exacto del periodo seleccionado.

## 🚀 Características Principales

* **Autenticación Segura:** Inicio de sesión mediante Google OAuth.
* **Control de Acceso (Whitelist):** Sistema de seguridad mediante guardia de rutas (`vue-router`) que verifica si el correo de Google pertenece a una lista blanca de usuarios autorizados en la base de datos.
* **Gestión Financiera (CRUD):** * Registro de Ingresos y Gastos.
  * Clasificación por estatus de pago (Pagado/Pendiente).
  * Soporte para adjuntar imágenes de comprobantes/tickets.
* **Dashboard Dinámico:** * Filtrado inmediato por Año, Mes y Quincena (1ra o 2da).
  * Tarjetas de resumen con el cálculo en tiempo real de Ingesos, Gastos y Balance Quincenal.
* **Visor de Comprobantes Integrado:** Modal a pantalla completa para previsualizar los tickets subidos sin salir de la aplicación, con soporte para cierre nativo mediante la tecla `Esc`.
* **UX/UI Moderna y Responsiva:** * Diseño "Mobile-First" utilizando un sistema de tarjetas para evitar el desbordamiento horizontal en celulares.
  * **Modo Oscuro (Dark Mode):** Alternancia manual de tema con persistencia en `localStorage` y detección automática de preferencias del sistema.
* **Soporte PWA:** Totalmente instalable en dispositivos móviles y de escritorio, con manifiesto web y service worker configurados.

## 🛠️ Stack Tecnológico

**Frontend:**
* [Vue 3](https://vuejs.org/) (Composition API & `<script setup>`)
* [Vite](https://vitejs.dev/) (Bundler rápido)
* [Vue Router](https://router.vuejs.org/) (Enrutamiento y protección de vistas)
* [Tailwind CSS](https://tailwindcss.com/) (Estilos utilitarios y Modo Oscuro)
* `vite-plugin-pwa` (Generación automática de Service Workers y Web Manifest)

**Backend as a Service (BaaS):**
* [Supabase](https://supabase.com/)
  * **Auth:** Proveedor de Google OAuth.
  * **Database:** PostgreSQL con políticas de seguridad a nivel de fila (RLS).
  * **Storage:** Bucket público para almacenamiento de comprobantes fotográficos.

## 🗄️ Estructura de Base de Datos

El sistema se apoya en las siguientes tablas principales de Supabase:

1. **`usuarios`**: Gestiona el acceso a la app (Lista blanca).
   * Columnas: `id`, `email`, `nombre`, `activo`, `created_at`.
2. **`gastos`**: Almacena los registros financieros.
   * Columnas: `id`, `user_id`, `tipo` (ingreso/gasto), `fecha`, `concepto`, `monto`, `estatus` (boolean), `comprobante_url`.
3. **Storage (`comprobantes`)**: Bucket público con políticas RLS configuradas para permitir operaciones CRUD únicamente a usuarios autenticados, almacenando los archivos en carpetas segmentadas por el `user_id`.

## ⚙️ Instalación y Configuración Local

1. Clonar el repositorio.
2. Instalar las dependencias:
   ```bash
   npm install