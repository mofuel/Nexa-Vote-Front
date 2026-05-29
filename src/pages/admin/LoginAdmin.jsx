import { useState, Fragment } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";
import "../../css/admin/LoginAdmin.css";
import { loginAdmin } from "../../services/api";
import { useAuth } from "../../context/useAuth";

const SECONDARY_LINKS = ["Soporte IT", "Protocolos", "Verificar Nodo"];
const FOOTER_LINKS = ["Privacy Policy", "Security Protocol", "Audit Status"];

const SECURITY_BADGES = [
  { icon: "shield_lock", colorClass: "la-badge-icon--teal", label: "Encriptación AES-256 en curso" },
  { icon: "location_on", colorClass: "la-badge-icon--orange", label: "IP: 192.168.1.104" },
];

export default function LoginAdmin() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [credentials, setCredentials] = useState({
    email: "",
    password: ""
  });
  const { login } = useAuth();

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {

      const result = await loginAdmin(
        credentials.email,
        credentials.password
      );

      if (!result.success) {
        alert(result.error || "Credenciales inválidas");
        return;
      }

      login(result.data.token, result.data.admin, "admin");

      navigate("/admin/dashboard");

    } catch {
      alert("Error conectando con el backend");
    }
  };

  return (
    <div className="la-page">

      {/* Header */}
      <header className="la-header">
        <div className="la-nav">
          <div className="la-nav-left">
            <span className="la-logo" onClick={() => navigate("/")}>
              NEXA VOTE
            </span>
            <div className="la-nav-divider" />
            <span className="la-nav-subtitle">Portal de Administración</span>
          </div>

          <div className="la-nav-icons">
            <button className="theme-toggle" onClick={toggleTheme}>
              <span className="material-symbols-outlined">{theme === "light" ? "dark_mode" : "light_mode"}</span>
            </button>
            <span className="material-symbols-outlined la-nav-icon">lock</span>
            <span className="material-symbols-outlined la-nav-icon">verified_user</span>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="la-main">
        <div className="la-container">

          {/* Access Header */}
          <div className="la-access-header">
            <div className="la-icon-circle">
              <span className="material-symbols-outlined">admin_panel_settings</span>
            </div>
            <h1 className="la-access-title">Acceso Restringido</h1>
            <p className="la-access-subtitle">
              Institutional Voting Authority • Admin v4.0
            </p>
          </div>

          {/* Form Card */}
          <section className="la-card">
            <div className="la-card-accent" />

            <form className="la-form" onSubmit={handleSubmit}>

              {/* Username */}
              <div className="la-field">
                <label className="la-label">Nombre de Usuario</label>
                <div className="la-input-wrap">
                  <span className="material-symbols-outlined la-input-icon">person</span>
                  <input
                    type="email"
                    name="email"
                    placeholder="admin@nexavote.com"
                    value={credentials.email}
                    onChange={handleChange}
                    className="la-input"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="la-field">
                <div className="la-label-row">
                  <label className="la-label">Contraseña</label>
                  <a href="#" className="la-forgot-link">¿Olvido de Credenciales?</a>
                </div>
                <div className="la-input-wrap">
                  <span className="material-symbols-outlined la-input-icon">key</span>
                  <input
                    type="password"
                    name="password"
                    placeholder="••••••••••••"
                    value={credentials.password}
                    onChange={handleChange}
                    className="la-input"
                  />
                </div>
              </div>

              {/* Submit */}
              <button type="submit" className="la-btn-submit">
                <span className="material-symbols-outlined">login</span>
                Acceder como Administrador
              </button>

            </form>

            {/* Security Badges */}
            <div className="la-security-badges">
              {SECURITY_BADGES.map((badge) => (
                <div key={badge.label} className="la-security-badge">
                  <span className={`material-symbols-outlined ${badge.colorClass}`}>
                    {badge.icon}
                  </span>
                  <span>{badge.label}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Secondary Links */}
          <div className="la-secondary-links">
            {SECONDARY_LINKS.map((text, idx) => (
              <Fragment key={text}>
                <a href="#" className="la-secondary-link">{text}</a>
                {idx < SECONDARY_LINKS.length - 1 && (
                  <span className="la-secondary-sep">•</span>
                )}
              </Fragment>
            ))}
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="la-footer">
        <div className="la-footer-inner">
          <span className="la-footer-copy">
            © 2024 NEXA VOTE • Institutional Voting Authority • Encrypted by AES-256
          </span>
          <div className="la-footer-links">
            {FOOTER_LINKS.map((link) => (
              <a key={link} href="#" className="la-footer-link">{link}</a>
            ))}
          </div>
        </div>
      </footer>

    </div>
  );
}