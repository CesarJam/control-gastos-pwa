import { createRouter, createWebHistory } from 'vue-router'
import { supabase } from '../supabase'
import Login from '../views/Login.vue'
import Gastos from '../views/Gastos.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: Login },
    { 
      path: '/gastos', 
      component: Gastos,
      meta: { requiresAuth: true }
    }
  ]
})

// Guardia de navegación
router.beforeEach(async (to, from, next) => {
  const { data: { session } } = await supabase.auth.getSession()

  // Si no hay sesión y la ruta requiere autenticación
  if (to.meta.requiresAuth && !session) {
    return next('/') 
  }

  // Si hay sesión iniciada
  if (session) {
    if (navigator.onLine) {
      try {
        const { data: usuario, error } = await supabase
          .from('usuarios')
          .select('*')
          .eq('email', session.user.email)
          .single()

        // Evaluamos si el error es de conexión (Supabase usa la palabra 'fetch' en fallos de red)
        const esErrorDeRed = error && error.message && error.message.toLowerCase().includes('fetch')

        // Si NO es un error de red, entonces el servidor sí nos respondió
        if (!esErrorDeRed) {
          // PGRST116 es el código exacto de Supabase cuando un registro no existe
          const noExiste = error && error.code === 'PGRST116'
          const estaInactivo = usuario && usuario.activo === false

          // SOLO te sacamos si estamos 100% seguros de que ya no tienes acceso
          if (noExiste || estaInactivo) {
            // Intentamos cerrar sesión (le ponemos un catch silencioso por si la red parpadea)
            try { await supabase.auth.signOut() } catch(e) {}
            
            if (to.path !== '/') {
              return next('/?error=no-autorizado')
            }
            return next() 
          }
        }
      } catch (err) {
        console.warn('Modo offline activo: Fallo de red al validar usuario.', err)
      }
    }

    // Si pasamos la validación o si la red falló, te dejamos entrar al dashboard
    if (to.path === '/') {
      return next('/gastos')
    }
  }

  // En cualquier otro caso, permite la navegación
  next()
})

export default router