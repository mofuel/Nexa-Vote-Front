import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Inicio from './pages/Inicio'
import LoginVotante from './pages/votante/LoginVotante'
import RegistroIdentidad from './pages/registro/RegistroIdentidad'
import RegistroReconocimiento from './pages/registro/RegistroReconocimiento'
import RegistroBiometrico from './pages/registro/RegistroBiometrico'
import ConfirmacionRegistro from './pages/registro/ConfirmacionRegistro'
import LoginAdmin from './pages/admin/LoginAdmin'
import AdminDashboard from './pages/admin/AdminDashboard'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path='/login' element={<LoginVotante/>} />
        <Route path="/registro" element={<RegistroIdentidad />} />
        <Route path="/registro/reconocimiento" element={<RegistroReconocimiento />} />
        <Route path='/registro/biometrico' element={<RegistroBiometrico />} />
        <Route path='/registro/verificacion' element={<ConfirmacionRegistro />} />
        <Route path='/loginadmin' element={<LoginAdmin />} />
        <Route path='/admindash' element={<AdminDashboard />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App