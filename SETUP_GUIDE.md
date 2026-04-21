# Sátrapa Café – Guía de Configuración

Instrucciones paso a paso para configurar la tienda online de Sátrapa Café con Google Sheets, Google Apps Script, Cloudinary y variables de entorno.

## 1. Google Sheets – Base de datos de productos

### 1.1 Crear el Sheet

1. Abre [sheets.google.com](https://sheets.google.com)
2. Haz clic en **"Crear nuevo"** → **"Hoja de cálculo"**
3. Renombra la hoja como **"Sátrapa Café Productos"**

### 1.2 Crear las pestañas

Borra la pestaña por defecto y crea **3 nuevas**:
- **productos** – Catálogo de café
- **categorias** – (opcional) Categorías disponibles
- **pedidos** – Registro de pedidos

### 1.3 Estructura de la pestaña "productos"

En la fila 1, agrega estos encabezados (columnas A–M):

| A | B | C | D | E | F | G | H | I | J | K | L | M |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| id | slug | nombre | categoria | precio | stock | descripcionCorta | descripcionLarga | origen | notasCata | imagenPrincipal | imagenesExtra | activo |

**Tipos de datos:**
- **id**: Identificador único (ej: `prod-001`)
- **slug**: URL-friendly (ej: `carioca`, `descarada`, `al-sol`)
- **nombre**: Nombre del producto (ej: `Carioca`, `Descarada`)
- **categoria**: Categoría (ej: `Origen Único`, `Blend`)
- **precio**: Número (ej: `450`)
- **stock**: Número entero
- **descripcionCorta**: Máx 120 caracteres
- **descripcionLarga**: Párrafo completo
- **origen**: País o región (ej: `Brasil, Minas Gerais`)
- **notasCata**: Notas separadas por coma (ej: `Chocolate, Nueces, Naranja`)
- **imagenPrincipal**: URL de Cloudinary (opcional en desarrollo)
- **imagenesExtra**: URLs separadas por coma (opcional)
- **activo**: `TRUE` o `1` para mostrar, `FALSE` o `0` para ocultar

**Ejemplo de fila:**
```
prod-001 | carioca | Carioca | Origen Único | 450 | 20 | Suave y equilibrado | Café brasileño... | Brasil | Chocolate,Nueces | | | TRUE
```

### 1.4 Estructura de la pestaña "pedidos"

En la fila 1:

| A | B | C | D | E | F | G | H |
|---|---|---|---|---|---|---|---|
| fecha | nombre | direccion | notas | items | subtotal | estado | procesado |

- **fecha**: Timestamp automático
- **nombre**, **direccion**, **notas**: Datos del cliente
- **items**: Formato `prod-001x2, prod-002x1` (id × cantidad)
- **subtotal**: Número (total del pedido)
- **estado**: `pendiente` → `confirmado` → (opcional) `cancelado`
- **procesado**: Timestamp cuando se procesa (Apps Script lo rellena)

## 2. Google Cloud – Service Account

### 2.1 Crear un proyecto en Google Cloud

1. Ve a [console.cloud.google.com](https://console.cloud.google.com)
2. En el selector de proyectos (arriba), haz clic en **"Nuevo proyecto"**
3. Nombra el proyecto: `satrapa-cafe`
4. Espera a que se cree

### 2.2 Habilitar la Google Sheets API

1. En la búsqueda de arriba, busca **"Google Sheets API"**
2. Haz clic en el resultado
3. Presiona **"Habilitar"**

### 2.3 Crear una Service Account

1. Ve a **"IAM & Admin"** → **"Service Accounts"** (en el menú de la izquierda)
2. Haz clic en **"Crear service account"**
3. Rellena los campos:
   - **Nombre de la service account**: `satrapa-cafe-api`
   - **ID**: Se rellena automáticamente
   - **Descripción**: `API para leer productos desde Google Sheets`
4. Haz clic en **"Crear y continuar"**
5. En "Otorgar roles a esta service account": Haz clic en **"Continuar"** (sin asignar roles globales)
6. Haz clic en **"Listo"**

### 2.4 Crear la clave privada (JSON)

1. Vuelve a la lista de Service Accounts
2. Haz clic en la que acabas de crear (`satrapa-cafe-api`)
3. Ve a la pestaña **"Claves"**
4. Haz clic en **"Agregar clave"** → **"Crear clave nueva"**
5. Selecciona **"JSON"** y presiona **"Crear"**
6. Automáticamente descargará un archivo JSON
7. **Abre el archivo** en un editor de texto y copia estos valores:
   - `client_email`: Correo de la SA (termina en `.iam.gserviceaccount.com`)
   - `private_key`: La clave (entre `-----BEGIN PRIVATE KEY-----` y `-----END PRIVATE KEY-----`)

## 3. Compartir el Sheet con la Service Account

1. Abre tu Sheet de productos
2. Haz clic en **"Compartir"** (arriba a la derecha)
3. Copia el `client_email` de la Service Account
4. Pégalo en el campo de "Agregar personas"
5. Dale permiso de **"Lector"** (o "Editor" si quieres que Apps Script escriba en el sheet)
6. Haz clic en **"Compartir"**

## 4. Cloudinary – Imágenes

### 4.1 Crear cuenta

1. Ve a [cloudinary.com](https://cloudinary.com)
2. Haz clic en **"Sign up for free"**
3. Crea una cuenta (con email, Google o GitHub)
4. Verifica tu email

### 4.2 Obtener el Cloud Name

1. Una vez logueado, ve al **Dashboard**
2. En la caja "Account Details" (arriba a la izquierda), verás tu **Cloud Name**
3. Cópialo (ej: `dk7x2p4jk`)

### 4.3 Subir imágenes

Puedes subir imágenes de dos formas:

**Opción A: Por URL**
```
https://res.cloudinary.com/{cloud-name}/image/upload/{public-id}
```

**Opción B: Desde el dashboard de Cloudinary** → **Media Library** → Subir archivo

En el Sheet, usa las URLs de Cloudinary en la columna `imagenPrincipal`.

## 5. WhatsApp – Número para pedidos

Simplemente asegúrate de tener un número de WhatsApp disponible para recibir pedidos.

En `.env.local`, configura:
```
NEXT_PUBLIC_WHATSAPP_NUMBER=549351XXXXXXX
```

(Sin `+`, sin espacios; incluye código de país para Argentina: `549`)

## 6. Google Apps Script – Automación de stock

### 6.1 Abrir el editor de Apps Script

1. Abre tu Sheet de productos
2. Ve a **Extensiones** → **Apps Script**
3. Se abrirá una nueva pestaña con el editor

### 6.2 Crear el script de stock manager

1. Borra todo lo que está en el editor
2. Copia y pega el contenido de [`scripts/apps-script/stock-manager.gs`](scripts/apps-script/stock-manager.gs)
3. Haz clic en **"Guardar"**

### 6.3 Configurar Script Properties

1. En el editor, ve a **Project Settings** (engranaje de la izquierda)
2. Abre la pestaña **"Script Properties"**
3. Agrega dos nuevas propiedades:

| Property | Value |
|----------|-------|
| `REVALIDATE_URL` | `https://tu-dominio.vercel.app/api/revalidate` |
| `REVALIDATE_SECRET` | El valor de `REVALIDATE_SECRET` en tu `.env.local` |

**Ejemplo:**
```
REVALIDATE_URL: https://satrapacafe.com/api/revalidate
REVALIDATE_SECRET: abc123...xyz789 (genérate uno con `openssl rand -hex 32`)
```

### 6.4 Configurar el trigger automático

1. En el editor de Apps Script, ve al ícono de reloj (Triggers) en la izquierda
2. Haz clic en **"Crear trigger"**
3. Configura:
   - **Función a ejecutar**: `onEdit`
   - **Evento de implementación**: `Editar`
   - **Tipo de evento**: `Cambios en la hoja`
4. Haz clic en **"Guardar"**
5. Cuando te pida permisos, autoriza la aplicación

**¿Qué hace?**
- Cada vez que edites algo en el Sheet, se ejecuta `onEdit`
- Si hay un pedido confirmado en la pestaña "pedidos" con estado `confirmado`, procesa el pedido:
  - Decrementa el stock en la pestaña "productos"
  - Marca la fila como `procesado` con un timestamp
  - Llama al webhook `/api/revalidate` para refrescar el sitio inmediatamente

## 7. Variables de entorno (.env.local)

### 7.1 Crear el archivo

1. En la raíz del proyecto, copia `.env.local.example` y renómbralo como `.env.local`
2. Completa todos los valores según lo que hayas configurado:

```bash
# Google Sheets
GOOGLE_SHEET_ID=1a2b3c4d5e6f... (el ID de tu Sheet desde la URL)
GOOGLE_SA_EMAIL=satrapa-cafe-api@...iam.gserviceaccount.com
GOOGLE_SA_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=tu_cloud_name

# WhatsApp
NEXT_PUBLIC_WHATSAPP_NUMBER=549351XXXXXXX

# Revalidación
REVALIDATE_SECRET=abc123...xyz789 (genera uno con `openssl rand -hex 32`)

# Sitio
NEXT_PUBLIC_SITE_URL=https://satrapacafe.com
```

### 7.2 Cómo obtener el GOOGLE_SHEET_ID

1. Abre tu Sheet
2. Mira la URL:
```
https://docs.google.com/spreadsheets/d/ESTE_ES_EL_ID/edit
```
3. Copia todo lo que está entre `/d/` y `/edit`

### 7.3 Cómo obtener GOOGLE_SA_KEY

El archivo JSON que descargaste tiene un campo `private_key`. **Importante:**
- Debe estar entre comillas dobles
- Los saltos de línea deben ser literales `\n`, no reemplazarlos manualmente
- Ejemplo correcto:
  ```
  GOOGLE_SA_KEY="-----BEGIN PRIVATE KEY-----\nMIIEv...\n-----END PRIVATE KEY-----\n"
  ```

## 8. Vercel – Deployment

### 8.1 Preparar para producción

1. Asegúrate de que todas las variables en `.env.local` están correctas
2. Genera un `REVALIDATE_SECRET` seguro:
   ```bash
   openssl rand -hex 32
   ```

### 8.2 Crear repositorio en GitHub

1. Ve a [github.com](https://github.com) y crea un nuevo repositorio privado
2. Clona el repositorio localmente
3. Agrega los archivos del proyecto:
   ```bash
   git add .
   git commit -m "Initial commit: Sátrapa Café ecommerce"
   git push -u origin main
   ```

### 8.3 Conectar Vercel

1. Ve a [vercel.com](https://vercel.com)
2. Haz clic en **"New Project"**
3. Selecciona tu repositorio de GitHub
4. En **"Environment Variables"**, agrega:
   - `GOOGLE_SHEET_ID`
   - `GOOGLE_SA_EMAIL`
   - `GOOGLE_SA_KEY` (con comillas dobles y `\n` literales)
   - `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`
   - `NEXT_PUBLIC_WHATSAPP_NUMBER`
   - `REVALIDATE_SECRET`
   - `NEXT_PUBLIC_SITE_URL=https://satrapacafe.com` (o tu dominio)

5. Haz clic en **"Deploy"**
6. Espera a que Vercel construya y despliegue el sitio

### 8.4 Configurar dominio personalizado

1. En tu proyecto de Vercel, ve a **"Settings"** → **"Domains"**
2. Agrega tu dominio personalizado (ej: `satrapacafe.com`)
3. Vercel te mostrará los registros DNS que necesitas configurar
4. Ve a tu proveedor de dominio (GoDaddy, Namecheap, etc.) y agrega los registros DNS
5. Espera a que se propaguen (puede tardar 24 horas)

## 9. Verificar que todo funciona

### Checklist

- [ ] El Sheet tiene los datos de productos correctamente estructurados
- [ ] La Service Account tiene acceso de lectura al Sheet
- [ ] Google Cloud tiene la Sheets API habilitada
- [ ] El archivo `.env.local` tiene todos los valores completados
- [ ] Google Apps Script está configurado en el Sheet con el trigger `onEdit`
- [ ] Las variables de entorno están configuradas en Vercel
- [ ] El sitio está deployado y accesible en la URL final

### Testing

1. **Prueba de lectura**: El sitio muestra los productos del Sheet
2. **Prueba de carrito**: Agrega un producto al carrito
3. **Prueba de pedido**: Completa un pedido enviándolo por WhatsApp
4. **Prueba de stock**: En el Sheet, confirma el pedido; verifica que el stock se decrementa automáticamente
5. **Prueba de revalidación**: Comprueba que el sitio se actualiza inmediatamente después de cambios

## 10. Soporte y troubleshooting

### El sitio muestra productos mock, no del Sheet

**Causa:** Las variables de entorno no están configuradas correctamente.

**Solución:**
1. Verifica que `.env.local` existe y tiene todos los valores
2. Reinicia el servidor de desarrollo (`npm run dev`)
3. Comprueba que `GOOGLE_SHEET_ID`, `GOOGLE_SA_EMAIL` y `GOOGLE_SA_KEY` no tienen espacios extras

### Google Sheets API error

**Causa:** La Service Account no tiene acceso al Sheet.

**Solución:**
1. Verifica que compartiste el Sheet con el email de la Service Account
2. Usa la pestaña "Sharing Settings" del Sheet para confirmar
3. Reinicia el servidor

### Apps Script no procesa pedidos

**Causa:** El trigger no está configurado o la Service Account no tiene permisos.

**Solución:**
1. Ve a Triggers en Apps Script y verifica que `onEdit` está activo
2. Comprueba que los Script Properties tienen `REVALIDATE_URL` y `REVALIDATE_SECRET`
3. Prueba manualmente el script: ve a "Ejecutar" y selecciona `onEdit`

### Dominio no resuelve

**Causa:** Los registros DNS no se han propagado.

**Solución:**
1. Espera 24–48 horas después de agregar los registros DNS
2. Verifica los registros en [DNS Checker](https://dnschecker.org)

---

**Preguntas o problemas:** Contacta con el equipo de soporte de Sátrapa Café.
