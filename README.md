# Sitio Web Carobra

## 📋 Descripción

Sitio web corporativo para **Carobra Consultores Especializados**, empresa líder en servicios financieros con más de 13 años de experiencia. Desarrollado con Astro, Tailwind CSS y optimizado para Vercel.

### 🏢 Sobre Carobra
- **13+ años** de experiencia en el sector financiero
- **+1,500 asesores** activos en todo el país
- **#1 en AFORE** durante 12 años consecutivos
- Alianzas con Skandia, Quálitas, Bradesco e Infinity

## 🚀 Stack Tecnológico

- **Framework:** Astro 5.14.5
- **Estilos:** Tailwind CSS 4.1.14
- **Deployment:** Vercel
- **Lenguaje:** TypeScript

## 📁 Estructura del Proyecto

```text
/
├── public/                 # Assets estáticos
├── src/
│   ├── components/         # Componentes reutilizables
│   │   ├── Header.astro   # Navegación principal
│   │   └── Footer.astro   # Footer con contacto
│   ├── layouts/
│   │   └── Layout.astro   # Layout base
│   ├── pages/
│   │   └── index.astro    # Página de inicio
│   └── styles/
│       └── global.css     # Estilos globales
├── SITE_STRUCTURE.md      # Mapa de navegación completo
├── vercel.json           # Configuración de Vercel
└── package.json
```

## 🎨 Características Implementadas

### ✅ **Diseño y Layout**
- Header responsive con navegación completa
- Footer con información de contacto y redes sociales
- Diseño exacto basado en el sitio original de Carobra
- Color de fondo personalizado (#BFBFBF)

### ✅ **Página de Inicio**
- Hero section con estadísticas clave
- Sección de servicios (Pensiones, Seguros, Inversiones, Asesoría)
- Sección "Quiénes somos" con historia de la empresa
- Placeholders para imágenes ("Aquí va imagen")

### ✅ **Navegación**
- Menú principal: Beneficios, Nosotros, Servicios, Trabaja con nosotros, Contacto
- Dropdown para servicios individuales
- Menú móvil responsive

### ✅ **SEO y Performance**
- Meta tags optimizados
- Open Graph para redes sociales
- Responsive design
- Optimizado para Vercel

## 🧞 Comandos de Desarrollo

Todos los comandos se ejecutan desde la raíz del proyecto:

| Comando                   | Acción                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Instala las dependencias                        |
| `npm run dev`             | Inicia servidor local en `localhost:4321`       |
| `npm run build`           | Construye el sitio para producción en `./dist/` |
| `npm run preview`         | Vista previa del build antes de deploy          |
| `npm run astro ...`       | Ejecuta comandos CLI de Astro                   |

## 📞 Información de Contacto (Carobra)

- **Dirección:** Av. Paseo Royal Country 4650, Puerta de Hierro, 45116 Zapopan, Jal.
- **Email:** contacto@carobra.com.mx
- **Teléfono:** (33) 3611-2959
- **Horarios:** Lunes – Viernes, 9:00 AM – 6:00 PM

## 🚀 Deployment

El sitio está configurado para deployarse automáticamente en Vercel:

1. Conectar repositorio a Vercel
2. El deploy se realiza automáticamente en cada push a `main`
3. Configuración incluida en `vercel.json`

---

**© 2025 Carobra Consultores Especializados. Todos los derechos reservados.**
