import { useState, useEffect } from 'react'
import AdminSidebar from '../components/layout/sidebar/AdminSidebar'
import AdminHeader from '../components/layout/header/AdminHeader'
import Footer from '../components/layout/footer/AdminFooter'
import { getVoteReport } from "../../services/api";

const glassCard = {
  background: 'var(--bg-surface)',
  border: '1px solid var(--border)',
  borderRadius: '16px',
}

const PIE_COLORS = ["#6366f1", "#22c55e", "#f59e0b", "#ef4444"];

function TurnoutGauge({ percentage }) {
  const r = 70;
  const circumference = 2 * Math.PI * r;
  const pct = Math.min(Math.max(percentage || 0, 0), 100);
  const offset = circumference - (pct / 100) * circumference;

  return (
    <svg width="160" height="160" viewBox="0 0 160 160">
      <circle cx="80" cy="80" r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="12" />
      <circle cx="80" cy="80" r={r} fill="none" stroke="#6c47ff" strokeWidth="12"
        strokeDasharray={circumference} strokeDashoffset={offset}
        transform="rotate(-90 80 80)" strokeLinecap="round"
        style={{ transition: 'stroke-dashoffset 0.6s ease' }} />
      <text x="80" y="75" textAnchor="middle" dominantBaseline="central"
        fontSize="28" fontWeight="700" fill="#fff" fontFamily="Space Grotesk, sans-serif">
        {pct}%
      </text>
      <text x="80" y="102" textAnchor="middle" dominantBaseline="central"
        fontSize="11" fill="#c9c3d9" fontFamily="Inter, sans-serif" letterSpacing="0.1em">
        Participación
      </text>
    </svg>
  );
}

function BarChart({ data }) {
  const maxVotes = Math.max(...data.map(d => d.total || 0), 1);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {data.map((d) => {
        const pct = (d.total / maxVotes) * 100;
        return (
          <div key={d.name}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span style={{ fontSize: '13px', fontWeight: 600, color: '#e6e0ef' }}>{d.name}</span>
              <span style={{ fontSize: '13px', fontWeight: 600, color: '#c9c3d9' }}>{d.total.toLocaleString()} votos</span>
            </div>
            <div style={{ height: '12px', background: 'rgba(255,255,255,0.06)', borderRadius: '999px', overflow: 'hidden' }}>
              <div style={{
                width: `${Math.max(pct, 1)}%`, height: '100%',
                background: d.name === "Voto en Blanco" ? '#8b92a5' : '#6c47ff',
                borderRadius: '999px', transition: 'width 0.4s ease',
              }} />
            </div>
          </div>
        )
      })}
    </div>
  );
}

function AgeDonut({ data }) {
  const items = Array.isArray(data) ? data : [];
  const total = items.reduce((s, d) => s + d.value, 0);
  if (total === 0) {
    return <p style={{ color: '#8b92a5', fontSize: '14px', textAlign: 'center', padding: '40px 0' }}>Sin datos de edad</p>;
  }

  const cx = 80, cy = 80, r = 67.2;
  let currentAngle = 0;

  return (
    <div style={{ position: 'relative', width: '160px', height: '160px', margin: '0 auto' }}>
      <svg viewBox="0 0 160 160" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
        {items.map((d, i) => {
          const pct = (d.value / total) * 100;
          const angle = (pct / 100) * 360;
          const startAngle = currentAngle;
          const endAngle = currentAngle + angle;
          currentAngle = endAngle;

          const startRad = ((startAngle - 90) * Math.PI) / 180;
          const endRad = ((endAngle - 90) * Math.PI) / 180;
          const x1 = cx + r * Math.cos(startRad);
          const y1 = cy + r * Math.sin(startRad);
          const x2 = cx + r * Math.cos(endRad);
          const y2 = cy + r * Math.sin(endRad);
          const largeArc = endAngle - startAngle > 180 ? 1 : 0;

          if (endAngle - startAngle >= 360 - 0.01) {
            return (
              <circle key={d.name} cx={cx} cy={cy} r={r}
                fill="none" stroke={PIE_COLORS[i % PIE_COLORS.length]} strokeWidth="8" />
            );
          }

          return (
            <path key={d.name}
              d={`M ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 0 ${x2} ${y2}`}
              fill="none" stroke={PIE_COLORS[i % PIE_COLORS.length]} strokeWidth="8" />
          );
        })}
      </svg>
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      }}>
        <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: '22px', color: '#fff' }}>
          {(items.length > 0 ? (total / items.length) : 0).toFixed(0)}%
        </span>
        <span style={{ color: '#c9c3d9', fontSize: '11px', marginTop: '2px' }}>promedio</span>
      </div>
    </div>
  );
}

export default function GestionVotantes() {
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('nexavote_sidebar_open');
      if (saved !== null) return saved === 'true';
      return window.innerWidth >= 1024;
    }
    return true;
  })

  const [report, setReport] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const token = sessionStorage.getItem("admin_token")

  useEffect(() => {
    if (!token) { setLoading(false); return }
    getVoteReport().then(data => {
      if (data?.success && data?.data) {
        setReport(data.data)
      } else {
        setError(data?.error || "Error al cargar reporte")
      }
    }).catch(() => setError("Error de conexión")).finally(() => setLoading(false))
  }, [token])

  const handleExportCSV = () => {
    if (!token) return
    fetch(`${import.meta.env.VITE_API_URL}/api/votes/report/csv`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(r => r.blob())
      .then(blob => {
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url; a.download = 'reporte-electoral.csv'; a.click()
        URL.revokeObjectURL(url)
      })
  }

  const results = report?.results || []
  const blankVotes = report?.blank_votes || { total: 0, percentage: 0 }
  const turnoutPct = report?.turnout_percentage ?? 0
  const totalVotes = report?.total_votes ?? 0
  const totalVoters = report?.total_voters ?? 0
  const turnoutByAge = report?.turnout_by_age || {}

  const barData = [
    ...results.map(r => ({ name: r.name, total: r.total || 0, color: '#6c47ff' })),
    ...(blankVotes.total > 0 ? [{ name: "Voto en Blanco", total: blankVotes.total, color: '#8b92a5' }] : []),
  ]

  const agePieData = Object.entries(turnoutByAge).map(([rango, v]) => ({
    name: rango, value: v.percentage ?? 0
  }))

  const avgTurnout = Object.values(turnoutByAge).reduce((s, v) =>
    s + (v.percentage || 0), 0
  ) / Math.max(Object.keys(turnoutByAge).length, 1);

  return (
    <div style={{ background: '#0A0C14', color: '#e6e0ef', minHeight: '100vh', fontFamily: 'Inter, sans-serif', display: 'flex' }}>

      <AdminSidebar isOpen={sidebarOpen} onClose={() => {
        setSidebarOpen(false);
        localStorage.setItem('nexavote_sidebar_open', 'false');
      }} />

      <div style={{ flex: 1, marginLeft: '256px', display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>

        <AdminHeader onMenuClick={() => {
          setSidebarOpen(true);
          localStorage.setItem('nexavote_sidebar_open', 'true');
        }} />

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
                Reportes Electorales
              </h2>
              <p style={{ color: '#c9c3d9', fontSize: '15px' }}>
                Datos consolidados de participación y resultados por candidato.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <button onClick={handleExportCSV} style={{
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
                Exportar CSV
              </button>
            </div>
          </div>

          {loading && (
            <div style={{ textAlign: 'center', padding: '60px 24px', color: '#c9c3d9' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '40px', opacity: 0.3, marginBottom: '12px' }}>hourglass_top</span>
              <p>Cargando reporte electoral...</p>
            </div>
          )}

          {error && (
            <div style={{ ...glassCard, padding: '48px', textAlign: 'center' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '40px', color: '#ff6b6b', marginBottom: '12px' }}>error</span>
              <p style={{ color: '#ff6b6b', fontWeight: 600 }}>{error}</p>
            </div>
          )}

          {!loading && !error && report && (
            <>

              {/* Stats cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                <div style={{ ...glassCard, padding: '20px', display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: 'rgba(108,71,255,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span className="material-symbols-outlined" style={{ color: '#6c47ff', fontSize: '22px' }}>how_to_vote</span>
                  </div>
                  <div>
                    <p style={{ fontSize: '10px', color: '#c9c3d9', letterSpacing: '0.1em', marginBottom: '2px' }}>Votos Emitidos</p>
                    <p style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: '24px', color: '#fff' }}>{totalVotes.toLocaleString()}</p>
                  </div>
                </div>
                <div style={{ ...glassCard, padding: '20px', display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: 'rgba(65,238,194,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span className="material-symbols-outlined" style={{ color: '#41eec2', fontSize: '22px' }}>group</span>
                  </div>
                  <div>
                    <p style={{ fontSize: '10px', color: '#c9c3d9', letterSpacing: '0.1em', marginBottom: '2px' }}>Votantes Registrados</p>
                    <p style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: '24px', color: '#fff' }}>{totalVoters.toLocaleString()}</p>
                  </div>
                </div>
                <div style={{ ...glassCard, padding: '20px', display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: 'rgba(249,158,11,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span className="material-symbols-outlined" style={{ color: '#f59e0b', fontSize: '22px' }}>do_not_disturb_on</span>
                  </div>
                  <div>
                    <p style={{ fontSize: '10px', color: '#c9c3d9', letterSpacing: '0.1em', marginBottom: '2px' }}>Votos en Blanco</p>
                    <p style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: '24px', color: '#fff' }}>{blankVotes.total.toLocaleString()}</p>
                  </div>
                </div>
              </div>

              {/* Charts row */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>

                {/* BarChart */}
                <div style={{ ...glassCard, padding: '24px' }}>
                  <h3 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600, fontSize: '18px', color: '#fff', marginBottom: '4px' }}>Resultados por Candidato</h3>
                  <p style={{ color: '#c9c3d9', fontSize: '13px', marginBottom: '20px' }}>Distribución de votos entre candidatos</p>
                  <BarChart data={barData} />
                </div>

                {/* Age donut + legend */}
                <div style={{ ...glassCard, padding: '24px' }}>
                  <h3 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600, fontSize: '18px', color: '#fff', marginBottom: '4px' }}>Participación por Edad</h3>
                  <p style={{ color: '#c9c3d9', fontSize: '13px', marginBottom: '20px' }}>Porcentaje de votación por rango etario</p>
                  <AgeDonut data={agePieData} />
                  <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {agePieData.map((d, i) => (
                      <div key={d.name} style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}>
                        <div style={{ width: '10px', height: '10px', borderRadius: '2px', background: PIE_COLORS[i % PIE_COLORS.length], flexShrink: 0 }} />
                        <span style={{ fontSize: '12px', color: '#c9c3d9' }}>{d.name}</span>
                        <span style={{ fontSize: '12px', fontWeight: 600, color: '#fff' }}>{d.value.toFixed(1)}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Gauge + detail row */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>

                {/* Gauge */}
                <div style={{ ...glassCard, padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <h3 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600, fontSize: '18px', color: '#fff', marginBottom: '20px', textAlign: 'center' }}>Participación Total</h3>
                  <TurnoutGauge percentage={turnoutPct} />
                  <div style={{ marginTop: '16px', width: '100%', background: 'rgba(255,255,255,0.04)', borderRadius: '8px', padding: '12px 16px', display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '12px', color: '#c9c3d9' }}>Votaron</span>
                    <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600, fontSize: '14px', color: '#fff' }}>{totalVotes.toLocaleString()} / {totalVoters.toLocaleString()}</span>
                  </div>
                </div>

                {/* Detalle por edad */}
                <div style={{ ...glassCard, padding: '24px' }}>
                  <h3 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600, fontSize: '18px', color: '#fff', marginBottom: '16px' }}>Detalle por Edad</h3>
                  {Object.keys(turnoutByAge).length === 0 ? (
                    <p style={{ color: '#8b92a5', fontSize: '14px' }}>Sin datos de edad</p>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {Object.entries(turnoutByAge).map(([rango, v]) => {
                        const pct = v.percentage || 0
                        return (
                          <div key={rango}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                              <span style={{ fontSize: '13px', fontWeight: 600, color: '#e6e0ef' }}>{rango} años</span>
                              <span style={{ fontSize: '13px', fontWeight: 600, color: '#c9c3d9' }}>{pct}%</span>
                            </div>
                            <div style={{ height: '8px', background: 'rgba(255,255,255,0.06)', borderRadius: '999px', overflow: 'hidden' }}>
                              <div style={{
                                width: `${Math.max(pct, 1)}%`, height: '100%',
                                background: pct >= 70 ? '#22c55e' : pct >= 50 ? '#f59e0b' : '#ef4444',
                                borderRadius: '999px', transition: 'width 0.4s ease',
                              }} />
                            </div>
                            <p style={{ fontSize: '11px', color: '#8b92a5', marginTop: '2px' }}>
                              {v.voted?.toLocaleString()} de {v.total?.toLocaleString()} votaron
                            </p>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              </div>

              {/* Tabla de resultados */}
              <div style={{ ...glassCard, overflow: 'hidden' }}>
                <div style={{ padding: '20px 24px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  <h3 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600, fontSize: '16px', color: '#fff' }}>Resultados Detallados</h3>
                </div>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '600px' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(43,41,51,0.4)' }}>
                        {['Candidato', 'Partido', 'Votos', 'Porcentaje'].map(col => (
                          <th key={col} style={{
                            padding: '14px 24px', textAlign: 'left',
                            fontFamily: 'Space Grotesk, sans-serif', fontSize: '11px',
                            fontWeight: 600, color: '#c9c3d9', letterSpacing: '0.1em', textTransform: 'uppercase',
                          }}>{col}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {results.map((r, i) => (
                        <tr key={r.candidate_id} style={{
                          borderBottom: i < results.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                          transition: 'background 0.2s',
                        }}
                          onMouseOver={e => e.currentTarget.style.background = 'rgba(108,71,255,0.04)'}
                          onMouseOut={e => e.currentTarget.style.background = 'transparent'}
                        >
                          <td style={{ padding: '14px 24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            {r.photo_url ? (
                              <img src={r.photo_url} alt={r.name}
                                style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }} />
                            ) : (
                              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#36333e', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <span className="material-symbols-outlined" style={{ fontSize: '16px', color: '#c9c3d9' }}>person</span>
                              </div>
                            )}
                            <span style={{ fontWeight: 600, fontSize: '14px', color: '#e6e0ef' }}>{r.name}</span>
                          </td>
                          <td style={{ padding: '14px 24px', fontSize: '13px', color: '#c9c3d9' }}>{r.party || '—'}</td>
                          <td style={{ padding: '14px 24px', fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600, fontSize: '14px', color: '#fff' }}>{r.total?.toLocaleString()}</td>
                          <td style={{ padding: '14px 24px', fontFamily: 'Space Grotesk, sans-serif', fontSize: '13px', color: '#c9c3d9' }}>{r.percentage?.toFixed(1) ?? 0}%</td>
                        </tr>
                      ))}
                      {blankVotes.total > 0 && (
                        <tr style={{ background: 'rgba(255,255,255,0.02)' }}>
                          <td style={{ padding: '14px 24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(139,146,165,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <span className="material-symbols-outlined" style={{ fontSize: '16px', color: '#8b92a5' }}>do_not_disturb_on</span>
                            </div>
                            <span style={{ fontWeight: 600, fontSize: '14px', color: '#8b92a5' }}>Voto en Blanco</span>
                          </td>
                          <td style={{ padding: '14px 24px', fontSize: '13px', color: '#8b92a5' }}>—</td>
                          <td style={{ padding: '14px 24px', fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600, fontSize: '14px', color: '#8b92a5' }}>{blankVotes.total.toLocaleString()}</td>
                          <td style={{ padding: '14px 24px', fontFamily: 'Space Grotesk, sans-serif', fontSize: '13px', color: '#8b92a5' }}>{blankVotes.percentage?.toFixed(1) ?? 0}%</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

            </>
          )}

        </main>

        <Footer />
      </div>
    </div>
  )
}
