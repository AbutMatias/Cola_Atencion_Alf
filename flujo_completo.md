# 🔄 Flujo completo - Botmaker + Sistema de Cola

Este diagrama representa el flujo completo de interacción entre el usuario, Botmaker y la API de cola.

---

## 🧠 Diagrama general

```mermaid
flowchart TD

A[👤 Usuario inicia chat] --> B[🤖 Botmaker - Nodo Inicio]

B --> C[🔌 Webhook POST /join]
C --> D[📊 API devuelve posición]

D --> E[💬 Mensaje: "Tenés X personas adelante"]

E --> F{🔘 Usuario interactúa}

F -->|📊 Ver estado| G[🔌 Webhook GET /position]
G --> H[💬 Mostrar posición actual]
H --> F

F -->|⏳ Seguir esperando| I[🔌 Webhook GET /position]
I --> J[💬 Mantener en cola]
J --> F

F -->|❌ Salir| K[🔌 Webhook POST /leave]
K --> L[💬 Sale de la cola]

F -->|🚨 Urgente| M[🔌 Webhook POST /join (priority urgente)]
M --> N[💬 Prioridad actualizada]
N --> F

F -->|⭐ VIP| O[🔌 Webhook POST /join (priority vip)]
O --> P[💬 Prioridad actualizada]
P --> F

F -->|👨‍💻 Agente toma chat| Q[🔌 Webhook POST /leave]
Q --> R[💬 "Te estamos atendiendo"]

```

---

## 🔍 Explicación del flujo

### 🟢 1. Inicio

* El usuario inicia conversación
* Botmaker ejecuta:

  * `POST /join`
* Se le asigna posición en la cola

---

### 🟡 2. Espera activa

El usuario puede:

* Consultar posición → `/position`
* Seguir esperando → `/position` (mantiene activo)
* Cambiar prioridad → `/join` con prioridad
* Salir → `/leave`

---

### 🔴 3. Atención humana

Cuando un agente toma el chat:

* Botmaker ejecuta:

  * `POST /leave`
* El usuario se elimina de la cola

---

### ⚙️ 4. Lógica interna (API)

* Manejo de cola FIFO + prioridades
* Timeout automático por inactividad
* Métricas en tiempo real
* Actualización de posición dinámica

---

## 🎯 Resultado del sistema

* Usuario siempre informado de su posición
* Cola dinámica y ordenada
* Mejor experiencia de espera
* Integración transparente con atención humana

---

## 💡 Nota técnica

Este flujo depende de:

* Webhooks activos en Botmaker
* API disponible públicamente
* Variables dinámicas (`{{contact.id}}`, `{{contact.name}}`)

---
