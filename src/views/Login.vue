<template>
  <div class="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 transition-colors duration-200 relative p-4">
    
    <div class="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl w-full max-w-md text-center transform transition-all border border-gray-100 dark:border-gray-700">
      
      <img src="/pwa-512x512.png" alt="Logo Control de Gastos" class="w-24 h-24 mx-auto mb-6 drop-shadow-md rounded-2xl">
      
      <h2 class="text-3xl font-extrabold mb-2 text-gray-800 dark:text-white tracking-tight">Control de Gastos</h2>
      <p class="text-gray-500 dark:text-gray-400 mb-8 text-sm">Inicia sesión para gestionar tus finanzas</p>
      
      <button 
        @click="handleGoogleLogin"
        :disabled="loading" 
        class="w-full flex items-center justify-center gap-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-white font-semibold py-3 px-4 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900/30 disabled:opacity-70 transition-all duration-200 shadow-sm"
      >
        <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
        </svg>
        {{ loading ? 'Conectando...' : 'Continuar con Google' }}
      </button>

      <div v-if="errorMessage" class="mt-6 p-3 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg text-sm font-medium border border-red-100 dark:border-red-800/50">
        {{ errorMessage }}
      </div>
    </div>

    <div class="absolute bottom-6 text-center w-full px-4">
      <p class="text-xs font-medium text-gray-400 dark:text-gray-500 tracking-wide">
        Desarrollado por CesarJam94 - v.1.0
      </p>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { supabase } from '../supabase'

const route = useRoute()
const loading = ref(false)
const errorMessage = ref('')

onMounted(() => {
  // 1. Revisar preferencias de tema al montar la vista de Login
  if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }

  // 2. Revisar si hay error de autorización en la URL
  if (route.query.error === 'no-autorizado') {
    errorMessage.value = 'Tu cuenta no tiene autorización para entrar al sistema.'
  }
})

const handleGoogleLogin = async () => {
  try {
    loading.value = true
    errorMessage.value = ''
    
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/gastos` 
      }
    })
    
    if (error) throw error
    
  } catch (error) {
    errorMessage.value = error.message
  } finally {
    loading.value = false
  }
}
</script>