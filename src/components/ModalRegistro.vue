<template>
  <div class="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50" @click.self="emit('cerrar')">
    <div class="bg-white dark:bg-gray-900 rounded-lg p-5 md:p-6 w-full max-w-md shadow-xl transition-colors duration-200 max-h-[90vh] overflow-y-auto">
      <h2 class="text-xl font-bold mb-4 text-gray-900 dark:text-white">{{ modoEdicion ? 'Editar' : 'Nuevo' }} Registro</h2>
      
      <form @submit.prevent="guardarMovimiento">
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tipo de Movimiento</label>
          <select v-model="form.tipo" class="w-full border dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md px-3 py-2 focus:ring-blue-500">
            <option value="gasto">Gasto</option>
            <option value="ingreso">Ingreso</option>
          </select>
        </div>

        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Fecha</label>
          <input v-model="form.fecha" type="date" required 
            class="w-full border dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md px-3 py-2 focus:ring-blue-500 text-left [&::-webkit-date-and-time-value]:text-left appearance-none">
        </div>

        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Categoría</label>
          
          <div class="grid grid-cols-4 sm:grid-cols-4 gap-2 md:gap-3 max-h-60 overflow-y-auto p-1 scrollbar-hide">
            
            <button 
              v-for="(cat, key) in categoriasVisibles" 
              :key="key"
              type="button"
              @click="form.categoria = key"
              class="flex flex-col items-center justify-start p-2 md:p-3 rounded-xl border-2 transition-all duration-200"
              :class="form.categoria === key 
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-sm' 
                : 'border-transparent bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-600'"
            >
              <div class="w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center mb-2 shadow-sm p-2 shrink-0" :class="cat.color">
                <img :src="cat.imgUrl" :alt="cat.texto" class="w-full h-full object-contain drop-shadow-sm" />
              </div>
              
              <span class="text-[10px] md:text-xs font-semibold text-center leading-tight break-words w-full"
                :class="form.categoria === key ? 'text-blue-700 dark:text-blue-400' : 'text-gray-600 dark:text-gray-300'">
                {{ cat.texto }}
              </span>
            </button>

          </div>
        </div>

        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Concepto</label>
          <input v-model="form.concepto" type="text" required placeholder="Ej. Pago de luz..." class="w-full border dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md px-3 py-2 focus:ring-blue-500">
        </div>

        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Monto</label>
          <input v-model="form.monto" type="number" step="0.01" required placeholder="0.00" class="w-full border dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md px-3 py-2 focus:ring-blue-500">
        </div>

        

        <div v-if="form.tipo === 'gasto'" class="mb-4 flex items-center">
          <input v-model="form.estatus" type="checkbox" id="estatus" class="h-4 w-4 text-blue-600 border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700 focus:ring-blue-500">
          <label for="estatus" class="ml-2 block text-sm text-gray-900 dark:text-gray-300">¿Ya está pagado?</label>
        </div>

        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Comprobante</label>
          
          <div class="flex gap-3">
            <button type="button" @click="inputFoto.click()" class="flex-1 flex flex-col items-center justify-center gap-1 p-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl text-gray-600 dark:text-gray-400 hover:bg-blue-50 dark:hover:bg-gray-700 hover:border-blue-400 transition-colors">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
              <span class="text-xs font-semibold">Tomar Foto</span>
            </button>

            <button type="button" @click="inputArchivo.click()" class="flex-1 flex flex-col items-center justify-center gap-1 p-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl text-gray-600 dark:text-gray-400 hover:bg-blue-50 dark:hover:bg-gray-700 hover:border-blue-400 transition-colors">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
              <span class="text-xs font-semibold">Subir Archivo</span>
            </button>
          </div>

          <input ref="inputFoto" type="file" accept="image/*" capture="environment" @change="manejarArchivo" class="hidden">
          <input ref="inputArchivo" type="file" accept="image/*" @change="manejarArchivo" class="hidden">

          <p v-if="archivoTemporal" class="mt-2 text-sm text-green-600 dark:text-green-400 flex items-center gap-1 font-medium">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
            Imagen lista para guardar
          </p>

          <a v-if="form.comprobante_url && !archivoTemporal" :href="form.comprobante_url" target="_blank" class="mt-2 inline-block text-sm text-blue-600 dark:text-blue-400 hover:underline">Ver comprobante guardado</a>
        </div>

        <div class="flex justify-end gap-3">
          <button type="button" @click="emit('cerrar')" class="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors">Cancelar</button>
          <button type="submit" :disabled="guardando" class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors">
            {{ guardando ? 'Guardando...' : 'Guardar' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed, watch } from 'vue'
import { supabase } from '../supabase'
import { db } from '../db'

const props = defineProps({
  modoEdicion: Boolean,
  itemInicial: Object
})

const emit = defineEmits(['cerrar', 'guardado'])

const guardando = ref(false)
const archivoTemporal = ref(null)

const inputFoto = ref(null)
const inputArchivo = ref(null)

// Función para detectar la tecla Esc
const cerrarConEsc = (e) => {
  if (e.key === 'Escape') {
    emit('cerrar')
  }
}

const obtenerFechaLocal = () => {
  const fecha = new Date()
  fecha.setMinutes(fecha.getMinutes() - fecha.getTimezoneOffset())
  return fecha.toISOString().split('T')[0]
}

const form = ref({
  tipo: 'gasto',
  categoria: 'entretenimiento',
  fecha: obtenerFechaLocal(),
  concepto: '',
  monto: null,
  estatus: false,
  comprobante_url: null
})

// Vigila los cambios en "tipo" para auto-seleccionar la categoría
watch(() => form.value.tipo, (nuevoTipo) => {
  if (nuevoTipo === 'ingreso') {
    form.value.categoria = 'ingreso'
  } else if (nuevoTipo === 'gasto' && form.value.categoria === 'ingreso') {
    // Si regresa a gasto, lo regresamos a una categoría por defecto
    form.value.categoria = 'otro' 
  }
})

// Filtra las categorías que se dibujan en pantalla
const categoriasVisibles = computed(() => {
  const filtradas = {}
  
  if (form.value.tipo === 'ingreso') {
    // Si es ingreso, SOLO mostramos la categoría ingreso
    filtradas['ingreso'] = categoriasMap['ingreso']
  } else {
    // Si es gasto, mostramos TODAS excepto ingreso
    for (const [key, value] of Object.entries(categoriasMap)) {
      if (key !== 'ingreso') {
        filtradas[key] = value
      }
    }
  }
  
  return filtradas
})


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
        imgUrl: 'https://img.icons8.com/?size=100&id=hANsGH9seK9Q&format=png&color=000000'
    }
}

// Si estamos editando, llenamos el formulario con los datos que nos pasaron
onMounted(() => {
  if (props.modoEdicion && props.itemInicial) {
    form.value = { ...props.itemInicial }
  }
  window.addEventListener('keydown', cerrarConEsc)
})

// Dejar de escuchar el teclado al cerrar para limpiar la memoria
onUnmounted(() => {
  window.removeEventListener('keydown', cerrarConEsc)
})

const manejarArchivo = (event) => {
  const file = event.target.files[0]
  if (file) archivoTemporal.value = file
}

const subirImagen = async (file) => {
  const { data: { user } } = await supabase.auth.getUser()
  const fileExt = file.name.split('.').pop()
  const fileName = `${user.id}/${Date.now()}.${fileExt}`
  
  const { error } = await supabase.storage.from('comprobantes').upload(fileName, file)
  if (error) throw error
  
  const { data: { publicUrl } } = supabase.storage.from('comprobantes').getPublicUrl(fileName)
  return publicUrl
}

const guardarMovimiento = async () => {
  try {
    guardando.value = true
    const { data: { session } } = await supabase.auth.getSession()

    // 1. Manejo de imágenes (Requiere internet por ahora)
    let urlComprobante = form.value.comprobante_url
    if (archivoTemporal.value) {
      if (!navigator.onLine) {
        alert('Estás sin conexión. No se pueden subir imágenes por ahora, guarda el registro sin comprobante.')
        guardando.value = false
        return
      }
      urlComprobante = await subirImagen(archivoTemporal.value)
    }

    // 2. Crear el payload con un ID local (UUID) si es un nuevo registro
    const registroId = props.modoEdicion ? form.value.id : crypto.randomUUID()

    const payload = {
      id: registroId,
      user_id: session.user.id,
      tipo: form.value.tipo,
      categoria: form.value.tipo === 'gasto' ? form.value.categoria : 'ingreso',
      fecha: form.value.fecha,
      concepto: form.value.concepto,
      monto: parseFloat(form.value.monto),
      estatus: form.value.tipo === 'gasto' ? form.value.estatus : false,
      comprobante_url: urlComprobante
    }

    // 3. GUARDADO LOCAL (Inmediato)
    if (props.modoEdicion) {
      await db.gastos.put(payload) // Actualiza en Dexie
    } else {
      await db.gastos.add(payload) // Inserta en Dexie
    }

    // 4. INTENTO DE SUBIDA O ENCOLADO
    const operacion = props.modoEdicion ? 'UPDATE' : 'INSERT'

    if (navigator.onLine) {
      try {
        let errorSupabase = null

        // Si hay red, intentamos mandarlo a Supabase y CAPTURAMOS el error
        if (props.modoEdicion) {
          const { error } = await supabase.from('gastos').update(payload).eq('id', payload.id)
          errorSupabase = error
        } else {
          const { error } = await supabase.from('gastos').insert([payload])
          errorSupabase = error
        }

        // Si Supabase reporta un fallo (ej. falso internet), forzamos la excepción
        if (errorSupabase) throw errorSupabase

      } catch (error) {
        // Ahora sí, el catch atrapará el error y lo mandará a la cola local
        console.warn('Fallo de red al subir. Encolando operación.', error)
        await db.cola_sincronizacion.add({ operacion, payload, timestamp: Date.now() })
      }
    } else {
      // Si definitivamente no hay internet, directo a la cola
      await db.cola_sincronizacion.add({ operacion, payload, timestamp: Date.now() })
    }

    emit('guardado') 
  } catch (error) {
    console.error('Error al guardar:', error)
    alert('Hubo un problema al guardar el registro.')
  } finally {
    guardando.value = false
  }
}

</script>