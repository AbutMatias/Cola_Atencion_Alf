# Sistema de Cola - Botmaker

Sistema de gestión de cola para atención al cliente con:
- Prioridades (normal, VIP, urgente)
- Timeout automático
- Métricas en tiempo real

# Tecnologías
- Node.js
- Express
- Integración con Botmaker

## Endpoints

# Ingresar a la cola
POST /join

# Consultar posición
GET /position/:userId

# Salir de la cola
POST /leave

# Métricas
GET /metrics

# Lógica

- FIFO con prioridad
- Limpieza automática por inactividad
- Cálculo de tiempo promedio de espera

# Beneficios

- Mejora la experiencia del cliente
- Reduce incertidumbre
- Permite priorizar casos críticos