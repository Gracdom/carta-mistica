/**
 * Netlify Edge Function — Subdomain Router
 *
 * Detecta el subdominio "directoriotarot" y hace un rewrite interno
 * a /directoriotarot, manteniendo la URL del subdominio en el browser.
 *
 * Producción : directoriotarot.cartamistica.com  → /directoriotarot
 * Desarrollo  : directoriotarot.localhost         → /directoriotarot
 */
export default async function handler(request, context) {
  const url = new URL(request.url)
  const hostname = url.hostname

  // Extrae el primer segmento del hostname (el subdominio)
  const parts = hostname.split('.')
  const subdomain = parts.length >= 2 ? parts[0] : null

  if (subdomain === 'directoriotarot') {
    // Solo reescribe si aún no está en la ruta correcta
    if (!url.pathname.startsWith('/directoriotarot')) {
      url.pathname = '/directoriotarot'
      return context.rewrite(url.toString())
    }
  }

  return context.next()
}

export const config = {
  // Se ejecuta en todas las rutas excepto assets estáticos y API
  path: '/*',
  excludedPath: [
    '/_next/*',
    '/static/*',
    '*.ico',
    '*.png',
    '*.jpg',
    '*.jpeg',
    '*.svg',
    '*.webp',
    '*.gif',
    '*.css',
    '*.js',
    '*.woff',
    '*.woff2',
    '*.ttf',
    '*.map',
    '/assets/*',
  ],
}
