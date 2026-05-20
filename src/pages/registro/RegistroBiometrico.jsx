import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabaseClient";
import { useRegistration } from "../../context/useRegistration";
import { useState } from "react";
import "../../css/registro/RegistroBiometrico.css";

const RegistroBiometrico = () => {
  const navigate = useNavigate();
  const { registrationId } = useRegistration();

  const [registrado, setRegistrado] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [loading, setLoading] = useState(false);

  const generarChallenge = () => window.crypto.getRandomValues(new Uint8Array(32));

  const registrarBiometrico = async () => {
    try {
      setLoading(true);
      setMensaje("");

      if (!registrationId) { setMensaje("No hay usuario registrado"); return; }

      const publicKey = {
        challenge: generarChallenge(),
        rp: { name: "Nexa Vote" },
        user: {
          id: new TextEncoder().encode(registrationId),
          name: "votante@nexavote.com",
          displayName: "Votante Nexa Vote",
        },
        pubKeyCredParams: [
          { type: "public-key", alg: -7 },
          { type: "public-key", alg: -257 },
        ],
        authenticatorSelection: { authenticatorAttachment: "platform", userVerification: "required" },
        timeout: 60000,
        attestation: "none",
      };

      const credential = await navigator.credentials.create({ publicKey });
      if (!credential) { setMensaje("No se pudo registrar biometría."); return; }

      const credId = btoa(String.fromCharCode(...new Uint8Array(credential.rawId)));

      const { error: webauthnError } = await supabase
        .from("webauthn_credentials")
        .upsert({ voter_id: registrationId, credential_id: credId, public_key: "stored_by_browser", sign_count: 0 }, { onConflict: "voter_id" });

      if (webauthnError) { console.log(webauthnError); setMensaje("Error guardando WebAuthn"); return; }

      const { error: statusError } = await supabase
        .from("registration_status")
        .update({ current_step: 3, status: "pending" })
        .eq("voter_id", registrationId);

      if (statusError) { console.log(statusError); setMensaje("Error actualizando estado"); return; }

      setRegistrado(true);
      setMensaje("Biometría registrada correctamente");
    } catch (error) {
      console.error(error);
      setMensaje(error.name === "NotAllowedError" ? "Operación cancelada o tiempo agotado" : "Error en WebAuthn");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rb-page">
      <header className="rb-navbar">
        <h2 className="rb-logo">NEXA VOTE</h2>
        <div className="rb-nav-icons">
          <span>🔒</span>
          <span>🛡️</span>
        </div>
      </header>

      <main className="rb-container">
        <section className="rb-card">
          <h1 className="rb-title">Biometría - WebAuthn</h1>
          <p className="rb-subtitle">Vincule su huella o llave de seguridad para continuar</p>

          <div className="rb-fingerprint-circle">
            <span className="rb-fingerprint-icon">🌀</span>
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