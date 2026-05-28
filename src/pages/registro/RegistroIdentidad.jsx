import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";
import Footer from "../components/layout/footer/Footer";
import { getVoter, updateIdentity } from "../../services/api";
import { useRegistration } from "../../context/useRegistration";
import { toast } from "sonner";
import "../../css/registro/Registroidentidad.css";

export default function RegistroIdentidad() {

  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { registrationId } = useRegistration();

  const [formData, setFormData] = useState({
    dni: "",
    full_name: "",
    birth_date: "",
    email: "",
    password: ""
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {

    if (!registrationId) return;

    const loadData = async () => {

      try {
        const data = await getVoter(registrationId);

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

  const handleContinue = async () => {

    if (loading) return;
    setLoading(true);

    try {

      const result = await updateIdentity(registrationId, formData);

      if (!result.success) {
        toast.error(result.error || "Error");
        return;
      }

      sessionStorage.setItem("token", result.token);
      sessionStorage.setItem("voter_id", registrationId);
      sessionStorage.setItem("voter", JSON.stringify({ id: registrationId }));
      
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

          <span className="ri-logo" onClick={() => navigate("/")}>
            NEXA VOTE
          </span>

          <div className="ri-nav-icons">
            <button className="theme-toggle" onClick={toggleTheme}>
              <span className="material-symbols-outlined">{theme === "light" ? "dark_mode" : "light_mode"}</span>
            </button>
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