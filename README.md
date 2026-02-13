# Sitio Web Carobra

## 🎯 Proyecto Freelance

Sitio web corporativo desarrollado como proyecto freelance para Carobra Consultores Especializados, empresa líder en servicios financieros con más de 13 años de experiencia.

**🔗 Sitio en vivo:** [carobra.com](https://carobra.com)

> ⚠️ **Nota:** Este repositorio es una versión de demostración del proyecto. Las credenciales y configuraciones sensibles han sido removidas.

### 🏢 Sobre el Cliente
- **13+ años** de experiencia en el sector financiero
- **+1,500 asesores** activos en todo el país
- **#1 en AFORE** durante 12 años consecutivos
- Alianzas con Skandia, Quálitas, Bradesco e Infinity

## 🚀 Stack Tecnológico

- **Framework:** Astro 5.14.5
- **Estilos:** Tailwind CSS 4.1.14
- **Deployment:** Vercel
- **Lenguaje:** TypeScript

## 💡 Aspectos Destacados del Desarrollo

- ✅ Integración de Vercel Blob para manejo y almacenamiento de archivos
- ✅ Implementación completa de Schema.org para SEO avanzado
- ✅ Optimización de imágenes con Astro Image (formato WebP)
- ✅ **Score perfecto de SEO (100/100)** en Lighthouse
- ✅ **Performance Score: 86/100** - Real Experience Score
- ✅ Formularios con validación y envío por email transaccional
- ✅ Integración de widget Flickr sin costos de API
- ✅ Sistema de upload de archivos (CV) con conversión a PDF

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
│   │   ├── galeria.astro        # Galería de fotos desde Flickr
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
- 📸 **Galería:** Widget embed de Flickr (sin costo)
- 📝 **Trabaja con nosotros:** Formulario de aplicación con upload de CV
- 📞 **Contacto:** Formulario de contacto, mapa, información de ubicación

### ✅ **Funcionalidades**
- 📸 **Galería Flickr** con widget embed oficial (sin API, gratis)
- 📧 **Envío de emails** con Resend (Nodemailer SMTP)
- 📄 **Upload de CV** con conversión a PDF y almacenamiento en Vercel Blob
- 📱 **Formularios funcionales** en contacto y carrera
- 🎨 **Diseño responsive** optimizado para móvil, tablet y desktop
- 🧭 **Navegación principal** con menú adaptativo

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

## 🛠️ Tecnologías y Herramientas

- **Framework:** Astro 5.14.5 - SSG para performance óptima
- **Styling:** Tailwind CSS 4.1.14 - Utility-first CSS
- **Email:** Resend - Servicio de email transaccional
- **Storage:** Vercel Blob - Almacenamiento de archivos
- **Deployment:** Vercel - CI/CD automático
- **SEO:** Schema.org markup completo
- **Analytics:** Vercel Analytics & Speed Insights

## 🧞 Comandos de Desarrollo

Todos los comandos se ejecutan desde la raíz del proyecto:

| Comando                   | Acción                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Instala las dependencias                        |
| `npm run dev`             | Inicia servidor local en `localhost:4321`       |
| `npm run build`           | Construye el sitio para producción en `./dist/` |
| `npm run preview`         | Vista previa del build antes de deploy          |
| `npm run astro ...`       | Ejecuta comandos CLI de Astro                   |

## ⚙️ Configuración

### Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto:
```bash
# Configuración de Email (ejemplo con Resend)
EMAIL_HOST=smtp.resend.com
EMAIL_PORT=587
EMAIL_USER=resend
EMAIL_PASSWORD=your_resend_api_key
EMAIL_FROM=noreply@yourdomain.com
EMAIL_TO=contact@yourdomain.com

# Almacenamiento (Vercel Blob)
BLOB_READ_WRITE_TOKEN=your_vercel_blob_token
```

**📸 Galería de Flickr:** La galería usa el widget embed de Flickr (gratis, sin API). Ver documentación del proyecto para más información.

### Configuración de Vercel

En el dashboard de Vercel, agrega las mismas variables de entorno en:
**Settings → Environment Variables**

## 🚀 Deployment

El sitio está configurado para deployarse automáticamente en Vercel:

1. **Conectar repositorio** a Vercel
2. **Configurar variables de entorno** en Vercel dashboard
3. El deploy se realiza **automáticamente** en cada push a `main`
4. Configuración incluida en `vercel.json`

### Configuración de Dominios
- Dominio principal configurado con SSL/TLS
- Redirecciones 301 implementadas
- DNS configurado para performance óptima

## 📞 Contacto

Para más información sobre este proyecto o colaboraciones:

- **GitHub** https://github.com/NicoGuerrero11
- **LinkedIn** https://www.linkedin.com/in/nicolas-guerrero-dev/

---

**Proyecto desarrollado en 2025 - Todos los derechos del cliente reservados.**
