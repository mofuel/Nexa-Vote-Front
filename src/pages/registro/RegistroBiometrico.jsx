import { useNavigate } from "react-router-dom";
import { useRegistration } from "../../context/useRegistration";
import { useState } from "react";
import "../../css/registro/RegistroBiometrico.css";
import API_URL from "../../config/api";

const RegistroBiometrico = () => {
  const navigate = useNavigate();
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

      // =========================
      // 1. pedir OPTIONS al backend
      // =========================
      const optionsRes = await fetch(`${API_URL}/webauthn/register/options`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ voter_id: registrationId })
      });

      const options = await optionsRes.json();

      if (!options.success) {
        setMensaje(options.error || "Error obteniendo challenge");
        return;
      }

      // decode challenge
      const challenge = Uint8Array.from(
        atob(options.challenge),
        c => c.charCodeAt(0)
      );

      // =========================
      // 2. crear credencial
      // =========================
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

      // =========================
      // 3. enviar al backend
      // =========================
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

      const verifyRes = await fetch(`${API_URL}/webauthn/register/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const result = await verifyRes.json();

      if (!verifyRes.ok || !result.success) {
        setMensaje(result.error || "Error verificando WebAuthn");
        return;
      }

      // =========================
      // 4. actualizar estado (AHORA backend idealmente lo hace)
      // =========================
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