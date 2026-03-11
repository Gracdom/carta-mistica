import { useState, useMemo, useEffect } from 'react'
import { SlidersHorizontal, X, Search, ChevronDown, Loader2 } from 'lucide-react'
import { supabase } from '../lib/supabase'
import TarotistCard from '../components/TarotistCard'
import Header from '../components/Header'
import Footer from '../components/Footer'

const TEMAS = ['Amor y Relaciones', 'Trabajo y Dinero', 'Familia y Amigos', 'Llamas gemelas', 'Karma y vidas pasadas', 'Tarot general', 'Lecturas Psíquicas']
const METODOS = ['Tarot', 'Videncia', 'Péndulo', 'Astrología', 'Ángeles', 'Lectura de velas']
const CANALES = ['Chat', 'Llamada']
const ESTADOS = [
  { value: 'todos', label: 'Todos' },
  { value: 'online', label: 'En línea ahora' },
  { value: 'disponible_hoy', label: 'Disponible hoy' },
  { value: 'solo_reserva', label: 'Con reserva' },
]
const PAISES = ['Todos', 'Argentina', 'Chile', 'México']
const ORDEN = [
  { value: 'relevancia', label: 'Relevancia' },
  { value: 'rating', label: 'Mejor valorados' },
  { value: 'precio_asc', label: 'Precio: menor a mayor' },
  { value: 'precio_desc', label: 'Precio: mayor a menor' },
  { value: 'lecturas', label: 'Más lecturas' },
]

function CheckItem({ label, checked, onChange }) {
  return (
    <label className="flex items-center gap-2.5 cursor-pointer group">
      <div
        className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 transition-colors ${
          checked ? 'bg-purple-600 border-purple-500' : 'border-white/20 group-hover:border-purple-500/50'
        }`}
        onClick={onChange}
      >
        {checked && <div className="w-2 h-2 bg-white rounded-sm" />}
      </div>
      <span className="text-sm text-gray-300 group-hover:text-white transition-colors select-none" onClick={onChange}>
        {label}
      </span>
    </label>
  )
}

function FilterSection({ title, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="border-b border-white/8 pb-5 mb-5">
      <button
        className="flex items-center justify-between w-full mb-4 group"
        onClick={() => setOpen(!open)}
      >
        <span className="text-white font-semibold text-sm">{title}</span>
        <ChevronDown
          size={15}
          className={`text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>
      {open && <div className="space-y-2.5">{children}</div>}
    </div>
  )
}

export default function Tarotistas() {
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [temas, setTemas] = useState([])
  const [metodos, setMetodos] = useState([])
  const [canales, setCanales] = useState([])
  const [estado, setEstado] = useState('todos')
  const [pais, setPais] = useState('Todos')
  const [orden, setOrden] = useState('relevancia')
  const [busqueda, setBusqueda] = useState('')
  const [TAROTISTAS, setTarotistas] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchTarotistas() {
      setLoading(true)
      const { data, error } = await supabase
        .from('tarotistas')
        .select('*')
        .eq('activo', true)
        .order('rating', { ascending: false })
      if (!error && data) {
        // Normalizar campo reseñas_count -> reseñas para compatibilidad con TarotistCard
        setTarotistas(data.map(t => ({
          ...t,
          id: t.slug,
          reseñas: t['reseñas_count'],
          lecturas: t.lecturas_count,
          precioPorMinuto: t.precio_por_minuto,
          precioChat: t.precio_chat,
          precioLlamada: t.precio_llamada,
          precioPromoChat: t.precio_promo_chat,
          precioPromoLlamada: t.precio_promo_llamada,
          descuentoPromo: t.descuento_promo,
          minutosGratis: t.minutos_gratis,
          fotoUrl: t.foto_url,
          foto: t.foto_url,
        })))
      }
      setLoading(false)
    }
    fetchTarotistas()
  }, [])

  const toggle = (arr, setArr, val) =>
    setArr(arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val])

  const totalFiltros = temas.length + metodos.length + canales.length +
    (estado !== 'todos' ? 1 : 0) + (pais !== 'Todos' ? 1 : 0)

  const resetFiltros = () => {
    setTemas([]); setMetodos([]); setCanales([])
    setEstado('todos'); setPais('Todos')
  }

  const resultados = useMemo(() => {
    let list = [...TAROTISTAS]

    if (busqueda) {
      const q = busqueda.toLowerCase()
      list = list.filter(t =>
        t.nombre.toLowerCase().includes(q) ||
        t.tagline.toLowerCase().includes(q) ||
        t.especialidades.some(e => e.toLowerCase().includes(q))
      )
    }
    if (temas.length) list = list.filter(t => temas.some(te => t.especialidades.includes(te)))
    if (metodos.length) list = list.filter(t => metodos.some(m => t.metodos.includes(m)))
    if (canales.length) list = list.filter(t => canales.some(c => t.canales.includes(c)))
    if (estado !== 'todos') list = list.filter(t => t.estado === estado)
    if (pais !== 'Todos') list = list.filter(t => t.pais === pais)

    switch (orden) {
      case 'rating': list.sort((a, b) => b.rating - a.rating); break
      case 'precio_asc': list.sort((a, b) => a.precioPorMinuto - b.precioPorMinuto); break
      case 'precio_desc': list.sort((a, b) => b.precioPorMinuto - a.precioPorMinuto); break
      case 'lecturas': list.sort((a, b) => b.lecturas - a.lecturas); break
    }
    return list
  }, [busqueda, temas, metodos, canales, estado, pais, orden])

  const Sidebar = () => (
    <aside className="w-full lg:w-64 xl:w-72 flex-shrink-0">
      <div className="bg-[#0D0B2B] border border-white/8 rounded-2xl p-5 sticky top-24">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-white font-semibold">Filtros</h3>
          {totalFiltros > 0 && (
            <button
              onClick={resetFiltros}
              className="text-purple-400 hover:text-purple-300 text-xs font-semibold transition-colors flex items-center gap-1"
            >
              <X size={12} /> Limpiar ({totalFiltros})
            </button>
          )}
        </div>

        <FilterSection title="Estado">
          {ESTADOS.map(e => (
            <label key={e.value} className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="radio"
                name="estado"
                checked={estado === e.value}
                onChange={() => setEstado(e.value)}
                className="accent-purple-500"
              />
              <span className="text-sm text-gray-300">{e.label}</span>
            </label>
          ))}
        </FilterSection>

        <FilterSection title="País">
          {PAISES.map(p => (
            <label key={p} className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="radio"
                name="pais"
                checked={pais === p}
                onChange={() => setPais(p)}
                className="accent-purple-500"
              />
              <span className="text-sm text-gray-300">{p}</span>
            </label>
          ))}
        </FilterSection>

        <FilterSection title="Especialidad / Tema">
          {TEMAS.map(t => (
            <CheckItem key={t} label={t} checked={temas.includes(t)} onChange={() => toggle(temas, setTemas, t)} />
          ))}
        </FilterSection>

        <FilterSection title="Método">
          {METODOS.map(m => (
            <CheckItem key={m} label={m} checked={metodos.includes(m)} onChange={() => toggle(metodos, setMetodos, m)} />
          ))}
        </FilterSection>

        <FilterSection title="Canal de atención">
          {CANALES.map(c => (
            <CheckItem key={c} label={c} checked={canales.includes(c)} onChange={() => toggle(canales, setCanales, c)} />
          ))}
        </FilterSection>
      </div>
    </aside>
  )

  return (
    <div className="bg-[#050511] min-h-screen">
      <Header />
      <main className="pt-20">
        {/* Page header */}
        <div
          className="py-12 sm:py-16 border-b border-white/5 relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #0D0B2B 0%, #050511 100%)' }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-purple-900/10 to-transparent pointer-events-none" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 relative">
            <p className="text-purple-400 text-xs font-semibold tracking-widest uppercase mb-3">Directorio completo</p>
            <h1 className="font-playfair text-3xl sm:text-4xl font-bold text-white mb-4">
              Encontrá tu tarotista ideal
            </h1>
            <p className="text-gray-400 text-sm sm:text-base max-w-xl">
              Tarotistas verificados disponibles para consultas por chat o llamada. Filtrá por especialidad, método y disponibilidad.
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          {/* Search + sort bar */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
              <input
                type="text"
                placeholder="Buscar por nombre o especialidad..."
                value={busqueda}
                onChange={e => setBusqueda(e.target.value)}
                className="w-full bg-white/5 border border-white/10 focus:border-purple-500/60 rounded-xl pl-10 pr-4 py-3 text-white placeholder-gray-500 outline-none transition-all text-sm"
              />
            </div>
            <div className="flex gap-3">
              <select
                value={orden}
                onChange={e => setOrden(e.target.value)}
                className="bg-white/5 border border-white/10 text-gray-300 text-sm rounded-xl px-4 py-3 outline-none [color-scheme:dark] cursor-pointer"
              >
                {ORDEN.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
              {/* Mobile filter toggle */}
              <button
                className="lg:hidden flex items-center gap-2 bg-white/5 border border-white/10 text-gray-300 text-sm rounded-xl px-4 py-3 hover:border-purple-500/40 transition-colors"
                onClick={() => setFiltersOpen(!filtersOpen)}
              >
                <SlidersHorizontal size={15} />
                Filtros {totalFiltros > 0 && <span className="bg-purple-600 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">{totalFiltros}</span>}
              </button>
            </div>
          </div>

          {/* Results count */}
          <p className="text-gray-500 text-sm mb-6">
            <span className="text-white font-semibold">{resultados.length}</span> tarotistas encontrados
            {totalFiltros > 0 && ' con los filtros seleccionados'}
          </p>

          <div className="flex gap-8 items-start">
            {/* Desktop sidebar */}
            <div className="hidden lg:block">
              <Sidebar />
            </div>

            {/* Mobile sidebar */}
            {filtersOpen && (
              <div className="lg:hidden fixed inset-0 z-50 flex">
                <div className="absolute inset-0 bg-black/60" onClick={() => setFiltersOpen(false)} />
                <div className="relative ml-auto w-80 max-w-full h-full bg-[#050511] overflow-y-auto p-5">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-white font-semibold">Filtros</h3>
                    <button onClick={() => setFiltersOpen(false)} className="text-gray-400">
                      <X size={20} />
                    </button>
                  </div>
                  <Sidebar />
                </div>
              </div>
            )}

            {/* Grid */}
            <div className="flex-1 min-w-0">
              {loading ? (
                <div className="flex items-center justify-center py-24">
                  <Loader2 size={32} className="text-purple-400 animate-spin" />
                </div>
              ) : resultados.length === 0 ? (
                <div className="text-center py-20">
                  <p className="text-gray-400 text-lg mb-2">Sin resultados</p>
                  <p className="text-gray-500 text-sm">Probá con otros filtros o limpiá la búsqueda.</p>
                  <button onClick={resetFiltros} className="mt-4 text-purple-400 hover:text-purple-300 text-sm font-semibold transition-colors">
                    Limpiar filtros
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                  {resultados.map(t => <TarotistCard key={t.id} t={t} />)}
                </div>
              )}
              
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
