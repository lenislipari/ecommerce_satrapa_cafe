# Guía de Deployment – Sátrapa Café

Pasos para desplegar la tienda en Vercel con un dominio personalizado.

## Checklist Pre-Deployment

Antes de desplegar, asegúrate de que:

- [ ] `.env.local` tiene todos los valores correctos
  - `GOOGLE_SHEET_ID`
  - `GOOGLE_SA_EMAIL`
  - `GOOGLE_SA_KEY` (con comillas y `\n` literales)
  - `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`
  - `NEXT_PUBLIC_WHATSAPP_NUMBER`
  - `REVALIDATE_SECRET` (generado con `openssl rand -hex 32`)
  - `NEXT_PUBLIC_SITE_URL`

- [ ] Google Sheets está compartido con la Service Account
- [ ] Google Apps Script está instalado en el Sheet con trigger `onEdit`
- [ ] Script Properties en Apps Script están configuradas
- [ ] El sitio funciona localmente: `npm run dev` y [http://localhost:3000](http://localhost:3000)
- [ ] No hay secretos en el código (todas las credenciales en `.env.local`)
- [ ] El repositorio está en GitHub (privado recomendado)

## Opción 1: Desplegar con Vercel CLI (Recomendado para desarrollo)

### 1. Instalar Vercel CLI

```bash
npm i -g vercel
```

### 2. Desplegar

```bash
cd satrapa-cafe
vercel
```

Responde las preguntas:
- **Scope**: Tu nombre de usuario o organización
- **Project name**: `satrapa-cafe`
- **Project path**: `.`
- **Want to modify your project settings?**: `N`

### 3. Agregar variables de entorno

```bash
vercel env add GOOGLE_SHEET_ID
vercel env add GOOGLE_SA_EMAIL
vercel env add GOOGLE_SA_KEY
vercel env add NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
vercel env add NEXT_PUBLIC_WHATSAPP_NUMBER
vercel env add REVALIDATE_SECRET
vercel env add NEXT_PUBLIC_SITE_URL
```

Pega los valores desde tu `.env.local` (excepto las variables que empiezan con `NEXT_PUBLIC_`, que Vercel detecta automáticamente).

### 4. Desplegar en producción

```bash
vercel --prod
```

Tu sitio estará disponible en `https://satrapa-cafe.vercel.app`

## Opción 2: Desplegar desde GitHub (Recomendado para automático)

### 1. Crear repositorio en GitHub

```bash
git remote add origin https://github.com/tu-usuario/satrapa-cafe.git
git branch -M main
git push -u origin main
```

### 2. Conectar GitHub a Vercel

1. Ve a [vercel.com/dashboard](https://vercel.com/dashboard)
2. Haz clic en **"Add New..."** → **"Project"**
3. Selecciona tu repositorio `satrapa-cafe`
4. En **"Configure Project"**, Vercel detectará automáticamente Next.js
5. En **"Environment Variables"**, agrega:

| Variable | Valor |
|----------|-------|
| `GOOGLE_SHEET_ID` | Tu Sheet ID |
| `GOOGLE_SA_EMAIL` | Email de la Service Account |
| `GOOGLE_SA_KEY` | Private key (con comillas y `\n`) |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Tu Cloud Name |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | Tu número de WhatsApp |
| `REVALIDATE_SECRET` | Token aleatorio seguro |
| `NEXT_PUBLIC_SITE_URL` | https://satrapacafe.com (actualizar después) |

6. Haz clic en **"Deploy"**
7. Espera a que Vercel construya y despliegue

Cada vez que hagas `git push` a `main`, Vercel automáticamente construirá y desplegará los cambios.

## Configurar dominio personalizado

### 1. En Vercel Dashboard

1. Abre tu proyecto en Vercel
2. Ve a **Settings** → **Domains**
3. Agrega tu dominio (ej: `satrapacafe.com` o `satrapacafe.com.ar`)

### 2. En tu proveedor de dominio (GoDaddy, Namecheap, etc.)

Vercel te mostrará los registros DNS necesarios. Generalmente:

- **CNAME** para `www.satrapacafe.com` → `cname.vercel-dns.com`
- O agrega registros **A** si es dominio raíz

Ejemplo en GoDaddy:
- Tipo: **CNAME**
- Nombre: `www`
- Valor: `cname.vercel-dns.com`

### 3. Verificar propagación

Espera 24–48 horas (puede ser más rápido). Verifica con:

```bash
nslookup satrapacafe.com
# o
dig satrapacafe.com
```

## Actualizar variables en producción

Si necesitas cambiar `NEXT_PUBLIC_SITE_URL` después de configurar el dominio:

```bash
vercel env rm NEXT_PUBLIC_SITE_URL production
vercel env add NEXT_PUBLIC_SITE_URL production
# Escribe el nuevo valor: https://satrapacafe.com
```

Luego redeploya:
```bash
vercel --prod
```

## Testing post-deployment

Una vez deployado:

1. **Abre el sitio** en el dominio (o `satrapacafe.vercel.app` temporalmente)
2. **Prueba lectura de productos**: ¿Se cargan desde Google Sheets?
3. **Prueba carrito**: Agrega un producto, ve al carrito
4. **Prueba checkout**: Completa un pedido por WhatsApp
5. **Prueba stock**: En el Sheet, confirma el pedido; verifica que el stock se decrementa
6. **Prueba SEO**: 
   - Verifica `/sitemap.xml` (debe listar todos los productos)
   - Verifica `/robots.txt`
   - Revisa Open Graph: comparte el sitio en redes sociales

## Rollback rápido

Si algo sale mal:

```bash
vercel rollback
```

Vercel automáticamente desplegará la versión anterior.

## Monitoreo

Vercel proporciona:
- **Logs**: Dashboard → **Logs** (acceso a errores en tiempo real)
- **Analytics**: Dashboard → **Analytics** (vistas de página, usuarios)
- **Edge Network**: Tus solicitudes se cachean en servidores globales

## CI/CD automático

Cada push a `main` automáticamente:
1. Vercel construye el sitio
2. Ejecuta tests (si existen)
3. Depliega a preview si hay una PR, o a producción si es a `main`

No necesitas hacer nada más; es totalmente automático.

## Variables secretas

Para mantener secretos seguros, usa las opciones de Vercel:
- Variables no visibles en el código
- Encriptadas en tránsito y en reposo
- No aparecen en build logs

## Soporte

- Documentación de Vercel: [vercel.com/docs](https://vercel.com/docs)
- Status: [status.vercel.com](https://status.vercel.com)
- Community: [github.com/vercel/next.js/discussions](https://github.com/vercel/next.js/discussions)
