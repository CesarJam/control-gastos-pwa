<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
    <div class="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md shadow-xl transition-colors duration-200">
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
          <input v-model="form.fecha" type="date" required class="w-full border dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md px-3 py-2 focus:ring-blue-500">
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
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Comprobante</label>
          <input type="file" accept="image/*" @change="manejarArchivo" class="w-full text-sm text-gray-500 dark:text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 dark:file:bg-gray-700 file:text-blue-700 dark:file:text-blue-400 hover:file:bg-blue-100 dark:hover:file:bg-gray-600">
          <a v-if="form.comprobante_url" :href="form.comprobante_url" target="_blank" class="mt-2 inline-block text-sm text-blue-600 dark:text-blue-400 hover:underline">Ver comprobante actual</a>
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
import { ref, onMounted } from 'vue'
import { supabase } from '../supabase'

const props = defineProps({
  modoEdicion: Boolean,
  itemInicial: Object
})

const emit = defineEmits(['cerrar', 'guardado'])

const guardando = ref(false)
const archivoTemporal = ref(null)

const form = ref({
  id: null,
  tipo: 'gasto',
  fecha: new Date().toISOString().split('T')[0],
  concepto: '',
  monto: '',
  estatus: false,
  comprobante_url: null
})

// Si estamos editando, llenamos el formulario con los datos que nos pasaron
onMounted(() => {
  if (props.modoEdicion && props.itemInicial) {
    form.value = { ...props.itemInicial }
  }
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
    const { data: { user } } = await supabase.auth.getUser()
    let urlComprobante = form.value.comprobante_url
    
    if (archivoTemporal.value) {
      urlComprobante = await subirImagen(archivoTemporal.value)
    }

    const payload = {
      user_id: user.id,
      tipo: form.value.tipo,
      fecha: form.value.fecha,
      concepto: form.value.concepto,
      monto: parseFloat(form.value.monto),
      estatus: form.value.tipo === 'gasto' ? form.value.estatus : false,
      comprobante_url: urlComprobante
    }

    if (props.modoEdicion) {
      await supabase.from('gastos').update(payload).eq('id', form.value.id)
    } else {
      await supabase.from('gastos').insert([payload])
    }

    emit('guardado') // Le avisamos a la vista padre que terminamos
  } catch (error) {
    console.error('Error al guardar:', error)
    alert('Hubo un problema al guardar el registro.')
  } finally {
    guardando.value = false
  }
}
</script>