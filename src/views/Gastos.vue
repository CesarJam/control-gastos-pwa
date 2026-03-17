<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-8 transition-colors duration-200">
    <div class="max-w-5xl mx-auto">
      
      <div class="flex justify-between items-center mb-8">
        <h1 class="text-3xl font-bold text-gray-800 dark:text-white">Control Financiero</h1>
        <div class="flex gap-3">
          <button @click="toggleDark" class="p-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-md transition-colors">
            <svg v-if="!isDark" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path></svg>
            <svg v-else class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
          </button>
          <button @click="handleLogout" class="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded transition-colors">
            Cerrar Sesión
          </button>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm mb-6 flex flex-wrap gap-4 items-end transition-colors duration-200">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Año</label>
          <select v-model="filtro.anio" class="border dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md px-3 py-2 w-32 focus:ring-blue-500">
            <option v-for="year in [2024, 2025, 2026, 2027]" :key="year" :value="year">{{ year }}</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Mes</label>
          <select v-model="filtro.mes" class="border dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md px-3 py-2 w-40 focus:ring-blue-500">
            <option v-for="(mes, index) in meses" :key="index" :value="index">{{ mes }}</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Quincena</label>
          <select v-model="filtro.quincena" class="border dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md px-3 py-2 w-40 focus:ring-blue-500">
            <option :value="1">1ra Quincena (1-15)</option>
            <option :value="2">2da Quincena (16+)</option>
          </select>
        </div>
        <div class="ml-auto">
          <button @click="abrirModal()" class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors flex items-center gap-2">
            <span>+ Nuevo Registro</span>
          </button>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border-l-4 border-green-500 transition-colors duration-200">
          <h3 class="text-gray-500 dark:text-gray-400 text-sm font-semibold uppercase">Ingresos</h3>
          <p class="text-2xl font-bold text-green-600 dark:text-green-400">${{ totalIngresos.toFixed(2) }}</p>
        </div>
        <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border-l-4 border-red-500 transition-colors duration-200">
          <h3 class="text-gray-500 dark:text-gray-400 text-sm font-semibold uppercase">Gastos</h3>
          <p class="text-2xl font-bold text-red-600 dark:text-red-400">${{ totalGastos.toFixed(2) }}</p>
        </div>
        <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border-l-4 transition-colors duration-200" :class="balance >= 0 ? 'border-blue-500' : 'border-yellow-500'">
          <h3 class="text-gray-500 dark:text-gray-400 text-sm font-semibold uppercase">Balance Quincenal</h3>
          <p class="text-2xl font-bold" :class="balance >= 0 ? 'text-blue-600 dark:text-blue-400' : 'text-yellow-600 dark:text-yellow-400'">${{ balance.toFixed(2) }}</p>
        </div>
      </div>

      <div v-if="loading" class="p-8 text-center text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
        Cargando movimientos...
      </div>
      <div v-else-if="movimientosFiltrados.length === 0" class="p-8 text-center text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
        No hay registros en esta quincena.
      </div>
      <div v-else class="grid grid-cols-1 gap-3">
        <div 
          v-for="item in movimientosFiltrados" 
          :key="item.id" 
          class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-4 transition-all border border-gray-100 dark:border-gray-700 flex items-center gap-4 hover:shadow-md"
        >
          <div 
            class="w-12 h-12 rounded-full flex items-center justify-center shrink-0 shadow-sm p-2"
            :class="item.tipo === 'ingreso' ? categoriasMap.ingreso.color : (categoriasMap[item.categoria]?.color || categoriasMap.otro.color)"
          >
            <img 
              :src="item.tipo === 'ingreso' ? categoriasMap.ingreso.imgUrl : (categoriasMap[item.categoria]?.imgUrl || categoriasMap.otro.imgUrl)" 
              :alt="item.categoria"
              class="w-full h-full object-contain drop-shadow-sm"
            />
          </div>

          <div class="flex-grow min-w-0">
            <div class="flex items-center gap-2">
              <p class="text-base text-gray-800 dark:text-white truncate leading-tight">
                {{ item.concepto }}
              </p>
              <span v-if="item.tipo === 'gasto'" 
                :class="item.estatus
                 ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300'
                 : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300'"
                class="px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-tighter"
              >
                {{ item.estatus ? 'Pagado' : 'Pendiente' }}
              </span>
            </div>
            <p class="text-xs text-gray-500 dark:text-gray-400 font-medium">
              {{ item.tipo === 'ingreso' ? 'Abono' : (categoriasMap[item.categoria]?.texto || 'Gasto') }} • {{ item.fecha }}
            </p>
          </div>

          <div class="text-right flex flex-col items-end gap-1">
            <span 
              class="text-lg font-black tracking-tight" 
              :class="item.tipo === 'ingreso' ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'"
            >
              {{ item.tipo === 'ingreso' ? '+' : '-' }}${{ item.monto.toLocaleString() }}
            </span>
            <div class="flex gap-2">
              <button @click="abrirComprobante(item.comprobante_url)" v-if="item.comprobante_url" class="text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 p-1 rounded-md transition-colors">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
              </button>
              <button @click="editarMovimiento(item)" class="text-gray-400 hover:text-blue-600 p-1">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
              </button>
              <button @click="eliminarMovimiento(item.id)" class="text-gray-400 hover:text-rose-600 p-1">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <ModalRegistro v-if="mostrarModal" :modo-edicion="modoEdicion" :item-inicial="itemSeleccionado" @cerrar="cerrarModal" @guardado="onGuardado" />
    <div 
        v-if="comprobanteActivo" 
        class="fixed inset-0 bg-black/90 flex items-center justify-center p-4 z-[60] backdrop-blur-sm transition-opacity"
        @click="cerrarComprobante"
      >
        <button 
          @click="cerrarComprobante" 
          class="absolute top-4 right-4 text-white hover:text-gray-300 bg-gray-800/50 hover:bg-gray-700/50 rounded-full p-2 transition-colors"
        >
          <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
        <img 
          :src="comprobanteActivo" 
          alt="Comprobante" 
          class="max-w-full max-h-full object-contain rounded-md shadow-2xl" 
          @click.stop 
        />
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

// Lógica del modo oscuro
const toggleDark = () => {
  isDark.value = !isDark.value
  if (isDark.value) {
    document.documentElement.classList.add('dark')
    localStorage.setItem('theme', 'dark')
  } else {
    document.documentElement.classList.remove('dark')
    localStorage.setItem('theme', 'light')
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
    const fechaItem = new Date(item.fecha + 'T00:00:00')
    return fechaItem.getFullYear() === filtro.value.anio && 
           fechaItem.getMonth() === filtro.value.mes && 
           (fechaItem.getDate() <= 15 ? 1 : 2) === filtro.value.quincena
  })
})

const totalIngresos = computed(() => movimientosFiltrados.value.filter(m => m.tipo === 'ingreso').reduce((sum, item) => sum + Number(item.monto), 0))
const totalGastos = computed(() => movimientosFiltrados.value.filter(m => m.tipo === 'gasto').reduce((sum, item) => sum + Number(item.monto), 0))
const balance = computed(() => totalIngresos.value - totalGastos.value)

onMounted(() => {
  // Revisar si ya había seleccionado modo oscuro antes
  if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    isDark.value = true
    document.documentElement.classList.add('dark')
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