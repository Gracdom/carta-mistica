import { useEffect, useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { Save, ChevronLeft, Plus, X } from 'lucide-react'

const EMPTY = {
  nombre: '', tagline: '', foto_url: '', estado: 'disponible_hoy', activo: true,
  rating: '', resenas_count: '', lecturas_count: '',
  precio_por_minuto: '', precio_chat: '', precio_llamada: '',
  precio_promo_chat: '', precio_promo_llamada: '', descuento_promo: '', minutos_gratis: '',
  pais: 'Argentina', ciudad: '', desde: '',
  especialidades: [], metodos: [], canales: [], etiquetas: [],
  descripcion_servicios: '', sobre_mi: '', servicios_adicionales: [], no_realiza: [],
}

const INPUT = 'w-full bg-white/4 border border-white/8 focus:border-purple-500/50 rounded-xl px-4 py-2.5 text-white placeholder-gray-500 outline-none transition-all text-sm'
const LABEL = 'block text-gray-400 text-xs font-semibold mb-1.5'

function Section({ title, children }) {
  return (
    <div className="rounded-xl p-5 sm:p-6 mb-5"
      style={{ background: 'rgba(255,255,255,.02)', border: '1px solid rgba(255,255,255,.07)' }}>
      <h3 className="text-white text-sm font-semibold mb-4 pb-3 border-b"
        style={{ borderColor: 'rgba(255,255,255,.07)' }}>{title}</h3>
      {children}
    </div>
  )
}

function TagInput({ label, value = [], onChange }) {
  const [input, setInput] = useState('')
  const add = () => {
    const v = input.trim()
    if (v && !value.includes(v)) onChange([...value, v])
    setInput('')
  }
  return (
    <div>
      <label className={LABEL}>{label}</label>
      <div className="flex gap-2 mb-2">
        <input value={input} onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), add())}
          placeholder="Escribí y presioná Enter"
          className={INPUT + ' flex-1'} />
        <button type="button" onClick={add}
          className="w-10 h-10 rounded-xl flex items-center justify-center text-purple-400 hover:text-white hover:bg-purple-600/30 transition-all flex-shrink-0"
          style={{ border: '1px solid rgba(139,92,246,.3)' }}>
          <Plus size={16} />
        </button>
      </div>
      {value.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {value.map(tag => (
            <span key={tag} className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full text-purple-300"
              style={{ background: 'rgba(109,40,217,.2)', border: '1px solid rgba(139,92,246,.3)' }}>
              {tag}
              <button type="button" onClick={() => onChange(value.filter(v => v !== tag))}
                className="hover:text-white transition-colors">
                <X size={10} />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

export default function AdminTarotistasForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = !!id
  const [form, setForm] = useState(EMPTY)
  const [loading, setLoading] = useState(isEdit)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!isEdit) return
    supabase.from('tarotistas').select('*').eq('id', id).single().then(({ data }) => {
      if (data) setForm({ ...EMPTY, ...data })
      setLoading(false)
    })
  }, [id, isEdit])

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))
  const num = (k, v) => set(k, v === '' ? '' : Number(v))

  const handleSubmit = async e => {
    e.preventDefault()
    setError('')
    setSaving(true)

    const payload = {
      ...form,
      rating: form.rating === '' ? null : Number(form.rating),
      resenas_count: form.resenas_count === '' ? null : Number(form.resenas_count),
      lecturas_count: form.lecturas_count === '' ? null : Number(form.lecturas_count),
      precio_por_minuto: form.precio_por_minuto === '' ? null : Number(form.precio_por_minuto),
      precio_chat: form.precio_chat === '' ? null : Number(form.precio_chat),
      precio_llamada: form.precio_llamada === '' ? null : Number(form.precio_llamada),
      precio_promo_chat: form.precio_promo_chat === '' ? null : Number(form.precio_promo_chat),
      precio_promo_llamada: form.precio_promo_llamada === '' ? null : Number(form.precio_promo_llamada),
      descuento_promo: form.descuento_promo === '' ? null : Number(form.descuento_promo),
      minutos_gratis: form.minutos_gratis === '' ? null : Number(form.minutos_gratis),
    }

    const { error: err } = isEdit
      ? await supabase.from('tarotistas').update(payload).eq('id', id)
      : await supabase.from('tarotistas').insert(payload)

    setSaving(false)
    if (err) { setError(err.message); return }
    navigate('/admin/tarotistas')
  }

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-6 h-6 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
    </div>
  )

  return (
    <div className="max-w-3xl">
      <div className="flex items-center gap-3 mb-6">
        <Link to="/admin/tarotistas" className="text-gray-500 hover:text-gray-300 transition-colors">
          <ChevronLeft size={20} />
        </Link>
        <div>
          <h1 className="font-playfair text-2xl font-bold text-white">
            {isEdit ? 'Editar tarotista' : 'Nuevo tarotista'}
          </h1>
          {isEdit && <p className="text-gray-500 text-xs mt-0.5">ID: {id}</p>}
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Section title="Información básica">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div><label className={LABEL}>Nombre *</label>
              <input required value={form.nombre} onChange={e => set('nombre', e.target.value)} placeholder="Nombre completo" className={INPUT} /></div>
            <div><label className={LABEL}>Tagline</label>
              <input value={form.tagline} onChange={e => set('tagline', e.target.value)} placeholder="Frase corta" className={INPUT} /></div>
            <div className="sm:col-span-2"><label className={LABEL}>URL de foto</label>
              <input value={form.foto_url} onChange={e => set('foto_url', e.target.value)} placeholder="https://..." className={INPUT} /></div>
            <div><label className={LABEL}>Estado</label>
              <select value={form.estado} onChange={e => set('estado', e.target.value)} className={INPUT + ' [color-scheme:dark]'}>
                <option value="online">Online</option>
                <option value="disponible_hoy">Disponible hoy</option>
                <option value="solo_reserva">Solo reserva</option>
              </select></div>
            <div className="flex items-center gap-3 pt-5">
              <input type="checkbox" id="activo" checked={form.activo} onChange={e => set('activo', e.target.checked)} className="accent-purple-500 w-4 h-4" />
              <label htmlFor="activo" className="text-gray-300 text-sm cursor-pointer">Perfil activo / visible</label>
            </div>
          </div>
        </Section>

        <Section title="Ubicación y trayectoria">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div><label className={LABEL}>País</label>
              <select value={form.pais} onChange={e => set('pais', e.target.value)} className={INPUT + ' [color-scheme:dark]'}>
                {['Argentina','Chile','México','Uruguay','Colombia','Perú','España','Otro'].map(p => <option key={p}>{p}</option>)}
              </select></div>
            <div><label className={LABEL}>Ciudad</label>
              <input value={form.ciudad} onChange={e => set('ciudad', e.target.value)} placeholder="Ciudad" className={INPUT} /></div>
            <div><label className={LABEL}>Desde (año)</label>
              <input value={form.desde} onChange={e => set('desde', e.target.value)} placeholder="2015" className={INPUT} /></div>
          </div>
        </Section>

        <Section title="Estadísticas">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div><label className={LABEL}>Rating (0-5)</label>
              <input type="number" min="0" max="5" step="0.1" value={form.rating} onChange={e => num('rating', e.target.value)} placeholder="4.9" className={INPUT} /></div>
            <div><label className={LABEL}>N° reseñas</label>
              <input type="number" min="0" value={form.resenas_count} onChange={e => num('resenas_count', e.target.value)} placeholder="0" className={INPUT} /></div>
            <div><label className={LABEL}>N° lecturas</label>
              <input type="number" min="0" value={form.lecturas_count} onChange={e => num('lecturas_count', e.target.value)} placeholder="0" className={INPUT} /></div>
          </div>
        </Section>

        <Section title="Precios">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div><label className={LABEL}>Por minuto ($)</label>
              <input type="number" min="0" value={form.precio_por_minuto} onChange={e => num('precio_por_minuto', e.target.value)} placeholder="0" className={INPUT} /></div>
            <div><label className={LABEL}>Chat ($)</label>
              <input type="number" min="0" value={form.precio_chat} onChange={e => num('precio_chat', e.target.value)} placeholder="0" className={INPUT} /></div>
            <div><label className={LABEL}>Llamada ($)</label>
              <input type="number" min="0" value={form.precio_llamada} onChange={e => num('precio_llamada', e.target.value)} placeholder="0" className={INPUT} /></div>
            <div><label className={LABEL}>Promo chat ($)</label>
              <input type="number" min="0" value={form.precio_promo_chat} onChange={e => num('precio_promo_chat', e.target.value)} placeholder="0" className={INPUT} /></div>
            <div><label className={LABEL}>Promo llamada ($)</label>
              <input type="number" min="0" value={form.precio_promo_llamada} onChange={e => num('precio_promo_llamada', e.target.value)} placeholder="0" className={INPUT} /></div>
            <div><label className={LABEL}>Descuento promo (%)</label>
              <input type="number" min="0" max="100" value={form.descuento_promo} onChange={e => num('descuento_promo', e.target.value)} placeholder="0" className={INPUT} /></div>
            <div><label className={LABEL}>Minutos gratis</label>
              <input type="number" min="0" value={form.minutos_gratis} onChange={e => num('minutos_gratis', e.target.value)} placeholder="0" className={INPUT} /></div>
          </div>
        </Section>

        <Section title="Especialidades y canales">
          <div className="space-y-4">
            <TagInput label="Especialidades" value={form.especialidades} onChange={v => set('especialidades', v)} />
            <TagInput label="Métodos" value={form.metodos} onChange={v => set('metodos', v)} />
            <TagInput label="Canales (Chat, Llamada...)" value={form.canales} onChange={v => set('canales', v)} />
            <TagInput label="Etiquetas" value={form.etiquetas} onChange={v => set('etiquetas', v)} />
          </div>
        </Section>

        <Section title="Descripción y servicios">
          <div className="space-y-4">
            <div><label className={LABEL}>Sobre mí</label>
              <textarea rows={4} value={form.sobre_mi} onChange={e => set('sobre_mi', e.target.value)}
                placeholder="Descripción personal..." className={INPUT + ' resize-none'} /></div>
            <div><label className={LABEL}>Descripción de servicios</label>
              <textarea rows={3} value={form.descripcion_servicios} onChange={e => set('descripcion_servicios', e.target.value)}
                placeholder="Qué incluye cada lectura..." className={INPUT + ' resize-none'} /></div>
            <TagInput label="Servicios adicionales" value={form.servicios_adicionales} onChange={v => set('servicios_adicionales', v)} />
            <TagInput label="No realiza" value={form.no_realiza} onChange={v => set('no_realiza', v)} />
          </div>
        </Section>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-red-400 text-sm mb-5">
            {error}
          </div>
        )}

        <div className="flex items-center gap-3">
          <button type="submit" disabled={saving}
            className="inline-flex items-center gap-2 text-white font-semibold px-6 py-3 rounded-xl transition-all disabled:opacity-60"
            style={{ background: 'linear-gradient(135deg,#6d28d9,#9333ea)', boxShadow: '0 0 20px rgba(139,92,246,.3)' }}>
            {saving
              ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              : <Save size={16} />}
            {isEdit ? 'Guardar cambios' : 'Crear tarotista'}
          </button>
          <Link to="/admin/tarotistas" className="text-gray-400 hover:text-white text-sm transition-colors px-4 py-3">
            Cancelar
          </Link>
        </div>
      </form>
    </div>
  )
}
