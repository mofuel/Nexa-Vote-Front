import { useState } from 'react'
import AdminSidebar from '../components/layout/sidebar/AdminSidebar'
import AdminHeader from '../components/layout/header/AdminHeader'
import Footer from '../components/layout/footer/AdminFooter'
import ConfirmVotingModal from '../../components/ConfirmVotingModal'

const glassPanel = {
  background: 'var(--bg-glass)',
  backdropFilter: 'blur(12px)',
  border: '1px solid var(--border)',
}

export default function ControlVotacionAdmin() {
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('nexavote_sidebar_open');
      if (saved !== null) return saved === 'true';
      return window.innerWidth >= 1024;
    }
    return true;
  })
  const [votingOpen, setVotingOpen] = useState(true)
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [pendingState, setPendingState] = useState(null);

  const handleToggleClick = () => {
    setPendingState(!votingOpen);
    setShowConfirmModal(true);
  };

  const handleConfirmToggle = () => {
    setVotingOpen(pendingState);
    setShowConfirmModal(false);
    setPendingState(null);
  };

  const handleCancelToggle = () => {
    setShowConfirmModal(false);
    setPendingState(null);
  };

  return (
    <div style={{ display: 'flex', background: 'var(--bg-page)', color: 'var(--text-primary)', minHeight: '100vh', fontFamily: 'Inter, sans-serif' }}>

      <AdminSidebar isOpen={sidebarOpen} onClose={() => {
        setSidebarOpen(false);
        localStorage.setItem('nexavote_sidebar_open', 'false');
      }} />

      <main style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', minHeight: '100vh', marginLeft: '256px' }}>

        <AdminHeader onMenuClick={() => {
          setSidebarOpen(true);
          localStorage.setItem('nexavote_sidebar_open', 'true');
        }} />

        <div style={{ padding: '40px', maxWidth: '1280px', width: '100%', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>

          {/* Toggle votación */}
          <div style={{ ...glassPanel, borderRadius: '12px', padding: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '24px' }}>
            <div>
              <h3 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600, fontSize: '28px', marginBottom: '8px' }}>Estado de Votación</h3>
              <p style={{ color: '#c9c3d9', fontSize: '16px' }}>Control manual del acceso a las urnas digitales.</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '12px', color: '#c9c3d9', letterSpacing: '0.1em' }}>CLOSED</span>
              <div
                onClick={handleToggleClick}
                style={{
                  width: '64px', height: '32px', borderRadius: '999px',
                  background: votingOpen ? '#41eec2' : '#36333e',
                  position: 'relative', cursor: 'pointer', transition: 'background 0.3s',
                }}
              >
                <div style={{
                  position: 'absolute', top: '4px',
                  left: votingOpen ? 'calc(100% - 28px)' : '4px',
                  width: '24px', height: '24px', borderRadius: '50%',
                  background: '#fff', transition: 'left 0.3s',
                }} />
              </div>
              <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '12px', color: '#41eec2', letterSpacing: '0.1em', fontWeight: 700 }}>OPEN</span>
            </div>
          </div>

          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>

            {/* Votos emitidos */}
            <div style={{ ...glassPanel, borderRadius: '12px', padding: '32px', borderLeft: '4px solid #c9beff' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '12px', color: '#c9c3d9', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600 }}>
                  Votos Emitidos
                </span>
                <span className="material-symbols-outlined" style={{ color: '#c9beff', fontSize: '28px' }}>ballot</span>
              </div>
              <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: '56px', lineHeight: 1 }}>
                1,284,092
              </span>
            </div>

            {/* Participación */}
            <div style={{ ...glassPanel, borderRadius: '12px', padding: '32px', borderLeft: '4px solid #41eec2' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '12px', color: '#c9c3d9', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600 }}>
                  Participación
                </span>
                <span className="material-symbols-outlined" style={{ color: '#41eec2', fontSize: '28px' }}>analytics</span>
              </div>
              <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: '56px', lineHeight: 1 }}>
                68.4%
              </span>
            </div>
          </div>

          {/* Generate Report */}
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '16px' }}>
            <button style={{
              padding: '16px 48px', background: '#6c47ff', color: '#fff',
              border: 'none', borderRadius: '12px', fontFamily: 'Space Grotesk, sans-serif',
              fontWeight: 600, fontSize: '18px', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: '12px',
              boxShadow: '0 8px 32px rgba(108,71,255,0.2)', transition: 'all 0.2s',
            }}
              onMouseOver={e => e.currentTarget.style.opacity = '0.9'}
              onMouseOut={e => e.currentTarget.style.opacity = '1'}
            >
              <span className="material-symbols-outlined">description</span>
              Generate Report
            </button>
          </div>

        </div>

        <Footer />
      </main>

      <ConfirmVotingModal
        isOpen={showConfirmModal}
        nextState={pendingState ?? false}
        onConfirm={handleConfirmToggle}
        onCancel={handleCancelToggle}
      />
    </div>
  )
}