import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";

import Inicio from "./pages/Inicio";
import LoginVotante from "./pages/votante/LoginVotante";
import LoginAdmin from "./pages/admin/LoginAdmin";

import AdminDashboard from "./pages/admin/AdminDashboard";
import ControlVotacionAdmin from "./pages/admin/ControlVotacionAdmin";
import GestionVotantesAdmin from "./pages/admin/GestionVotantesAdmin";

import MFAPaso1DNI from "./pages/votante/Mfapaso1dni";
import MFAPaso2Facial from "./pages/votante/Mfapaso2facial";
import MFAPaso3WebAuthn from "./pages/votante/Mfapaso3webauthn";

import SeleccionCandidato from "./pages/votante/Seleccioncandidato";

import RegistroLayout from "./pages/registro/RegistroLayout";

function App() {
  return (
    <BrowserRouter>
      <Toaster richColors position="top-right" />
      <Routes>
        {/* PUBLICO */}
        <Route path="/" element={<Inicio />} />
        <Route path="/login" element={<LoginVotante />} />

        {/* REGISTRO */}
        <Route path="/registro/*" element={<RegistroLayout />} />

        {/* ADMIN */}
        <Route path="/loginadmin" element={<LoginAdmin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/resultados" element={<ControlVotacionAdmin />} />
        <Route path="/admin/votantes" element={<GestionVotantesAdmin />} />

        {/* MFA (se mantiene separado) */}
        <Route path="/mfa/escaneo" element={<MFAPaso1DNI />} />
        <Route path="/mfa/facial" element={<MFAPaso2Facial />} />
        <Route path="/mfa/webauthn" element={<MFAPaso3WebAuthn />} />

        {/* VOTACIÓN */}
        <Route path="/candidatos" element={<SeleccionCandidato />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;