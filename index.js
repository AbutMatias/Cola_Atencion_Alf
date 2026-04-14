/**
 * API REST - SISTEMA DE COLA
 * -----------------------------------
 * Endpoints:
 * POST /join       → ingresar a la cola
 * GET /position    → consultar posición
 * POST /leave      → salir de la cola
 * GET /metrics     → métricas del sistema
 */

const express = require("express");
const queue = require("./queue");

const app = express();
app.use(express.json());

/**
 * INGRESAR A LA COLA
 * Body:
 * {
 *   userId: string,
 *   priority: "normal" | "vip" | "urgente"
 * }
 */
app.post("/join", (req, res) => {
  const { userId, name, priority } = req.body;

  if (!userId) {
    return res.status(400).json({ error: "userId requerido" });
  }

  const position = queue.addUser(userId, name, priority);

  res.json({
    message: "Usuario agregado a la cola",
    position
  });
});

/**
 * CONSULTAR POSICIÓN
 */
app.get("/position/:userId", (req, res) => {
  const userId = req.params.userId;

  const position = queue.getPosition(userId);

  // Actualiza actividad para evitar timeout
  queue.updateActivity(userId);

  res.json({
    position
  });
});

/**
 * SALIR DE LA COLA (cuando es atendido)
 */
app.post("/leave", (req, res) => {
  const { userId } = req.body;

  queue.removeUser(userId);

  res.json({
    message: "Usuario eliminado de la cola"
  });
});

/**
 * MÉTRICAS DEL SISTEMA
 */
app.get("/metrics", (req, res) => {
  const metrics = queue.getMetrics();

  res.json(metrics);
});

// Levanta el servidor
app.listen(3000, () => {
  console.log("Servidor de cola corriendo en puerto 3000");
});
