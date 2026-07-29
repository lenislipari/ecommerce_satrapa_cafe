/**
 * Dominio canónico del sitio.
 *
 * Se define fijo (y no vía env) a propósito: los deploys de Vercel exponen el
 * sitio también en *.vercel.app, y si el canonical saliera de una variable de
 * entorno esos deploys se auto-declararían como originales. Con esto, todas las
 * URLs de metadata (canonical, Open Graph, sitemap) apuntan siempre a
 * satrapacafe.com, sin importar desde qué host se sirvió la página.
 */
export const SITE_URL = "https://satrapacafe.com";
