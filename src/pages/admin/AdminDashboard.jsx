import { useState, useEffect } from 'react'
import AdminSidebar from '../components/layout/sidebar/AdminSidebar'
import AdminHeader from '../components/layout/header/AdminHeader'
import Footer from '../components/layout/footer/AdminFooter'
import { getVoteResults, getTotalVotes, getTurnout } from "../../services/api";

const glassPanel = {
  background: 'var(--bg-glass)',
  backdropFilter: 'blur(12px)',
  border: '1px solid var(--border)',
}


const auditLogs = [
  { time: '14:22:15.002', action: 'Tally Validation', validator: 'VAL-992-X-NODE', region: 'Western Sector 7', level: 'LEVEL 4', levelColor: '#c9beff', status: 'Verified' },
  { time: '14:21:58.841', action: 'Packet Integrity', validator: 'VAL-102-B-NODE', region: 'Mainframe Alpha', level: 'LEVEL 2', levelColor: '#41eec2', status: 'Verified' },
  { time: '14:20:44.210', action: 'Credential Refresh', validator: 'ADMIN-SYS-001', region: 'Security Terminal', level: 'LEVEL 5', levelColor: '#6c47ff', status: 'Success' },
]


export default function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const [results, setResults] = useState([])
  const [totalVotes, setTotalVotes] = useState(0)
  const [turnout, setTurnout] = useState(0)

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const fetchStats = async () => {
    try {
      const totalData = await getTotalVotes()
      const turnoutData = await getTurnout()

      console.log("TOTAL:", totalData)
      console.log("TURNOUT:", turnoutData)

      setTotalVotes(totalData?.total ?? 0)
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
        fetchResults()
      ])

      setLoading(false)
    }

    init()
  }, [])

  const maxVotes = Math.max(...results.map(r => r.total || 0), 1);


  const TOTAL_VOTERS = 150;

  const radius = 42;
  const circumference = 2 * Math.PI * radius;


  const turnoutPct = Number(turnout) || 0;


  const safeTurnout = Math.min(Math.max(turnoutPct, 0), 100);

  const offset = circumference - (safeTurnout / 100) * circumference;


  const candidates = results.map((r, i) => ({
    name: r.candidate_name,
    votes: r.total,
    color: "#41eec2",
    pct: maxVotes ? `${(r.total / maxVotes) * 100}%` : "0%"
  }))









  return (
    <div style={{ display: 'flex', background: '#14121c', color: '#e6e0ef', minHeight: '100vh', fontFamily: 'Inter, sans-serif' }}>

      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', minHeight: '100vh', marginLeft: '256px', overflowY: 'auto' }}>

        <AdminHeader onMenuClick={() => setSidebarOpen(true)} />

        <div style={{ padding: '40px', display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '1280px', width: '100%', margin: '0 auto' }}>

          {/* Stats row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px' }}>
            <div style={{ ...glassPanel, padding: '24px', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p style={{ fontSize: '11px', color: '#c9c3d9', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '4px' }}>Control del Proceso</p>
                <p style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600, fontSize: '18px' }}>Voting Status</p>
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
                <p style={{ fontSize: '11px', color: '#c9c3d9', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '4px' }}>Votos Emitidos</p>
                <p style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600, fontSize: '22px' }}>
                  {totalVotes.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          {/* Results + Chart */}
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
            <section style={{ ...glassPanel, padding: '24px', borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '8px' }}>
                <div>
                  <h3 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600, fontSize: '20px', marginBottom: '4px' }}>Resultados por Candidato</h3>
                  <p style={{ color: '#c9c3d9', fontSize: '14px' }}>Live tallies from verified precincts</p>
                </div>
                <span style={{ fontSize: '11px', color: '#c9c3d9', background: 'rgba(255,255,255,0.05)', padding: '4px 8px', borderRadius: '6px', fontFamily: 'Space Grotesk, sans-serif' }}>REFRESHED: 2m AGO</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {candidates.map((c) => (
                  <div key={c.name}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span style={{ fontSize: '14px', fontWeight: 600 }}>{c.name}</span>
                      <span style={{ fontSize: '14px', fontWeight: 600, color: c.color }}>{c.votes} votes</span>
                    </div>
                    <div style={{ height: '16px', background: '#201e29', borderRadius: '999px', overflow: 'hidden' }}>
                      <div style={{ height: '100%', background: c.color, width: c.pct }} />
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '16px', textAlign: 'right' }}>
                <button style={{ color: '#c9beff', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '13px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  DETAILED ANALYTICS <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>chevron_right</span>
                </button>
              </div>
            </section>

            <section style={{ ...glassPanel, padding: '24px', borderRadius: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <h3 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600, fontSize: '20px', width: '100%', marginBottom: '4px' }}>Participación</h3>
              <p style={{ color: '#c9c3d9', fontSize: '14px', width: '100%', marginBottom: '24px' }}>Registered voter turnout</p>
              <div style={{ position: 'relative', width: '160px', height: '160px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
                  <circle
                    cx="50%"
                    cy="50%"
                    r="42%"
                    fill="transparent"
                    stroke="#201e29"
                    strokeWidth="8%"
                  />

                  <circle
                    cx="50%"
                    cy="50%"
                    r="42%"
                    fill="transparent"
                    stroke="#41eec2"
                    strokeWidth="8%"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                  />
                </svg>
                <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: '32px', lineHeight: 1 }}>
                    {turnout}%
                  </span>
                  <span style={{ color: '#41eec2', fontSize: '11px', letterSpacing: '0.1em' }}>ACTIVE</span>
                </div>
              </div>
              <div style={{ marginTop: '24px', width: '100%', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '10px', color: '#c9c3d9', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Current Total</span>
                <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600, fontSize: '13px' }}>
                  {totalVotes.toLocaleString()} / {TOTAL_VOTERS}
                </span>
              </div>
            </section>
          </div>

          {/* Audit Log */}
          <section style={{ ...glassPanel, borderRadius: '12px', overflow: 'hidden' }}>
            <div style={{ padding: '24px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
              <div>
                <h3 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600, fontSize: '20px', marginBottom: '4px' }}>Registro de Auditoría</h3>
                <p style={{ color: '#c9c3d9', fontSize: '14px' }}>Immutable ledger entries for recent operations</p>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                {['Filter', 'Export'].map(btn => (
                  <button key={btn} style={{ padding: '8px 16px', background: '#201e29', border: 'none', borderRadius: '8px', color: '#c9c3d9', cursor: 'pointer', fontSize: '13px', fontWeight: 600 }}>{btn}</button>
                ))}
              </div>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '700px' }}>
                <thead>
                  <tr style={{ background: 'rgba(255,255,255,0.05)' }}>
                    {['Timestamp', 'Action Type', 'Validator ID', 'Region', 'Security', 'Status'].map(h => (
                      <th key={h} style={{ padding: '16px 24px', textAlign: 'left', fontSize: '11px', color: '#c9c3d9', textTransform: 'uppercase', letterSpacing: '0.1em', fontFamily: 'Space Grotesk, sans-serif' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {auditLogs.map((log, i) => (
                    <tr key={i} style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                      <td style={{ padding: '16px 24px', fontSize: '12px', fontFamily: 'Space Grotesk, sans-serif', letterSpacing: '0.1em' }}>{log.time}</td>
                      <td style={{ padding: '16px 24px', fontSize: '14px', fontWeight: 700, color: '#c9beff' }}>{log.action}</td>
                      <td style={{ padding: '16px 24px', fontSize: '12px', opacity: 0.7 }}>{log.validator}</td>
                      <td style={{ padding: '16px 24px', fontSize: '14px' }}>{log.region}</td>
                      <td style={{ padding: '16px 24px' }}>
                        <span style={{ background: `${log.levelColor}20`, color: log.levelColor, padding: '2px 8px', borderRadius: '4px', fontSize: '10px', fontWeight: 700 }}>{log.level}</span>
                      </td>
                      <td style={{ padding: '16px 24px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#41eec2' }} />
                          <span style={{ fontSize: '14px' }}>{log.status}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div style={{ padding: '16px', background: 'rgba(255,255,255,0.03)', textAlign: 'center' }}>
              <button style={{ color: '#c9beff', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: '12px', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
                View All Log Entries
              </button>
            </div>
          </section>

        </div>
        <Footer />
      </main>
    </div>
  )
}