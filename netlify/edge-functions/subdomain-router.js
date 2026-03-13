/**
 * Netlify Edge Function — Subdomain Router
 *
 * Para el subdominio "directoriotarot.*", sirve el index.html del SPA.
 * La detección de qué componente mostrar la hace React en App.jsx
 * leyendo window.location.hostname directamente en el browser.
 */
export default async function handler(request, context) {
  const url = new URL(request.url)
  const subdomain = url.hostname.split('.')[0]

  if (subdomain === 'directoriotarot') {
    // Sirve el index.html del SPA sin cambiar la URL del browser.
    // React detecta el subdominio y renderiza DirectorioTarot.
    const rewriteUrl = new URL(url)
    rewriteUrl.pathname = '/'
    return context.rewrite(rewriteUrl.toString())
  }

  return context.next()
}

export const config = {
  path: '/*',
  excludedPath: ['/assets/*', '*.ico', '*.png', '*.jpg', '*.svg', '*.webp', '*.css', '*.js', '*.woff', '*.woff2', '*.map'],
}
