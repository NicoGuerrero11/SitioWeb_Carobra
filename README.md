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
├── public/                      # Assets estáticos
│   ├── favicon.ico
│   ├── images/                  # Imágenes públicas (og-image)
│   └── site.webmanifest
├── src/
│   ├── assets/                  # Assets optimizados por Astro
│   │   └── images/
│   │       ├── beneficios/      # Imágenes de beneficios
│   │       ├── carrera/         # Imágenes de trabaja con nosotros
│   │       ├── contacto/        # Imágenes de contacto
│   │       ├── index/           # Imágenes de página principal
│   │       ├── logo/            # Logos de la empresa
│   │       ├── nosotros/        # Imágenes de nosotros
│   │       └── servicios/       # Imágenes de servicios
│   ├── components/              # Componentes reutilizables
│   │   ├── beneficios/
│   │   │   └── SeccionBeneficio.astro
│   │   ├── nosotros/
│   │   │   ├── EquipoTestimonios.astro
│   │   │   ├── GaleriaFotos.astro
│   │   │   ├── HeroNosotros.astro
│   │   │   └── HistoriaTimeline.astro
│   │   ├── seo/                 # Componentes SEO y Schema.org
│   │   │   ├── SchemaBreadcrumbs.astro
│   │   │   ├── SchemaJobPosting.astro
│   │   │   ├── SchemaOrganization.astro
│   │   │   └── SchemaTestimonios.astro
│   │   ├── servicios/
│   │   │   ├── HeroServicios.astro
│   │   │   └── ServicioItem.astro
│   │   ├── Footer.astro         # Footer con contacto
│   │   └── Header.astro         # Navegación principal
│   ├── layouts/
│   │   └── Layout.astro         # Layout base con SEO
│   ├── pages/                   # Páginas del sitio
│   │   ├── api/                 # API endpoints
│   │   │   ├── carrera.ts       # Endpoint formulario carrera
│   │   │   └── contacto.ts      # Endpoint formulario contacto
│   │   ├── beneficios.astro     # Página de beneficios
│   │   ├── carrera.astro        # Trabaja con nosotros
│   │   ├── contacto.astro       # Página de contacto
│   │   ├── index.astro          # Página principal
│   │   ├── nosotros.astro       # Sobre nosotros
│   │   └── servicios.astro      # Página de servicios
│   ├── styles/
│   │   └── global.css           # Estilos globales
│   └── utils/
│       └── testimonios.ts       # Data de testimonios
├── .env                         # Variables de entorno (no en repo)
├── SITE_STRUCTURE.md           # Mapa de navegación completo
├── vercel.json                 # Configuración de Vercel
└── package.json
```

## 🎨 Características Implementadas

### ✅ **Páginas Completas**
- 🏠 **Inicio:** Hero section, servicios, quiénes somos, imágenes optimizadas
- 🎁 **Beneficios:** Descripción detallada de beneficios para asesores
- 👥 **Nosotros:** Historia, timeline, testimonios, galería de fotos
- 💼 **Servicios:** Overview de todos los servicios financieros
- 📝 **Trabaja con nosotros:** Formulario de aplicación con upload de CV
- 📞 **Contacto:** Formulario de contacto, mapa, información de ubicación

### ✅ **Funcionalidades**
- 📧 **Envío de emails** con Resend (Nodemailer SMTP)
- 📄 **Upload de CV** con conversión a PDF y almacenamiento en Vercel Blob
- 📱 **Formularios funcionales** en contacto y carrera
- 🎨 **Diseño responsive** optimizado para móvil, tablet y desktop
- 🧭navigation** con dropdown de servicios

### ✅ **SEO y Performance**
- 🎯 **SEO Score: 100/100** en Lighthouse
- 📊 **Performance: 86/100** - Real Experience Score
- 🔍 **Schema.org** markup (Organization, JobPosting, Breadcrumbs, Testimonios)
- 🌐 **Open Graph** y Twitter Cards optimizados
- 🚀 **Vercel Speed Insights** y **Analytics** integrados
- 🗺️ **Sitemap** y meta tags completos
- 🔗 **Canonical URLs** configurados

### ✅ **Optimizaciones**
- 🖼️ **Imágenes en WebP** optimizadas con Astro Image
- ⚡ **Preload** de recursos críticos
- 🎯 **Lazy loading** de imágenes
- 📦 **Tailwind CSS** optimizado

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

## ⚙️ Configuración

### Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:

```bash
# Configuración de Email - Resend
EMAIL_HOST=smtp.resend.com
EMAIL_PORT=587
EMAIL_USER=resend
EMAIL_PASSWORD=tu_api_key_de_resend
EMAIL_FROM=send@tudominio.com
EMAIL_TO=contacto@carobra.com.mx

# Almacenamiento opcional (Vercel Blob)
BLOB_READ_WRITE_TOKEN=tu_token_de_vercel_blob
```

### Configuración de Vercel

En el dashboard de Vercel, agrega las mismas variables de entorno en:
**Settings → Environment Variables**

## 🚀 Deployment

El sitio está configurado para deployarse automáticamente en Vercel:

1. **Conectar repositorio** a Vercel
2. **Configurar variables de entorno** en Vercel dashboard
3. El deploy se realiza **automáticamente** en cada push a `main`
4. Configuración incluida en `vercel.json`

### Dominios Configurados
- **Principal:** carobra.com
- **WWW:** www.carobra.com
- **Redirección 301:** carobra.com.mx → carobra.com

### DNS y Email
- **Proveedor DNS:** Squarespace (carobra.com)
- **Email Service:** Resend con dominio verificado
- **Redirección:** DreamHost (carobra.com.mx)

---

**© 2025 Carobra Consultores Especializados. Todos los derechos reservados.**
