import { useNavigate } from 'react-router-dom'
import Footer from '../components/layout/footer/Footer'
import MFAStepper from '../components/ui/MFAStepper'

const glassPanel = {
  background: 'rgba(19, 22, 42, 0.8)',
  backdropFilter: 'blur(12px)',
  border: '1px solid rgba(255, 255, 255, 0.06)',
}

export default function MFAPaso1DNI() {
  const navigate = useNavigate()

  const handleDNIScan = () => {
    const token = localStorage.getItem('token')

    if (!token) {
      alert('Debe iniciar sesión primero')
      navigate('/login')
      return
    }

    localStorage.setItem('dni_barcode_valid', 'true')
    navigate('/mfa/facial')
  }

  return (
    <div style={{ background: '#14121c', color: '#e6e0ef', minHeight: '100vh', fontFamily: 'Inter, sans-serif', display: 'flex', flexDirection: 'column' }}>

      <header style={{
        background: 'rgba(20,18,28,0.8)', backdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        position: 'sticky', top: 0, zIndex: 50,
      }}>
        <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 40px', maxWidth: '1280px', margin: '0 auto' }}>
          <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: '20px', color: '#e6e0ef' }}>NEXA VOTE</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span className="material-symbols-outlined" style={{ color: '#c9beff' }}>security</span>
            <button style={{ background: '#6c47ff', color: '#fff', border: 'none', padding: '8px 24px', borderRadius: '4px', fontWeight: 700, fontSize: '14px', cursor: 'pointer' }}>
              Secure Login
            </button>
          </div>
        </nav>
      </header>

      <main style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '48px 16px' }}>

        <div style={{ width: '100%', maxWidth: '680px', marginBottom: '48px' }}>
          <MFAStepper currentStep={1} />
        </div>

        <div style={{ ...glassPanel, width: '100%', maxWidth: '680px', borderRadius: '12px', overflow: 'hidden', padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>

          <div style={{ textAlign: 'center' }}>
            <h1 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600, fontSize: '28px', marginBottom: '8px' }}>
              Validación de Identidad
            </h1>
            <p style={{ color: '#c9c3d9', fontSize: '16px' }}>
              Coloque el reverso de su DNI dentro del marco
            </p>
          </div>

          <div style={{
            position: 'relative', aspectRatio: '1.586 / 1', background: '#0A0C14',
            borderRadius: '8px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)',
          }}>
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ width: '80%', height: '80%', border: '2px dashed rgba(108,71,255,0.5)', borderRadius: '8px', position: 'relative' }}>
                {[
                  { top: '-4px', left: '-4px', borderTop: '4px solid #6c47ff', borderLeft: '4px solid #6c47ff' },
                  { top: '-4px', right: '-4px', borderTop: '4px solid #6c47ff', borderRight: '4px solid #6c47ff' },
                  { bottom: '-4px', left: '-4px', borderBottom: '4px solid #6c47ff', borderLeft: '4px solid #6c47ff' },
                  { bottom: '-4px', right: '-4px', borderBottom: '4px solid #6c47ff', borderRight: '4px solid #6c47ff' },
                ].map((s, i) => (
                  <div key={i} style={{ position: 'absolute', width: '24px', height: '24px', ...s }} />
                ))}

                <div style={{
                  position: 'absolute', width: '100%', height: '4px',
                  background: 'linear-gradient(to bottom, transparent, #6c47ff, transparent)',
                  animation: 'scan 3s linear infinite',
                }} />
              </div>
            </div>

            <div style={{ position: 'absolute', top: '16px', right: '16px', ...glassPanel, padding: '4px 12px', borderRadius: '999px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#41eec2', display: 'inline-block' }} />
              <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '11px', color: '#41eec2', letterSpacing: '0.1em' }}>
                Live Stream Secure
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <button
              onClick={handleDNIScan}
              style={{
                background: '#6c47ff', color: '#fff', border: 'none',
                height: '56px', borderRadius: '8px', fontFamily: 'Space Grotesk, sans-serif',
                fontWeight: 600, fontSize: '18px', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                transition: 'all 0.2s',
              }}
              onMouseOver={e => e.currentTarget.style.filter = 'brightness(1.1)'}
              onMouseOut={e => e.currentTarget.style.filter = 'brightness(1)'}
            >
              <span className="material-symbols-outlined">camera</span>
              Iniciar Escaneo
            </button>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', background: 'rgba(255,255,255,0.05)', padding: '16px', borderRadius: '8px' }}>
              <span className="material-symbols-outlined" style={{ color: '#c9beff', flexShrink: 0 }}>shield_lock</span>
              <p style={{ color: '#c9c3d9', fontSize: '13px', lineHeight: '1.6', margin: 0 }}>
                En esta versión MVP, el escaneo del DNI se registra como una validación simulada del código de barras.
              </p>
            </div>
          </div>
        </div>

        <div style={{ width: '100%', maxWidth: '680px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '24px' }}>
          {[
            { step: 'Paso 2', label: 'Reconocimiento Facial' },
            { step: 'Paso 3', label: 'WebAuthn Biométrico' },
          ].map((item) => (
            <div key={item.step} style={{ ...glassPanel, padding: '16px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '16px', opacity: 0.5 }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#201e29', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span className="material-symbols-outlined" style={{ color: '#938ea2' }}>pending</span>
              </div>
              <div>
                <p style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '11px', color: '#938ea2', textTransform: 'uppercase', letterSpacing: '0.1em', margin: 0 }}>{item.step}</p>
                <p style={{ fontSize: '14px', color: '#c9c3d9', margin: 0, fontWeight: 600 }}>{item.label}</p>
              </div>
            </div>
          ))}
        </div>
      </main>

      <Footer />

      <style>{`
        @keyframes scan {
          0% { top: 0%; }
          100% { top: 100%; }
        }
      `}</style>
    </div>
  )
}