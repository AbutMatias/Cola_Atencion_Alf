Sistema de Cola - Botmaker

Sistema de gestión de cola para atención al cliente con:
- Prioridades (normal, VIP, urgente)
- Timeout automático
- Métricas en tiempo real

Tecnologías
- Node.js
- Express
- Integración con Botmaker

Endpoints

Ingresar a la cola
POST /join

Consultar posición
GET /position/:userId

Salir de la cola
POST /leave

Métricas
GET /metrics

Lógica

- FIFO con prioridad
- Limpieza automática por inactividad
- Cálculo de tiempo promedio de espera

Beneficios

- Mejora la experiencia del cliente
- Reduce incertidumbre
- Permite priorizar casos críticos

---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

Integración con Botmaker mediante Webhooks

Este sistema de cola se integra con **Botmaker** utilizando Webhooks (llamadas HTTP) para gestionar la posición de los usuarios en tiempo real.

---

Concepto de integración

* **Botmaker** actúa como interfaz conversacional con el usuario
* **Este backend** gestiona la lógica de la cola (posición, prioridades, métricas)
* La comunicación se realiza mediante **requests HTTP (Webhooks)**

---

Requisitos previos

Antes de configurar:

* El backend debe estar **deployado en una URL pública** (ej: Render, Railway, etc.)
* Botmaker debe tener habilitada la acción de **Webhook / API Request**
* Tener acceso a variables dinámicas como:

  ```
  {{contact.id}}
  ```

---

1. Ingreso a la cola

Configurar un Webhook en el flujo inicial del bot.

**Método:**

```
POST
```

**URL:**

```
https://TU-SERVIDOR/join
```

**Body (JSON):**

```json
{
  "userId": "{{contact.id}}",
  "priority": "normal"
}
```

**Respuesta esperada:**

```json
{
  "position": 3
}
```

**Mensaje sugerido al usuario:**

```
Hola 👋

Actualmente hay otros clientes en espera.
Tenés {{position}} personas adelante tuyo.

Te vamos a atender en breve.
```

---

2. Consulta de posición

Permite al usuario consultar su estado en la cola.

**Método:**

```
GET
```

**URL:**

```
https://TU-SERVIDOR/position/{{contact.id}}
```

**Mensaje sugerido:**

```
Seguís en espera ⏳

Personas delante tuyo: {{position - 1}}
```

Esta llamada también actualiza la actividad del usuario para evitar su eliminación por timeout.

---

3. Salida de la cola (cuando es atendido)

Cuando la conversación es derivada a un agente humano, se debe ejecutar:

**Método:**

```
POST
```

**URL:**

```
https://TU-SERVIDOR/leave
```

**Body:**

```json
{
  "userId": "{{contact.id}}"
}
```

---

4. Manejo de actividad (anti-timeout)

Para evitar que el usuario sea eliminado automáticamente por inactividad:

* Se recomienda llamar al endpoint `/position` cada vez que el usuario interactúe con el bot
* Esto actualiza internamente el campo `lastActive`

---

5. Métricas (uso interno)

El sistema expone métricas en:

```
GET https://TU-SERVIDOR/metrics
```

Ejemplo de respuesta:

```json
{
  "enCola": 5,
  "atendidos": 120,
  "esperaPromedioSegundos": 45
}
```

Estas métricas pueden ser utilizadas para dashboards o monitoreo interno.

---

# Consideraciones importantes

* Botmaker no puede consumir endpoints locales (`localhost`)
* Es obligatorio utilizar una URL pública accesible
* Validar manejo de errores en Webhooks (timeouts, caídas del servidor)
* Asegurar que el `userId` sea único por usuario

---

# Recomendaciones

* Implementar botones tipo:

  * “Consultar estado”
  * “Seguir esperando”
* Mostrar mensajes dinámicos para mejorar la experiencia del usuario
* Considerar el uso de prioridades (`vip`, `urgente`) según el caso

---

#  Beneficio de la integración

Esta implementación permite:

* Reducir la incertidumbre del cliente
* Mejorar la experiencia de espera
* Priorizar casos críticos
* Obtener métricas reales de atención

---
