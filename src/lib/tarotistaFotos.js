/**
 * Fotos locales en /public/tarotistas/
 * Ajustá los slugs para que coincidan con la columna `slug` de tu tabla `tarotistas` en Supabase.
 */
export const TAROTISTA_FOTO_BY_SLUG = {
  'miguel-arcangel': '/tarotistas/maestro.png',
  'rous-quesada': '/tarotistas/marta.png',
  'alma-luz': '/tarotistas/esmeralda.png',
}

export function fotoTarotista(slug, fotoUrl) {
  if (slug && TAROTISTA_FOTO_BY_SLUG[slug]) return TAROTISTA_FOTO_BY_SLUG[slug]
  return fotoUrl || null
}
