import { useNavigate } from "react-router-dom";
import Footer from "../components/layout/footer/Footer";
import MFAStepper from "../components/ui/MFAStepper";
import "../../css/votante/Mfapaso1dni.css";

const NEXT_STEPS = [
  { step: "Paso 2", label: "Reconocimiento Facial" },
  { step: "Paso 3", label: "WebAuthn Biométrico" },
];

export default function MFAPaso1DNI() {
  const navigate = useNavigate();

  const handleDNIScan = () => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Debe iniciar sesión primero");
      navigate("/login");
      return;
    }

    localStorage.setItem("dni_barcode_valid", "true");
    navigate("/mfa/facial");
  };

  return (
    <div className="mfa1-page">

      {/* Header */}
      <header className="mfa1-header">
        <nav className="mfa1-nav">
          <span className="mfa1-logo">NEXA VOTE</span>
          <div className="mfa1-nav-right">
            <span className="material-symbols-outlined mfa1-nav-icon">security</span>
            <button className="mfa1-btn-secure">Secure Login</button>
          </div>
        </nav>
      </header>

      {/* Main */}
      <main className="mfa1-main">

        <div className="mfa1-stepper-wrap">
          <MFAStepper currentStep={1} />
        </div>

        <div className="mfa1-panel">

          {/* Panel Header */}
          <div className="mfa1-panel-header">
            <h1>Validación de Identidad</h1>
            <p>Coloque el reverso de su DNI dentro del marco</p>
          </div>

          {/* Scanner */}
          <div className="mfa1-scanner">
            <div className="mfa1-scanner-inner">
              <div className="mfa1-scan-frame">
                <div className="mfa1-corner mfa1-corner--tl" />
                <div className="mfa1-corner mfa1-corner--tr" />
                <div className="mfa1-corner mfa1-corner--bl" />
                <div className="mfa1-corner mfa1-corner--br" />
                <div className="mfa1-scan-line" />
              </div>
            </div>

            <div className="mfa1-live-badge">
              <span className="mfa1-live-dot" />
              <span className="mfa1-live-text">Live Stream Secure</span>
            </div>
          </div>

          {/* Actions */}
          <div className="mfa1-actions">
            <button className="mfa1-btn-scan" onClick={handleDNIScan}>
              <span className="material-symbols-outlined">camera</span>
              Iniciar Escaneo
            </button>

            <div className="mfa1-info-box">
              <span className="material-symbols-outlined mfa1-info-icon">shield_lock</span>
              <p className="mfa1-info-text">
                En esta versión MVP, el escaneo del DNI se registra como una
                validación simulada del código de barras.
              </p>
            </div>
          </div>

        </div>

        {/* Next Steps */}
        <div className="mfa1-next-steps">
          {NEXT_STEPS.map((item) => (
            <div key={item.step} className="mfa1-step-card">
              <div className="mfa1-step-icon">
                <span className="material-symbols-outlined">pending</span>
              </div>
              <div>
                <p className="mfa1-step-label">{item.step}</p>
                <p className="mfa1-step-name">{item.label}</p>
              </div>
            </div>
          ))}
        </div>

      </main>

      <Footer />

    </div>
  );
}