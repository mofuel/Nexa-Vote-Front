import { useNavigate } from 'react-router-dom'
import Stepper from '../components/ui/Stepper'

const glassCard = {
  background: 'rgba(19, 22, 42, 0.8)',
  backdropFilter: 'blur(12px)',
  border: '1px solid rgba(255, 255, 255, 0.06)',
}

const steps = [
  { n: 1, label: 'Identidad' },
  { n: 2, label: 'Facial' },
  { n: 3, label: 'Biométrico' },
  { n: 4, label: 'Verificación' },
]

export default function RegistroBiometrico() {
  const navigate = useNavigate()
  return (
    <div style={{
      background: '#14121c',
      color: '#e6e0ef',
      minHeight: '100vh',
      fontFamily: 'Inter, sans-serif',
      display: 'flex',
      flexDirection: 'column'
    }}>

      {/* HEADER */}
      <header style={{
        position: 'fixed',
        top: 0,
        width: '100%',
        zIndex: 50,
        background: 'rgba(20,18,28,0.8)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        height: '64px',
        display: 'flex',
        alignItems: 'center',
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '0 40px',
          width: '100%',
          maxWidth: '1280px',
          margin: '0 auto',
        }}>
          <span
            onClick={() => navigate('/')}
            style={{
              fontFamily: 'Space Grotesk, sans-serif',
              fontWeight: 700,
              fontSize: '20px',
              color: '#c9beff',
              letterSpacing: '0.15em',
              cursor: 'pointer'
            }}
          >
            NEXA VOTE
          </span>

          <div style={{ display: 'flex', gap: '8px' }}>
            <span className="material-symbols-outlined" style={{ color: '#41eec2' }}>lock</span>
            <span className="material-symbols-outlined" style={{ color: '#41eec2' }}>verified_user</span>
          </div>
        </div>
      </header>

      {/* MAIN */}
      <main style={{ paddingTop: '96px', paddingBottom: '48px', flex: 1 }}>
        <div style={{
          maxWidth: '800px',
          margin: '0 auto',
          padding: '0 24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '32px'
        }}>

          {/* STEPPER */}
          <Stepper steps={steps} currentStep={3} />

          {/* CARD */}
          <section style={{
            ...glassCard,
            borderRadius: '16px',
            padding: '32px',
            display: 'flex',
            flexDirection: 'column',
            gap: '24px'
          }}>

            {/* TITLE */}
            <div style={{ textAlign: 'center' }}>
              <h1 style={{
                fontFamily: 'Space Grotesk, sans-serif',
                fontSize: '28px',
                marginBottom: '8px'
              }}>
                Biometría - WebAuthn
              </h1>

              <p style={{ color: '#c9c3d9', fontSize: '14px' }}>
                Vincule su huella o llave de seguridad para continuar
              </p>
            </div>

            {/* FINGERPRINT VISUAL */}
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              padding: '20px'
            }}>
              <div style={{
                width: '180px',
                height: '180px',
                borderRadius: '50%',
                border: '2px dashed rgba(108,71,255,0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'rgba(108,71,255,0.05)'
              }}>
                <span className="material-symbols-outlined" style={{
                  fontSize: '64px',
                  color: '#c9beff'
                }}>
                  fingerprint
                </span>
              </div>
            </div>

            {/* BADGES */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
              {['FIDO2', 'U2F', 'AES-256'].map(t => (
                <div key={t} style={{
                  padding: '6px 12px',
                  borderRadius: '999px',
                  border: '1px solid rgba(255,255,255,0.1)',
                  fontSize: '11px',
                  color: '#c9c3d9'
                }}>
                  {t} COMPATIBLE
                </div>
              ))}
            </div>

            {/* INFO */}
            <div style={{
              background: 'rgba(108,71,255,0.08)',
              borderLeft: '3px solid #6c47ff',
              padding: '12px'
            }}>
              <p style={{ fontSize: '13px', color: '#c9c3d9' }}>
                WebAuthn utiliza criptografía de clave pública. Sus datos biométricos nunca salen del dispositivo.
              </p>
            </div>

            {/* BUTTONS */}
            <button style={{
              padding: '14px',
              borderRadius: '12px',
              background: '#6c47ff',
              border: 'none',
              color: '#fff',
              fontFamily: 'Space Grotesk',
              cursor: 'pointer'
            }}>
              Registrar Biométrico
            </button>

            <button
              onClick={() => navigate('/registro/verificacion')}
              style={{
                padding: '14px',
                borderRadius: '12px',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: '#c9c3d9',
                cursor: 'pointer'
              }}
            >
              Siguiente →
            </button>

          </section>

        </div>
      </main>

      {/* FOOTER */}
      <footer style={{
        padding: '24px',
        borderTop: '1px solid rgba(255,255,255,0.05)',
        textAlign: 'center',
        fontSize: '12px',
        color: '#c9c3d9'
      }}>
        © 2024 NEXA VOTE • AES-256 Encrypted
      </footer>

    </div>
  )
}