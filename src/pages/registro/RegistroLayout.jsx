import { Routes, Route } from "react-router-dom";
import { RegistrationProvider } from "../../context/RegistrationProvider";

import RegistroEscaneDNI from "./RegistroEscaneDNI";
import RegistroIdentidad from "./RegistroIdentidad";
import RegistroReconocimiento from "./RegistroReconocimiento";
import RegistroBiometrico from "./RegistroBiometrico";
import ConfirmacionRegistro from "./ConfirmacionRegistro";

const RegistroLayout = () => {
  return (
    <RegistrationProvider>
      <div>
        <Routes>
          <Route path="/" element={<RegistroEscaneDNI />} />
          <Route path="identidad" element={<RegistroIdentidad />} />
          <Route path="reconocimiento" element={<RegistroReconocimiento />} />
          <Route path="biometrico" element={<RegistroBiometrico />} />
          <Route path="verificacion" element={<ConfirmacionRegistro />} />
        </Routes>
      </div>
    </RegistrationProvider>
  );
};

export default RegistroLayout;