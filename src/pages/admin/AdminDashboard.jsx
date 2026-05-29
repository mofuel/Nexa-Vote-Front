import { useState, useEffect } from 'react'
import AdminSidebar from '../components/layout/sidebar/AdminSidebar'
import AdminHeader from '../components/layout/header/AdminHeader'
import Footer from '../components/layout/footer/AdminFooter'
import { getVoteResults, getTotalVotes, getTurnoutDetailed, getAuditLogs } from "../../services/api";
import CandidatePieChart from '../../components/CandidatePieChart'

const glassPanel = {
  background: 'var(--bg-glass)',
  backdropFilter: 'blur(12px)',
  border: '1px solid var(--border)',
}


export default function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('nexavote_sidebar_open');
      if (saved !== null) return saved === 'true';
      return window.innerWidth >= 1024;
    }
    return true;
  })

  const [results, setResults] = useState([])
  const [totalVotes, setTotalVotes] = useState(0)
  const [turnout, setTurnout] = useState(0)
  const [totalVoters, setTotalVoters] = useState(0)
  const [auditLogs, setAuditLogs] = useState([])
  const [chartMode, setChartMode] = useState('turnout')

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const fetchStats = async () => {
    try {
      const [totalData, turnoutData] = await Promise.all([
        getTotalVotes(),
        getTurnoutDetailed()
      ])

      setTotalVotes(totalData?.total ?? 0)
      setTotalVoters(turnoutData?.total_voters ?? 0)
      setTurnout(turnoutData?.percentage ?? 0)
    } catch (err) {
      console.error(err)
      setError("Error al cargar estadísticas")
    }
  }

  const fetchResults = async () => {
    try {
      const data = await getVoteResults()

      console.log("RESULTS API:", data)

      if (data?.success) {
        setResults(data.data || [])
      } else {
        setResults([])
        setError("Error al cargar resultados")
      }

    } catch (err) {
      console.error(err)
      setError("Error de conexión con el backend")
    }
  }

  useEffect(() => {
    const init = async () => {
      setLoading(true)

      await Promise.all([
        fetchStats(),
        fetchResults(),
      ])

      setLoading(false)
    }

    init()

    const fetchLogs = () => {
      getAuditLogs().then(res => {
        if (res?.success) setAuditLogs(res.data || [])
      })
    }

    fetchLogs()
    const interval = setInterval(fetchLogs, 15000)
    return () => clearInterval(interval)
  }, [])

  const blankVotes = Math.max(0, totalVotes - results.reduce((sum, r) => sum + (r.total || 0), 0));
  const maxVotes = Math.max(...results.map(r => r.total || 0), blankVotes, 1);



  const radius = 67.2;
  const circumference = 2 * Math.PI * radius;


  const turnoutPct = Number(turnout) || 0;


  const safeTurnout = Math.min(Math.max(turnoutPct, 0), 100);

  const minPct = Math.max(safeTurnout, 2);
  const offset = circumference - (minPct / 100) * circumference;

  const ringColor =
  safeTurnout >= 66 ? "#41eec2" :    
  safeTurnout >= 33 ? "#ffd93d" :    
  "#ff6b6b"                           


  const candidates = [
    ...results.map((r) => ({
      name: r.candidate_name,
      votes: r.total,
      color: "#41eec2",
      pct: maxVotes ? `${(r.total / maxVotes) * 100}%` : "0%"
    })),
    ...(blankVotes > 0 ? [{
      name: "Voto en Blanco",
      votes: blankVotes,
      color: "#8b92a5",
      pct: maxVotes ? `${(blankVotes / maxVotes) * 100}%` : "0%"
    }] : []),
  ].sort((a, b) => b.votes - a.votes)









  return (
    <div style={{ display: 'flex', background: '#14121c', color: '#e6e0ef', minHeight: '100vh', fontFamily: 'Inter, sans-serif' }}>

      <AdminSidebar isOpen={sidebarOpen} onClose={() => {
        setSidebarOpen(false);
        localStorage.setItem('nexavote_sidebar_open', 'false');
      }} />

      <main style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', minHeight: '100vh', marginLeft: '256px', overflowY: 'auto' }}>

        <AdminHeader onMenuClick={() => {
          setSidebarOpen(true);
          localStorage.setItem('nexavote_sidebar_open', 'true');
        }} />

        <div style={{ padding: '40px', display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '1280px', width: '100%', margin: '0 auto' }}>

          {/* Stats row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px' }}>
            <div style={{ ...glassPanel, padding: '24px', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p style={{ fontSize: '11px', color: '#c9c3d9', letterSpacing: '0.1em', marginBottom: '4px' }}>Control del Proceso</p>
                <p style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600, fontSize: '18px' }}>Estado de votación</p>
              </div>
              <div style={{ width: '48px', height: '24px', borderRadius: '999px', background: '#41eec2', position: 'relative', cursor: 'pointer' }}>
                <div style={{ position: 'absolute', right: '2px', top: '2px', width: '20px', height: '20px', borderRadius: '50%', background: '#fff' }} />
              </div>
            </div>
            <div style={{ ...glassPanel, padding: '24px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '8px', background: 'rgba(201,190,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span className="material-symbols-outlined" style={{ color: '#c9beff', fontSize: '28px' }}>how_to_vote</span>
              </div>
              <div>
                <p style={{ fontSize: '11px', color: '#c9c3d9', letterSpacing: '0.1em', marginBottom: '4px' }}>Votos emitidos</p>
                <div>
                  <span style={{ fontSize: '42px', fontWeight: 700, color: '#ffffff', lineHeight: 1 }}>
                    {totalVotes.toLocaleString()}
                  </span>
                  <span style={{ fontSize: '13px', color: '#8b92a5', marginLeft: '8px' }}>
                    de {totalVoters} registrado{totalVoters !== 1 ? 's' : ''}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Results + Chart */}
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
            <section style={{ ...glassPanel, padding: '24px', borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '8px' }}>
                <div>
                  <h3 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600, fontSize: '20px', marginBottom: '4px' }}>Resultados por Candidato</h3>
                  <p style={{ color: '#c9c3d9', fontSize: '14px' }}>Conteo en vivo desde mesas verificadas</p>
                </div>
                <span style={{ fontSize: '11px', color: '#c9c3d9', background: 'rgba(255,255,255,0.05)', padding: '4px 8px', borderRadius: '6px', fontFamily: 'Space Grotesk, sans-serif' }}>Actualizado: 2m</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {candidates.map((c) => {
                  const barPct = c.votes > 0 ? c.pct : '100%';
                  return (
                  <div key={c.name}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span style={{ fontSize: '14px', fontWeight: 600 }}>{c.name}</span>
                      <span style={{ fontSize: '14px', fontWeight: 600, color: c.votes === 0 ? '#8b92a5' : c.color }}>
                        {c.votes === 0 ? 'Sin votos aún' : `${c.votes} votos`}
                      </span>
                    </div>
                    <div style={{ height: '16px', background: '#201e29', borderRadius: '999px', overflow: 'hidden' }}>
                      <div style={{
                        width: barPct,
                        minHeight: '4px',
                        height: c.votes > 0 ? '100%' : '0',
                        background: c.votes > 0 ? c.color : 'transparent',
                        border: c.votes === 0 ? '1px dashed #2d3448' : 'none',
                        borderRadius: '4px',
                        opacity: c.votes === 0 ? 0.4 : 1,
                        transition: 'width 0.4s ease',
                      }} />
                    </div>
                  </div>
                )})}
              </div>
              <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '16px', textAlign: 'right' }}>
                <button style={{ color: '#c9beff', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '13px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  Ver análisis detallado <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>chevron_right</span>
                </button>
              </div>
            </section>

            <section style={{ ...glassPanel, padding: '24px', borderRadius: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <h3 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600, fontSize: '20px', width: '100%', marginBottom: '4px' }}>Participación</h3>

              <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', background: '#201e29', borderRadius: '8px', padding: '4px' }}>
                <button
                  onClick={() => setChartMode('turnout')}
                  style={{
                    padding: '6px 16px', borderRadius: '6px', border: 'none',
                    background: chartMode === 'turnout' ? '#6c47ff' : 'transparent',
                    color: chartMode === 'turnout' ? '#fff' : '#8b92a5',
                    cursor: 'pointer', fontSize: '12px', fontWeight: 600,
                    transition: 'all 0.2s',
                  }}
                >
                  Participación
                </button>
                <button
                  onClick={() => setChartMode('candidates')}
                  style={{
                    padding: '6px 16px', borderRadius: '6px', border: 'none',
                    background: chartMode === 'candidates' ? '#6c47ff' : 'transparent',
                    color: chartMode === 'candidates' ? '#fff' : '#8b92a5',
                    cursor: 'pointer', fontSize: '12px', fontWeight: 600,
                    transition: 'all 0.2s',
                  }}
                >
                  Candidatos
                </button>
              </div>

              {chartMode === 'turnout' ? (
                <>
                  <div style={{ position: 'relative', width: '160px', height: '160px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg viewBox="0 0 160 160" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
                      <circle cx="80" cy="80" r="67.2" fill="transparent" stroke="#201e29" strokeWidth="8" />
                      <circle cx="80" cy="80" r="67.2" fill="transparent" stroke={ringColor} strokeWidth="8"
                        strokeDasharray={circumference} strokeDashoffset={offset} />
                    </svg>
                    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: '32px', lineHeight: 1 }}>
                        {turnout}%
                      </span>
                      <span style={{ color: '#41eec2', fontSize: '11px', letterSpacing: '0.1em' }}>Activo</span>
                    </div>
                  </div>
                  <div style={{ marginTop: '24px', width: '100%', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '10px', color: '#c9c3d9', letterSpacing: '0.1em' }}>Total actual</span>
                    <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600, fontSize: '13px' }}>
                      {totalVotes.toLocaleString()} / {totalVoters}
                    </span>
                  </div>
                </>
              ) : (
                <>
                  <CandidatePieChart candidates={candidates} />
                  <div style={{ marginTop: '16px', width: '100%', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '10px', color: '#c9c3d9', letterSpacing: '0.1em' }}>Total votos</span>
                    <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600, fontSize: '13px' }}>
                      {totalVotes.toLocaleString()}
                    </span>
                  </div>
                </>
              )}
            </section>
          </div>

          {/* Audit Log */}
          <section style={{ ...glassPanel, borderRadius: '12px', overflow: 'hidden' }}>
            <div style={{ padding: '24px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
              <div>
                <h3 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600, fontSize: '20px', marginBottom: '4px' }}>Registro de Auditoría</h3>
                <p style={{ color: '#c9c3d9', fontSize: '14px' }}>Registro inmutable de operaciones recientes</p>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                {['Filtrar', 'Exportar'].map(btn => (
                  <button key={btn} style={{ padding: '8px 16px', background: '#201e29', border: 'none', borderRadius: '8px', color: '#c9c3d9', cursor: 'pointer', fontSize: '13px', fontWeight: 600 }}>{btn}</button>
                ))}
              </div>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '700px' }}>
                <thead>
                  <tr style={{ background: 'rgba(255,255,255,0.05)' }}>
                    {['Fecha', 'Acción', 'Estado', 'IP', 'Votante', 'Detalle'].map(h => (
                      <th key={h} style={{ padding: '16px 24px', textAlign: 'left', fontSize: '11px', color: '#c9c3d9', textTransform: 'uppercase', letterSpacing: '0.1em', fontFamily: 'Space Grotesk, sans-serif' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {auditLogs.reduce((acc, entry, index) => {
                    const prev = auditLogs[index - 1];
                    const isSame =
                      prev &&
                      prev.action_type === entry.action_type &&
                      prev.ip_address === entry.ip_address &&
                      prev.status === entry.status;
                    if (isSame) {
                      acc[acc.length - 1].count += 1;
                      acc[acc.length - 1].lastDate = entry.created_at;
                    } else {
                      acc.push({ ...entry, count: 1, lastDate: entry.created_at });
                    }
                    return acc;
                  }, []).map((log) => (
                    <tr key={log.id} style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                      <td style={{ padding: '16px 24px', fontSize: '12px', fontFamily: 'Space Grotesk, sans-serif', letterSpacing: '0.05em' }}>
                        {new Date(log.created_at).toLocaleString()}
                        {log.count > 1 && (
                          <span style={{ background: '#2d3448', color: '#8b92a5', fontSize: '11px', padding: '2px 8px', borderRadius: '999px', marginLeft: '8px' }}>
                            {'\u00d7'}{log.count} ({new Date(log.created_at).toLocaleString()} \u2013 {new Date(log.lastDate).toLocaleString()})
                          </span>
                        )}
                      </td>
                      <td style={{ padding: '16px 24px', fontSize: '14px', fontWeight: 700, color: '#c9beff' }}>
                        {log.action_type === 'ADMIN_LOGIN' ? 'Inicio de sesión' :
                         log.action_type === 'VOTE_CAST' ? 'Voto emitido' :
                         log.action_type}
                      </td>
                      <td style={{ padding: '16px 24px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div style={{
                            width: '8px', height: '8px', borderRadius: '50%',
                            background: log.status === 'success' ? '#41eec2' : '#ff6b6b',
                          }} />
                          <span style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.08em', color: log.status === 'success' ? '#41eec2' : '#ff6b6b' }}>
                            {log.status === 'success' ? 'Exitoso' : log.status}
                          </span>
                        </div>
                      </td>
                      <td style={{ padding: '16px 24px', fontSize: '12px', opacity: 0.7, fontFamily: 'Space Grotesk, sans-serif' }}>{log.ip_address}</td>
                      <td style={{ padding: '16px 24px', fontSize: '13px', opacity: log.voter_id ? 1 : 0.4 }}>
                        {log.voter_id ? String(log.voter_id).slice(0, 8) + '...' : '—'}
                      </td>
                      <td style={{ padding: '16px 24px', fontSize: '11px', color: '#c9c3d9', opacity: 0.6, fontFamily: 'Space Grotesk, sans-serif' }}>
                        {log.metadata
                          ? (typeof log.metadata === 'object'
                            ? Object.entries(log.metadata).map(([k, v]) => `${k}: ${v}`).join(', ')
                            : String(log.metadata))
                          : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div style={{ padding: '16px', background: 'rgba(255,255,255,0.03)', textAlign: 'center' }}>
              <button style={{ color: '#c9beff', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: '12px', letterSpacing: '0.15em' }}>
                Ver todos los registros
              </button>
            </div>
          </section>

        </div>
        <Footer />
      </main>
    </div>
  )
}