import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Tarotistas from './pages/Tarotistas'
import Perfil from './pages/Perfil'
import DirectorioTarot from './pages/DirectorioTarot'
import './App.css'

export default function App() {
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
