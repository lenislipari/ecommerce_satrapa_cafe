/**
 * Dominio canónico del sitio.
 *
 * Se define fijo (y no vía env) a propósito: los deploys de Vercel exponen el
 * sitio también en *.vercel.app, y si el canonical saliera de una variable de
 * entorno esos deploys se auto-declararían como originales. Con esto, todas las
 * URLs de metadata (canonical, Open Graph, sitemap) apuntan siempre acá, sin
 * importar desde qué host se sirvió la página.
 *
 * Va con `www` porque es el host que sirve el contenido: en Vercel el apex
 * satrapacafe.com redirige a www.satrapacafe.com. Si algún día se invierte esa
 * configuración, hay que cambiar esta constante en el mismo momento; si no, los
 * canonical y el sitemap quedan apuntando a URLs que redirigen y Google elige
 * el destino por su cuenta.
 */
export const SITE_URL = "https://www.satrapacafe.com";
