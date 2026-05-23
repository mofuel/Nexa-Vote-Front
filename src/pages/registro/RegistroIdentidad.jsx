import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../components/layout/footer/Footer";
import API_URL from "../../config/api";
import { useRegistration } from "../../context/useRegistration";
import { toast } from "sonner";
import "../../css/registro/Registroidentidad.css";

export default function RegistroIdentidad() {

  const navigate = useNavigate();
  const { registrationId } = useRegistration();

  const [formData, setFormData] = useState({
    dni: "",
    full_name: "",
    birth_date: "",
    email: "",
    password: ""
  });

  const [loading, setLoading] = useState(false);

  // ── cargar datos del scan ─────────────────────────────
  useEffect(() => {

    if (!registrationId) return;

    const loadData = async () => {

      try {
        const res = await fetch(`${API_URL}/register/voter/${registrationId}`);
        const data = await res.json();

        if (!data.success) {
          toast.error("Error cargando datos");
          return;
        }

        setFormData((prev) => ({
          ...prev,
          dni: data.data.dni || "",
          full_name: data.data.full_name || ""
        }));

      } catch (err) {
        console.error(err);
      }
    };

    loadData();

  }, [registrationId]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  // ── enviar registro final ─────────────────────────────
  const handleContinue = async () => {

    if (loading) return;
    setLoading(true);

    try {

      const res = await fetch(
        `${API_URL}/register/identity/${registrationId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData)
        }
      );

      const result = await res.json();

      if (!result.success) {
        toast.error(result.error || "Error");
        return;
      }

      toast.success("Registro completado");
      navigate("/registro/reconocimiento");

    } catch (err) {
      console.error(err);
      toast.error("Error de conexión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ri-page">

      <header className="ri-header">
        <nav className="ri-nav">

          <span className="ri-logo">
            NEXA VOTE
          </span>

          <div className="ri-nav-icons">
            <span className="material-symbols-outlined ri-nav-icon">
              verified_user
            </span>
          </div>

        </nav>
      </header>

      <main className="ri-main">

        <div className="ri-glass-panel">

          <div className="ri-panel-header">

            <h1 className="ri-title">
              Registro de Votante
            </h1>

            <p className="ri-subtitle">
              Complete los datos restantes para continuar con su registro.
            </p>

          </div>

          <div className="ri-form-grid">

            {/* DNI */}
            <div className="ri-field">

              <label>DNI</label>

              <input
                type="text"
                name="dni"
                value={formData.dni}
                disabled
                className="ri-input ri-input-disabled"
              />

            </div>

            {/* Nombre */}
            <div className="ri-field">

              <label>Nombre Completo</label>

              <input
                type="text"
                name="full_name"
                value={formData.full_name}
                disabled
                className="ri-input ri-input-disabled"
              />

            </div>

            {/* Fecha nacimiento */}
            <div className="ri-field">

              <label>Fecha de Nacimiento</label>

              <input
                type="date"
                name="birth_date"
                value={formData.birth_date}
                onChange={handleChange}
                className="ri-input"
              />

            </div>

            {/* Email */}
            <div className="ri-field">

              <label>Correo Electrónico</label>

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="correo@nexavote.test"
                className="ri-input"
              />

            </div>

            {/* Password */}
            <div className="ri-field">

              <label>Contraseña</label>

              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="********"
                className="ri-input"
              />

            </div>

            <button
              onClick={handleContinue}
              className="ri-btn-submit"
              disabled={loading}
            >
              {loading ? "Registrando..." : "Continuar"}
            </button>

          </div>

        </div>

      </main>

      <Footer />

    </div>
  );
}