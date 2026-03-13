import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Clock, Tag, ArrowRight, Search, TrendingUp, Star, Heart, Briefcase, Moon } from 'lucide-react'
import Header from '../components/Header'
import Footer from '../components/Footer'

const CATEGORIES = [
  { id: 'todos', label: 'Todos', icon: Star },
  { id: 'amor', label: 'Amor', icon: Heart },
  { id: 'tarot', label: 'Tarot', icon: Moon },
  { id: 'astrologia', label: 'Astrología', icon: TrendingUp },
  { id: 'trabajo', label: 'Trabajo', icon: Briefcase },
]

const POSTS = [
  {
    id: 1,
    slug: 'como-leer-el-tarot-para-principiantes',
    categoria: 'tarot',
    etiqueta: 'Guía',
    titulo: 'Cómo leer el tarot para principiantes: tu primera tirada paso a paso',
    resumen: 'Aprende los conceptos fundamentales del tarot, la estructura del mazo y cómo hacer tu primera tirada de tres cartas con confianza y precisión.',
    imagen: 'https://placehold.co/600x380/1a0533/7c3aed?text=Tarot+Principiantes',
    autor: 'Selene Mística',
    avatarAutor: 'https://placehold.co/40x40/2d1b69/a78bfa?text=S',
    fecha: '12 feb 2026',
    lectura: '8 min',
    destacado: true,
  },
  {
    id: 2,
    slug: 'arcano-mayor-el-loco-significado',
    categoria: 'tarot',
    etiqueta: 'Arcanos',
    titulo: 'El Loco: el arcano del comienzo, la aventura y lo desconocido',
    resumen: 'El primer arcano mayor del tarot Rider-Waite es mucho más que inocencia. Descubrí qué significa en lectura de amor, trabajo y vida espiritual.',
    imagen: 'https://placehold.co/600x380/0d1b33/3b82f6?text=El+Loco',
    autor: 'Rous Quesada',
    avatarAutor: 'https://placehold.co/40x40/1e3a5f/93c5fd?text=R',
    fecha: '8 feb 2026',
    lectura: '6 min',
    destacado: false,
  },
  {
    id: 3,
    slug: 'compatibilidad-de-pareja-por-signo',
    categoria: 'amor',
    etiqueta: 'Amor',
    titulo: 'Los 5 signos zodiacales más compatibles en el amor para 2026',
    resumen: 'Piscis con Escorpio, Tauro con Capricornio y más. Analizamos las combinaciones astrológicas que vibran más alto este año según los astros.',
    imagen: 'https://placehold.co/600x380/330d1b/ec4899?text=Compatibilidad',
    autor: 'Venus del Tarot',
    avatarAutor: 'https://placehold.co/40x40/5f1e3a/f9a8d4?text=V',
    fecha: '5 feb 2026',
    lectura: '5 min',
    destacado: false,
  },
  {
    id: 4,
    slug: 'mercurio-retrogrado-febrero-2026',
    categoria: 'astrologia',
    etiqueta: 'Astrología',
    titulo: 'Mercurio retrógrado en febrero 2026: qué esperar y cómo protegerte',
    resumen: 'Las fechas exactas, los signos más afectados y los rituales de protección que podés hacer para navegar este período con claridad y sin contratiempos.',
    imagen: 'https://placehold.co/600x380/0d2b1b/22c55e?text=Mercurio+Retrogrado',
    autor: 'Aurora Espiritual',
    avatarAutor: 'https://placehold.co/40x40/14532d/86efac?text=A',
    fecha: '1 feb 2026',
    lectura: '7 min',
    destacado: false,
  },
  {
    id: 5,
    slug: 'llamas-gemelas-senales-reales',
    categoria: 'amor',
    etiqueta: 'Llamas gemelas',
    titulo: '7 señales reales de que encontraste a tu llama gemela',
    resumen: 'Más allá del romanticismo, las llamas gemelas son conexiones que aceleran tu evolución espiritual. ¿Estás viviendo alguna de estas señales?',
    imagen: 'https://placehold.co/600x380/33110d/f97316?text=Llamas+Gemelas',
    autor: 'Alma de Luz',
    avatarAutor: 'https://placehold.co/40x40/5f2714/fed7aa?text=A',
    fecha: '27 ene 2026',
    lectura: '9 min',
    destacado: false,
  },
  {
    id: 6,
    slug: 'tarot-para-el-trabajo-tirada-laboral',
    categoria: 'trabajo',
    etiqueta: 'Trabajo',
    titulo: 'Tirada de tarot para decisiones laborales: cuándo cambiar de trabajo',
    resumen: 'Una tirada de 5 cartas diseñada especialmente para consultas laborales. Aprende a interpretar cada posición y tomar decisiones con más claridad.',
    imagen: 'https://placehold.co/600x380/1a1a0d/eab308?text=Tarot+Laboral',
    autor: 'Karma Libre',
    avatarAutor: 'https://placehold.co/40x40/3f3f14/fef08a?text=K',
    fecha: '22 ene 2026',
    lectura: '10 min',
    destacado: false,
  },
]

function PostCard({ post }) {
  return (
    <article className="group bg-[#0D0B2B]/60 border border-white/8 rounded-2xl overflow-hidden hover:border-purple-500/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-purple-900/20 flex flex-col">
      <div className="relative overflow-hidden h-48">
        <img
          src={post.imagen}
          alt={post.titulo}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <span className="absolute top-3 left-3 bg-purple-600/90 text-white text-xs font-semibold px-2.5 py-1 rounded-full">
          {post.etiqueta}
        </span>
      </div>
      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-playfair text-white font-semibold text-lg leading-snug mb-2 group-hover:text-purple-300 transition-colors line-clamp-2">
          {post.titulo}
        </h3>
        <p className="text-gray-400 text-sm leading-relaxed mb-4 line-clamp-3 flex-1">
          {post.resumen}
        </p>
        <div className="flex items-center justify-between pt-3 border-t border-white/8">
          <div className="flex items-center gap-2">
            <img src={post.avatarAutor} alt={post.autor} className="w-7 h-7 rounded-full" />
            <span className="text-gray-400 text-xs">{post.autor}</span>
          </div>
          <div className="flex items-center gap-3 text-gray-500 text-xs">
            <span className="flex items-center gap-1">
              <Clock size={11} />
              {post.lectura}
            </span>
            <span>{post.fecha}</span>
          </div>
        </div>
      </div>
    </article>
  )
}

export default function Blog() {
  const [categoriaActiva, setCategoriaActiva] = useState('todos')
  const [busqueda, setBusqueda] = useState('')

  const postsFiltrados = POSTS.filter(p => {
    const coincideCategoria = categoriaActiva === 'todos' || p.categoria === categoriaActiva
    const coincideBusqueda = busqueda === '' ||
      p.titulo.toLowerCase().includes(busqueda.toLowerCase()) ||
      p.resumen.toLowerCase().includes(busqueda.toLowerCase())
    return coincideCategoria && coincideBusqueda
  })

  const destacado = POSTS.find(p => p.destacado)
  const resto = postsFiltrados.filter(p => !p.destacado || categoriaActiva !== 'todos' || busqueda !== '')

  const mostrarDestacado = categoriaActiva === 'todos' && busqueda === '' && destacado

  return (
    <div className="min-h-screen bg-[#050511]">
      <Header />

      {/* Hero */}
      <section className="relative pt-28 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/15 via-transparent to-transparent pointer-events-none" />
        <div className="absolute top-20 left-1/4 w-64 h-64 bg-purple-600/8 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-10 right-1/4 w-48 h-48 bg-indigo-600/8 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-2 bg-purple-900/30 border border-purple-500/20 rounded-full px-4 py-1.5 mb-6">
            <Tag size={13} className="text-purple-400" />
            <span className="text-purple-300 text-xs font-medium tracking-wide">Artículos & Guías</span>
          </div>
          <h1 className="font-playfair text-4xl sm:text-5xl font-bold text-white mb-4">
            Blog de La Carta Mística
          </h1>
          <p className="text-gray-400 text-lg max-w-xl mx-auto mb-8">
            Guías de tarot, astrología, amor y espiritualidad escritas por nuestras tarotistas.
          </p>

          {/* Buscador */}
          <div className="relative max-w-md mx-auto">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
            <input
              type="text"
              placeholder="Buscar artículo..."
              value={busqueda}
              onChange={e => setBusqueda(e.target.value)}
              className="w-full bg-white/5 border border-white/10 focus:border-purple-500/50 rounded-full pl-10 pr-4 py-3 text-white text-sm placeholder-gray-500 outline-none transition-colors"
            />
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-20">

        {/* Filtros de categoría */}
        <div className="flex flex-wrap gap-2 mb-10">
          {CATEGORIES.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setCategoriaActiva(id)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                categoriaActiva === id
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-900/40'
                  : 'bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:border-white/20'
              }`}
            >
              <Icon size={14} />
              {label}
            </button>
          ))}
        </div>

        {/* Artículo destacado */}
        {mostrarDestacado && (
          <article className="group bg-[#0D0B2B]/60 border border-white/8 rounded-2xl overflow-hidden hover:border-purple-500/30 transition-all duration-300 hover:shadow-xl hover:shadow-purple-900/20 mb-10">
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="relative overflow-hidden h-60 md:h-auto">
                <img
                  src={destacado.imagen}
                  alt={destacado.titulo}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#0D0B2B] hidden md:block pointer-events-none" />
                <span className="absolute top-4 left-4 bg-purple-600 text-white text-xs font-bold px-3 py-1.5 rounded-full">
                  ✦ Destacado
                </span>
              </div>
              <div className="p-8 flex flex-col justify-center">
                <span className="text-purple-400 text-xs font-semibold uppercase tracking-widest mb-3">
                  {destacado.etiqueta}
                </span>
                <h2 className="font-playfair text-white text-2xl sm:text-3xl font-bold leading-tight mb-4 group-hover:text-purple-200 transition-colors">
                  {destacado.titulo}
                </h2>
                <p className="text-gray-400 leading-relaxed mb-6">
                  {destacado.resumen}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <img src={destacado.avatarAutor} alt={destacado.autor} className="w-8 h-8 rounded-full" />
                    <div>
                      <p className="text-white text-sm font-medium">{destacado.autor}</p>
                      <p className="text-gray-500 text-xs">{destacado.fecha} · {destacado.lectura}</p>
                    </div>
                  </div>
                  <button className="flex items-center gap-2 text-purple-400 hover:text-purple-300 text-sm font-semibold transition-colors">
                    Leer más <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            </div>
          </article>
        )}

        {/* Grid de artículos */}
        {resto.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {resto.map(post => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-4xl mb-3">🔮</p>
            <p className="text-gray-400 text-lg">No hay artículos que coincidan con tu búsqueda.</p>
            <button
              onClick={() => { setBusqueda(''); setCategoriaActiva('todos') }}
              className="mt-4 text-purple-400 hover:text-purple-300 text-sm underline"
            >
              Ver todos los artículos
            </button>
          </div>
        )}

        {/* CTA newsletter */}
        <div className="mt-16 rounded-2xl border border-purple-500/20 bg-gradient-to-br from-purple-900/20 to-indigo-900/10 p-8 sm:p-12 text-center">
          <div className="text-3xl mb-3">✉️</div>
          <h3 className="font-playfair text-white text-2xl font-bold mb-2">
            Recibí los mejores artículos en tu correo
          </h3>
          <p className="text-gray-400 mb-6 max-w-md mx-auto">
            Una vez por semana, guías de tarot, horóscopos y tips espirituales directamente a tu bandeja.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="tu@correo.com"
              className="flex-1 bg-white/5 border border-white/15 focus:border-purple-500/50 rounded-full px-5 py-3 text-white text-sm placeholder-gray-500 outline-none"
            />
            <button className="bg-purple-600 hover:bg-purple-500 text-white font-semibold px-6 py-3 rounded-full text-sm transition-colors whitespace-nowrap">
              Suscribirme
            </button>
          </div>
          <p className="text-gray-600 text-xs mt-3">Sin spam. Podés darte de baja cuando quieras.</p>
        </div>
      </div>

      <Footer />
    </div>
  )
}
