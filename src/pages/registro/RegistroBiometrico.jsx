import { useNavigate } from "react-router-dom";
import { useRegistration } from "../../context/useRegistration";
import { useTheme } from "../../context/ThemeContext";
import { useState } from "react";
import "../../css/registro/RegistroBiometrico.css";
import { webauthnRegisterOptions, webauthnRegisterVerify } from "../../services/api";

const RegistroBiometrico = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { registrationId } = useRegistration();

  const [registrado, setRegistrado] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [loading, setLoading] = useState(false);

  const registrarBiometrico = async () => {
    try {
      setLoading(true);
      setMensaje("");

      if (!registrationId) {
        setMensaje("No hay usuario registrado");
        return;
      }


      const result = await webauthnRegisterOptions(registrationId);
      const state = result.state; 
      if (!result.success) {
        setMensaje(result.error || "Error obteniendo challenge");
        return;
      }

      const publicKey = result.data.publicKey;
      function base64urlToBytes(str) {
        const base64 = str.replace(/-/g, '+').replace(/_/g, '/');
        const binaryStr = atob(base64);
        const bytes = new Uint8Array(binaryStr.length);
        for (let i = 0; i < binaryStr.length; i++) bytes[i] = binaryStr.charCodeAt(i);
        return bytes;
      }

      publicKey.challenge = base64urlToBytes(publicKey.challenge);      
      publicKey.user.id = base64urlToBytes(publicKey.user.id);          

      const credential = await navigator.credentials.create({ publicKey });

      if (!credential) {
        setMensaje("No se pudo registrar biometría.");
        return;
      }


      const payload = {
        state,
        id: credential.id,
        raw_id: btoa(String.fromCharCode(...new Uint8Array(credential.rawId))),
        response: {
          client_data_json: btoa(
            String.fromCharCode(...new Uint8Array(credential.response.clientDataJSON))
          ),
          attestation_object: btoa(
            String.fromCharCode(...new Uint8Array(credential.response.attestationObject))
          ),
        },
      };

      const verifyResult = await webauthnRegisterVerify(payload);

      if (!verifyResult.success) {
        setMensaje(verifyResult.error || "Error verificando WebAuthn");
        return;
      }


      setRegistrado(true);
      setMensaje("Biometría registrada correctamente");

      navigate("/registro/biometrico");

    } catch (error) {
      console.error(error);
      setMensaje(
        error.name === "NotAllowedError"
          ? "Operación cancelada o tiempo agotado"
          : "Error en WebAuthn"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rb-page">
      <header className="rb-navbar">
        <h2 className="rb-logo">NEXA VOTE</h2>
        <div className="rb-nav-icons">
          <button className="theme-toggle" onClick={toggleTheme}>
            <span className="material-symbols-outlined">{theme === "light" ? "dark_mode" : "light_mode"}</span>
          </button>
          <span className="material-symbols-outlined">lock</span>
          <span className="material-symbols-outlined">verified_user</span>
        </div>
      </header>

      <main className="rb-container">
        <section className="rb-card">
          <h1 className="rb-title">Biometría - WebAuthn</h1>
          <p className="rb-subtitle">Vincule su huella o llave de seguridad para continuar</p>

          <div className="rb-fingerprint-circle">
            <span className="material-symbols-outlined rb-fingerprint-icon">fingerprint</span>
          </div>

          <div className="rb-badges">
            <span className="rb-badge">FIDO2 COMPATIBLE</span>
            <span className="rb-badge">U2F COMPATIBLE</span>
            <span className="rb-badge">AES-256 COMPATIBLE</span>
          </div>

          <div className="rb-info-box">
            WebAuthn utiliza criptografía de clave pública. Sus datos biométricos nunca salen del dispositivo.
          </div>

          <button
            onClick={registrarBiometrico}
            disabled={loading || registrado}
            className="rb-btn-primary"
          >
            {loading ? "Esperando validación biométrica..." : registrado ? "Biometría registrada" : "Registrar Biométrico"}
          </button>

          <button
            onClick={() => navigate("/registro/verificacion")}
            disabled={!registrado}
            className="rb-btn-secondary"
          >
            Siguiente →
          </button>

          {mensaje && <div className="rb-message">{mensaje}</div>}
        </section>
      </main>
    </div>
  );
};

export default RegistroBiometrico;