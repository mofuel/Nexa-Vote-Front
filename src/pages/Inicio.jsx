import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { testConnection } from "../test/supabaseTest";
import { useTheme } from "../context/ThemeContext";
import "../css/Inicio.css";

const FEATURE_CARDS = [
  {
    icon: "lock",
    colorKey: "purple",
    title: "AES-256 ENCRYPTED",
    desc: "Cifrado de extremo a extremo para proteger cada sufragio individual.",
  },
  {
    icon: "fingerprint",
    colorKey: "teal",
    title: "BIOMÉTRICO VERIFICADO",
    desc: "Validación facial y dactilar para prevenir la suplantación de identidad.",
  },
  {
    icon: "badge",
    colorKey: "orange",
    title: "DNI CONFIRMADO",
    desc: "Sincronización directa con el registro civil nacional para auditoría.",
  },
];

const FOOTER_LINKS = ["Privacy Policy", "Security Protocol", "Audit Status"];

export default function Inicio() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    testConnection();
  }, []);

  return (
    <div className="in-page">

      {/* Header */}
      <header className="in-header">
        <div className="in-nav">
          <span className="in-logo">NEXA VOTE</span>

          <div className="in-nav-right">
            <div className="in-nav-links">
              <span className="in-nav-link active">Inicio</span>
              <span className="in-nav-link">Seguridad</span>
              <span className="in-nav-link">Transparencia</span>
            </div>
            <button className="theme-toggle" onClick={toggleTheme}>
              <span className="material-symbols-outlined">{theme === "light" ? "dark_mode" : "light_mode"}</span>
            </button>
            <span className="material-symbols-outlined in-nav-icon">lock</span>
            <span className="material-symbols-outlined in-nav-icon">verified_user</span>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="in-main">

        <div className="in-glow-top" />
        <div className="in-glow-bottom" />

        {/* Hero */}
        <section className="in-hero">

          <div className="in-badge">
            <span className="material-symbols-outlined in-badge-icon">shield</span>
            <span className="in-badge-text">SISTEMA ELECTORAL SEGURO</span>
          </div>

          <h1 className="in-title">Sistema de Voto Electrónico</h1>

          <p className="in-subtitle">
            Seguridad reforzada nivel: no somos la ONPE.
          </p>

          <div className="in-cta-group">
            <button className="in-btn-primary" onClick={() => navigate("/registro")}>
              Registrarse
            </button>
            <button className="in-btn-outline" onClick={() => navigate("/login")}>
              Iniciar Sesión
            </button>
          </div>

          {/* Feature Cards */}
          <div className="in-cards-grid">
            {FEATURE_CARDS.map((card) => (
              <div key={card.title} className="in-feature-card">
                <div className={`in-card-icon-wrap in-card-icon-wrap--${card.colorKey}`}>
                  <span className={`material-symbols-outlined in-card-icon--${card.colorKey}`}>
                    {card.icon}
                  </span>
                </div>
                <div>
                  <h3 className="in-card-title">{card.title}</h3>
                  <p className="in-card-desc">{card.desc}</p>
                </div>
              </div>
            ))}
          </div>

        </section>

        {/* Security Section */}
        <section className="in-security">
          <div className="in-security-card">
            <div className="in-security-content">
              <h2>Arquitectura de Inmutabilidad</h2>
              <p>
                Nuestra red utiliza tecnología de registro distribuido para asegurar
                que una vez que se emite un voto, este no pueda ser alterado, borrado
                ni duplicado por ninguna autoridad.
              </p>
            </div>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="in-footer">
        <div className="in-footer-inner">

          <div className="in-footer-left">
            <span className="in-footer-copy">
              © 2024 Institutional Voting Authority • Encrypted by AES-256
            </span>
            <div className="in-footer-links">
              {FOOTER_LINKS.map((link) => (
                <span key={link} className="in-footer-link">{link}</span>
              ))}
            </div>
          </div>

          <div className="in-footer-right">
            <div className="in-network-badge">
              <span className="in-network-dot" />
              <span className="in-network-text">NETWORK ACTIVE</span>
            </div>
          </div>

        </div>
      </footer>

    </div>
  );
}