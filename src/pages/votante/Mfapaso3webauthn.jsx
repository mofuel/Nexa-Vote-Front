import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../components/layout/footer/Footer";
import MFAStepper from "../components/ui/MFAStepper";
import { validateMultifactor } from "../../services/api";
import "../../css/votante/Mfapaso3webauthn.css";

const STEP_CHIPS = [
  { icon: "verified_user", label: "Paso 1: Escaneo DNI" },
  { icon: "check_circle", label: "Paso 2: Reconocimiento Facial" },
];

const BOTTOM_BADGES = [
  { icon: "lock", label: "E2E Encrypted" },
  { icon: "verified", label: "Biometric Verified" },
  { icon: "shield", label: "Audit Compliant" },
];

export default function MFAPaso3WebAuthn() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  const handleWebAuthnValidation = async () => {

    const token = localStorage.getItem("token");
    const dniValid = localStorage.getItem("dni_barcode_valid");
    const faceValid = localStorage.getItem("face_valid");
    const voterId = localStorage.getItem("voter_id");

    if (!token) {
      alert("Debe iniciar sesión primero");
      navigate("/login");
      return;
    }

    if (dniValid !== "true") {
      alert("Primero debe completar la validación del DNI");
      navigate("/mfa/escaneo");
      return;
    }

    if (faceValid !== "true") {
      alert("Primero debe completar la validación facial");
      navigate("/mfa/facial");
      return;
    }

    try {

      setLoading(true);

      setStatusMessage(
        "Solicitando autenticación biométrica del dispositivo..."
      );

      if (!window.PublicKeyCredential) {
        alert("Este navegador no soporta WebAuthn");
        return;
      }

      // =========================
      // 1. pedir challenge al backend
      // =========================



      const optionsRes = await fetch(
        "http://127.0.0.1:5000/webauthn/auth/options",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          }
        }
      );

      const options = await optionsRes.json();

      if (!options.success) {
        alert(options.error || "Error obteniendo challenge");
        return;
      }

      // =========================
      // 2. decode challenge
      // =========================

      const challenge = Uint8Array.from(
        atob(options.challenge),
        c => c.charCodeAt(0)
      );

      // =========================
      // 3. AUTENTICAR (NO REGISTRAR)
      // =========================

      const credential = await navigator.credentials.get({
        publicKey: {
          challenge,
          userVerification: "required",
          timeout: 60000
        }
      });

      if (!credential) {
        alert("No se pudo autenticar biometría");
        return;
      }

      // =========================
      // 4. enviar credential al backend
      // =========================

      const payload = {
        voter_id: voterId,
        id: credential.id
      };

      const verifyRes = await fetch(
        "http://127.0.0.1:5000/webauthn/auth/verify",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(payload)
        }
      );

      const result = await verifyRes.json();

      if (!verifyRes.ok || !result.success) {
        alert(result.error || "Error validando WebAuthn");
        return;
      }

      // =========================
      // 5. MFA COMPLETADO
      // =========================

      localStorage.setItem("fingerprint_valid", "true");

      setStatusMessage(
        "Validación multifactor completada correctamente"
      );

      navigate("/candidatos");

    } catch (error) {

      console.error(error);

      if (error.name === "NotAllowedError") {
        alert("Autenticación cancelada");
      } else {
        alert("Error en autenticación WebAuthn");
      }

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mfa3-page">

      {/* Header */}
      <header className="mfa3-header">
        <nav className="mfa3-nav">
          <span className="mfa3-logo">NEXA VOTE</span>
          <div className="mfa3-nav-right">
            <span className="material-symbols-outlined mfa3-nav-icon">security</span>
            <button className="mfa3-btn-secure">Secure Login</button>
          </div>
        </nav>
      </header>

      {/* Main */}
      <main className="mfa3-main">

        <div className="mfa3-stepper-wrap">
          <MFAStepper currentStep={3} />
        </div>

        <section className="mfa3-section">
          <div className="mfa3-panel">

            {/* Fingerprint Icon */}
            <div className="mfa3-icon-wrap">
              <div className="mfa3-icon-pulse" />
              <div className="mfa3-icon-inner">
                <span className="material-symbols-outlined">fingerprint</span>
              </div>
            </div>

            <h1 className="mfa3-title">Biométrico WebAuthn</h1>

            <p className="mfa3-subtitle">
              Use Touch ID, huella Android, Face ID o el autenticador seguro de
              su dispositivo para completar la validación multifactor.
            </p>

            {/* Step Chips */}
            <div className="mfa3-chips">
              {STEP_CHIPS.map((chip) => (
                <div key={chip.label} className="mfa3-chip">
                  <span className="material-symbols-outlined">{chip.icon}</span>
                  <span className="mfa3-chip-label">{chip.label}</span>
                </div>
              ))}
            </div>

            {/* Status Message */}
            {statusMessage && (
              <div className="mfa3-status">{statusMessage}</div>
            )}

            {/* Submit Button */}
            <button
              onClick={handleWebAuthnValidation}
              disabled={loading}
              className="mfa3-btn-submit"
            >
              <span className="material-symbols-outlined">lock</span>
              {loading ? "Validando..." : "Registrar Biométrico WebAuthn"}
            </button>

            {/* Info Box */}
            <div className="mfa3-info-box">
              <span className="material-symbols-outlined mfa3-info-icon">encrypted</span>
              <p className="mfa3-info-text">
                WebAuthn permite validar la biometría desde el dispositivo del
                usuario sin enviar ni almacenar la huella real en el servidor.
                El backend solo recibe el resultado de validación para habilitar
                el voto.
              </p>
            </div>

          </div>
        </section>

        {/* Bottom Badges */}
        <div className="mfa3-bottom-badges">
          {BOTTOM_BADGES.map((badge) => (
            <div key={badge.label} className="mfa3-bottom-badge">
              <span className="material-symbols-outlined">{badge.icon}</span>
              <span className="mfa3-bottom-badge-label">{badge.label}</span>
            </div>
          ))}
        </div>

      </main>

      <Footer />

    </div>
  );
}