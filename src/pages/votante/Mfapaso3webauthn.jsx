import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Footer from '../components/layout/footer/Footer'
import MFAStepper from '../components/ui/MFAStepper'
import { validateMultifactor } from '../../services/api'

const glassPanel = {
  background: '#13162A',
  backdropFilter: 'blur(12px)',
  border: '1px solid rgba(255, 255, 255, 0.06)',
}

export default function MFAPaso3WebAuthn() {
  const navigate = useNavigate()

  const [loading, setLoading] = useState(false)
  const [statusMessage, setStatusMessage] = useState('')

  const handleWebAuthnValidation = async () => {
    const token = localStorage.getItem('token')
    const dniValid = localStorage.getItem('dni_barcode_valid')
    const faceValid = localStorage.getItem('face_valid')

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

    if (faceValid !== 'true') {
      alert('Primero debe completar la validación facial')
      navigate('/mfa/facial')
      return
    }

    try {
      setLoading(true)
      setStatusMessage('Solicitando autenticación biométrica del dispositivo...')

      if (!window.PublicKeyCredential) {
        alert('Este navegador no soporta WebAuthn')
        return
      }

      /*
        MVP WebAuthn:
        En producción, el challenge debe generarse en el backend.
        Para la demo, simulamos el challenge en frontend y usamos WebAuthn
        para activar Touch ID, huella Android, Face ID o autenticador local.
      */
      const challenge = new Uint8Array(32)
      window.crypto.getRandomValues(challenge)

      const userId = new Uint8Array(16)
      window.crypto.getRandomValues(userId)

      await navigator.credentials.create({
        publicKey: {
          challenge,
          rp: {
            name: 'NEXA Vote'
          },
          user: {
            id: userId,
            name: 'votante@nexavote.test',
            displayName: 'Votante NEXA'
          },
          pubKeyCredParams: [
            { type: 'public-key', alg: -7 },
            { type: 'public-key', alg: -257 }
          ],
          authenticatorSelection: {
            authenticatorAttachment: 'platform',
            userVerification: 'required'
          },
          timeout: 60000,
          attestation: 'none'
        }
      })

      localStorage.setItem('fingerprint_valid', 'true')

      const result = await validateMultifactor(token, {
        dni_barcode_valid: true,
        face_valid: true,
        fingerprint_valid: true
      })

      if (!result.success) {
        alert(result.message || 'No se pudo completar la validación multifactor')
        return
      }

      setStatusMessage('Validación multifactor completada correctamente')
      navigate('/candidatos')

    } catch (error) {
      console.error(error)
      alert('La autenticación biométrica fue cancelada o falló')
    } finally {
      setLoading(false)
    }
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
            <span className="material-symbols-outlined" style={{ color: '#c9c3d9' }}>security</span>
            <button style={{ background: '#6c47ff', color: '#fff', border: 'none', padding: '8px 24px', borderRadius: '8px', fontWeight: 700, fontSize: '14px', cursor: 'pointer' }}>
              Secure Login
            </button>
          </div>
        </nav>
      </header>

      <main style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '48px 16px' }}>

        <div style={{ width: '100%', maxWidth: '680px', marginBottom: '48px' }}>
          <MFAStepper currentStep={3} />
        </div>

        <section style={{ width: '100%', maxWidth: '680px' }}>
          <div style={{ ...glassPanel, borderRadius: '12px', padding: '48px 32px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>

            <div style={{ position: 'relative', width: '128px', height: '128px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '32px' }}>
              <div style={{
                position: 'absolute', inset: 0, borderRadius: '50%',
                background: 'rgba(108,71,255,0.1)',
                animation: 'pulse 2s infinite',
              }} />

              <div style={{
                position: 'relative', zIndex: 10,
                background: 'rgba(108,71,255,0.2)', padding: '24px', borderRadius: '50%',
                border: '1px solid rgba(108,71,255,0.3)',
              }}>
                <span className="material-symbols-outlined" style={{ color: '#6c47ff', fontSize: '64px' }}>
                  fingerprint
                </span>
              </div>
            </div>

            <h1 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600, fontSize: '28px', marginBottom: '12px' }}>
              Biométrico WebAuthn
            </h1>

            <p style={{ color: '#c9c3d9', fontSize: '18px', maxWidth: '430px', lineHeight: '28px', marginBottom: '32px' }}>
              Use Touch ID, huella Android, Face ID o el autenticador seguro de su dispositivo para completar la validación multifactor.
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '12px', marginBottom: '32px' }}>
              {[
                { icon: 'verified_user', label: 'Paso 1: Escaneo DNI' },
                { icon: 'check_circle', label: 'Paso 2: Reconocimiento Facial' },
              ].map((chip) => (
                <div key={chip.label} style={{
                  display: 'flex', alignItems: 'center', gap: '8px',
                  padding: '6px 12px', background: 'rgba(255,255,255,0.05)',
                  borderRadius: '999px', border: '1px solid rgba(255,255,255,0.1)',
                }}>
                  <span className="material-symbols-outlined" style={{ color: '#41eec2', fontSize: '16px' }}>
                    {chip.icon}
                  </span>
                  <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '11px', color: '#c9c3d9', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                    {chip.label}
                  </span>
                </div>
              ))}
            </div>

            {statusMessage && (
              <div style={{
                marginBottom: '20px',
                padding: '12px 16px',
                borderRadius: '8px',
                background: 'rgba(65,238,194,0.08)',
                border: '1px solid rgba(65,238,194,0.18)',
                color: '#41eec2',
                fontSize: '13px'
              }}>
                {statusMessage}
              </div>
            )}

            <button
              onClick={handleWebAuthnValidation}
              disabled={loading}
              style={{
                background: loading ? 'rgba(108,71,255,0.5)' : '#6c47ff',
                color: '#fff',
                border: 'none',
                padding: '16px 48px',
                borderRadius: '12px',
                fontWeight: 600,
                fontSize: '18px',
                cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                boxShadow: '0 8px 32px rgba(108,71,255,0.3)',
                marginBottom: '24px',
                transition: 'all 0.2s',
              }}
              onMouseOver={e => {
                if (!loading) e.currentTarget.style.filter = 'brightness(1.1)'
              }}
              onMouseOut={e => {
                e.currentTarget.style.filter = 'brightness(1)'
              }}
            >
              <span className="material-symbols-outlined">lock</span>
              {loading ? 'Validando...' : 'Registrar Biométrico WebAuthn'}
            </button>

            <div style={{
              padding: '16px', borderRadius: '8px',
              background: '#1c1a25', border: '1px solid rgba(255,255,255,0.05)',
              display: 'flex', gap: '16px', alignItems: 'flex-start', textAlign: 'left',
            }}>
              <span className="material-symbols-outlined" style={{ color: '#6c47ff', flexShrink: 0 }}>
                encrypted
              </span>

              <p style={{ color: '#c9c3d9', fontSize: '14px', lineHeight: '1.6', margin: 0 }}>
                WebAuthn permite validar la biometría desde el dispositivo del usuario sin enviar ni almacenar la huella real en el servidor. El backend solo recibe el resultado de validación para habilitar el voto.
              </p>
            </div>
          </div>
        </section>

        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '24px', marginTop: '32px', opacity: 0.6 }}>
          {[
            { icon: 'lock', label: 'E2E ENCRYPTED' },
            { icon: 'verified', label: 'BIOMETRIC VERIFIED' },
            { icon: 'shield', label: 'AUDIT COMPLIANT' },
          ].map((badge) => (
            <div key={badge.label} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="material-symbols-outlined" style={{ color: '#e6e0ef', fontSize: '18px' }}>
                {badge.icon}
              </span>
              <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '12px', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                {badge.label}
              </span>
            </div>
          ))}
        </div>
      </main>

      <Footer />

      <style>{`
        @keyframes pulse {
          0%   { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(108, 71, 255, 0.7); }
          70%  { transform: scale(1);    box-shadow: 0 0 0 20px rgba(108, 71, 255, 0); }
          100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(108, 71, 255, 0); }
        }
      `}</style>
    </div>
  )
}