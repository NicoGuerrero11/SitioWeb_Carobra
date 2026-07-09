## Context

Carobra ya tiene una landing del libro publicada dentro de un sitio Astro orientado principalmente a marketing. El siguiente paso es convertir esa landing en un punto de venta real sin mezclar la lógica comercial con los endpoints existentes de contacto y carrera.

El cambio introduce tres dependencias externas con responsabilidades distintas:
- Stripe como autoridad de pago y emisor de eventos confiables.
- Neon como fuente canónica de órdenes y estados operativos.
- Resend como canal de notificación transaccional hacia el distribuidor.

La prioridad de negocio para v1 es simple: cobrar el libro a precio fijo, guardar una orden confiable y enviar un email detallado al distribuidor después de la confirmación del pago. La logística, el stock real y un panel administrativo completo quedan fuera de esta fase.

## Goals / Non-Goals

**Goals:**
- Permitir que la landing del libro dispare una compra real con Stripe Checkout.
- Crear una orden interna con estado `pending` antes de redirigir al comprador a Stripe.
- Confirmar pagos únicamente desde un webhook firmado por Stripe.
- Persistir en Neon la información operativa necesaria para que el distribuidor pueda atender el pedido.
- Enviar un email estructurado por Resend solo después de que la orden quede confirmada como `paid`.
- Mantener el módulo aislado para no afectar otros flujos del sitio.

**Non-Goals:**
- Calcular tarifas de envío o integrarse con paqueterías.
- Implementar stock real o reservas de inventario.
- Construir un panel administrativo completo.
- Reemplazar o migrar en esta fase los endpoints heredados que aún usan otro mecanismo de correo.
- Soportar múltiples productos, carrito, cupones o reembolsos automatizados.

## Decisions

### 1. Mantener un módulo de comercio aislado
La lógica nueva vivirá en rutas y utilidades dedicadas al libro, en lugar de extender endpoints existentes.

Rationale:
- Reduce riesgo de regresión sobre flujos actuales.
- Hace más claro el límite entre marketing y comercio.
- Facilita futuras iteraciones del módulo sin contaminar páginas ajenas.

Alternatives considered:
- Reusar endpoints existentes de contacto o formularios.
  - Rejected porque mezcla responsabilidades y debilita la trazabilidad transaccional.

### 2. Crear la orden interna antes de crear la sesión de Stripe
El backend generará una orden `pending` en Neon antes de solicitar la sesión Checkout.

Rationale:
- Permite adjuntar un `order_id` interno en metadata de Stripe.
- Da trazabilidad incluso si el usuario abandona Checkout.
- Mantiene a Neon como fuente canónica de la vida de la orden.

Alternatives considered:
- Crear la orden solo al recibir el webhook.
  - Rejected porque perdería correlación temprana, haría más difícil auditar abandonos y complicaría la reconciliación.

### 3. Confiar en el webhook como único confirmador de pago
La página de éxito será informativa y no podrá marcar órdenes como pagadas ni enviar correos.

Rationale:
- El frontend y los query params no son confiables.
- Stripe puede completar o reintentar eventos de manera asíncrona.
- Evita falsos positivos de pago confirmado.

Alternatives considered:
- Confirmar por redirección a `/gracias`.
  - Rejected por inseguro y propenso a inconsistencias.

### 4. Usar un catálogo backend mínimo para un solo libro
El producto se definirá en configuración backend con precio fijo, moneda y estado activo.

Rationale:
- En v1 solo existe un libro y un precio fijo.
- Evita introducir persistencia extra para catálogo antes de necesitarla.
- Conserva una forma extensible para crecer a más productos luego.

Alternatives considered:
- Persistir el catálogo completo desde el inicio.
  - Deferred; agrega complejidad sin resolver una necesidad inmediata.

### 5. Guardar datos operativos completos en Neon antes del email
El webhook deberá persistir nombre, email, teléfono si existe, dirección y referencias Stripe antes de disparar el correo.

Rationale:
- El email no debe ser la única copia de la orden.
- Permite reenvío manual o futuras vistas operativas.
- Protege contra fallos de Resend luego de una actualización correcta en base de datos.

Alternatives considered:
- Enviar correo directamente desde el payload del webhook sin persistir todo primero.
  - Rejected porque rompe la prioridad de Neon como fuente de verdad.

### 6. Hacer el webhook idempotente a nivel de orden
La actualización a `paid` y el envío del email deben ejecutarse una sola vez por orden confirmada.

Rationale:
- Stripe puede reenviar el mismo evento.
- Se deben evitar duplicados de estado y correos repetidos al distribuidor.

Alternatives considered:
- Confiar en que Stripe solo enviará un evento.
  - Rejected porque contradice el contrato operativo de webhooks.

### 7. Enviar el email operativo al distribuidor por Resend
El mensaje incluirá la información necesaria para fulfillment manual, pero el distribuidor será responsable del envío físico.

Rationale:
- Se alinea con la operación real acordada.
- Mantiene el alcance en venta y handoff, no en logística.

Alternatives considered:
- Integrar envío físico o seguimiento desde v1.
  - Rejected por no ser prioritario para el negocio.

## Risks / Trade-offs

- [Webhook recibe pago pero falla el email] → La orden queda `paid` en Neon y el fallo de notificación se registra para reenvío manual posterior.
- [Sesión Stripe creada pero compra abandonada] → La orden permanece `pending`; más adelante se podrá agregar limpieza o expiración operativa.
- [Datos de shipping incompletos según configuración de Stripe] → Configurar Checkout para recolectar nombre, email y dirección requerida antes de habilitar producción.
- [Dependencia de servicios externos] → Encapsular clientes de Stripe, Neon y Resend para aislar errores y facilitar pruebas.
- [Sin panel admin en v1] → El equipo operará inicialmente desde Neon y correos; la propuesta debe dejar esto explícito para evitar expectativa equivocada.

## Migration Plan

1. Configurar variables de entorno para Stripe, Neon y Resend en ambientes de desarrollo y producción.
2. Crear la estructura de persistencia de órdenes y estados iniciales en Neon.
3. Implementar el endpoint de creación de Checkout y conectarlo a la landing del libro.
4. Implementar la página `/gracias` como pantalla informativa post-checkout.
5. Implementar el webhook firmado y la transición a `paid` con persistencia completa de datos.
6. Implementar el email al distribuidor por Resend y validar el contenido operativo.
7. Ejecutar pruebas end-to-end en modo sandbox de Stripe antes del despliegue.

Rollback strategy:
- Deshabilitar temporalmente el CTA de compra o el producto backend si se detecta un problema severo.
- Revocar el endpoint webhook en despliegue si la incidencia está en el procesamiento asíncrono.
- Mantener el resto del sitio operativo porque el módulo queda desacoplado.

## Open Questions

- ¿El email al comprador se envía en v1 o se deja desactivado inicialmente?
- ¿Qué países se permitirán en Checkout desde producción?
- ¿Se requiere un formato específico de número público de orden para el distribuidor?
- ¿Habrá una casilla adicional de referencias de entrega si Stripe no cubre bien esa necesidad?
