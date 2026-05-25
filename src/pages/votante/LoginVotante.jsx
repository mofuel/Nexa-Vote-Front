import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginVoter } from "../../services/api";
import "../../css/votante/LoginVotante.css";

const SECURITY_BADGES = [
  { icon: "shield_lock", label: "Standard", value: "AES-256" },
  { icon: "enhanced_encryption", label: "Estado", value: "Encriptado" },
];

export default function LoginVotante() {
  const navigate = useNavigate();

  const [dni, setDni] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    setError("");

    if (!dni || !password) {
      setError("Ingrese DNI y contraseña");
      return;
    }

    try {
      setLoading(true);

      const result = await loginVoter(dni, password);

      if (!result.success) {
        setError(result.error || "Credenciales inválidas");
        return;
      }

      const { token, user, has_voted } = result.data;

      if (has_voted) {
        setError("Ya has emitido tu voto. No puedes volver a ingresar.");
        return;
      }

      localStorage.setItem("token", token);
      localStorage.setItem("voter_id", user.id);
      localStorage.setItem("voter", JSON.stringify(user));

      navigate("/mfa/escaneo");

    } catch {
      setError("No se pudo conectar con el backend");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="lv-page">

      {/* Header */}
      <header className="lv-header">
        <div className="lv-nav">
          <span className="lv-logo" onClick={() => navigate("/")}>
            NEXA VOTE
          </span>
          <div className="lv-nav-icons">
            <span className="material-symbols-outlined lv-nav-icon">lock</span>
            <span className="material-symbols-outlined lv-nav-icon">verified_user</span>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="lv-main">
        <div className="lv-glow-top" />
        <div className="lv-glow-bottom" />

        <div className="lv-card-wrapper">
          <div className="lv-card">

            {/* Card Header */}
            <div className="lv-card-header">
              <div className="lv-icon-circle">
                <span className="material-symbols-outlined">fingerprint</span>
              </div>
              <h1 className="lv-card-title">Acceso de Votante</h1>
              <p className="lv-card-subtitle">
                Ingrese sus credenciales para continuar con el proceso de sufragio.
              </p>
            </div>

            {/* Form */}
            <div className="lv-form">

              <div className="lv-field">
                <label className="lv-label">Número de DNI</label>
                <div className="lv-input-wrap">
                  <span className="material-symbols-outlined lv-input-icon">badge</span>
                  <input
                    type="text"
                    value={dni}
                    onChange={(e) => setDni(e.target.value)}
                    placeholder="12345678"
                    className="lv-input"
                  />
                </div>
              </div>

              <div className="lv-field">
                <label className="lv-label">Contraseña</label>
                <div className="lv-input-wrap">
                  <span className="material-symbols-outlined lv-input-icon">lock</span>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="123456"
                    className="lv-input"
                  />
                </div>
              </div>

              {error && <div className="lv-error">{error}</div>}

              <button
                onClick={handleLogin}
                disabled={loading}
                className="lv-btn-submit"
              >
                <span>{loading ? "Validando..." : "Iniciar Sesión"}</span>
                <span className="material-symbols-outlined">arrow_forward</span>
              </button>

            </div>

            {/* Security Badges */}
            <div className="lv-badges-grid">
              {SECURITY_BADGES.map((badge) => (
                <div key={badge.value} className="lv-security-badge">
                  <span className="material-symbols-outlined">{badge.icon}</span>
                  <div className="lv-badge-info">
                    <span className="lv-badge-label">{badge.label}</span>
                    <span className="lv-badge-value">{badge.value}</span>
                  </div>
                </div>
              ))}
            </div>

            <p className="lv-footer-text">
              ¿Problemas con su acceso?{" "}
              <span className="lv-link">Contacte a Soporte Técnico</span>
            </p>

            <p className="lv-footer-text">
              ¿No tiene cuenta?{" "}
              <span className="lv-link" onClick={() => navigate("/registro")}>
                Registrarse
              </span>
            </p>

          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="lv-footer">
        <div className="lv-footer-inner">
          <span className="lv-footer-copy">
            © 2024 Institutional Voting Authority • Encrypted by AES-256
          </span>
        </div>
      </footer>

    </div>
  );
}