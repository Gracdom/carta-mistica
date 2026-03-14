import { useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { Clock, ArrowLeft, ArrowRight, Tag, Calendar } from 'lucide-react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { POSTS } from '../data/blogPosts'

function renderBloque(bloque, i) {
  switch (bloque.tipo) {
    case 'intro':
      return (
        <p key={i} className="text-lg text-gray-300 leading-relaxed font-light border-l-2 border-purple-500/40 pl-5 mb-8 italic">
          {bloque.texto}
        </p>
      )
    case 'h2':
      return (
        <h2 key={i} className="font-playfair text-white text-2xl font-bold mt-10 mb-4">
          {bloque.texto}
        </h2>
      )
    case 'texto':
      return (
        <p key={i} className="text-gray-300 leading-relaxed mb-5 text-base">
          {renderInline(bloque.texto)}
        </p>
      )
    case 'lista':
      return (
        <ul key={i} className="space-y-3 mb-6 pl-1">
          {bloque.items.map((item, j) => (
            <li key={j} className="flex items-start gap-3 text-gray-300 text-base leading-relaxed">
              <span className="text-purple-400/60 flex-shrink-0 mt-1 text-xs">✦</span>
              <span>{renderInline(item)}</span>
            </li>
          ))}
        </ul>
      )
    default:
      return null
  }
}

function renderInline(text) {
  const parts = text.split(/\*\*(.*?)\*\*/g)
  return parts.map((part, i) =>
    i % 2 === 1
      ? <strong key={i} className="text-white font-semibold">{part}</strong>
      : part
  )
}

export default function BlogPost() {
  const { slug }   = useParams()
  const navigate   = useNavigate()
  const post       = POSTS.find(p => p.slug === slug)

  useEffect(() => {
    if (!post) navigate('/blog', { replace: true })
  }, [post, navigate])

  if (!post) return null

  const idx        = POSTS.indexOf(post)
  const anterior   = POSTS[idx - 1] ?? null
  const siguiente  = POSTS[idx + 1] ?? null
  const relacionados = POSTS.filter(p => p.slug !== slug && p.categoria === post.categoria).slice(0, 2)

  return (
    <div className="min-h-screen bg-[#050511]">
      <Header />

      {/* Hero imagen */}
      <div className="relative w-full h-64 sm:h-80 md:h-96 overflow-hidden">
        <img
          src={post.imagen}
          alt={post.titulo}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050511] via-[#050511]/60 to-transparent" />

        {/* Breadcrumb sobre imagen */}
        <div className="absolute bottom-6 left-0 right-0 max-w-3xl mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-2 text-xs text-gray-400 mb-3">
            <Link to="/" className="hover:text-white transition-colors">Inicio</Link>
            <span className="opacity-40">›</span>
            <Link to="/blog" className="hover:text-white transition-colors">Blog</Link>
            <span className="opacity-40">›</span>
            <span className="text-purple-400">{post.etiqueta}</span>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 pb-20 -mt-6 relative z-10">

        {/* Cabecera del artículo */}
        <div className="mb-8">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full mb-4"
            style={{ background: 'rgba(124,58,237,.2)', border: '1px solid rgba(139,92,246,.35)', color: '#c4b5fd' }}>
            <Tag size={11} /> {post.etiqueta}
          </span>

          <h1 className="font-playfair text-3xl sm:text-4xl font-bold text-white leading-tight mb-5">
            {post.titulo}
          </h1>

          <p className="text-gray-400 text-base leading-relaxed mb-6 border-b border-white/8 pb-6">
            {post.resumen}
          </p>

          {/* Autor + meta */}
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <img src={post.avatarAutor} alt={post.autor}
                className="w-10 h-10 rounded-full ring-2 ring-purple-500/30" />
              <div>
                <p className="text-white text-sm font-medium">{post.autor}</p>
                <p className="text-gray-500 text-xs">Tarotista · La Carta Mística</p>
              </div>
            </div>
            <div className="flex items-center gap-4 text-gray-500 text-xs">
              <span className="flex items-center gap-1.5">
                <Calendar size={13} className="text-purple-400/60" />
                {post.fecha}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock size={13} className="text-purple-400/60" />
                {post.lectura} de lectura
              </span>
            </div>
          </div>
        </div>

        {/* Cuerpo del artículo */}
        <article
          className="rounded-2xl p-6 sm:p-8 mb-10"
          style={{ background: 'rgba(255,255,255,.018)', border: '1px solid rgba(255,255,255,.06)' }}>
          {post.contenido.map((bloque, i) => renderBloque(bloque, i))}
        </article>

        {/* CTA consulta */}
        <div className="rounded-2xl p-6 sm:p-8 mb-10 text-center"
          style={{ background: 'linear-gradient(135deg,rgba(109,40,217,.15),rgba(79,46,220,.06))', border: '1px solid rgba(139,92,246,.2)' }}>
          <p className="text-purple-300/70 text-xs uppercase tracking-widest mb-2">¿Querés profundizar?</p>
          <h3 className="font-playfair text-white text-xl font-bold mb-2">
            Consultá con una tarotista ahora
          </h3>
          <p className="text-gray-400 text-sm mb-5 max-w-md mx-auto">
            Nuestras tarotistas verificadas pueden leer tu situación específica y darte la claridad que necesitás.
          </p>
          <Link to="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold text-white transition-all hover:brightness-110"
            style={{ background: 'linear-gradient(135deg,#7c3aed,#6d28d9)', boxShadow: '0 0 20px rgba(124,58,237,.3)' }}>
            Ver tarotistas disponibles <ArrowRight size={14} />
          </Link>
        </div>

        {/* Navegación anterior / siguiente */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
          {anterior ? (
            <Link to={`/blog/${anterior.slug}`}
              className="flex items-start gap-3 rounded-xl p-4 transition-all hover:-translate-y-0.5 group"
              style={{ background: 'rgba(255,255,255,.025)', border: '1px solid rgba(255,255,255,.07)' }}>
              <ArrowLeft size={16} className="text-purple-400 flex-shrink-0 mt-0.5 group-hover:-translate-x-1 transition-transform" />
              <div>
                <p className="text-gray-500 text-xs mb-1">Artículo anterior</p>
                <p className="text-white text-sm font-medium line-clamp-2 group-hover:text-purple-300 transition-colors">{anterior.titulo}</p>
              </div>
            </Link>
          ) : <div />}

          {siguiente ? (
            <Link to={`/blog/${siguiente.slug}`}
              className="flex items-start gap-3 rounded-xl p-4 transition-all hover:-translate-y-0.5 group text-right justify-end sm:flex-row-reverse"
              style={{ background: 'rgba(255,255,255,.025)', border: '1px solid rgba(255,255,255,.07)' }}>
              <ArrowRight size={16} className="text-purple-400 flex-shrink-0 mt-0.5 group-hover:translate-x-1 transition-transform" />
              <div>
                <p className="text-gray-500 text-xs mb-1">Artículo siguiente</p>
                <p className="text-white text-sm font-medium line-clamp-2 group-hover:text-purple-300 transition-colors">{siguiente.titulo}</p>
              </div>
            </Link>
          ) : <div />}
        </div>

        {/* Artículos relacionados */}
        {relacionados.length > 0 && (
          <div>
            <h3 className="font-playfair text-white text-lg font-semibold mb-4">También te puede interesar</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {relacionados.map(rel => (
                <Link key={rel.slug} to={`/blog/${rel.slug}`}
                  className="flex gap-4 rounded-xl p-4 transition-all hover:-translate-y-0.5 group"
                  style={{ background: 'rgba(255,255,255,.02)', border: '1px solid rgba(255,255,255,.06)' }}>
                  <img src={rel.imagen} alt={rel.titulo}
                    className="w-16 h-16 rounded-lg object-cover flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-white text-sm font-medium line-clamp-2 group-hover:text-purple-300 transition-colors leading-snug">
                      {rel.titulo}
                    </p>
                    <p className="text-gray-500 text-xs mt-1">{rel.lectura} · {rel.fecha}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Volver al blog */}
        <div className="mt-10 pt-6 text-center" style={{ borderTop: '1px solid rgba(255,255,255,.06)' }}>
          <Link to="/blog"
            className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors">
            <ArrowLeft size={14} /> Volver al blog
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  )
}
