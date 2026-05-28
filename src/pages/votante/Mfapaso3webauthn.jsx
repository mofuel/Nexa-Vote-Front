import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";
import Footer from "../components/layout/footer/Footer";
import MFAStepper from "../components/ui/Mfastepper";
import "../../css/votante/Mfapaso3webauthn.css";
import { webauthnAuthOptions, webauthnAuthVerify } from "../../services/api";

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
  const { theme, toggleTheme } = useTheme();

  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  const handleWebAuthnValidation = async () => {


    try {

      setLoading(true);

      setStatusMessage(
        "Solicitando autenticación biométrica del dispositivo..."
      );

      if (!window.PublicKeyCredential) {
        alert("Este navegador no soporta WebAuthn");
        return;
      }




      const options = await webauthnAuthOptions();

      if (!options.success) {
        alert(options.error || "Error obteniendo challenge");
        return;
      }


      const challenge = Uint8Array.from(
        atob(options.challenge),
        c => c.charCodeAt(0)
      );



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



      const payload = {
        voter_id: sessionStorage.getItem("voter_id"),
        id: credential.id
      };

      const result = await webauthnAuthVerify(payload);

      if (!result.success) {
        alert(result.error || "Error validando WebAuthn");
        return;
      }

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
            <button className="theme-toggle" onClick={toggleTheme}>
              <span className="material-symbols-outlined">{theme === "light" ? "dark_mode" : "light_mode"}</span>
            </button>
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