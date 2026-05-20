import { useNavigate } from "react-router-dom";
import Footer from "../components/layout/footer/Footer";
import MFAStepper from "../components/ui/MFAStepper";
import "../../css/votante/Mfapaso2facial.css";

export default function MFAPaso2Facial() {
  const navigate = useNavigate();

  const handleFacialScan = () => {
    const token = localStorage.getItem("token");
    const dniValid = localStorage.getItem("dni_barcode_valid");

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

    localStorage.setItem("face_valid", "true");
    navigate("/mfa/webauthn");
  };

  return (
    <div className="mfa2-page">

      {/* Header */}
      <header className="mfa2-header">
        <nav className="mfa2-nav">
          <span className="mfa2-logo">NEXA VOTE</span>
          <div className="mfa2-nav-right">
            <span className="material-symbols-outlined mfa2-nav-icon">security</span>
            <button className="mfa2-btn-secure">Secure Login</button>
          </div>
        </nav>
      </header>

      {/* Main */}
      <main className="mfa2-main">

        <div className="mfa2-stepper-wrap">
          <MFAStepper currentStep={2} />
        </div>

        <div className="mfa2-panel">

          {/* ID Verified Badge */}
          <div className="mfa2-id-badge">
            <span className="material-symbols-outlined">verified</span>
            <span className="mfa2-id-badge-text">ID VERIFIED</span>
          </div>

          {/* Panel Header */}
          <div className="mfa2-panel-header">
            <h1>MFA Paso 2: Reconocimiento Facial</h1>
            <p>
              Posicione su rostro dentro del recuadro para continuar con la
              validación multifactor.
            </p>
          </div>

          {/* Face Scanner */}
          <div className="mfa2-scanner">
            <div className="mfa2-scanner-inner">
              <div className="mfa2-face-frame">
                <div className="mfa2-corner mfa2-corner--tl" />
                <div className="mfa2-corner mfa2-corner--tr" />
                <div className="mfa2-corner mfa2-corner--bl" />
                <div className="mfa2-corner mfa2-corner--br" />

                <svg
                  className="mfa2-face-outline"
                  fill="none"
                  stroke="white"
                  strokeWidth="0.5"
                  viewBox="0 0 100 120"
                >
                  <path d="M50 10C35 10 20 25 20 50C20 85 40 110 50 110C60 110 80 85 80 50C80 25 65 10 50 10Z" />
                </svg>
              </div>
            </div>

            <div className="mfa2-calibrating">
              <div className="mfa2-calibrating-pill">
                <span className="mfa2-pulse-dot" />
                <span className="mfa2-calibrating-text">
                  CALIBRANDO SENSOR BIOMÉTRICO...
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="mfa2-actions">
            <button className="mfa2-btn-scan" onClick={handleFacialScan}>
              <span className="material-symbols-outlined">videocam</span>
              Iniciar Escaneo
            </button>

            <div className="mfa2-mvp-note">
              <span className="material-symbols-outlined">lock_person</span>
              <span>Validación facial simulada para MVP</span>
            </div>
          </div>

          {/* Info Box */}
          <div className="mfa2-info-section">
            <div className="mfa2-info-box">
              <span className="material-symbols-outlined mfa2-info-icon">info</span>
              <p className="mfa2-info-text">
                En esta versión, la validación facial se registra como
                confirmación del paso biométrico. En producción se integraría
                con un servicio real de reconocimiento facial.
              </p>
            </div>
          </div>

        </div>

        {/* Status Cards */}
        <div className="mfa2-status-grid">

          <div className="mfa2-status-card mfa2-status-card--verified">
            <div className="mfa2-status-left">
              <span className="material-symbols-outlined mfa2-status-icon--verified">
                id_card
              </span>
              <div>
                <p className="mfa2-status-title">DOCUMENTO IDENTIDAD</p>
                <p className="mfa2-status-subtitle">DNI ESCANEADO</p>
              </div>
            </div>
            <span className="mfa2-status-tag mfa2-status-tag--verified">
              VERIFICADO
            </span>
          </div>

          <div className="mfa2-status-card mfa2-status-card--pending">
            <div className="mfa2-status-left">
              <span className="material-symbols-outlined mfa2-status-icon--pending">
                key
              </span>
              <div>
                <p className="mfa2-status-title">WEBAUTHN TOKEN</p>
                <p className="mfa2-status-subtitle">PENDIENTE DE FIRMA</p>
              </div>
            </div>
            <span className="mfa2-status-tag mfa2-status-tag--pending">
              PENDIENTE
            </span>
          </div>

        </div>

      </main>

      <Footer />

    </div>
  );
}