import { useNavigate } from 'react-router-dom'

const glassCard = {
  background: 'rgba(19, 22, 42, 0.8)',
  backdropFilter: 'blur(12px)',
  border: '1px solid rgba(255, 255, 255, 0.06)',
}

const inputStyle = {
  width: '100%',
  background: '#201e29',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: '8px',
  padding: '12px 16px',
  color: '#e6e0ef',
  fontFamily: 'Inter, sans-serif',
  fontSize: '16px',
  outline: 'none',
  boxSizing: 'border-box',
  transition: 'border-color 0.2s',
}

const labelStyle = {
  display: 'block',
  fontFamily: 'Space Grotesk, sans-serif',
  fontSize: '12px',
  color: '#c9c3d9',
  letterSpacing: '0.1em',
  fontWeight: 500,
  textTransform: 'uppercase',
  marginBottom: '8px',
}

const steps = [
  { n: 1, label: 'Identidad' },
  { n: 2, label: 'Facial' },
  { n: 3, label: 'Biométrico' },
  { n: 4, label: 'Verificación' },
]

export default function RegistroIdentidad() {
  const navigate = useNavigate()
  const currentStep = 1

  return (
    <div style={{ background: '#14121c', color: '#e6e0ef', minHeight: '100vh', fontFamily: 'Inter, sans-serif', display: 'flex', flexDirection: 'column' }}>

      {/* Header */}
      <header style={{
        position: 'fixed', top: 0, width: '100%', zIndex: 50,
        background: 'rgba(20,18,28,0.8)', backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.1)', height: '64px',
        display: 'flex', alignItems: 'center',
      }}>
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '0 40px', width: '100%', maxWidth: '1280px', margin: '0 auto',
        }}>
          <span
            onClick={() => navigate('/')}
            style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: '20px', color: '#c9beff', letterSpacing: '0.15em', cursor: 'pointer' }}
          >
            NEXA VOTE
          </span>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            padding: '4px 12px', background: 'rgba(255,255,255,0.05)',
            borderRadius: '999px', border: '1px solid rgba(255,255,255,0.1)',
          }}>
            <span className="material-symbols-outlined" style={{ color: '#41eec2', fontSize: '16px' }}>verified_user</span>
            <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '11px', color: '#c9c3d9', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              Sesión Encriptada
            </span>
          </div>
        </div>
      </header>

      {/* Main */}
      <main style={{ paddingTop: '96px', paddingBottom: '48px', flex: 1 }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 24px', display: 'flex', flexDirection: 'column', gap: '32px' }}>

          {/* Progress Stepper */}
          <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
            {steps.map((step, i) => (
              <div key={step.n} style={{ display: 'flex', alignItems: 'center', flex: i < steps.length - 1 ? 1 : 'unset' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', minWidth: '80px' }}>
                  <div style={{
                    width: '40px', height: '40px', borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700,
                    ...(step.n === currentStep
                      ? { background: '#6c47ff', color: '#fff', boxShadow: '0 0 0 4px rgba(108,71,255,0.2)' }
                      : { border: '2px solid rgba(255,255,255,0.2)', color: '#c9c3d9', opacity: 0.4 }
                    ),
                  }}>
                    {step.n}
                  </div>
                  <span style={{
                    fontFamily: 'Space Grotesk, sans-serif', fontSize: '12px', fontWeight: 600,
                    letterSpacing: '0.05em', textAlign: 'center',
                    color: step.n === currentStep ? '#c9beff' : '#c9c3d9',
                    opacity: step.n === currentStep ? 1 : 0.4,
                  }}>
                    {step.label}
                  </span>
                </div>
                {i < steps.length - 1 && (
                  <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.1)', marginBottom: '24px', marginLeft: '8px', marginRight: '8px' }} />
                )}
              </div>
            ))}
          </nav>

          {/* Title */}
          <div style={{ textAlign: 'center' }}>
            <h1 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: '28px', color: '#fff', marginBottom: '12px' }}>
              Validación de Identidad
            </h1>
            <p style={{ color: '#c9c3d9', fontSize: '16px', lineHeight: '24px', maxWidth: '480px', margin: '0 auto' }}>
              Complete sus datos personales y proporcione una copia digital de su documento oficial para continuar.
            </p>
          </div>

          {/* Form section */}
          <section style={{ ...glassCard, borderRadius: '16px', padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px' }}>

            {/* Nombre completo */}
            <div>
              <label style={labelStyle}>Nombre completo</label>
              <input
                type="text"
                placeholder="Ej. Juan Pérez García"
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = '#6c47ff'}
                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
              />
            </div>

            {/* Fecha + DNI */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
              <div>
                <label style={labelStyle}>Fecha de nacimiento</label>
                <input
                  type="date"
                  style={{ ...inputStyle, colorScheme: 'dark' }}
                  onFocus={e => e.target.style.borderColor = '#6c47ff'}
                  onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                />
              </div>
              <div>
                <label style={labelStyle}>Número de DNI</label>
                <input
                  type="text"
                  placeholder="00000000-0"
                  style={inputStyle}
                  onFocus={e => e.target.style.borderColor = '#6c47ff'}
                  onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                />
              </div>
            </div>

            {/* Dirección */}
            <div>
              <label style={labelStyle}>Dirección de residencia</label>
              <textarea
                placeholder="Calle, número, departamento y ciudad"
                rows={3}
                style={{ ...inputStyle, resize: 'none' }}
                onFocus={e => e.target.style.borderColor = '#6c47ff'}
                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
              />
            </div>
          </section>

          {/* Document scan section */}
          <section style={{
            ...glassCard,
            borderRadius: '16px', padding: '32px',
            border: '2px dashed rgba(108,71,255,0.3)',
            background: 'rgba(108,71,255,0.04)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px', textAlign: 'center',
          }}>
            <div style={{
              width: '64px', height: '64px', borderRadius: '50%',
              background: 'rgba(108,71,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <span className="material-symbols-outlined" style={{ color: '#6c47ff', fontSize: '36px', fontVariationSettings: "'wght' 300" }}>document_scanner</span>
            </div>

            <div>
              <h3 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600, fontSize: '22px', color: '#fff', marginBottom: '8px' }}>
                Escaneo de DNI
              </h3>
              <p style={{ color: '#c9c3d9', fontSize: '16px', maxWidth: '360px' }}>
                Capture el anverso y reverso de su documento de identidad con buena iluminación.
              </p>
            </div>

            {/* Scan preview area */}
            <div style={{
              width: '100%', maxWidth: '480px', aspectRatio: '1.6 / 1',
              borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)',
              overflow: 'hidden', position: 'relative', cursor: 'pointer',
              background: 'rgba(0,0,0,0.4)',
            }}>
              <div style={{
                position: 'absolute', inset: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <button style={{
                  display: 'flex', alignItems: 'center', gap: '8px',
                  background: '#6c47ff', color: '#fff',
                  padding: '12px 24px', borderRadius: '999px',
                  fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600,
                  fontSize: '14px', border: 'none', cursor: 'pointer',
                  boxShadow: '0 8px 24px rgba(108,71,255,0.3)',
                  transition: 'transform 0.2s',
                }}
                  onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'}
                  onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>photo_camera</span>
                  Iniciar Escaneo
                </button>
              </div>
            </div>

            {/* Tips */}
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
              {['Luz Natural', 'Sin Reflejos'].map(tip => (
                <div key={tip} style={{
                  display: 'flex', alignItems: 'center', gap: '6px',
                  padding: '4px 12px', background: 'rgba(255,255,255,0.05)',
                  borderRadius: '999px', border: '1px solid rgba(255,255,255,0.05)',
                }}>
                  <span className="material-symbols-outlined" style={{ color: '#41eec2', fontSize: '14px' }}>check_circle</span>
                  <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '11px', color: '#c9c3d9', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{tip}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Navigation */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '8px', gap: '16px', flexWrap: 'wrap' }}>
            <button
              onClick={() => navigate('/')}
              style={{
                padding: '14px 32px', border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '999px', background: 'transparent', color: '#c9c3d9',
                fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600, fontSize: '14px',
                cursor: 'pointer', transition: 'background 0.2s', letterSpacing: '0.05em',
              }}
              onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
              onMouseOut={e => e.currentTarget.style.background = 'transparent'}
            >
              Cancelar proceso
            </button>
            <button
              onClick={() => navigate('/registro/reconocimiento')}
              style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                padding: '14px 48px', background: '#6c47ff',
                borderRadius: '999px', border: 'none', color: '#fff',
                fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600, fontSize: '14px',
                cursor: 'pointer', letterSpacing: '0.05em',
                boxShadow: '0 8px 24px rgba(108,71,255,0.25)',
                transition: 'opacity 0.2s',
              }}
              onMouseOver={e => e.currentTarget.style.opacity = '0.9'}
              onMouseOut={e => e.currentTarget.style.opacity = '1'}
            >
              Continuar
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>arrow_forward</span>
            </button>
          </div>

          {/* Trust indicator */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', opacity: 0.4 }}>
            <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>lock</span>
            <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              Encriptación AES-256 de Grado Militar
            </span>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer style={{ background: '#14121c', borderTop: '1px solid rgba(255,255,255,0.05)', padding: '32px 40px', marginTop: '48px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '1280px', margin: '0 auto', flexWrap: 'wrap', gap: '16px' }}>
          <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '12px', color: '#c9c3d9', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            © 2024 NEXA VOTE • Encrypted by AES-256
          </span>
          <div style={{ display: 'flex', gap: '16px' }}>
            {['Privacy Policy', 'Security Protocol', 'Audit Status'].map(link => (
              <span key={link} style={{ color: '#c9c3d9', fontSize: '12px', textDecoration: 'underline', cursor: 'pointer', fontFamily: 'Space Grotesk, sans-serif', letterSpacing: '0.05em' }}>{link}</span>
            ))}
          </div>
        </div>
      </footer>

    </div>
  )
}