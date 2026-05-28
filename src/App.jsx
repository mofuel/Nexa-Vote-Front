import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import { ThemeProvider } from "./context/ThemeContext";
import ProtectedRoute from "./components/ProtectedRoute";

import Inicio from "./pages/Inicio";
import LoginVotante from "./pages/votante/LoginVotante";
import LoginAdmin from "./pages/admin/LoginAdmin";

import AdminDashboard from "./pages/admin/AdminDashboard";
import ControlVotacionAdmin from "./pages/admin/ControlVotacionAdmin";
import GestionVotantesAdmin from "./pages/admin/GestionVotantesAdmin";
import AuditLogsAdmin from "./pages/admin/AuditLogsAdmin";

import MFAPaso1DNI from "./pages/votante/Mfapaso1dni";
import MFAPaso2Facial from "./pages/votante/Mfapaso2facial";
import MFAPaso3WebAuthn from "./pages/votante/Mfapaso3webauthn";

import SeleccionCandidato from "./pages/votante/Seleccioncandidato";

import RegistroLayout from "./pages/registro/RegistroLayout";

function App() {
  return (
    <ThemeProvider>
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
          <Route path="/admin/dashboard" element={<ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/resultados" element={<ProtectedRoute adminOnly><ControlVotacionAdmin /></ProtectedRoute>} />
          <Route path="/admin/votantes" element={<ProtectedRoute adminOnly><GestionVotantesAdmin /></ProtectedRoute>} />
          <Route path="/admin/auditoria" element={<ProtectedRoute adminOnly><AuditLogsAdmin /></ProtectedRoute>} />

          {/* MFA */}
          <Route path="/mfa/escaneo" element={<ProtectedRoute><MFAPaso1DNI /></ProtectedRoute>} />
          <Route path="/mfa/facial" element={<ProtectedRoute><MFAPaso2Facial /></ProtectedRoute>} />
          <Route path="/mfa/webauthn" element={<ProtectedRoute><MFAPaso3WebAuthn /></ProtectedRoute>} />


          {/* VOTACIÓN */}
          <Route path="/candidatos" element={<ProtectedRoute><SeleccionCandidato /></ProtectedRoute>} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;