import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Tarotistas from './pages/Tarotistas'
import Perfil from './pages/Perfil'
import DirectorioTarot from './pages/DirectorioTarot'
import './App.css'

// Detecta si la app está corriendo en el subdominio "directoriotarot"
const subdomain = window.location.hostname.split('.')[0]
const isDirectorioSubdomain = subdomain === 'directoriotarot'

export default function App() {
  // Si el hostname es directoriotarot.*, renderiza directamente el componente.
  // React Router solo sirve para la navegación interna del sitio principal.
  if (isDirectorioSubdomain) {
    return (
      <BrowserRouter>
        <Routes>
          <Route path="*" element={<DirectorioTarot />} />
        </Routes>
      </BrowserRouter>
    )
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/tarotistas" element={<Tarotistas />} />
        <Route path="/tarotistas/:id" element={<Perfil />} />
        <Route path="/directoriotarot" element={<DirectorioTarot />} />
      </Routes>
    </BrowserRouter>
  )
}
