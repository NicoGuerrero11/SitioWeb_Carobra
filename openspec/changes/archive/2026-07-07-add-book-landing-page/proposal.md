## Why

Carobra necesita comenzar la venta del libro con una presencia propia dentro del sitio, pero sin degradar la coherencia visual de la marca ni depender todavía de una implementación completa de commerce. Hoy solo existe el contrato técnico y un set limitado de materiales del libro, así que hace falta una propuesta que permita construir una landing atractiva, aislada y disciplinada en contenido.

## What Changes

- Crear una nueva página dedicada para el libro en una ruta propia dentro del sitio.
- Agregar acceso visible a la página del libro desde la navegación principal.
- Definir una estructura editorial para la landing que priorice identidad visual del producto y copy respaldado por los materiales disponibles.
- Reutilizar el sistema visual base de Carobra, pero con una dirección más protagónica y aspiracional para el libro.
- Preparar CTAs y puntos de integración para el flujo de compra futuro sin implementar todavía el checkout completo.
- Establecer límites claros sobre qué contenido puede mostrarse con la información actual y qué insumos adicionales deben pedirse antes de cerrar la narrativa de venta.

## Capabilities

### New Capabilities
- `book-landing`: Experiencia dedicada para presentar el libro con navegación integrada, layout editorial y CTAs preparados para evolucionar al flujo de compra.

### Modified Capabilities
- None.

## Impact

- Afecta la navegación compartida del sitio para incorporar el acceso al libro.
- Añade una nueva ruta de frontend y estilos/componentes específicos para la landing.
- Usa como referencia el contrato existente en `docs/book-commerce-system-contract.md` para respetar el aislamiento del módulo del libro.
- No modifica flujos existentes de contacto, carrera o servicios.
