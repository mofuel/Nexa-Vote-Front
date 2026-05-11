import { useState } from 'react'
import AdminSidebar from '../components/layout/sidebar/AdminSidebar'
import AdminHeader from '../components/layout/header/AdminHeader'
import Footer from '../components/layout/footer/AdminFooter'

const glassCard = {
  background: '#13162A',
  border: '1px solid rgba(255, 255, 255, 0.06)',
  borderRadius: '16px',
}

const voters = [
  {
    id: 'NX-9928-VX',
    name: 'Alejandro García',
    dni: '34.829.112-K',
    status: 'verified',
    voted: true,
  },
  {
    id: 'NX-1044-VX',
    name: 'Elena Rodriguez',
    dni: '42.119.005-A',
    status: 'pending',
    voted: false,
  },
  {
    id: 'NX-3371-VX',
    name: 'Carlos Mendoza',
    dni: '28.441.900-B',
    status: 'verified',
    voted: false,
  },
  {
    id: 'NX-7823-VX',
    name: 'Sofía Torres',
    dni: '39.102.774-M',
    status: 'verified',
    voted: true,
  },
]

const securityBadges = [
  { icon: 'shield', color: '#41eec2', bg: 'rgba(65,238,194,0.1)', title: 'AES-256 Encrypted', desc: 'All voter data is salted and hashed.' },
  { icon: 'gavel', color: '#c9beff', bg: 'rgba(201,190,255,0.1)', title: 'Legal Compliance', desc: 'Audit-ready electoral logs enabled.' },
  { icon: 'verified_user', color: '#41eec2', bg: 'rgba(65,238,194,0.1)', title: 'KYC Verified', desc: 'Identity verified via secure API.' },
]

const filters = ['Todos (4,281)', 'Verificados', 'Pendientes', 'Votó']

export default function GestionVotantes() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeFilter, setActiveFilter] = useState(0)

  return (
    <div style={{ background: '#0A0C14', color: '#e6e0ef', minHeight: '100vh', fontFamily: 'Inter, sans-serif', display: 'flex' }}>

      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main content — offset by sidebar width on large screens */}
      <div style={{ flex: 1, marginLeft: '256px', display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>

        <AdminHeader onMenuClick={() => setSidebarOpen(true)} />

        <main style={{ flex: 1, padding: '32px 40px 48px', maxWidth: '1280px', width: '100%', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '32px' }}>

          {/* Page header */}
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '24px', flexWrap: 'wrap' }}>
            <div>
              <div style={{ marginBottom: '8px' }}>
                <span style={{
                  padding: '2px 10px', background: 'rgba(65,238,194,0.1)',
                  border: '1px solid rgba(65,238,194,0.2)', borderRadius: '4px',
                  fontFamily: 'Space Grotesk, sans-serif', fontSize: '10px', fontWeight: 500,
                  color: '#41eec2', letterSpacing: '0.1em', textTransform: 'uppercase',
                }}>
                  Administrative access
                </span>
              </div>
              <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: '28px', color: '#fff', marginBottom: '4px' }}>
                Gestión de Votantes
              </h2>
              <p style={{ color: '#c9c3d9', fontSize: '15px' }}>
                Monitoreo y administración de la base de datos electoral centralizada.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <button style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                padding: '10px 20px', background: '#2b2933',
                border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px',
                color: '#e6e0ef', fontFamily: 'Space Grotesk, sans-serif',
                fontWeight: 600, fontSize: '14px', cursor: 'pointer',
                transition: 'background 0.2s',
              }}
                onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                onMouseOut={e => e.currentTarget.style.background = '#2b2933'}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>download</span>
                Exportar DB
              </button>
              <button style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                padding: '10px 24px', background: '#6c47ff',
                border: 'none', borderRadius: '12px',
                color: '#fff', fontFamily: 'Space Grotesk, sans-serif',
                fontWeight: 600, fontSize: '14px', cursor: 'pointer',
                transition: 'opacity 0.2s',
              }}
                onMouseOver={e => e.currentTarget.style.opacity = '0.9'}
                onMouseOut={e => e.currentTarget.style.opacity = '1'}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>person_add</span>
                Nuevo Votante
              </button>
            </div>
          </div>

          {/* Filters & Search */}
          <div style={{ ...glassCard, padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '24px', flexWrap: 'wrap' }}>

              {/* Search */}
              <div style={{ position: 'relative', flex: 1, maxWidth: '480px' }}>
                <span className="material-symbols-outlined" style={{
                  position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)',
                  color: 'rgba(201,195,217,0.5)', fontSize: '20px',
                }}>search</span>
                <input
                  type="text"
                  placeholder="Buscar por nombre, DNI o ID de billetera..."
                  style={{
                    width: '100%', background: '#0e0d17',
                    border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px',
                    padding: '12px 16px 12px 44px', color: '#e6e0ef',
                    fontFamily: 'Inter, sans-serif', fontSize: '15px',
                    outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.2s',
                  }}
                  onFocus={e => e.target.style.borderColor = '#6c47ff'}
                  onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.06)'}
                />
              </div>

              {/* Filter tags */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '13px', color: '#c9c3d9', fontWeight: 600, marginRight: '4px' }}>Filtros:</span>
                {filters.map((f, i) => (
                  <button
                    key={f}
                    onClick={() => setActiveFilter(i)}
                    style={{
                      padding: '6px 16px', borderRadius: '999px',
                      fontFamily: 'Space Grotesk, sans-serif', fontSize: '12px', fontWeight: 600,
                      cursor: 'pointer', transition: 'all 0.2s', border: '1px solid',
                      background: activeFilter === i ? 'rgba(201,190,255,0.15)' : 'rgba(54,51,62,0.5)',
                      color: activeFilter === i ? '#c9beff' : '#c9c3d9',
                      borderColor: activeFilter === i ? 'rgba(201,190,255,0.3)' : 'rgba(255,255,255,0.05)',
                    }}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Voter Table */}
          <div style={{ ...glassCard, overflow: 'hidden' }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '700px' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', background: 'rgba(43,41,51,0.4)' }}>
                    {['Nombre', 'DNI / Documento', 'Estado', 'Participación', 'Acciones'].map(col => (
                      <th key={col} style={{
                        padding: '16px 24px', textAlign: 'left',
                        fontFamily: 'Space Grotesk, sans-serif', fontSize: '11px',
                        fontWeight: 600, color: '#c9c3d9', letterSpacing: '0.1em', textTransform: 'uppercase',
                      }}>
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {voters.map((voter, i) => (
                    <tr
                      key={voter.id}
                      style={{
                        borderBottom: i < voters.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                        transition: 'background 0.2s',
                      }}
                      onMouseOver={e => e.currentTarget.style.background = 'rgba(108,71,255,0.04)'}
                      onMouseOut={e => e.currentTarget.style.background = 'transparent'}
                    >
                      {/* Name */}
                      <td style={{ padding: '16px 24px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div style={{
                            width: '38px', height: '38px', borderRadius: '50%',
                            background: '#36333e', border: '1px solid rgba(255,255,255,0.1)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            flexShrink: 0,
                          }}>
                            <span className="material-symbols-outlined" style={{ color: '#c9c3d9', fontSize: '20px' }}>person</span>
                          </div>
                          <div>
                            <p style={{ fontWeight: 600, fontSize: '15px', color: '#e6e0ef', marginBottom: '2px' }}>{voter.name}</p>
                            <p style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '10px', color: '#c9c3d9', letterSpacing: '0.08em', opacity: 0.6 }}>ID: {voter.id}</p>
                          </div>
                        </div>
                      </td>

                      {/* DNI */}
                      <td style={{ padding: '16px 24px' }}>
                        <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '13px', color: '#c9c3d9' }}>{voter.dni}</span>
                      </td>

                      {/* Status */}
                      <td style={{ padding: '16px 24px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: voter.status === 'verified' ? '#41eec2' : '#ffb691' }}>
                          <span className="material-symbols-outlined" style={{ fontSize: '18px', fontVariationSettings: "'FILL' 1" }}>
                            {voter.status === 'verified' ? 'verified' : 'pending'}
                          </span>
                          <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '11px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                            {voter.status === 'verified' ? 'Verificado' : 'Pendiente'}
                          </span>
                        </div>
                      </td>

                      {/* Voted */}
                      <td style={{ padding: '16px 24px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', opacity: voter.voted ? 1 : 0.4 }}>
                          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: voter.voted ? '#41eec2' : 'rgba(255,255,255,0.3)', boxShadow: voter.voted ? '0 0 8px #41eec2' : 'none' }} />
                          <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '11px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                            {voter.voted ? 'Votó' : 'No votó'}
                          </span>
                        </div>
                      </td>

                      {/* Actions */}
                      <td style={{ padding: '16px 24px' }}>
                        <div style={{ display: 'flex', gap: '4px' }}>
                          <button style={{
                            padding: '8px', background: 'transparent', border: 'none',
                            borderRadius: '8px', color: '#c9c3d9', cursor: 'pointer', transition: 'all 0.2s',
                          }}
                            onMouseOver={e => { e.currentTarget.style.color = '#c9beff'; e.currentTarget.style.background = 'rgba(201,190,255,0.1)' }}
                            onMouseOut={e => { e.currentTarget.style.color = '#c9c3d9'; e.currentTarget.style.background = 'transparent' }}
                          >
                            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>visibility</span>
                          </button>
                          <button style={{
                            padding: '8px', background: 'transparent', border: 'none',
                            borderRadius: '8px', color: '#c9c3d9', cursor: 'pointer', transition: 'all 0.2s',
                          }}
                            onMouseOver={e => { e.currentTarget.style.color = '#ffb4ab'; e.currentTarget.style.background = 'rgba(255,180,171,0.1)' }}
                            onMouseOut={e => { e.currentTarget.style.color = '#c9c3d9'; e.currentTarget.style.background = 'transparent' }}
                          >
                            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>person_off</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div style={{
              padding: '16px 24px', borderTop: '1px solid rgba(255,255,255,0.05)',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px',
            }}>
              <p style={{ fontSize: '13px', color: '#c9c3d9' }}>
                Mostrando <strong style={{ color: '#e6e0ef' }}>1 - 10</strong> de <strong style={{ color: '#e6e0ef' }}>4,281</strong> votantes
              </p>
              <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                {[
                  { content: <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>chevron_left</span>, disabled: true, active: false },
                  { content: '1', disabled: false, active: true },
                  { content: '2', disabled: false, active: false },
                  { content: '3', disabled: false, active: false },
                  { content: '...', disabled: true, active: false },
                  { content: '429', disabled: false, active: false },
                  { content: <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>chevron_right</span>, disabled: false, active: false },
                ].map((btn, i) => (
                  <button
                    key={i}
                    disabled={btn.disabled && btn.content !== '...'}
                    style={{
                      minWidth: '36px', height: '36px', borderRadius: '8px',
                      border: btn.active ? 'none' : '1px solid rgba(255,255,255,0.1)',
                      background: btn.active ? '#6c47ff' : 'transparent',
                      color: btn.active ? '#fff' : '#c9c3d9',
                      fontFamily: 'Space Grotesk, sans-serif', fontWeight: btn.active ? 700 : 400,
                      fontSize: '13px', cursor: btn.disabled ? 'default' : 'pointer',
                      opacity: btn.disabled && !btn.active ? 0.3 : 1,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      transition: 'background 0.2s',
                    }}
                  >
                    {btn.content}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Security badges */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
            {securityBadges.map(badge => (
              <div key={badge.title} style={{ ...glassCard, padding: '16px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: badge.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <span className="material-symbols-outlined" style={{ color: badge.color, fontSize: '20px' }}>{badge.icon}</span>
                </div>
                <div>
                  <p style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '11px', fontWeight: 600, color: '#e6e0ef', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '2px' }}>{badge.title}</p>
                  <p style={{ fontSize: '12px', color: '#c9c3d9', opacity: 0.6 }}>{badge.desc}</p>
                </div>
              </div>
            ))}
          </div>

        </main>

        <Footer />
      </div>
    </div>
  )
}