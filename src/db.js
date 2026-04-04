import Dexie from 'dexie'

// 1. Creamos la base de datos local
export const db = new Dexie('ControlGastosDB')

// 2. Definimos la estructura (esquema) de nuestras tablas
db.version(1).stores({
  gastos: 'id, user_id, tipo, categoria, fecha, concepto',
  // La tabla 'cola_sincronizacion' es nuestra libreta de "tareas pendientes".
  // ++id significa que se auto-incrementa (1, 2, 3...).
  // Aquí guardaremos si la acción fue 'INSERT', 'UPDATE' o 'DELETE' cuando no había internet.
  cola_sincronizacion: '++id, operacion, timestamp'
})