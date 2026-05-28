import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";
import { getRegistrationSummary, completeRegistration } from "../../services/api";
import { useRegistration } from "../../context/useRegistration";
import Stepper from "../components/ui/Stepper";
import "../../css/registro/ConfirmacionRegistro.css";

const steps = [
  { n: 1, label: "Identidad" },
  { n: 2, label: "Facial" },
  { n: 3, label: "Biométrico" },
  { n: 4, label: "Verificación" },
];

export default function ConfirmacionRegistro() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { registrationId } = useRegistration();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!registrationId) return;
      const data = await getRegistrationSummary(registrationId);
      if (!data.success) return;
      setData(data.data);
      setLoading(false);
    };
    fetchData();
  }, [registrationId]);


  const faceOk = data?.face_registered;
  const bioOk = data?.webauthn_registered;

  const finishRegistration = async () => {
    const result = await completeRegistration(registrationId);
    if (!result.success) { console.log(result.error); return; }
    navigate("/");
  };



  if (loading) {
    return <div className="cr-loading">Cargando...</div>;
  }

  return (
    <div className="cr-page">

      <header className="cr-header">
        <div className="cr-nav">
          <span className="cr-logo" onClick={() => navigate("/")}>
            NEXA VOTE
          </span>
          <div className="cr-nav-icons">
            <button className="theme-toggle" onClick={toggleTheme}>
              <span className="material-symbols-outlined">{theme === "light" ? "dark_mode" : "light_mode"}</span>
            </button>
            <span className="material-symbols-outlined cr-nav-icon">lock</span>
            <span className="material-symbols-outlined cr-nav-icon">verified_user</span>
          </div>
        </div>
      </header>

      <main className="cr-main">
        <div className="cr-content">

          <Stepper steps={steps} currentStep={4} />

          <div className="cr-page-title">
            <h1>Confirmación de Registro</h1>
            <p>Revise la información antes de finalizar</p>
          </div>

          <section className="cr-card">

            {/* Perfil */}
            <div className="cr-profile">
              <div className="cr-avatar">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCeWuNUhk99LQRkOfMyu5_kTKiESepjmLTkMpSCHJW1PUvivLvmSeOul1_prLjECurrAWcf1Jz3u9LxAwaETgdI85ba_ZnebxldCFid4RRmASuae6a0_T__17vzvU8EnFNzGFlcUtbXCsARg4NgmwI5hSHlbGPjAuOkvDMpBteJ1Zdby31zdY5m7mQ-5jBpBdEljl1PVHLAHENSJuWemCuTPDEg_-HmYRFmL-Oj52ySq9puR8iHqQEqgvuAyKf7w4RBBxmoXht0psg"
                  alt="Avatar"
                />
              </div>

              <div className="cr-profile-info">
                <div className="cr-verified-badge">
                  <span className="material-symbols-outlined">verified</span>
                  <span>IDENTIDAD VERIFICADA</span>
                </div>
                <h2 className="cr-profile-name">{data?.full_name}</h2>
                <p className="cr-profile-email">{data?.email}</p>
              </div>
            </div>

            {/* Data Grid */}
            <div className="cr-data-grid">

              <div className="cr-data-item">
                <span className="cr-data-label">Nombre Completo</span>
                <div className="cr-data-value">{data?.full_name}</div>
              </div>

              <div className="cr-data-item">
                <span className="cr-data-label">DNI</span>
                <div className="cr-data-value">{data?.dni}</div>
              </div>

              <div className="cr-data-item">
                <span className="cr-data-label">Validación Facial</span>
                <div className="cr-data-status">
                  <span>{faceOk ? "Completado" : "Pendiente"}</span>
                  {faceOk && (
                    <span className="material-symbols-outlined cr-check-icon">check_circle</span>
                  )}
                </div>
              </div>

              <div className="cr-data-item">
                <span className="cr-data-label">Biometría</span>
                <div className="cr-data-status">
                  <span>{bioOk ? "Registrado" : "Pendiente"}</span>
                  {bioOk && (
                    <span className="material-symbols-outlined cr-check-icon">check_circle</span>
                  )}
                </div>
              </div>

            </div>

            {/* Buttons */}
            <div className="cr-actions">
              <button className="cr-btn-edit" onClick={() => navigate("/registro?edit=1")}>
                Editar Información
              </button>

              <button
                className="cr-btn-finish"
                onClick={finishRegistration}
                disabled={!faceOk || !bioOk}
              >
                Finalizar Registro
              </button>
            </div>

          </section>
        </div>
      </main>
    </div>
  );
}