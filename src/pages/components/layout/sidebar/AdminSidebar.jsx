import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from "../../../../context/useAuth";

export default function AdminSidebar({ isOpen, onClose }) {
  const navigate = useNavigate()
  const location = useLocation()
  const { logout } = useAuth();

  const navItems = [
    { icon: 'dashboard', label: 'Dashboard', path: '/admin/dashboard' },
    { icon: 'analytics', label: 'Live Results', path: '/admin/resultados' },
    { icon: 'history_edu', label: 'Audit Logs', path: '/admin/auditoria' },
    { icon: 'how_to_reg', label: 'Voter Registry', path: '/admin/votantes' },
  ]

  const isActive = (path) => location.pathname === path

  const handleLogout = () => {
    logout();
    navigate("/loginadmin");
  };

  return (
    <>
      {isOpen && (
        <div onClick={onClose} style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 45,
        }} />
      )}

      <aside style={{
        position: 'fixed', top: 0, left: 0,
        height: '100vh', width: '256px',
        background: 'var(--bg-glass)', backdropFilter: 'blur(20px)',
        borderRight: '1px solid var(--border)',
        padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px',
        zIndex: 50,
        transform: isOpen ? 'translateX(0)' : 'translateX(-100%)',
        transition: 'transform 0.3s ease',
      }}>

        <div style={{
          marginBottom: '16px',
          padding: '0 8px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start'
        }}>
          <div>
            <h2 style={{
              fontFamily: 'Space Grotesk, sans-serif',
              fontWeight: 700,
              fontSize: '20px',
              color: 'var(--text-primary)',
              letterSpacing: '0.1em',
              textTransform: 'uppercase'
            }}>
              Admin Panel
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', opacity: 0.7 }}>
              Level 5 clearance
            </p>
          </div>

          <button onClick={onClose} style={{
            background: 'none',
            border: 'none',
            color: 'var(--text-primary)',
            cursor: 'pointer'
          }}>
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px', flexGrow: 1 }}>
          {navItems.map((item) => (
            <div
              key={item.path}
              onClick={() => {
                navigate(item.path)
                onClose()
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 16px',
                borderRadius: '12px',
                cursor: 'pointer',
                background: isActive(item.path)
                  ? 'rgba(65,238,194,0.15)'
                  : 'transparent',
                color: isActive(item.path)
                  ? 'var(--color-icon-teal)'
                  : 'var(--text-secondary)',
                fontWeight: isActive(item.path) ? 700 : 400,
                transition: 'all 0.2s',
              }}
            >
              <span className="material-symbols-outlined">{item.icon}</span>
              <span style={{ fontSize: '15px' }}>{item.label}</span>
            </div>
          ))}
        </nav>

        <div style={{
          borderTop: '1px solid var(--border)',
          paddingTop: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px'
        }}>

          <button style={{
            background: 'var(--accent)',
            color: 'var(--text-on-accent)',
            border: 'none',
            borderRadius: '12px',
            padding: '12px',
            fontWeight: 700,
            fontSize: '14px',
            cursor: 'pointer'
          }}>
            Generate Report
          </button>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '8px 16px',
            color: 'var(--text-secondary)',
            cursor: 'pointer'
          }}>
            <span className="material-symbols-outlined">settings</span>
            <span>Security Settings</span>
          </div>

          <div
            onClick={handleLogout}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '8px 16px',
              color: '#ff6b6b',
              cursor: 'pointer',
              fontWeight: 600
            }}
          >
            <span className="material-symbols-outlined">logout</span>
            <span>Logout</span>
          </div>

        </div>
      </aside>
    </>
  )
}