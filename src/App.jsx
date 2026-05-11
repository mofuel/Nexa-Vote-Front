import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Inicio from './pages/Inicio'
import LoginVotante from './pages/votante/LoginVotante'
import RegistroIdentidad from './pages/registro/RegistroIdentidad'
import RegistroReconocimiento from './pages/registro/RegistroReconocimiento'
import RegistroBiometrico from './pages/registro/RegistroBiometrico'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path='/login' element={<LoginVotante/>} />
        <Route path="/registro" element={<RegistroIdentidad />} />
        <Route path="/registro/reconocimiento" element={<RegistroReconocimiento />} />
        <Route path='/registro/biometrico' element={<RegistroBiometrico />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App