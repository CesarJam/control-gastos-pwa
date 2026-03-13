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
    // Validar si el correo existe en nuestra tabla 'usuarios'
    const { data: usuario, error } = await supabase
      .from('usuarios')
      .select('*')
      .eq('email', session.user.email)
      .single()

    // Si no existe el usuario o no está activo, destruimos la sesión
    if (error || !usuario || !usuario.activo) {
      await supabase.auth.signOut()
      
      // Si intentaba ir a otra ruta, lo mandamos al login con un parámetro de error
      if (to.path !== '/') {
        return next('/?error=no-autorizado')
      }
      return next() // Si ya estaba en el login, se queda ahí
    }

    // Si el usuario es válido y está en el login, lo mandamos a gastos
    if (to.path === '/') {
      return next('/gastos')
    }
  }

  // En cualquier otro caso, permite la navegación
  next()
})

export default router