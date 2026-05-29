import { useState, useEffect } from 'react'
import AdminSidebar from '../components/layout/sidebar/AdminSidebar'
import AdminHeader from '../components/layout/header/AdminHeader'
import Footer from '../components/layout/footer/AdminFooter'
import { getAuditLogs } from "../../services/api";

const glassPanel = {
  background: 'var(--bg-glass)',
  backdropFilter: 'blur(12px)',
  border: '1px solid var(--border)',
}

const ACTION_COLORS = {
  VOTE_CAST: '#41eec2',
  VOTE_FAILED: '#ff6b6b',
  ADMIN_LOGIN: '#c9beff',
  FACE_VERIFIED: '#ffb691',
}

export default function AuditLogsAdmin() {
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('nexavote_sidebar_open');
      if (saved !== null) return saved === 'true';
      return window.innerWidth >= 1024;
    }
    return true;
  })
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [filterStatus, setFilterStatus] = useState('all')

  const fetchLogs = async () => {
    try {
      const res = await getAuditLogs()
      if (res?.success) {
        setLogs(res.data || [])
      } else {
        setError(res?.error || "Error al cargar auditoría")
      }
    } catch {
      setError("Error de conexión con el backend")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLogs()
    const interval = setInterval(fetchLogs, 15000)
    return () => clearInterval(interval)
  }, [])

  const filteredLogs = logs.filter(log => {
    if (filterStatus === 'all') return true;
    if (filterStatus === 'fail') return log.status && log.status.startsWith('fail');
    return log.status === filterStatus;
  })

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

          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <div style={{ marginBottom: '8px' }}>
                <span style={{
                  padding: '2px 10px', background: 'rgba(201,190,255,0.1)',
                  border: '1px solid rgba(201,190,255,0.2)', borderRadius: '4px',
                  fontFamily: 'Space Grotesk, sans-serif', fontSize: '10px', fontWeight: 500,
                  color: '#c9beff', letterSpacing: '0.1em', textTransform: 'uppercase',
                }}>
                  Administrative access
                </span>
              </div>
              <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: '28px', marginBottom: '4px' }}>
                Registro de Auditoría
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>
                Ledger inmutable de operaciones críticas del sistema.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <span style={{
                padding: '8px 16px', background: 'rgba(65,238,194,0.1)',
                border: '1px solid rgba(65,238,194,0.2)', borderRadius: '8px',
                fontFamily: 'Space Grotesk, sans-serif', fontSize: '12px', fontWeight: 600,
                color: '#41eec2', display: 'flex', alignItems: 'center', gap: '6px',
              }}>
                <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>verified</span>
                {filteredLogs.length} registros
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
            {[
              { key: 'all', label: 'Todos', color: '#c9beff' },
              { key: 'success', label: 'Exitoso', color: '#41eec2' },
              { key: 'fail', label: 'Fallido', color: '#ff6b6b' },
            ].map(opt => (
              <button
                key={opt.key}
                onClick={() => setFilterStatus(opt.key)}
                style={{
                  padding: '6px 16px', borderRadius: '6px', border: 'none',
                  background: filterStatus === opt.key ? opt.color : '#201e29',
                  color: filterStatus === opt.key ? '#fff' : '#8b92a5',
                  cursor: 'pointer', fontSize: '12px', fontWeight: 600,
                  transition: 'all 0.2s',
                }}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {loading ? (
            <div style={{ ...glassPanel, borderRadius: '12px', padding: '48px', textAlign: 'center' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '40px', color: 'var(--text-secondary)', opacity: 0.3, marginBottom: '12px' }}>hourglass_top</span>
              <p style={{ color: 'var(--text-secondary)' }}>Cargando registros de auditoría...</p>
            </div>
          ) : error ? (
            <div style={{ ...glassPanel, borderRadius: '12px', padding: '48px', textAlign: 'center' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '40px', color: '#ff6b6b', marginBottom: '12px' }}>error</span>
              <p style={{ color: '#ff6b6b', fontWeight: 600 }}>{error}</p>
            </div>
           ) : filteredLogs.length === 0 ? (
            <div style={{ ...glassPanel, borderRadius: '12px', padding: '48px', textAlign: 'center' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '40px', color: 'var(--text-secondary)', opacity: 0.3, marginBottom: '12px' }}>history</span>
              <p style={{ color: 'var(--text-secondary)' }}>{filterStatus === 'all' ? 'No hay registros de auditoría disponibles.' : 'No hay registros con ese estado.'}</p>
            </div>
          ) : (
            <section style={{ ...glassPanel, borderRadius: '12px', overflow: 'hidden' }}>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '800px' }}>
                  <thead>
                    <tr style={{ background: 'rgba(255,255,255,0.04)' }}>
                      {['Fecha', 'Acción', 'Estado', 'IP', 'Votante', 'Detalle'].map(h => (
                        <th key={h} style={{
                          padding: '16px 24px', textAlign: 'left',
                          fontFamily: 'Space Grotesk, sans-serif', fontSize: '11px',
                          fontWeight: 600, color: 'var(--text-secondary)',
                          letterSpacing: '0.1em', textTransform: 'uppercase',
                        }}>
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredLogs.map((log) => (
                      <tr key={log.id} style={{
                        borderTop: '1px solid rgba(255,255,255,0.04)',
                        transition: 'background 0.2s',
                      }}
                        onMouseOver={e => e.currentTarget.style.background = 'rgba(108,71,255,0.04)'}
                        onMouseOut={e => e.currentTarget.style.background = 'transparent'}
                      >
                        <td style={{ padding: '16px 24px' }}>
                          <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '12px', letterSpacing: '0.05em' }}>
                            {new Date(log.created_at).toLocaleString()}
                          </span>
                        </td>
                        <td style={{ padding: '16px 24px' }}>
                          <span style={{
                            fontFamily: 'Space Grotesk, sans-serif', fontSize: '13px', fontWeight: 700,
                            color: ACTION_COLORS[log.action_type] || 'var(--text-primary)',
                          }}>
                            {log.action_type}
                          </span>
                        </td>
                        <td style={{ padding: '16px 24px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div style={{
                              width: '8px', height: '8px', borderRadius: '50%',
                              background: log.status === 'success' ? '#41eec2' : '#ff6b6b',
                              boxShadow: log.status === 'success'
                                ? '0 0 8px rgba(65,238,194,0.5)'
                                : '0 0 8px rgba(255,107,107,0.5)',
                            }} />
                            <span style={{
                              fontFamily: 'Space Grotesk, sans-serif', fontSize: '11px', fontWeight: 600,
                              letterSpacing: '0.08em', textTransform: 'uppercase',
                              color: log.status === 'success' ? '#41eec2' : '#ff6b6b',
                            }}>
                              {log.status}
                            </span>
                          </div>
                        </td>
                        <td style={{ padding: '16px 24px' }}>
                          <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '12px', opacity: 0.7 }}>
                            {log.ip_address}
                          </span>
                        </td>
                        <td style={{ padding: '16px 24px' }}>
                          <span style={{ fontSize: '13px', opacity: log.voter_id ? 1 : 0.4 }}>
                            {log.voter_id ? log.voter_id.slice(0, 8) + '...' : '—'}
                          </span>
                        </td>
                        <td style={{ padding: '16px 24px' }}>
                          {log.metadata ? (
                            <span style={{
                              fontSize: '11px', color: 'var(--text-secondary)', opacity: 0.6,
                              fontFamily: 'Space Grotesk, sans-serif',
                            }}>
                              {typeof log.metadata === 'object'
                                ? Object.entries(log.metadata).map(([k, v]) => `${k}: ${v}`).join(', ')
                                : String(log.metadata)}
                            </span>
                          ) : (
                            <span style={{ opacity: 0.3 }}>—</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {/* Security badges */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
            {[
              { icon: 'history', color: '#c9beff', bg: 'rgba(201,190,255,0.1)', title: 'Audit Trail', desc: 'Todos los eventos son inmutables y con timestamp.' },
              { icon: 'gavel', color: '#41eec2', bg: 'rgba(65,238,194,0.1)', title: 'Legal Compliance', desc: 'Registros auditables para cumplimiento electoral.' },
              { icon: 'verified_user', color: '#ffb691', bg: 'rgba(255,182,145,0.1)', title: 'Integridad', desc: 'No se puede modificar ni eliminar un registro existente.' },
            ].map(badge => (
              <div key={badge.title} style={{ ...glassPanel, borderRadius: '12px', padding: '16px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: badge.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <span className="material-symbols-outlined" style={{ color: badge.color, fontSize: '20px' }}>{badge.icon}</span>
                </div>
                <div>
                  <p style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '11px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '2px' }}>{badge.title}</p>
                  <p style={{ fontSize: '12px', color: 'var(--text-secondary)', opacity: 0.6 }}>{badge.desc}</p>
                </div>
              </div>
            ))}
          </div>

        </div>

        <Footer />
      </main>
    </div>
  )
}
