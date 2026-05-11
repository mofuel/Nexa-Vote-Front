import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Inicio from './pages/Inicio'
import LoginVotante from './pages/votante/LoginVotante'
import RegistroIdentidad from './pages/registro/RegistroIdentidad'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path='/login' element={<LoginVotante/>} />
        <Route path="/registro" element={<RegistroIdentidad />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App