# Colores Institucionales CAROBRA

Este documento detalla la paleta de colores institucionales de CAROBRA según el Manual de Identidad Institucional.

## Colores Principales

### Pantone 296 C - Azul Oscuro Institucional
- **CMYK**: 100/81/51/68
- **HEX**: `#0A2342`
- **Uso en Tailwind**: `carobra-dark`
- **Aplicación**: Fondos oscuros, footer, elementos de énfasis

### Pantone 301 C - Azul Medio Institucional  
- **CMYK**: 100/67/24/12
- **HEX**: `#004E8A`
- **Uso en Tailwind**: `carobra-primary`
- **Aplicación**: Color principal de marca, botones, títulos, links

### Pantone 299 C - Azul Claro/Cian Institucional
- **CMYK**: 81/15/0/0
- **HEX**: `#00A9E0`
- **Uso en Tailwind**: `carobra-light`
- **Aplicación**: Acentos, hover states, elementos interactivos

## Colores Complementarios

### Azul Claro para Fondos
- **HEX**: `#E6F4FA`
- **Uso en Tailwind**: `carobra-light-bg`
- **Aplicación**: Fondos de secciones, áreas destacadas

### Azul Más Claro
- **HEX**: `#B3E0F2`
- **Uso en Tailwind**: `carobra-lighter`
- **Aplicación**: Elementos decorativos, gradientes

## Uso en el Código

Los colores están configurados en `tailwind.config.mjs` y se pueden usar así:

```html
<!-- Fondos -->
<div class="bg-carobra-dark">...</div>
<div class="bg-carobra-primary">...</div>
<div class="bg-carobra-light">...</div>
<div class="bg-carobra-light-bg">...</div>

<!-- Textos -->
<h1 class="text-carobra-dark">...</h1>
<h2 class="text-carobra-primary">...</h2>
<a class="text-carobra-light">...</a>

<!-- Bordes -->
<div class="border-carobra-primary">...</div>

<!-- Hover States -->
<a class="hover:text-carobra-light">...</a>
<button class="hover:bg-carobra-dark">...</button>
```

## Lineamientos de Uso

Según el manual de identidad:

1. **Colores obligatorios**: Siempre usar Pantone 296 C, 301 C y 299 C
2. **No modificar**: No alterar proporciones ni tonalidades
3. **Contraste**: Asegurar legibilidad en textos
4. **Consistencia**: Mantener uso consistente en toda la plataforma

## Archivos Actualizados

- `tailwind.config.mjs` - Configuración de colores
- `src/components/Header.astro` - Header con colores institucionales
- `src/components/Footer.astro` - Footer con colores institucionales
- `src/pages/index.astro` - Página principal con colores institucionales

## Referencias

- Manual de Identidad Institucional CAROBRA (manual_carobra_v1.pdf)
- Página 8: Color Constitucional
- Página 9: Tintas Directas
