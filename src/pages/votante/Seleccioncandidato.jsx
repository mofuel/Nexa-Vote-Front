import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../components/layout/footer/Footer";
import { getCandidates, castVote } from "../../services/api";
import "../../css/votante/SeleccionCandidato.css";

const NAV_LINKS = ["Resultados", "Cédula", "Recursos"];
const CARD_TAGS = ["CANDIDATO", "OFICIAL"];

export default function SeleccionCandidato() {
  const navigate = useNavigate();

  const [candidates, setCandidates] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [voting, setVoting] = useState(false);
  const [message, setMessage] = useState("");

  const selectedCandidate = candidates.find((c) => c.id === selected);
  const isSuccess = message.includes("correctamente");

  useEffect(() => {
    async function loadCandidates() {
      try {
        const result = await getCandidates();
        if (result.success) {
          setCandidates(result.data);
        } else {
          setMessage(result.message || "No se pudieron obtener los candidatos");
        }
      } catch {
        setMessage("Error de conexión con el backend");
      } finally {
        setLoading(false);
      }
    }

    loadCandidates();
  }, []);

  const handleConfirmVote = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Debe iniciar sesión primero");
      navigate("/login");
      return;
    }

    if (!selected) {
      setMessage("Seleccione un candidato antes de confirmar");
      return;
    }

    try {
      setVoting(true);
      setMessage("");

      const result = await castVote(token, selected);

      if (!result.success) {
        setMessage(result.message || "No se pudo registrar el voto");
        return;
      }

      setMessage("Voto registrado correctamente");
      setTimeout(() => navigate("/"), 1200);

    } catch {
      setMessage("Error al conectar con el backend");
    } finally {
      setVoting(false);
    }
  };

  return (
    <div className="sc-page">

      {/* Header */}
      <header className="sc-header">
        <div className="sc-nav">
          <span className="sc-logo">NEXA VOTE</span>

          <div className="sc-nav-right">
            <div className="sc-nav-links">
              {NAV_LINKS.map((item) => (
                <span
                  key={item}
                  className={`sc-nav-link${item === "Cédula" ? " active" : ""}`}
                >
                  {item}
                </span>
              ))}
            </div>

            <div className="sc-verified-pill">
              <span className="material-symbols-outlined">verified_user</span>
              <span className="sc-verified-text">ID VERIFIED</span>
            </div>

            <span className="material-symbols-outlined sc-lock-icon">lock</span>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="sc-main">

        {/* Progress */}
        <div className="sc-progress-wrap">
          <div className="sc-progress-bar">
            <div className="sc-progress-segment sc-progress-segment--done" />
            <div className="sc-progress-segment sc-progress-segment--done" />
            <div className="sc-progress-segment sc-progress-segment--active" />
          </div>
        </div>

        {/* Title */}
        <div className="sc-page-title">
          <h1>Cédula de Votación</h1>
          <p>Seleccione un candidato. El sistema permitirá emitir el voto una sola vez.</p>
        </div>

        {/* States */}
        {loading && (
          <p className="sc-loading">Cargando candidatos...</p>
        )}

        {!loading && candidates.length === 0 && (
          <p className="sc-empty">No hay candidatos disponibles.</p>
        )}

        {!loading && candidates.length > 0 && (
          <div className="sc-grid">
            {candidates.map((candidate) => (
              <div
                key={candidate.id}
                className={`sc-card${selected === candidate.id ? " selected" : ""}`}
                onClick={() => setSelected(candidate.id)}
              >
                <div className="sc-card-top">
                  <div className="sc-avatar">
                    {candidate.photo_url ? (
                      <img
                        src={candidate.photo_url}
                        alt={candidate.name}
                        className="sc-avatar-img"
                      />
                    ) : (
                      <span className="material-symbols-outlined">person</span>
                    )}
                  </div>

                  <div className="sc-radio">
                    {selected === candidate.id && (
                      <span className="material-symbols-outlined">check</span>
                    )}
                  </div>
                </div>

                <h3 className="sc-candidate-name">{candidate.name}</h3>
                <p className="sc-candidate-party">{candidate.party}</p>

                <div className="sc-tags">
                  {CARD_TAGS.map((tag) => (
                    <span key={tag} className="sc-tag">{tag}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Message */}
        {message && (
          <div className={`sc-message ${isSuccess ? "sc-message--success" : "sc-message--error"}`}>
            {message}
          </div>
        )}

      </main>

      {/* Bottom Bar */}
      <div className="sc-bottom-bar">
        <div className="sc-bottom-inner">

          <div className="sc-bottom-left">
            <div>
              <p className="sc-selection-label">Selección Actual</p>
              <p className="sc-selection-name">
                {selectedCandidate?.name || "Ninguno"}
              </p>
            </div>

            <div className="sc-divider" />

            <div className="sc-jwt-badge">
              <span className="material-symbols-outlined">shield</span>
              <span className="sc-jwt-text">JWT PROTECTED</span>
            </div>
          </div>

          <button
            onClick={handleConfirmVote}
            disabled={voting}
            className="sc-btn-vote"
          >
            {voting ? "Registrando..." : "Confirmar Voto"}
            <span className="material-symbols-outlined">send</span>
          </button>

        </div>
      </div>

      {/* Session Widget */}
      <div className="sc-session-widget">
        <span className="material-symbols-outlined">security</span>
        <div>
          <p className="sc-session-label">SESSION</p>
          <p className="sc-session-status">AUTHENTICATED</p>
        </div>
      </div>

      <Footer />

    </div>
  );
}