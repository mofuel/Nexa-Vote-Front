import { useNavigate } from 'react-router-dom'
import { useEffect } from "react";
import { testConnection } from "../test/supabaseTest";

const glassCard = {
  background: 'rgba(19, 22, 42, 0.7)',
  backdropFilter: 'blur(12px)',
  border: '1px solid rgba(255, 255, 255, 0.06)',
}


export default function Inicio() {
  const navigate = useNavigate()

  useEffect(() => {
    testConnection();
  }, []);

  return (
    <div style={{ background: '#14121c', color: '#e6e0ef', minHeight: '100vh', fontFamily: 'Inter, sans-serif' }}>

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
          <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: '20px', color: '#c9beff', letterSpacing: '0.15em' }}>
            NEXA VOTE
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            <div style={{ display: 'flex', gap: '24px', marginRight: '24px' }}>
              <span style={{ color: '#c9beff', fontWeight: 700, borderBottom: '2px solid #c9beff', paddingBottom: '4px', cursor: 'pointer' }}>Inicio</span>
              <span style={{ color: '#c9c3d9', cursor: 'pointer' }}>Seguridad</span>
              <span style={{ color: '#c9c3d9', cursor: 'pointer' }}>Transparencia</span>
            </div>
            <span className="material-symbols-outlined" style={{ color: '#c9beff', cursor: 'pointer' }}>lock</span>
            <span className="material-symbols-outlined" style={{ color: '#c9beff', cursor: 'pointer' }}>verified_user</span>
          </div>
        </div>
      </header>

      {/* Main */}
      <main style={{ position: 'relative', minHeight: '100vh', overflow: 'hidden', paddingTop: '64px' }}>

        {/* Background glows */}
        <div style={{
          position: 'absolute', top: '-96px', right: '-96px',
          width: '600px', height: '600px', pointerEvents: 'none',
          background: 'radial-gradient(circle at center, rgba(108,71,255,0.15) 0%, transparent 70%)',
        }} />
        <div style={{
          position: 'absolute', bottom: '-192px', left: '-192px',
          width: '800px', height: '800px', pointerEvents: 'none',
          background: 'radial-gradient(circle at center, rgba(65,238,194,0.1) 0%, transparent 70%)',
        }} />

        {/* Hero */}
        <section style={{
          position: 'relative', zIndex: 10,
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          justifyContent: 'center', minHeight: 'calc(100vh - 64px)',
          padding: '0 40px', maxWidth: '1280px', margin: '0 auto',
        }}>

          {/* Badge */}
          <div style={{
            ...glassCard,
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            padding: '6px 16px', borderRadius: '999px',
            borderColor: 'rgba(65,238,194,0.2)', marginBottom: '24px',
          }}>
            <span className="material-symbols-outlined" style={{ color: '#41eec2', fontSize: '18px' }}>shield</span>
            <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '12px', color: '#41eec2', letterSpacing: '0.1em', fontWeight: 500 }}>
              SISTEMA ELECTORAL SEGURO
            </span>
          </div>

          {/* Title */}
          <h1 style={{
            fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700,
            fontSize: 'clamp(28px, 5vw, 48px)', color: '#fff',
            textAlign: 'center', maxWidth: '800px',
            marginBottom: '12px', lineHeight: 1.15,
          }}>
            Sistema de Voto Electrónico
          </h1>

          {/* Subtitle */}
          <p style={{
            fontSize: '18px', color: '#c9c3d9', textAlign: 'center',
            maxWidth: '640px', marginBottom: '48px', lineHeight: '28px',
          }}>
            Seguridad reforzada nivel: no somos la ONPE.
          </p>

          {/* Buttons */}
          <div style={{ display: 'flex', gap: '16px', marginBottom: '96px', flexWrap: 'wrap', justifyContent: 'center' }}>
            <button
              onClick={() => navigate('/registro')}
              style={{
                background: '#6c47ff', color: '#fff', border: 'none',
                padding: '16px 40px', borderRadius: '8px', fontWeight: 600,
                fontSize: '14px', cursor: 'pointer', letterSpacing: '0.05em',
                boxShadow: '0 8px 32px rgba(108,71,255,0.3)',
                transition: 'all 0.2s',
              }}
              onMouseOver={e => e.target.style.opacity = '0.9'}
              onMouseOut={e => e.target.style.opacity = '1'}
            >
              Registrarse
            </button>
            <button
              onClick={() => navigate('/login')}
              style={{
                background: 'transparent', color: '#c9beff',
                border: '1px solid #6c47ff',
                padding: '16px 40px', borderRadius: '8px', fontWeight: 600,
                fontSize: '14px', cursor: 'pointer', letterSpacing: '0.05em',
                transition: 'all 0.2s',
              }}
              onMouseOver={e => e.target.style.background = 'rgba(108,71,255,0.05)'}
              onMouseOut={e => e.target.style.background = 'transparent'}
            >
              Iniciar Sesión
            </button>
          </div>

          {/* Feature cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '24px', width: '100%' }}>
            {[
              { icon: 'lock', color: '#c9beff', bg: 'rgba(201,190,255,0.1)', title: 'AES-256 ENCRYPTED', desc: 'Cifrado de extremo a extremo para proteger cada sufragio individual.' },
              { icon: 'fingerprint', color: '#41eec2', bg: 'rgba(65,238,194,0.1)', title: 'BIOMÉTRICO VERIFICADO', desc: 'Validación facial y dactilar para prevenir la suplantación de identidad.' },
              { icon: 'badge', color: '#ffb691', bg: 'rgba(255,182,145,0.1)', title: 'DNI CONFIRMADO', desc: 'Sincronización directa con el registro civil nacional para auditoría.' },
            ].map((card) => (
              <div key={card.title} style={{ ...glassCard, padding: '24px', borderRadius: '8px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ background: card.bg, padding: '12px', borderRadius: '8px', width: 'fit-content' }}>
                  <span className="material-symbols-outlined" style={{ color: card.color }}>{card.icon}</span>
                </div>
                <div>
                  <h3 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, color: '#fff', marginBottom: '4px', fontSize: '14px' }}>{card.title}</h3>
                  <p style={{ color: '#c9c3d9', fontSize: '14px', lineHeight: '20px' }}>{card.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Security visualization */}
        <section style={{ padding: '96px 40px', maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ ...glassCard, borderRadius: '16px', overflow: 'hidden', position: 'relative', minHeight: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ position: 'relative', zIndex: 10, textAlign: 'center', padding: '48px', maxWidth: '640px' }}>
              <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600, fontSize: '32px', color: '#fff', marginBottom: '24px' }}>
                Arquitectura de Inmutabilidad
              </h2>
              <p style={{ color: '#c9c3d9', fontSize: '18px', lineHeight: '28px' }}>
                Nuestra red utiliza tecnología de registro distribuido para asegurar que una vez que se emite un voto, este no pueda ser alterado, borrado ni duplicado por ninguna autoridad.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer style={{ background: '#14121c', borderTop: '1px solid rgba(255,255,255,0.05)', padding: '48px 40px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '1280px', margin: '0 auto', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '12px', color: '#c9c3d9', letterSpacing: '0.1em' }}>
              © 2024 Institutional Voting Authority • Encrypted by AES-256
            </span>
            <div style={{ display: 'flex', gap: '16px' }}>
              {['Privacy Policy', 'Security Protocol', 'Audit Status'].map(link => (
                <span key={link} style={{ color: '#c9c3d9', fontSize: '12px', textDecoration: 'underline', cursor: 'pointer' }}>{link}</span>
              ))}
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '4px 12px', background: '#201e29', borderRadius: '999px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#41eec2', display: 'inline-block' }} />
              <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '12px', color: '#41eec2', letterSpacing: '0.1em' }}>NETWORK ACTIVE</span>
            </div>
          </div>
        </div>
      </footer>

    </div>
  )
}