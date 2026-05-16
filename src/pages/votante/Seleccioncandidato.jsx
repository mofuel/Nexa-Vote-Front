import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Footer from '../components/layout/footer/Footer'
import { getCandidates, castVote } from '../../services/api'

const glassCard = {
  background: '#13162A',
  backdropFilter: 'blur(12px)',
  border: '1px solid rgba(255, 255, 255, 0.06)',
}

const glassCardSelected = {
  background: '#13162A',
  backdropFilter: 'blur(12px)',
  border: '2px solid #6C47FF',
  boxShadow: 'inset 0 0 15px rgba(108, 71, 255, 0.2)',
}

export default function SeleccionCandidato() {
  const navigate = useNavigate()

  const [candidates, setCandidates] = useState([])
  const [selected, setSelected] = useState(null)
  const [loading, setLoading] = useState(true)
  const [voting, setVoting] = useState(false)
  const [message, setMessage] = useState('')

  const selectedCandidate = candidates.find(c => c.id === selected)

  useEffect(() => {
    async function loadCandidates() {
      try {
        const result = await getCandidates()

        if (result.success) {
          setCandidates(result.data)
        } else {
          setMessage(result.message || 'No se pudieron obtener los candidatos')
        }
      } catch (error) {
        setMessage('Error de conexión con el backend')
      } finally {
        setLoading(false)
      }
    }

    loadCandidates()
  }, [])

  const handleConfirmVote = async () => {
    const token = localStorage.getItem('token')

    if (!token) {
      alert('Debe iniciar sesión primero')
      navigate('/login')
      return
    }

    if (!selected) {
      setMessage('Seleccione un candidato antes de confirmar')
      return
    }

    try {
      setVoting(true)
      setMessage('')

      const result = await castVote(token, selected)

      if (!result.success) {
        setMessage(result.message || 'No se pudo registrar el voto')
        return
      }

      setMessage('Voto registrado correctamente')

      setTimeout(() => {
        navigate('/')
      }, 1200)

    } catch (error) {
      setMessage('Error al conectar con el backend')
    } finally {
      setVoting(false)
    }
  }

  return (
    <div style={{ background: '#0A0C14', color: '#e6e0ef', minHeight: '100vh', fontFamily: 'Inter, sans-serif' }}>

      <header style={{
        position: 'fixed', top: 0, width: '100%', zIndex: 50,
        background: 'rgba(20,18,28,0.8)', backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.1)', height: '64px',
        display: 'flex', alignItems: 'center',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 40px', width: '100%', maxWidth: '1280px', margin: '0 auto' }}>
          <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: '20px', color: '#c9beff', letterSpacing: '0.15em' }}>
            NEXA VOTE
          </span>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ display: 'flex', gap: '24px', marginRight: '16px' }}>
              {['Resultados', 'Cédula', 'Recursos'].map((item, i) => (
                <span key={item} style={{
                  color: i === 1 ? '#c9beff' : '#c9c3d9',
                  cursor: 'pointer',
                  fontWeight: i === 1 ? 700 : 400,
                  fontSize: '15px',
                  borderBottom: i === 1 ? '2px solid #c9beff' : 'none',
                  paddingBottom: i === 1 ? '4px' : '0',
                }}>
                  {item}
                </span>
              ))}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '4px 12px', background: '#201e29', borderRadius: '999px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <span className="material-symbols-outlined" style={{ color: '#41eec2', fontSize: '18px' }}>verified_user</span>
              <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '11px', color: '#c9c3d9', letterSpacing: '0.1em' }}>
                ID VERIFIED
              </span>
            </div>

            <span className="material-symbols-outlined" style={{ color: '#c9c3d9', cursor: 'pointer' }}>
              lock
            </span>
          </div>
        </div>
      </header>

      <main style={{ paddingTop: '96px', paddingBottom: '192px', maxWidth: '1280px', margin: '0 auto', padding: '96px 40px 192px' }}>

        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '40px' }}>
          <div style={{ display: 'flex', alignItems: 'center', width: '100%', maxWidth: '400px', gap: '8px' }}>
            <div style={{ height: '6px', flex: 1, background: '#41eec2', borderRadius: '999px' }} />
            <div style={{ height: '6px', flex: 1, background: '#41eec2', borderRadius: '999px' }} />
            <div style={{ height: '6px', flex: 1, background: '#6c47ff', borderRadius: '999px' }} />
          </div>
        </div>

        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <h1 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 'clamp(28px, 5vw, 48px)', marginBottom: '8px' }}>
            Cédula de Votación
          </h1>
          <p style={{ color: '#c9c3d9', fontSize: '18px', maxWidth: '600px', margin: '0 auto' }}>
            Seleccione un candidato. El sistema permitirá emitir el voto una sola vez.
          </p>
        </div>

        {loading && (
          <div style={{ textAlign: 'center', color: '#c9c3d9', fontSize: '16px' }}>
            Cargando candidatos...
          </div>
        )}

        {!loading && candidates.length === 0 && (
          <div style={{ textAlign: 'center', color: '#ffb4ab', fontSize: '16px' }}>
            No hay candidatos disponibles.
          </div>
        )}

        {!loading && candidates.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
            {candidates.map((candidate) => (
              <div
                key={candidate.id}
                onClick={() => setSelected(candidate.id)}
                style={{
                  ...(selected === candidate.id ? glassCardSelected : glassCard),
                  padding: '24px',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  transform: selected === candidate.id ? 'scale(1.02)' : 'scale(1)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
                  <div style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    background: selected === candidate.id ? 'rgba(108,71,255,0.2)' : '#201e29',
                    border: `2px solid ${selected === candidate.id ? '#6c47ff' : 'rgba(255,255,255,0.1)'}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <span className="material-symbols-outlined" style={{ color: '#c9beff', fontSize: '32px' }}>
                      person
                    </span>
                  </div>

                  <div style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    background: selected === candidate.id ? '#6c47ff' : 'transparent',
                    border: `2px solid ${selected === candidate.id ? '#6c47ff' : 'rgba(255,255,255,0.2)'}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: selected === candidate.id ? '0 0 10px rgba(108,71,255,0.6)' : 'none',
                  }}>
                    {selected === candidate.id && (
                      <span className="material-symbols-outlined" style={{ color: '#fff', fontSize: '14px' }}>
                        check
                      </span>
                    )}
                  </div>
                </div>

                <h3 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600, fontSize: '20px', marginBottom: '4px' }}>
                  {candidate.name}
                </h3>

                <p style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '11px', color: '#41eec2', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '16px' }}>
                  {candidate.party}
                </p>

                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {['CANDIDATO', 'OFICIAL'].map(tag => (
                    <span key={tag} style={{
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '10px',
                      fontWeight: 700,
                      fontFamily: 'Space Grotesk, sans-serif',
                      letterSpacing: '0.08em',
                      background: selected === candidate.id ? 'rgba(108,71,255,0.2)' : '#201e29',
                      color: selected === candidate.id ? '#c9beff' : '#c9c3d9',
                    }}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {message && (
          <div style={{
            margin: '32px auto 0',
            maxWidth: '520px',
            textAlign: 'center',
            padding: '14px 18px',
            borderRadius: '12px',
            background: message.includes('correctamente') ? 'rgba(65,238,194,0.08)' : 'rgba(255,80,80,0.10)',
            border: message.includes('correctamente') ? '1px solid rgba(65,238,194,0.25)' : '1px solid rgba(255,80,80,0.25)',
            color: message.includes('correctamente') ? '#41eec2' : '#ffb4ab',
            fontSize: '14px'
          }}>
            {message}
          </div>
        )}
      </main>

      <div style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        width: '100%',
        padding: '16px 24px',
        background: 'rgba(20,18,28,0.9)',
        backdropFilter: 'blur(20px)',
        borderTop: '1px solid rgba(255,255,255,0.1)',
        zIndex: 50,
      }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            <div>
              <p style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '10px', color: '#c9c3d9', textTransform: 'uppercase', letterSpacing: '0.1em', margin: 0 }}>
                Selección Actual
              </p>
              <p style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600, fontSize: '20px', color: '#c9beff', margin: 0 }}>
                {selectedCandidate?.name || 'Ninguno'}
              </p>
            </div>

            <div style={{ height: '32px', width: '1px', background: 'rgba(255,255,255,0.1)' }} />

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span className="material-symbols-outlined" style={{ color: '#41eec2', fontSize: '16px' }}>
                shield
              </span>
              <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '13px', color: '#41eec2', fontWeight: 700 }}>
                JWT PROTECTED
              </span>
            </div>
          </div>

          <button
            onClick={handleConfirmVote}
            disabled={voting}
            style={{
              padding: '14px 48px',
              background: voting ? 'rgba(108,71,255,0.5)' : '#6c47ff',
              color: '#fff',
              border: 'none',
              borderRadius: '999px',
              fontFamily: 'Space Grotesk, sans-serif',
              fontWeight: 700,
              fontSize: '18px',
              cursor: voting ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              boxShadow: '0 0 30px rgba(108,71,255,0.4)',
              transition: 'all 0.2s',
            }}
          >
            {voting ? 'Registrando...' : 'Confirmar Voto'}
            <span className="material-symbols-outlined">send</span>
          </button>
        </div>
      </div>

      <div style={{
        position: 'fixed',
        bottom: '128px',
        left: '40px',
        zIndex: 40,
        background: 'rgba(28,26,37,0.9)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255,255,255,0.06)',
        padding: '12px 16px',
        borderRadius: '12px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
      }}>
        <span className="material-symbols-outlined" style={{ color: '#41eec2' }}>
          security
        </span>

        <div>
          <p style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '10px', color: '#c9c3d9', letterSpacing: '0.1em', margin: 0 }}>
            SESSION
          </p>
          <p style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '12px', color: '#41eec2', margin: 0 }}>
            AUTHENTICATED
          </p>
        </div>
      </div>

      <Footer />
    </div>
  )
}