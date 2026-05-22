import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Footer from '../components/layout/footer/Footer';
import API_URL from "../../config/api";
import { useRegistration } from "../../context/useRegistration";
import { toast } from "sonner";
import "../../css/registro/Registroidentidad.css";


export default function RegistroIdentidad() {
  const navigate = useNavigate();
  const location = useLocation();
  const { registrationId, setRegistrationId } = useRegistration();

  const isEditMode = new URLSearchParams(location.search).get("edit");

  const [formData, setFormData] = useState({
    dni: '',
    full_name: '',
    birth_date: '',
    email: '',
    password: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  useEffect(() => {
    if (!isEditMode || !registrationId) return;

    const loadData = async () => {
      try {
        const response = await fetch(`${API_URL}/register/voter/${registrationId}`);
        const result = await response.json();

        if (result.success) {
          setFormData({
            dni: result.data.dni,
            full_name: result.data.full_name,
            birth_date: result.data.birth_date,
            email: result.data.email,
            password: "",
          });
        }
      } catch (err) {
        console.log(err);
      }
    };

    loadData();
  }, [registrationId, isEditMode]);

  const handleContinue = async () => {
    if (loading) return;
    setLoading(true);

    const { dni, full_name, birth_date, email, password } = formData;

    try {

      

      const response = await fetch(
        isEditMode && registrationId
          ? `${API_URL}/register/identity/${registrationId}`
          : `${API_URL}/register/identity`,
        {
          method: isEditMode && registrationId ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ dni, full_name, birth_date, email, password }),
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        toast.error(result.error || "Error en la operación");
        return;
      }

      if (isEditMode) {
        toast.success(result.message || "Actualizado correctamente");
        navigate("/registro/verificacion");
        return;
      }

      setRegistrationId(result.data.voter_id);
      toast.success(result.message || "Registro creado");
      navigate("/registro/reconocimiento");

    } catch (err) {
      console.error(err);
      toast.error("Error de conexión con el servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ri-page">

      <header className="ri-header">
        <nav className="ri-nav">
          <span className="ri-logo">NEXA VOTE</span>
          <div className="ri-nav-icons">
            <span className="material-symbols-outlined ri-nav-icon">verified_user</span>
          </div>
        </nav>
      </header>

      <main className="ri-main">
        <div className="ri-glass-panel">

          <div className="ri-panel-header">
            <h1 className="ri-title">Registro de Votante</h1>
            <p className="ri-subtitle">
              Ingrese sus datos personales para crear su cuenta electoral.
            </p>
          </div>

          <div className="ri-form-grid">

            <div className="ri-field">
              <label>DNI</label>
              <input
                type="text"
                name="dni"
                value={formData.dni}
                onChange={handleChange}
                placeholder="12345678"
                className="ri-input"
              />
            </div>

            <div className="ri-field">
              <label>Nombre Completo</label>
              <input
                type="text"
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                placeholder="Juan Pérez"
                className="ri-input"
              />
            </div>

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

            {error && <div className="ri-error">{error}</div>}

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