/**
 * SISTEMA DE COLA INTELIGENTE
 * -----------------------------------
 * Maneja:
 * - Orden de atención (FIFO (Primero en entrar primero en salir) + prioridades)
 * - Timeout automático por inactividad
 * - Métricas de atención
 */

let queue = []; // Array principal de usuarios en espera

// Métricas acumuladas
let metrics = {
  totalServed: 0,      // Total de usuarios atendidos
  totalWaitTime: 0     // Tiempo total acumulado de espera
};

// Tiempo máximo permitido sin actividad (ej: 5 minutos)
const TIMEOUT = 5 * 60 * 1000;

/**
 * Agrega un usuario a la cola con nombre
 * @param {string} userId
 * @param {string} name
 * @param {string} priority
 */
function addUser(userId, name = "Cliente", priority = "normal") {
  const existingUser = queue.find(u => u.userId === userId);

  // Evita duplicados
  if (existingUser) {
    return getPosition(userId);
  }

  const user = {
    userId,
    name,
    priority,
    joinedAt: Date.now(),
    lastActive: Date.now()
  };

  queue.push(user);
  sortQueue();

  return getPosition(userId);
}

/**
 * Ordena la cola por prioridad y tiempo
 * Prioridad:
 * urgente > vip > normal
 */
function sortQueue() {
  const priorityOrder = {
    urgente: 1,
    vip: 2,
    normal: 3
  };

  queue.sort((a, b) => {
    // Primero ordena por prioridad
    if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    }

    // Si tienen misma prioridad → FIFO (primero en entrar)
    return a.joinedAt - b.joinedAt;
  });
}

/**
 * Obtiene la posición actual de un usuario
 * @param {string} userId
 */
function getPosition(userId) {
  cleanupQueue(); // Limpia usuarios inactivos

  return queue.findIndex(u => u.userId === userId) + 1;
}

/**
 * Elimina un usuario de la cola (cuando es atendido)
 * y actualiza métricas
 */
function removeUser(userId) {
  const user = queue.find(u => u.userId === userId);

  if (user) {
    const waitTime = Date.now() - user.joinedAt;

    metrics.totalServed++;
    metrics.totalWaitTime += waitTime;
  }

  queue = queue.filter(u => u.userId !== userId);
}

/**
 * Actualiza actividad del usuario (evita timeout)
 */
function updateActivity(userId) {
  const user = queue.find(u => u.userId === userId);

  if (user) {
    user.lastActive = Date.now();
  }
}

/**
 * Elimina usuarios inactivos automáticamente
 */
function cleanupQueue() {
  const now = Date.now();

  queue = queue.filter(user => {
    return (now - user.lastActive) < TIMEOUT;
  });
}

/**
 * Devuelve métricas del sistema
 */
function getMetrics() {
  return {
    enCola: queue.length,
    atendidos: metrics.totalServed,
    esperaPromedioSegundos: metrics.totalServed
      ? Math.round(metrics.totalWaitTime / metrics.totalServed / 1000)
      : 0
  };
}

module.exports = {
  addUser,
  removeUser,
  getPosition,
  updateActivity,
  getMetrics
};
