import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Footer from '../components/layout/footer/Footer'

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

const candidates = [
  {
    id: 1, name: 'Dr. Alistair Thorne', party: 'Integrity Alliance',
    tags: ['STABILITY', 'EXPERIENCE'],
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA-e0TNmiiNpxhido5qlQNy1piZ-_EqDUbC9NwRDjWtXVIQC6YyhMz_7CHxfsxvbsR_VW_6sMizr7CSYbUxSFDdbMRMXUyu028nMy6NLVDdqVQMhB7WpY-DNL3qZ3zAVjV6aJJ0hhO5yyk6OZOXSQkwYQIDg1e1HAd22cx_csiSHOXSil3qY3lagpKSvHkb6ktHXFfm5iWC1vM6yf8jvNn9cbaDq4H8SmunmFrQXEE-uvWNYz9JnFJZqEsJqEu0GXzcEViB7Ejk6f4',
  },
  {
    id: 2, name: 'Elena Vance', party: 'Progress Network',
    tags: ['INNOVATION', 'TRANSPARENCY'],
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAbQRPF0G-S0d52o_wyU1TdJMziHr6FbvJlaIEZAbjrITHsbwziDOVdQIphIEjMjsBekR1W_dNSuu_28LOrNtpaZw7x4YUiyJpYkJvKk2CjUjJgxwAVyICa9oadjAYaZYvKaZJu1OEe6MksCausjeVO92htXLwT1za6d7eequKunx3gRMZFSw5_SwTyblKjvqRSpgVi0_yyGaDhgrK-uL7zJGswHCPFZla5vpN5re1zBtFxfeWtoEUav8Viow3FnbtRggbzth05E5E',
  },
  {
    id: 3, name: 'Marcus Sterling', party: 'Liberty Core',
    tags: ['REFORM', 'AUTONOMY'],
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDH1wZqH73ahj6X2PJE1SZjJzvNVn4RqLP1A4YcMtSNFBk7mGTfVzjmQPRhVrPVdKPcXKbrziitKLqDLTjDF7hgMenSkWy_thwFwaKi3C1uGdOpam4JdT2WuwLvR8hEsfuE9XWsFOpbIs7rv49TXQDrPr1s2s9zIspixGU9OVgJE9b8zTtvUoAyxTJzW1SDLKS3P58vKpdj5HsDKhFsUgFGJe7pmdBDzElDA3Ddg32b9kkWM4lSOHUtk9HG8O2h90lzpqfMZQNgVsI',
  },
  {
    id: 4, name: 'Julianna Reed', party: 'Tradition Union',
    tags: ['HERITAGE', 'ETHICS'],
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAad8Xs-ENz6LddFCEEdOg7vGLhZ0KDKgFykNPXwldMrzSluOUEgsuoZykVgMllL2pNZDmuf9t2KQG6NWj2WZ8H36k12TZuppPx3JkrWNLKEKVCW7fwViCoSAk5HBmHB242Ci82ASeGulOfhDEIXr4pqTZlhuyRLRQx3j0TbBl2N_-A_XZuT9SWP0nEF_bnZ-eqEkC-lyZdBpJWJ1HgKNFAvs-TO7PvLYyFXgm-Uj0EoVjtlELGGvKaJBDSciO1FC3H_Gh5x5RjgCk',
  },
  {
    id: 5, name: 'Nathaniel Cole', party: 'Unity Front',
    tags: ['COMMUNITY', 'GROWTH'],
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD1FPtO4AjuBQ4J5RQgLRdmbcV42jF6Mi3y3sBegXTJ9OAfTuTutPCuq8hgLOx4GhSNmQlcmNTumCKZ7K7W2YYX1Mj4WIBu5URg9Mve8WXU4_EHXdIIPEAzcISx-QEJA1n4wIXpJNmmGTPNWQDvHT_V6HDxD-THUVs47EVaZvFL11ytosK5f1uQnGUU5tbCqO9rI12qJpQcCKwTsKIF3Bdy0EdZ08b09_uQPnyrC8cxpkiHCRicSUFi8oRe-GzbY_-LNahxxO_XKGw',
  },
  {
    id: 0, name: 'Voto en Blanco', party: 'Sin selección de candidato',
    tags: ['ABSTAIN'], img: null,
  },
]

export default function SeleccionCandidato() {
  const navigate = useNavigate()
  const [selected, setSelected] = useState(2)

  const selectedCandidate = candidates.find(c => c.id === selected)

  return (
    <div style={{ background: '#0A0C14', color: '#e6e0ef', minHeight: '100vh', fontFamily: 'Inter, sans-serif' }}>

      {/* Header */}
      <header style={{
        position: 'fixed', top: 0, width: '100%', zIndex: 50,
        background: 'rgba(20,18,28,0.8)', backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.1)', height: '64px',
        display: 'flex', alignItems: 'center',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 40px', width: '100%', maxWidth: '1280px', margin: '0 auto' }}>
          <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: '20px', color: '#c9beff', letterSpacing: '0.15em' }}>NEXA VOTE</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ display: 'flex', gap: '24px', marginRight: '16px' }}>
              {['Resultados', 'Cédula', 'Recursos'].map((item, i) => (
                <span key={item} style={{
                  color: i === 1 ? '#c9beff' : '#c9c3d9', cursor: 'pointer',
                  fontWeight: i === 1 ? 700 : 400, fontSize: '15px',
                  borderBottom: i === 1 ? '2px solid #c9beff' : 'none',
                  paddingBottom: i === 1 ? '4px' : '0',
                }}>{item}</span>
              ))}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '4px 12px', background: '#201e29', borderRadius: '999px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <span className="material-symbols-outlined" style={{ color: '#41eec2', fontSize: '18px' }}>verified_user</span>
              <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '11px', color: '#c9c3d9', letterSpacing: '0.1em' }}>ID VERIFIED</span>
            </div>
            <span className="material-symbols-outlined" style={{ color: '#c9c3d9', cursor: 'pointer' }}>lock</span>
          </div>
        </div>
      </header>

      {/* Main */}
      <main style={{ paddingTop: '96px', paddingBottom: '192px', maxWidth: '1280px', margin: '0 auto', padding: '96px 40px 192px' }}>

        {/* Progress bar */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '40px' }}>
          <div style={{ display: 'flex', alignItems: 'center', width: '100%', maxWidth: '400px', gap: '8px' }}>
            <div style={{ height: '6px', flex: 1, background: '#41eec2', borderRadius: '999px' }} />
            <div style={{ height: '6px', flex: 1, background: '#6c47ff', borderRadius: '999px' }} />
            <div style={{ height: '6px', flex: 1, background: '#36333e', borderRadius: '999px' }} />
          </div>
        </div>

        {/* Title */}
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <h1 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 'clamp(28px, 5vw, 48px)', marginBottom: '8px' }}>Cédula de Votación</h1>
          <p style={{ color: '#c9c3d9', fontSize: '18px', maxWidth: '600px', margin: '0 auto' }}>Por favor seleccione un candidato. Su selección está encriptada e inmutable.</p>
        </div>

        {/* Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
          {candidates.map((c) => (
            <div
              key={c.id}
              onClick={() => setSelected(c.id)}
              style={{
                ...(selected === c.id ? glassCardSelected : glassCard),
                padding: '24px', borderRadius: '12px', cursor: 'pointer',
                transition: 'all 0.3s',
                transform: selected === c.id ? 'scale(1.02)' : 'scale(1)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
                {c.img ? (
                  <div style={{ width: '64px', height: '64px', borderRadius: '50%', overflow: 'hidden', border: `2px solid ${selected === c.id ? '#6c47ff' : 'rgba(255,255,255,0.1)'}` }}>
                    <img src={c.img} alt={c.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                ) : (
                  <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#201e29', border: '2px dashed rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span className="material-symbols-outlined" style={{ color: '#938ea2', fontSize: '32px' }}>block</span>
                  </div>
                )}
                <div style={{
                  width: '24px', height: '24px', borderRadius: '50%',
                  background: selected === c.id ? '#6c47ff' : 'transparent',
                  border: `2px solid ${selected === c.id ? '#6c47ff' : 'rgba(255,255,255,0.2)'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: selected === c.id ? '0 0 10px rgba(108,71,255,0.6)' : 'none',
                }}>
                  {selected === c.id && <span className="material-symbols-outlined" style={{ color: '#fff', fontSize: '14px' }}>check</span>}
                </div>
              </div>
              <h3 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600, fontSize: '20px', marginBottom: '4px' }}>{c.name}</h3>
              <p style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '11px', color: '#41eec2', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '16px' }}>{c.party}</p>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {c.tags.map(tag => (
                  <span key={tag} style={{
                    padding: '4px 8px', borderRadius: '4px', fontSize: '10px', fontWeight: 700,
                    fontFamily: 'Space Grotesk, sans-serif', letterSpacing: '0.08em',
                    background: selected === c.id ? 'rgba(108,71,255,0.2)' : '#201e29',
                    color: selected === c.id ? '#c9beff' : '#c9c3d9',
                  }}>{tag}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Sticky bottom bar */}
      <div style={{
        position: 'fixed', bottom: 0, left: 0, width: '100%',
        padding: '16px 24px', background: 'rgba(20,18,28,0.9)',
        backdropFilter: 'blur(20px)', borderTop: '1px solid rgba(255,255,255,0.1)', zIndex: 50,
      }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            <div>
              <p style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '10px', color: '#c9c3d9', textTransform: 'uppercase', letterSpacing: '0.1em', margin: 0 }}>Selección Actual</p>
              <p style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600, fontSize: '20px', color: '#c9beff', margin: 0 }}>
                {selectedCandidate?.name || 'Ninguno'}
              </p>
            </div>
            <div style={{ height: '32px', width: '1px', background: 'rgba(255,255,255,0.1)' }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span className="material-symbols-outlined" style={{ color: '#41eec2', fontSize: '16px' }}>shield</span>
              <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '13px', color: '#41eec2', fontWeight: 700 }}>AES-256</span>
            </div>
          </div>
          <button
            onClick={() => navigate('/confirmacion')}
            style={{
              padding: '14px 48px', background: '#6c47ff', color: '#fff',
              border: 'none', borderRadius: '999px', fontFamily: 'Space Grotesk, sans-serif',
              fontWeight: 700, fontSize: '18px', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: '12px',
              boxShadow: '0 0 30px rgba(108,71,255,0.4)', transition: 'all 0.2s',
            }}
            onMouseOver={e => e.currentTarget.style.boxShadow = '0 0 40px rgba(108,71,255,0.6)'}
            onMouseOut={e => e.currentTarget.style.boxShadow = '0 0 30px rgba(108,71,255,0.4)'}
          >
            Confirmar Voto
            <span className="material-symbols-outlined">send</span>
          </button>
        </div>
      </div>

      {/* Session chip */}
      <div style={{
        position: 'fixed', bottom: '128px', left: '40px', zIndex: 40,
        background: 'rgba(28,26,37,0.9)', backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255,255,255,0.06)', padding: '12px 16px',
        borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '12px',
      }}>
        <span className="material-symbols-outlined" style={{ color: '#41eec2' }}>security</span>
        <div>
          <p style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '10px', color: '#c9c3d9', letterSpacing: '0.1em', margin: 0 }}>SESSION ID</p>
          <p style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '12px', color: '#41eec2', margin: 0 }}>82F2-X901-BA44</p>
        </div>
      </div>

      <Footer />
    </div>
  )
}