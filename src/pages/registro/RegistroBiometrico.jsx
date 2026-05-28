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


      const options = await webauthnRegisterOptions(registrationId);

      if (!options.success) {
        setMensaje(options.error || "Error obteniendo challenge");
        return;
      }

      const challenge = Uint8Array.from(
        atob(options.challenge),
        c => c.charCodeAt(0)
      );


      const credential = await navigator.credentials.create({
        publicKey: {
          challenge,
          rp: { name: "Nexa Vote" },
          user: {
            id: new TextEncoder().encode(registrationId),
            name: "voter",
            displayName: "Votante Nexa Vote",
          },
          pubKeyCredParams: [
            { type: "public-key", alg: -7 },
            { type: "public-key", alg: -257 },
          ],
          authenticatorSelection: {
            authenticatorAttachment: "platform",
            userVerification: "required"
          },
          timeout: 60000,
          attestation: "none",
        },
      });

      if (!credential) {
        setMensaje("No se pudo registrar biometría.");
        return;
      }

 
      const payload = {
        id: credential.id,
        rawId: btoa(String.fromCharCode(...new Uint8Array(credential.rawId))),
        type: credential.type,
        response: {
          clientDataJSON: btoa(
            String.fromCharCode(...new Uint8Array(credential.response.clientDataJSON))
          ),
          attestationObject: btoa(
            String.fromCharCode(...new Uint8Array(credential.response.attestationObject))
          ),
        },
        voter_id: registrationId
      };

      const result = await webauthnRegisterVerify(payload);

      if (!result.success) {
        setMensaje(result.error || "Error verificando WebAuthn");
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