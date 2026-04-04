# Control de Gastos - PWA

Aplicación Web Progresiva (PWA) desarrollada para la gestión detallada de finanzas personales. Permite registrar, clasificar y consultar ingresos y gastos estructurados por año, mes y quincena, ofreciendo un balance exacto del periodo seleccionado.

## 🚀 Características Principales

* **Arquitectura Offline-First:** Funcionamiento ininterrumpido sin conexión a internet. Lectura ultrarrápida (0 milisegundos de latencia) y encolado automático de operaciones (Crear, Editar, Eliminar) que se sincronizan en segundo plano en cuanto el dispositivo recupera la conexión.
* **Autenticación Segura y Resiliente:** Inicio de sesión mediante Google OAuth con tolerancia a "Falso Internet" (Lie-Fi), permitiendo acceder a los datos locales si la red falla.
* **Control de Acceso (Whitelist):** Sistema de seguridad mediante guardia de rutas (`vue-router`) que verifica si el correo de Google pertenece a una lista blanca de usuarios autorizados en la base de datos.
* **Gestión Financiera (CRUD):** * Registro de Ingresos y Gastos con generación de UUIDs locales.
  * Clasificación por estatus de pago (Pagado/Pendiente).
  * Soporte para adjuntar imágenes de comprobantes/tickets.
* **Dashboard Dinámico:** * Filtrado inmediato por Año, Mes y Quincena (1ra o 2da).
  * Tarjetas de resumen interactivas (filtros rápidos) con cálculo en tiempo real de Ingresos, Gastos y Balance.
* **Visor de Comprobantes Integrado:** Modal a pantalla completa para previsualizar los tickets subidos con efecto *backdrop blur* y cierre nativo mediante la tecla `Esc`.
* **UX/UI Moderna y Responsiva:** * Diseño "Mobile-First" nativo (bloqueo de selección de texto y pull-to-refresh desactivado).
  * **Modo Oscuro (Dark Mode):** Alternancia manual de tema con persistencia en `localStorage` y detección automática de preferencias del sistema.

## 🛠️ Stack Tecnológico

**Frontend:**
* [Vue 3](https://vuejs.org/) (Composition API & `<script setup>`)
* [Vite](https://vitejs.dev/) (Bundler rápido)
* [Vue Router](https://router.vuejs.org/) (Enrutamiento y protección de vistas)
* [Tailwind CSS](https://tailwindcss.com/) (Estilos utilitarios y animaciones UI)
* [Dexie.js](https://dexie.org/) (Wrapper de IndexedDB para el motor de base de datos local Offline-First)
* `vite-plugin-pwa` (Generación automática de Service Workers y Web Manifest)

**Backend as a Service (BaaS):**
* [Supabase](https://supabase.com/)
  * **Auth:** Proveedor de Google OAuth.
  * **Database:** PostgreSQL con políticas de seguridad a nivel de fila (RLS).
  * **Storage:** Bucket público para almacenamiento de comprobantes fotográficos.

## 🗄️ Estructura de Base de Datos

El sistema utiliza una arquitectura híbrida (Local + Nube) para garantizar disponibilidad y consistencia:

**1. Nube (Supabase - PostgreSQL):**
* **`usuarios`**: Gestiona el acceso a la app (Lista blanca).
* **`gastos`**: Fuente de la verdad de los registros financieros en la nube.
* **`comprobantes` (Storage)**: Bucket con políticas RLS segmentado por `user_id`.

**2. Local (IndexedDB / Dexie.js):**
* **`gastos`**: Espejo local ultrarrápido alimentado por Supabase. Incluye limpieza automática de registros "fantasmas" eliminados en otros dispositivos.
* **`cola_sincronizacion`**: Almacén temporal de transacciones (`INSERT`, `UPDATE`, `DELETE`) pendientes de enviar al servidor cuando el dispositivo se encuentra sin red.

## ⚙️ Instalación y Configuración Local

1. Clonar el repositorio.
2. Instalar las dependencias:
   ```bash
   npm install
3. Configurar las variables de entorno. Crear un archivo .env en la raíz con las credenciales de Supabase:
    ```bash
    VITE_SUPABASE_URL=tu_url_de_supabase
    VITE_SUPABASE_ANON_KEY=tu_clave_anonima_de_supabase
4. Levantar el servidor de desarrollo:
    ```bash
    npm run dev
5. Para compilar a producción y probar la PWA localmente:
    ```bash
    npm run build
    npm run preview
--
Desarrollado por CesarJam94 - v.2.0
