import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { loginVoter } from '../../services/api'

const glassCard = {
  background: 'rgba(19, 22, 42, 0.7)',
  backdropFilter: 'blur(12px)',
  border: '1px solid rgba(255, 255, 255, 0.06)',
}

export default function LoginVotante() {
  const navigate = useNavigate()

  const [dni, setDni] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async () => {
    setError('')

    if (!dni || !password) {
      setError('Ingrese DNI y contraseña')
      return
    }

    try {
      setLoading(true)

      const result = await loginVoter(dni, password)

      if (!result.success) {
        setError(result.message || 'Credenciales inválidas')
        return
      }

      localStorage.setItem('token', result.data.token)
      localStorage.setItem('voter', JSON.stringify(result.data.user))

      navigate('/mfa/escaneo')
    } catch (error) {
      setError('No se pudo conectar con el backend')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ background: '#14121c', color: '#e6e0ef', minHeight: '100vh', fontFamily: 'Inter, sans-serif', display: 'flex', flexDirection: 'column' }}>

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

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span className="material-symbols-outlined" style={{ color: '#c9beff', cursor: 'pointer' }}>lock</span>
            <span className="material-symbols-outlined" style={{ color: '#c9beff', cursor: 'pointer' }}>verified_user</span>
          </div>
        </div>
      </header>

      <main style={{
        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '96px 40px 48px', position: 'relative', overflow: 'hidden',
      }}>

        <div style={{
          position: 'absolute', top: '-10%', right: '-5%',
          width: '500px', height: '500px', pointerEvents: 'none',
          background: 'radial-gradient(circle at center, rgba(108,71,255,0.15) 0%, transparent 70%)',
        }} />

        <div style={{
          position: 'absolute', bottom: '-10%', left: '-5%',
          width: '400px', height: '400px', pointerEvents: 'none',
          background: 'radial-gradient(circle at center, rgba(65,238,194,0.08) 0%, transparent 70%)',
        }} />

        <div style={{ width: '100%', maxWidth: '480px', position: 'relative', zIndex: 10 }}>
          <div style={{ ...glassCard, padding: '48px', borderRadius: '16px', boxShadow: '0 24px 64px rgba(0,0,0,0.4)' }}>

            <div style={{ textAlign: 'center', marginBottom: '32px' }}>
              <div style={{
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                width: '64px', height: '64px', borderRadius: '50%',
                background: 'rgba(108,71,255,0.15)', border: '1px solid rgba(201,190,255,0.2)',
                marginBottom: '16px',
              }}>
                <span className="material-symbols-outlined" style={{ color: '#c9beff', fontSize: '32px' }}>fingerprint</span>
              </div>

              <h1 style={{
                fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700,
                fontSize: '28px', color: '#fff', marginBottom: '8px',
              }}>
                Acceso de Votante
              </h1>

              <p style={{ color: '#c9c3d9', fontSize: '14px', lineHeight: '20px', maxWidth: '280px', margin: '0 auto' }}>
                Ingrese sus credenciales para continuar con el proceso de sufragio.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{
                  fontFamily: 'Space Grotesk, sans-serif', fontSize: '12px',
                  color: '#c9c3d9', letterSpacing: '0.1em', fontWeight: 500,
                  textTransform: 'uppercase', paddingLeft: '4px',
                }}>
                  Número de DNI
                </label>

                <div style={{ position: 'relative' }}>
                  <span className="material-symbols-outlined" style={{
                    position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)',
                    color: '#938ea2', fontSize: '20px',
                  }}>badge</span>

                  <input
                    type="text"
                    value={dni}
                    onChange={(e) => setDni(e.target.value)}
                    placeholder="12345678"
                    style={{
                      width: '100%', background: '#0e0d17',
                      border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px',
                      padding: '14px 16px 14px 48px', color: '#e6e0ef',
                      fontFamily: 'Space Grotesk, sans-serif', fontSize: '14px',
                      outline: 'none', boxSizing: 'border-box',
                      transition: 'border-color 0.2s',
                    }}
                    onFocus={e => e.target.style.borderColor = '#6c47ff'}
                    onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{
                  fontFamily: 'Space Grotesk, sans-serif', fontSize: '12px',
                  color: '#c9c3d9', letterSpacing: '0.1em', fontWeight: 500,
                  textTransform: 'uppercase', paddingLeft: '4px',
                }}>
                  Contraseña
                </label>

                <div style={{ position: 'relative' }}>
                  <span className="material-symbols-outlined" style={{
                    position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)',
                    color: '#938ea2', fontSize: '20px',
                  }}>lock</span>

                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="123456"
                    style={{
                      width: '100%', background: '#0e0d17',
                      border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px',
                      padding: '14px 16px 14px 48px', color: '#e6e0ef',
                      fontFamily: 'Space Grotesk, sans-serif', fontSize: '14px',
                      outline: 'none', boxSizing: 'border-box',
                      transition: 'border-color 0.2s',
                    }}
                    onFocus={e => e.target.style.borderColor = '#6c47ff'}
                    onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                  />
                </div>
              </div>

              {error && (
                <div style={{
                  background: 'rgba(255, 80, 80, 0.12)',
                  border: '1px solid rgba(255, 80, 80, 0.25)',
                  color: '#ffb4ab',
                  padding: '12px',
                  borderRadius: '8px',
                  fontSize: '13px',
                  textAlign: 'center'
                }}>
                  {error}
                </div>
              )}

              <button
                onClick={handleLogin}
                disabled={loading}
                style={{
                  marginTop: '8px',
                  background: loading ? 'rgba(108,71,255,0.5)' : '#6c47ff',
                  color: '#fff',
                  border: 'none',
                  padding: '16px',
                  borderRadius: '8px',
                  fontWeight: 700,
                  fontSize: '16px',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  letterSpacing: '0.03em',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: '0 8px 32px rgba(108,71,255,0.3)',
                  transition: 'all 0.2s',
                }}
              >
                <span>{loading ? 'Validando...' : 'Iniciar Sesión'}</span>
                <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>arrow_forward</span>
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '32px' }}>
              {[
                { icon: 'shield_lock', label: 'Standard', value: 'AES-256' },
                { icon: 'enhanced_encryption', label: 'Estado', value: 'Encriptado' },
              ].map((badge) => (
                <div key={badge.value} style={{
                  display: 'flex', alignItems: 'center', gap: '10px',
                  padding: '12px', borderRadius: '8px',
                  background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.05)',
                }}>
                  <span className="material-symbols-outlined" style={{ color: '#41eec2', fontSize: '20px' }}>{badge.icon}</span>
                  <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                    <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '10px', color: '#c9c3d9', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{badge.label}</span>
                    <span style={{ fontSize: '13px', fontWeight: 600, color: '#e6e0ef', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{badge.value}</span>
                  </div>
                </div>
              ))}
            </div>

            <p style={{ textAlign: 'center', marginTop: '24px', fontSize: '13px', color: '#c9c3d9' }}>
              ¿Problemas con su acceso?{' '}
              <span style={{ color: '#c9beff', cursor: 'pointer', textDecoration: 'underline' }}>Contacte a Soporte Técnico</span>
            </p>

            <p style={{ textAlign: 'center', marginTop: '12px', fontSize: '13px', color: '#c9c3d9' }}>
              ¿No tiene cuenta?{' '}
              <span
                onClick={() => navigate('/registro')}
                style={{ color: '#c9beff', cursor: 'pointer', textDecoration: 'underline' }}
              >
                Registrarse
              </span>
            </p>

          </div>
        </div>
      </main>

      <footer style={{ background: '#14121c', borderTop: '1px solid rgba(255,255,255,0.05)', padding: '32px 40px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '1280px', margin: '0 auto', flexWrap: 'wrap', gap: '16px' }}>
          <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '12px', color: '#c9c3d9', letterSpacing: '0.1em' }}>
            © 2024 Institutional Voting Authority • Encrypted by AES-256
          </span>
        </div>
      </footer>
    </div>
  )
}