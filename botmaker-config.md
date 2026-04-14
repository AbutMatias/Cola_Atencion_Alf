Configuración en Botmaker - Sistema de Cola

Este documento explica los cambios necesarios dentro de Botmaker para integrar el sistema de cola de atención.

---

Objetivo

Permitir que Botmaker:

* Registre usuarios en la cola
* Consulte su posición
* Los elimine cuando son atendidos

Todo esto mediante Webhooks conectados a la API.

---

Requisitos

* Acceso al builder de Botmaker
* Backend desplegado en una URL pública
  Ejemplo:

  ```
  https://mi-backend.com
  ```

---

1. Ingreso a la cola (Nodo inicial)

Acción: Webhook

**Método:**

```
POST
```

**URL:**

```
https://mi-backend.com/join
```

**Body (JSON):**

```json
{
  "userId": "{{contact.id}}",
  "name": "{{contact.name}}",
  "priority": "normal"
}
```

---

Respuesta esperada

```json
{
  "position": 3
}
```

---

Mensaje al usuario

```
Hola 👋

Hay otros clientes en espera.
Tenés {{position}} personas adelante tuyo.

Te vamos a atender en breve.
```

---

2. Consulta de posición

Crear un nodo (puede ser botón o respuesta automática).

Acción: Webhook

**Método:**

```
GET
```

**URL:**

```
https://mi-backend.com/position/{{contact.id}}
```

---

Mensaje

```
Seguís en espera ⏳

Personas delante tuyo: {{position - 1}}
```

---

3. Mantener actividad (IMPORTANTE)

Cada vez que el usuario interactúe:

* volver a llamar al endpoint `/position`

Esto evita que el usuario sea eliminado por timeout.

---

4. Salida de la cola (cuando pasa a agente)

Cuando la conversación se asigna a un agente humano:

Acción: Webhook

**Método:**

```
POST
```

**URL:**

```
https://mi-backend.com/leave
```

**Body:**

```json
{
  "userId": "{{contact.id}}"
}
```

---

Botones recomendados (configuración en Botmaker)

Se recomienda agregar botones interactivos en el flujo para mejorar la experiencia del usuario durante la espera.

---

1. Botón: “Ver estado de atención”

**Objetivo:**
Permitir al usuario consultar su posición actual en la cola.

**Acción asociada:**

* Webhook → `GET /position/{{contact.id}}`

**Mensaje sugerido:**

```
Seguís en espera ⏳

Personas delante tuyo: {{position - 1}}
```

---

2. Botón: “⏳ Seguir esperando”

**Objetivo:**
Mantener al usuario en la cola y actualizar su actividad (evita timeout).

**Acción asociada:**

* Webhook → `GET /position/{{contact.id}}`

**Mensaje sugerido:**

```
Perfecto 🙌

Seguís en la cola.
Te avisamos apenas sea tu turno.
```

---

3. Botón: “Salir de la cola”

**Objetivo:**
Permitir que el usuario abandone la espera voluntariamente.

**Acción asociada:**

* Webhook → `POST /leave`

**Body:**

```json
{
  "userId": "{{contact.id}}"
}
```

**Mensaje sugerido:**

```
Listo 👍

Saliste de la cola.
Si necesitás ayuda nuevamente, podés volver a escribirnos.
```

---

4. Botón: “Atención urgente” (opcional)

**Objetivo:**
Permitir que el usuario se marque como prioridad alta.

**Acción asociada:**

* Webhook → `POST /join`

**Body:**

```json
{
  "userId": "{{contact.id}}",
  "name": "{{contact.name}}",
  "priority": "urgente"
}
```

**Mensaje sugerido:**

```
Tu solicitud fue marcada como urgente 🚨

Vamos a priorizar tu atención.
```

---

5. Botón: “Soy cliente VIP” (opcional)

**Objetivo:**
Asignar prioridad media (VIP).

**Acción asociada:**

* Webhook → `POST /join`

**Body:**

```json
{
  "userId": "{{contact.id}}",
  "name": "{{contact.name}}",
  "priority": "vip"
}
```

**Mensaje sugerido:**

```
Gracias por ser cliente VIP ⭐

Tu atención será priorizada.
```

---

# Recomendaciones de uso

* Mostrar estos botones después del mensaje inicial de espera
* Repetirlos cada cierto tiempo o interacción
* Usar máximo 3-4 botones por pantalla para no saturar al usuario

---

Beneficio

Estos botones permiten:

* Reducir ansiedad del usuario
* Mantener activa la sesión (evita timeout)
* Dar control sobre la espera
* Mejorar la experiencia general de atención

---


## Nota

Esta integración depende completamente del uso de Webhooks.
Si no están habilitados en Botmaker, el sistema no funcionará correctamente.

---
