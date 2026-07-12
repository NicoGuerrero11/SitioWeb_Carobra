## Context

El sitio actual de Carobra tiene un lenguaje visual institucional, limpio y consistente, con navegación compartida y páginas de marketing estáticas. El contrato técnico del libro en `docs/book-commerce-system-contract.md` ya establece que el módulo de commerce debe mantenerse aislado del resto del sitio y que cualquier integración con páginas existentes debe ser mínima.

En esta fase el objetivo no es implementar todavía el checkout completo, sino crear la presencia dedicada del libro dentro del sitio: una landing propia, accesible desde la navegación principal, capaz de vender la identidad visual del producto sin romper la continuidad de marca. La información confirmada del libro es limitada; por ahora solo existe el documento base y assets visuales. Eso obliga a diseñar una experiencia donde el peso de conversión recaiga principalmente en el arte, la composición editorial y copy acotado a información validada.

## Goals / Non-Goals

**Goals:**
- Crear una ruta dedicada para el libro dentro del sitio de Carobra.
- Integrar un enlace claro al libro en la navegación compartida.
- Diseñar una landing con una estética más editorial y protagónica, usando paleta, tipografía y ritmo visual compatibles con Carobra.
- Mantener una arquitectura de contenido disciplinada para no inventar claims, beneficios o estructuras internas no confirmadas.
- Dejar CTAs y puntos de integración listos para conectar el flujo de compra en una fase posterior.

**Non-Goals:**
- Implementar Stripe Checkout, webhooks, persistencia de órdenes o correos transaccionales.
- Rediseñar la home o alterar flujos existentes de contacto, carrera, servicios o beneficios.
- Introducir un sistema de copy expansivo basado en supuestos sobre el contenido del libro.
- Crear una microsite separada de Carobra con navegación o layout completamente distintos.

## Decisions

### 1. La experiencia del libro se implementa como ruta dedicada, no como sección en la home
La landing vivirá en una página propia, enlazada desde el nav principal. Esto da libertad compositiva para tratar al libro como producto protagonista sin competir con el objetivo actual de la home.

Alternativas consideradas:
- Insertar un teaser en la home: descartado porque debilita el enfoque del libro y obliga a competir con el marketing institucional actual.
- Crear una microsite separada: descartado porque rompería continuidad de marca y aumenta la complejidad de integración.

### 2. La página hereda el sistema base de Carobra, pero con un tratamiento editorial específico
Se mantendrán la tipografía base, la paleta institucional y la estructura global del sitio, pero la landing podrá usar contrastes más altos, composición más inmersiva, fondos con más intención visual y un protagonismo mayor de portada/mockups.

Alternativas consideradas:
- Mantener exactamente los mismos patrones visuales que el resto del sitio: descartado porque no permite vender suficientemente la identidad del libro.
- Crear un diseño completamente nuevo: descartado porque haría ver el libro como algo ajeno a Carobra.

### 3. El copy será mínimo y gobernado por “solo afirmar lo que está respaldado”
La narrativa verbal se limitará a nombre del libro, descripción corta validada, información de formato/precio si existe, y bloques derivados del material real disponible. Donde falten insumos, la propuesta priorizará visuales o dejará explícitos dependientes de contenido.

Alternativas consideradas:
- Completar la landing con copy aspiracional genérico: descartado por riesgo de sobreprometer o desalinearse del producto real.
- Esperar a tener todo el contenido antes de diseñar: descartado porque retrasa validaciones visuales que sí pueden avanzar con el material actual.

### 4. La primera entrega debe resolver presencia y dirección visual antes que commerce
El CTA principal debe existir desde la landing, pero su implementación funcional puede quedar preparada para una fase siguiente. El objetivo de esta propuesta es permitir una validación temprana del diseño, la jerarquía de contenido y la integración con el sitio.

Alternativas consideradas:
- Construir diseño y checkout al mismo tiempo: descartado porque mezcla dos frentes con dependencias distintas y complica la validación.

## Risks / Trade-offs

- [Información insuficiente para algunos bloques narrativos] → Mitigación: diseñar con copy mínimo, usar placeholders controlados y marcar insumos faltantes antes de implementación final.
- [Landing demasiado parecida al resto del sitio] → Mitigación: elevar contraste, protagonismo del arte y composición editorial manteniendo solo las anclas visuales esenciales de Carobra.
- [Landing demasiado distinta al sitio] → Mitigación: conservar layout global, navegación compartida, tipografías y paleta base.
- [CTA sin flujo final aún implementado] → Mitigación: definir desde la propuesta el punto de integración y el comportamiento esperado para la siguiente fase de commerce.
