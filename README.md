# Sátrapa Café – Tienda Online

Un ecommerce minimalista de especialidad construido con Next.js, Tailwind CSS y Google Sheets.

## Características

- 📱 **Responsivo**: Diseño mobile-first optimizado
- ☕ **Catálogo dinámico**: Productos desde Google Sheets en tiempo real
- 🛒 **Carrito persistente**: Compras guardadas en localStorage
- 💬 **Checkout WhatsApp**: Pedidos enviados directamente a WhatsApp
- 📊 **Stock automático**: Google Apps Script gestiona el inventario
- 🔍 **SEO optimizado**: Sitemap dinámico, robots.txt, Open Graph
- ⚡ **ISR**: Caché inteligente con revalidación de 5 minutos
- 🎨 **Brand-first**: Diseño basado en manual de marca Sátrapa

## Tecnología

- **Framework**: Next.js 16 (App Router)
- **Estilos**: Tailwind CSS v4
- **Estado**: Zustand + localStorage
- **UI**: Radix UI + Lucide Icons
- **Animaciones**: Framer Motion
- **Base de datos**: Google Sheets (via Service Account)
- **Hosting**: Vercel
- **Imágenes**: Cloudinary (opcional)

## Inicio rápido

### Requisitos

- Node.js 18+
- npm o yarn

### Instalación

```bash
git clone <repo-url>
cd satrapa-cafe
npm install
```

### Variables de entorno

Copia `.env.local.example` a `.env.local` y completa los valores:

```bash
cp .env.local.example .env.local
```

Ver [SETUP_GUIDE.md](./SETUP_GUIDE.md) para instrucciones detalladas de configuración.

### Desarrollo

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000)

## Estructura del proyecto

```
src/
├── app/                    # Next.js App Router
│   ├── page.tsx           # Home page
│   ├── layout.tsx         # Root layout con metadata
│   ├── globals.css        # Tokens y estilos globales
│   ├── producto/[slug]/   # Páginas dinámicas de productos
│   ├── api/revalidate/    # Webhook para revalidar ISR
│   └── sitemap.ts         # Sitemap dinámico
├── components/
│   ├── layout/            # Header, Footer, CartButton
│   ├── product/           # ProductCard, ProductGrid, Skeleton
│   ├── cart/              # CartDrawer, CartItem, AddToCartButton
│   ├── brand/             # Logo
│   └── toast/             # Toast notifications
├── stores/                # Zustand stores
│   ├── useCartStore.ts   # Estado del carrito
│   └── useToastStore.ts  # Notificaciones
├── lib/
│   ├── sheets.ts          # Google Sheets integration
│   ├── whatsapp.ts        # Checkout links
│   ├── cloudinary.ts      # Image handling
│   ├── mock-products.ts   # Fallback products
│   └── utils.ts           # Utilidades
├── types/                 # TypeScript types
└── hooks/                 # Custom hooks
    └── useInView.ts       # Scroll reveal
```

## Configuración de Google Sheets

1. Crea un Sheet con 3 pestañas: `productos`, `categorias`, `pedidos`
2. Estructura la pestaña `productos` con columnas A–M (ver [SETUP_GUIDE.md](./SETUP_GUIDE.md))
3. Configura una Service Account en Google Cloud
4. Comparte el Sheet con el email de la Service Account
5. Copia el ID, email y private key a `.env.local`

Ver [SETUP_GUIDE.md](./SETUP_GUIDE.md) para detalles completos.

## Google Apps Script

El archivo [scripts/apps-script/stock-manager.gs](./scripts/apps-script/stock-manager.gs) automatiza:
- Decrementar stock cuando se confirma un pedido
- Llamar al webhook `/api/revalidate` para actualizar el sitio inmediatamente

Instalación:
1. Abre tu Sheet
2. Ve a **Extensiones** → **Apps Script**
3. Copia el contenido de `stock-manager.gs`
4. Configura los **Script Properties** con `REVALIDATE_URL` y `REVALIDATE_SECRET`

## Deployment

### Vercel

```bash
npm run build
vercel deploy
```

Configura las variables de entorno en Vercel Dashboard y conecta tu repositorio de GitHub para CI/CD automático.

Ver [SETUP_GUIDE.md](./SETUP_GUIDE.md) sección 8 para instrucciones completas.

## Paleta de colores

- **Café**: `#532016` (primary)
- **Naranja**: `#FF512C` (accent)
- **Crema**: `#EDDDCF` (light background)

## Notas de desarrollo

- Los productos son cachés mediante ISR con validación cada 5 minutos
- Si no hay credenciales de Google Sheets, se usan los productos mock
- El carrito persiste en localStorage (solo lado cliente)
- Las animaciones usan Framer Motion con `AnimatePresence`
- Los tipos TypeScript están tipados estrictamente

## Soporte

Ver [SETUP_GUIDE.md](./SETUP_GUIDE.md) sección 10 para troubleshooting común.
