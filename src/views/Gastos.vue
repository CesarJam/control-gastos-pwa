<template>
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 pb-24 md:p-8 transition-colors duration-200">
        <div class="max-w-5xl mx-auto">

            <div class="flex justify-between items-center mb-8">
                <h1 class="text-3xl font-bold text-gray-800 dark:text-white">Control Financiero</h1>
                <div class="flex gap-3">

                    <button @click="toggleDark"
                        class="p-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-md transition-colors flex items-center justify-center">
                        <svg v-if="!isDark" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z">
                            </path>
                        </svg>
                        <svg v-else class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z">
                            </path>
                        </svg>
                    </button>

                    <button @click="handleLogout"
                        class="bg-red-500 hover:bg-red-600 text-white font-bold p-2 md:py-2 md:px-4 rounded transition-colors flex items-center justify-center gap-2">
                        <svg class="w-6 h-6 md:hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1">
                            </path>
                        </svg>
                        <span class="hidden md:inline">Cerrar Sesión</span>
                    </button>

                </div>
            </div>

            <div class="bg-white dark:bg-gray-800 p-3 md:p-4 rounded-lg shadow-sm mb-6 flex flex-col gap-3 transition-colors duration-200">
        
        <div class="grid grid-cols-2 md:flex md:flex-wrap gap-2 md:gap-4 md:items-end">
          
          <div>
            <label class="hidden md:block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Año</label>
            <select v-model="filtro.anio" class="w-full md:w-32 border dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md px-2 md:px-3 py-2 text-sm md:text-base focus:ring-blue-500">
              <option v-for="year in [2024, 2025, 2026, 2027]" :key="year" :value="year">{{ year }}</option>
            </select>
          </div>
          
          <div>
            <label class="hidden md:block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Mes</label>
            <select v-model="filtro.mes" class="w-full md:w-40 border dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md px-2 md:px-3 py-2 text-sm md:text-base focus:ring-blue-500">
              <option v-for="(mes, index) in meses" :key="index" :value="index">{{ mes }}</option>
            </select>
          </div>
          
          <div class="col-span-2 md:col-span-1">
            <label class="hidden md:block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Quincena</label>
            <select v-model="filtro.quincena" class="w-full md:w-48 border dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md px-2 md:px-3 py-2 text-sm md:text-base focus:ring-blue-500">
              <option :value="1">1ra Quincena (1-15)</option>
              <option :value="2">2da Quincena (16+)</option>
            </select>
          </div>

          <div class="col-span-2 md:col-span-1 md:ml-auto">
            <button @click="abrirModal()" class="fixed bottom-6 right-4 md:static z-40 bg-blue-600 hover:bg-blue-700 text-white font-bold w-14 h-14 md:w-auto md:h-auto md:py-2 md:px-4 rounded-full md:rounded shadow-2xl md:shadow-none transition-all flex items-center justify-center gap-2">
              <svg class="w-7 h-7 md:hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4"></path>
              </svg>
              <span class="hidden md:inline">+ Nuevo Registro</span>
            </button>
          </div>

        </div>

        <div class="relative w-full">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </div>
          <input v-model="searchQuery" type="text" placeholder="Buscar concepto (ej. Gasolina...)" class="w-full pl-10 pr-4 py-2 text-sm md:text-base border dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-colors" />
        </div>
        
      </div>

            <div class="grid grid-cols-3 gap-2 md:gap-6 mb-8">

                <div @click="filtroTipo = 'ingreso'"
                    class="cursor-pointer p-3 md:p-6 rounded-xl border-b-4 md:border-b-0 md:border-l-4 border-green-500 transition-all duration-300 flex flex-col items-center md:items-start justify-center"
                    :class="filtroTipo === 'ingreso' 
                        ? 'bg-white dark:bg-gray-800 shadow-lg scale-105 -translate-y-1 opacity-100 z-10' 
                        : 'bg-gray-50 dark:bg-gray-800/60 shadow-sm scale-95 opacity-50 hover:opacity-70'">
                    <div class="flex items-center gap-2 mb-1 md:mb-0 text-gray-500 dark:text-gray-400">
                        <svg class="w-5 h-5 md:hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
                        </svg>
                        <h3 class="hidden md:block text-sm font-semibold uppercase">Ingresos</h3>
                    </div>
                    <p class="text-sm sm:text-base md:text-2xl font-bold text-green-600 dark:text-green-400 truncate w-full text-center md:text-left">
                        ${{ totalIngresos.toFixed(2) }}
                    </p>
                </div>

                <div @click="filtroTipo = 'gasto'"
                    class="cursor-pointer p-3 md:p-6 rounded-xl border-b-4 md:border-b-0 md:border-l-4 border-red-500 transition-all duration-300 flex flex-col items-center md:items-start justify-center"
                    :class="filtroTipo === 'gasto' 
                        ? 'bg-white dark:bg-gray-800 shadow-lg scale-105 -translate-y-1 opacity-100 z-10' 
                        : 'bg-gray-50 dark:bg-gray-800/60 shadow-sm scale-95 opacity-50 hover:opacity-70'">
                    <div class="flex items-center gap-2 mb-1 md:mb-0 text-gray-500 dark:text-gray-400">
                        <svg class="w-5 h-5 md:hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 17h8m0 0v-8m0 8l-8-8-4 4-6-6"></path>
                        </svg>
                        <h3 class="hidden md:block text-sm font-semibold uppercase">Gastos</h3>
                    </div>
                    <p class="text-sm sm:text-base md:text-2xl font-bold text-red-600 dark:text-red-400 truncate w-full text-center md:text-left">
                        ${{ totalGastos.toFixed(2) }}
                    </p>
                </div>

                <div @click="filtroTipo = 'todos'"
                    class="cursor-pointer p-3 md:p-6 rounded-xl border-b-4 md:border-b-0 md:border-l-4 transition-all duration-300 flex flex-col items-center md:items-start justify-center"
                    :class="[
                        balance >= 0 ? 'border-blue-500' : 'border-yellow-500',
                        filtroTipo === 'todos' 
                            ? 'bg-white dark:bg-gray-800 shadow-lg scale-105 -translate-y-1 opacity-100 z-10' 
                            : 'bg-gray-50 dark:bg-gray-800/60 shadow-sm scale-95 opacity-50 hover:opacity-70'
                    ]">
                    <div class="flex items-center gap-2 mb-1 md:mb-0 text-gray-500 dark:text-gray-400">
                        <svg class="w-5 h-5 md:hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path>
                        </svg>
                        <h3 class="hidden md:block text-sm font-semibold uppercase truncate">Balance</h3>
                    </div>
                    <p class="text-sm sm:text-base md:text-2xl font-bold truncate w-full text-center md:text-left"
                        :class="balance >= 0 ? 'text-blue-600 dark:text-blue-400' : 'text-yellow-600 dark:text-yellow-400'">
                        ${{ balance.toFixed(2) }}
                    </p>
                </div>

            </div>

            <div v-if="loading"
                class="p-8 text-center text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                Cargando movimientos...
            </div>
            <div v-else-if="listaMovimientos.length === 0"
                class="p-8 text-center text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                No hay registros en esta quincena.
            </div>
            <div v-else class="grid grid-cols-1 gap-3">
                <div v-for="item in listaMovimientos" :key="item.id"
                    class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-4 transition-all border border-gray-100 dark:border-gray-700 flex items-center gap-4 hover:shadow-md">
                    <div class="w-12 h-12 rounded-full flex items-center justify-center shrink-0 shadow-sm p-2"
                        :class="item.tipo === 'ingreso' ? categoriasMap.ingreso.color : (categoriasMap[item.categoria]?.color || categoriasMap.otro.color)">
                        <img :src="item.tipo === 'ingreso' ? categoriasMap.ingreso.imgUrl : (categoriasMap[item.categoria]?.imgUrl || categoriasMap.otro.imgUrl)"
                            :alt="item.categoria" class="w-full h-full object-contain drop-shadow-sm" />
                    </div>

                    <div class="flex-grow min-w-0">
                        <div class="flex items-center gap-2">
                            <p class="text-base font-bold text-gray-800 dark:text-white leading-tight break-words">
                                {{ item.concepto }}
                            </p>
                        </div>
                        <p class="text-xs text-gray-500 dark:text-gray-400 font-medium">
                            {{ item.tipo === 'ingreso' ? 'Abono' : (categoriasMap[item.categoria]?.texto || 'Gasto') }}
                            • {{ item.fecha }}
                        </p>
                    </div>

                    <div class="text-right flex flex-col items-end gap-1">
                        <span class="text-lg font-black tracking-tight"
                            :class="item.tipo === 'ingreso' ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'">
                            {{ item.tipo === 'ingreso' ? '+' : '-' }}${{ item.monto.toLocaleString() }}
                        </span>
                        <span v-if="item.tipo === 'gasto'" :class="item.estatus
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300'
                            : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300'"
                            class="px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-tighter">
                            {{ item.estatus ? 'Pagado' : 'Pendiente' }}
                        </span>
                        <div class="flex gap-2">
                            <button @click="abrirComprobante(item.comprobante_url)" v-if="item.comprobante_url"
                                class="text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 p-1 rounded-md transition-colors">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z">
                                    </path>
                                </svg>
                            </button>
                            <button @click="editarMovimiento(item)" class="text-gray-400 hover:text-blue-600 p-1">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z">
                                    </path>
                                </svg>
                            </button>
                            <button @click="eliminarMovimiento(item.id)" class="text-gray-400 hover:text-rose-600 p-1">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16">
                                    </path>
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <ModalRegistro v-if="mostrarModal" :modo-edicion="modoEdicion" :item-inicial="itemSeleccionado"
                @cerrar="cerrarModal" @guardado="onGuardado" />
            <div v-if="comprobanteActivo"
                class="fixed inset-0 bg-black/90 flex items-center justify-center p-4 z-[60] backdrop-blur-sm transition-opacity"
                @click="cerrarComprobante">
                <button @click="cerrarComprobante"
                    class="absolute top-4 right-4 text-white hover:text-gray-300 bg-gray-800/50 hover:bg-gray-700/50 rounded-full p-2 transition-colors">
                    <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12">
                        </path>
                    </svg>
                </button>
                <img :src="comprobanteActivo" alt="Comprobante"
                    class="max-w-full max-h-full object-contain rounded-md shadow-2xl" @click.stop />
            </div>
        </div>

    </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { supabase } from '../supabase'
import { useRouter } from 'vue-router'
import ModalRegistro from '../components/ModalRegistro.vue'

const router = useRouter()
const loading = ref(true)
const movimientos = ref([])
const isDark = ref(false) // Variable del modo oscuro

const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']

const hoy = new Date()
const filtro = ref({
    anio: hoy.getFullYear(),
    mes: hoy.getMonth(),
    quincena: hoy.getDate() <= 15 ? 1 : 2
})

//Variable para busqueda
const searchQuery = ref('')

//Filtro rápido por tipo de tarjeta
const filtroTipo = ref('todos')

//Computada final para la lista visual (respeta fecha, búsqueda y tipo de tarjeta)
const listaMovimientos = computed(() => {
    if (filtroTipo.value === 'todos') return movimientosFiltrados.value
    return movimientosFiltrados.value.filter(m => m.tipo === filtroTipo.value)
})

// Lógica del modo oscuro
const toggleDark = () => {
    isDark.value = !isDark.value
    const metaThemeColor = document.getElementById('theme-color-meta') 

    if (isDark.value) {
        document.documentElement.classList.add('dark')
        localStorage.setItem('theme', 'dark')
        if (metaThemeColor) metaThemeColor.setAttribute('content', '#111827') 
    } else {
        document.documentElement.classList.remove('dark')
        localStorage.setItem('theme', 'light')
        if (metaThemeColor) metaThemeColor.setAttribute('content', '#f9fafb')
    }
}

const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
}

const fetchMovimientos = async () => {
    loading.value = true
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
        const { data, error } = await supabase.from('gastos').select('*').eq('user_id', user.id).order('fecha', { ascending: false })
        if (!error && data) movimientos.value = data
    }
    loading.value = false
}

const movimientosFiltrados = computed(() => {
    return movimientos.value.filter(item => {
        // 1. Validar la fecha
        const fechaItem = new Date(item.fecha + 'T00:00:00')
        const coincideFecha = fechaItem.getFullYear() === filtro.value.anio &&
            fechaItem.getMonth() === filtro.value.mes &&
            (fechaItem.getDate() <= 15 ? 1 : 2) === filtro.value.quincena

        // 2. Validar la búsqueda (ignorando mayúsculas y minúsculas)
        const coincideBusqueda = item.concepto.toLowerCase().includes(searchQuery.value.toLowerCase())

        // Retornar solo si cumple ambas condiciones
        return coincideFecha && coincideBusqueda
    })
})

const totalIngresos = computed(() => movimientosFiltrados.value.filter(m => m.tipo === 'ingreso').reduce((sum, item) => sum + Number(item.monto), 0))
const totalGastos = computed(() => movimientosFiltrados.value.filter(m => m.tipo === 'gasto').reduce((sum, item) => sum + Number(item.monto), 0))
const balance = computed(() => totalIngresos.value - totalGastos.value)

onMounted(() => {
    // Revisar si ya había seleccionado modo oscuro antes
    const metaThemeColor = document.getElementById('theme-color-meta')

    if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        isDark.value = true
        document.documentElement.classList.add('dark')
        if (metaThemeColor) metaThemeColor.setAttribute('content', '#111827') 
    } else {
        if (metaThemeColor) metaThemeColor.setAttribute('content', '#f9fafb') 
    }
    
    fetchMovimientos()
    window.addEventListener('keydown', cerrarConEsc)
})
onUnmounted(() => {
    window.removeEventListener('keydown', cerrarConEsc)
})

const mostrarModal = ref(false)
const modoEdicion = ref(false)
const itemSeleccionado = ref(null)

const abrirModal = () => {
    itemSeleccionado.value = null
    modoEdicion.value = false
    mostrarModal.value = true
}

const editarMovimiento = (item) => {
    itemSeleccionado.value = { ...item }
    modoEdicion.value = true
    mostrarModal.value = true
}

const cerrarModal = () => mostrarModal.value = false

const onGuardado = async () => {
    cerrarModal()
    await fetchMovimientos()
}

// Lógica del visor de comprobantes
const comprobanteActivo = ref(null)

const abrirComprobante = (url) => comprobanteActivo.value = url
const cerrarComprobante = () => comprobanteActivo.value = null

const eliminarMovimiento = async (id) => {
    if (confirm('¿Estás seguro de que deseas eliminar este registro?')) {
        await supabase.from('gastos').delete().eq('id', id)
        await fetchMovimientos()
    }
}

//Logica para cerrar modal
const cerrarConEsc = (e) => {
    if (e.key === 'Escape' && comprobanteActivo.value) {
        cerrarComprobante()
    }
}
//Categorias
const categoriasMap = {
    entretenimiento: {
        color: 'bg-purple-100 dark:bg-purple-900/30',
        texto: 'Entretenimiento',
        imgUrl: 'https://img.icons8.com/?size=100&id=vzJRN9S0Db0Q&format=png&color=000000'
    },
    automovil: {
        color: 'bg-blue-100 dark:bg-blue-900/30',
        texto: 'Automóvil',
        imgUrl: 'https://img.icons8.com/?size=100&id=hwOJ5x33ywg6&format=png&color=000000'
    },
    escuela: {
        color: 'bg-indigo-100 dark:bg-indigo-900/30',
        texto: 'Escuela',
        imgUrl: 'https://img.icons8.com/?size=100&id=9HuXC128p4_T&format=png&color=000000'
    },
    salud: {
        color: 'bg-rose-100 dark:bg-rose-900/30',
        texto: 'Salud',
        imgUrl: 'https://img.icons8.com/?size=100&id=trsCZxEJArXb&format=png&color=000000'
    },
    gimnasio: {
        color: 'bg-zinc-200 dark:bg-zinc-800/50',
        texto: 'Gimnasio',
        imgUrl: 'https://img.icons8.com/?size=100&id=eqJxioVaWa0N&format=png&color=000000'
    },
    comida: {
        color: 'bg-green-100 dark:bg-green-900/30',
        texto: 'Comida',
        imgUrl: 'https://img.icons8.com/?size=100&id=as4wAkWJZrIK&format=png&color=000000'
    },
    servicios: {
        color: 'bg-yellow-100 dark:bg-yellow-900/30',
        texto: 'Servicios',
        imgUrl: 'https://img.icons8.com/?size=100&id=zqNjrHRmmsQI&format=png&color=000000'
    },
    ingreso: {
        color: 'bg-emerald-100 dark:bg-emerald-900/30',
        texto: 'Ingreso',
        imgUrl: 'https://img.icons8.com/?size=100&id=yUTNKgUuTlsA&format=png&color=000000'
    },
    otro: {
        color: 'bg-slate-100 dark:bg-slate-900/30',
        texto: 'Otro',
        imgUrl: 'https://img.icons8.com/?size=100&id=hANsGH9seK9Q&format=png&color=000000' // Icono genérico de caja
    }
}

</script>