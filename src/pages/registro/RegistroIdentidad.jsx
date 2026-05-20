import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Footer from '../components/layout/footer/Footer'
import { supabase } from "../../lib/supabaseClient";
import { useRegistration } from "../../context/useRegistration";

const glassPanel = {
  background: 'rgba(19, 22, 42, 0.8)',
  backdropFilter: 'blur(12px)',
  border: '1px solid rgba(255,255,255,0.06)',
}

export default function RegistroIdentidad() {
  const navigate = useNavigate()
  const { setRegistrationId } = useRegistration();

  const [formData, setFormData] = useState({
    dni: '',
    full_name: '',
    birth_date: '',
    email: '',
    password: '',
  })

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleContinue = async () => {
    if (loading) return;

    setError('');
    setLoading(true);

    const { dni, full_name, birth_date, email, password } = formData;

    try {
      if (!dni || !full_name || !birth_date || !email || !password) {
        setError("Todos los campos son obligatorios");
        return;
      }

      if (dni.length !== 8) {
        setError("El DNI debe tener 8 dígitos");
        return;
      }


      const birthDate = new Date(birth_date);
      const today = new Date();

      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();

      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }

      if (age < 18) {
        setError("Debes ser mayor de 18 años");
        return;
      }

      if (age > 100) {
        setError("Edad inválida");
        return;
      }


      const { data: voterData, error: voterError } = await supabase
        .from("voters")
        .insert([
          {
            dni,
            full_name,
            birth_date,
            email,
          },
        ])
        .select()
        .single();

      if (voterError) {
        console.log(voterError);
        setError("Error creando votante");
        return;
      }


      const { error: statusError } = await supabase
        .from("registration_status")
        .insert([
          {
            voter_id: voterData.id,
            current_step: 1,
            status: "pending",
          },
        ]);

      if (statusError) {
        console.log(statusError);

        await supabase
          .from("voters")
          .delete()
          .eq("id", voterData.id);

        setError("Error creando estado de registro");
        return;
      }

      // guardar ID global
      setRegistrationId(voterData.id);

      // continuar
      navigate("/registro/reconocimiento");
    } catch (err) {
      console.error("ERROR GENERAL:", err);
      setError("Error inesperado");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      background: '#14121c',
      color: '#e6e0ef',
      minHeight: '100vh',
      fontFamily: 'Inter, sans-serif',
      display: 'flex',
      flexDirection: 'column'
    }}>

      <header style={{
        background: 'rgba(20,18,28,0.8)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        position: 'sticky',
        top: 0,
        zIndex: 50,
      }}>
        <nav style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '12px 40px',
          maxWidth: '1280px',
          margin: '0 auto'
        }}>
          <span style={{
            fontFamily: 'Space Grotesk, sans-serif',
            fontWeight: 700,
            fontSize: '20px',
            color: '#e6e0ef'
          }}>
            NEXA VOTE
          </span>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span className="material-symbols-outlined" style={{ color: '#c9beff' }}>
              verified_user
            </span>
          </div>
        </nav>
      </header>

      <main style={{
        flexGrow: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '48px 16px'
      }}>

        <div style={{
          ...glassPanel,
          width: '100%',
          maxWidth: '680px',
          borderRadius: '16px',
          padding: '40px'
        }}>

          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <h1 style={{
              fontFamily: 'Space Grotesk, sans-serif',
              fontWeight: 700,
              fontSize: '32px',
              marginBottom: '8px'
            }}>
              Registro de Votante
            </h1>

            <p style={{
              color: '#c9c3d9',
              fontSize: '16px'
            }}>
              Ingrese sus datos personales para crear su cuenta electoral.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gap: '20px'
          }}>

            <div>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                color: '#c9c3d9',
                fontSize: '14px'
              }}>
                DNI
              </label>

              <input
                type="text"
                name="dni"
                value={formData.dni}
                onChange={handleChange}
                placeholder="12345678"
                style={{
                  width: '100%',
                  padding: '14px',
                  borderRadius: '8px',
                  border: '1px solid rgba(255,255,255,0.1)',
                  background: '#0A0C14',
                  color: '#fff',
                  fontSize: '14px',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                color: '#c9c3d9',
                fontSize: '14px'
              }}>
                Nombre Completo
              </label>

              <input
                type="text"
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                placeholder="Juan Pérez"
                style={{
                  width: '100%',
                  padding: '14px',
                  borderRadius: '8px',
                  border: '1px solid rgba(255,255,255,0.1)',
                  background: '#0A0C14',
                  color: '#fff',
                  fontSize: '14px',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                color: '#c9c3d9',
                fontSize: '14px'
              }}>
                Fecha de Nacimiento
              </label>

              <input
                type="date"
                name="birth_date"
                value={formData.birth_date}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '14px',
                  borderRadius: '8px',
                  border: '1px solid rgba(255,255,255,0.1)',
                  background: '#0A0C14',
                  color: '#fff',
                  fontSize: '14px',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                color: '#c9c3d9',
                fontSize: '14px'
              }}>
                Correo Electrónico
              </label>

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="correo@nexavote.test"
                style={{
                  width: '100%',
                  padding: '14px',
                  borderRadius: '8px',
                  border: '1px solid rgba(255,255,255,0.1)',
                  background: '#0A0C14',
                  color: '#fff',
                  fontSize: '14px',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                color: '#c9c3d9',
                fontSize: '14px'
              }}>
                Contraseña
              </label>

              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="********"
                style={{
                  width: '100%',
                  padding: '14px',
                  borderRadius: '8px',
                  border: '1px solid rgba(255,255,255,0.1)',
                  background: '#0A0C14',
                  color: '#fff',
                  fontSize: '14px',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            {error && (
              <div style={{
                background: 'rgba(255,80,80,0.1)',
                border: '1px solid rgba(255,80,80,0.2)',
                padding: '12px',
                borderRadius: '8px',
                color: '#ffb4ab',
                textAlign: 'center',
                fontSize: '14px'
              }}>
                {error}
              </div>
            )}

            <button onClick={handleContinue} style={{
              background: '#6c47ff',
              color: '#fff',
              border: 'none',
              padding: '16px',
              borderRadius: '12px',
              fontWeight: 700,
              fontSize: '16px',
              cursor: 'pointer',
              marginTop: '8px'
            }} disabled={loading}>
              {loading ? "Registrando..." : "Continuar"}
            </button>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}