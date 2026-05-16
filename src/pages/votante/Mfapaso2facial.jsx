import { useNavigate } from 'react-router-dom'
import Footer from '../components/layout/footer/Footer'
import MFAStepper from '../components/ui/MFAStepper'

const glassPanel = {
  background: 'rgba(19, 22, 42, 0.8)',
  backdropFilter: 'blur(12px)',
  border: '1px solid rgba(255, 255, 255, 0.06)',
}

export default function MFAPaso2Facial() {
  const navigate = useNavigate()

  const handleFacialScan = () => {
    const token = localStorage.getItem('token')
    const dniValid = localStorage.getItem('dni_barcode_valid')

    if (!token) {
      alert('Debe iniciar sesión primero')
      navigate('/login')
      return
    }

    if (dniValid !== 'true') {
      alert('Primero debe completar la validación del DNI')
      navigate('/mfa/escaneo')
      return
    }

    localStorage.setItem('face_valid', 'true')
    navigate('/mfa/webauthn')
  }

  return (
    <div style={{ background: '#14121c', color: '#e6e0ef', minHeight: '100vh', fontFamily: 'Inter, sans-serif', display: 'flex', flexDirection: 'column' }}>

      <header style={{
        background: 'rgba(20,18,28,0.8)', backdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        position: 'sticky', top: 0, zIndex: 50,
      }}>
        <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 40px', maxWidth: '1280px', margin: '0 auto' }}>
          <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: '20px', color: '#e6e0ef' }}>
            NEXA VOTE
          </span>

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
          <MFAStepper currentStep={2} />
        </div>

        <div style={{ ...glassPanel, width: '100%', maxWidth: '680px', borderRadius: '12px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px', position: 'relative' }}>

          <div style={{ position: 'absolute', top: '16px', right: '16px', background: 'rgba(65,238,194,0.1)', border: '1px solid rgba(65,238,194,0.2)', padding: '4px 12px', borderRadius: '999px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span className="material-symbols-outlined" style={{ color: '#41eec2', fontSize: '16px' }}>verified</span>
            <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '10px', color: '#41eec2', letterSpacing: '0.1em' }}>
              ID VERIFIED
            </span>
          </div>

          <div style={{ textAlign: 'center', paddingTop: '8px' }}>
            <h1 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600, fontSize: '28px', marginBottom: '8px' }}>
              MFA Paso 2: Reconocimiento Facial
            </h1>
            <p style={{ color: '#c9c3d9', fontSize: '16px' }}>
              Posicione su rostro dentro del recuadro para continuar con la validación multifactor.
            </p>
          </div>

          <div style={{
            position: 'relative', width: '100%', maxWidth: '500px', margin: '0 auto',
            aspectRatio: '4/3', borderRadius: '8px', overflow: 'hidden',
            border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.4)',
          }}>
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ position: 'relative', width: '256px', height: '320px' }}>
                {[
                  { top: 0, left: 0, borderTop: '4px solid #6c47ff', borderLeft: '4px solid #6c47ff', borderRadius: '4px 0 0 0' },
                  { top: 0, right: 0, borderTop: '4px solid #6c47ff', borderRight: '4px solid #6c47ff', borderRadius: '0 4px 0 0' },
                  { bottom: 0, left: 0, borderBottom: '4px solid #6c47ff', borderLeft: '4px solid #6c47ff', borderRadius: '0 0 0 4px' },
                  { bottom: 0, right: 0, borderBottom: '4px solid #6c47ff', borderRight: '4px solid #6c47ff', borderRadius: '0 0 4px 0' },
                ].map((s, i) => (
                  <div key={i} style={{ position: 'absolute', width: '32px', height: '32px', ...s }} />
                ))}

                <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.2 }} fill="none" stroke="white" strokeWidth="0.5" viewBox="0 0 100 120">
                  <path d="M50 10C35 10 20 25 20 50C20 85 40 110 50 110C60 110 80 85 80 50C80 25 65 10 50 10Z" />
                </svg>
              </div>
            </div>

            <div style={{ position: 'absolute', bottom: '16px', left: 0, right: 0, display: 'flex', justifyContent: 'center' }}>
              <div style={{ background: 'rgba(20,18,28,0.9)', backdropFilter: 'blur(8px)', padding: '6px 16px', borderRadius: '999px', border: '1px solid rgba(108,71,255,0.3)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#41eec2', display: 'inline-block', animation: 'pulse 1.5s infinite' }} />
                <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '10px', color: '#e6e0ef', letterSpacing: '0.1em' }}>
                  CALIBRANDO SENSOR BIOMÉTRICO...
                </span>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
            <button
              onClick={handleFacialScan}
              style={{
                width: '100%', maxWidth: '320px', background: '#6c47ff', color: '#fff',
                border: 'none', borderRadius: '12px', padding: '16px',
                fontWeight: 600, fontSize: '16px', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px',
                boxShadow: '0 8px 24px rgba(108,71,255,0.2)', transition: 'all 0.2s',
              }}
              onMouseOver={e => e.currentTarget.style.filter = 'brightness(1.1)'}
              onMouseOut={e => e.currentTarget.style.filter = 'brightness(1)'}
            >
              <span className="material-symbols-outlined">videocam</span>
              Iniciar Escaneo
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#c9c3d9' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>lock_person</span>
              <span style={{ fontSize: '14px' }}>Validación facial simulada para MVP</span>
            </div>
          </div>

          <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '24px' }}>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start', background: 'rgba(255,255,255,0.05)', padding: '16px', borderRadius: '8px' }}>
              <span className="material-symbols-outlined" style={{ color: '#c9beff', flexShrink: 0 }}>info</span>
              <p style={{ color: '#c9c3d9', fontSize: '13px', lineHeight: '1.6', margin: 0 }}>
                En esta versión, la validación facial se registra como confirmación del paso biométrico. En producción se integraría con un servicio real de reconocimiento facial.
              </p>
            </div>
          </div>
        </div>

        <div style={{ width: '100%', maxWidth: '680px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '24px' }}>
          <div style={{ ...glassPanel, padding: '16px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderLeft: '4px solid #41eec2' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span className="material-symbols-outlined" style={{ color: '#41eec2' }}>id_card</span>
              <div>
                <p style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '12px', fontWeight: 600, margin: 0 }}>
                  DOCUMENTO IDENTIDAD
                </p>
                <p style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '10px', color: '#c9c3d9', letterSpacing: '0.1em', margin: 0 }}>
                  DNI ESCANEADO
                </p>
              </div>
            </div>
            <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '10px', color: '#41eec2', letterSpacing: '0.1em', fontWeight: 700 }}>
              VERIFICADO
            </span>
          </div>

          <div style={{ ...glassPanel, padding: '16px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', opacity: 0.5 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span className="material-symbols-outlined" style={{ color: '#938ea2' }}>key</span>
              <div>
                <p style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '12px', fontWeight: 600, margin: 0 }}>
                  WEBAUTHN TOKEN
                </p>
                <p style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '10px', color: '#c9c3d9', letterSpacing: '0.1em', margin: 0 }}>
                  PENDIENTE DE FIRMA
                </p>
              </div>
            </div>
            <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '10px', color: '#938ea2', letterSpacing: '0.1em' }}>
              PENDIENTE
            </span>
          </div>
        </div>
      </main>

      <Footer />

      <style>{`
        @keyframes pulse {
          0% { opacity: 0.4; }
          50% { opacity: 1; }
          100% { opacity: 0.4; }
        }
      `}</style>
    </div>
  )
}