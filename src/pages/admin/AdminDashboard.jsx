import { useState } from 'react';

// --- SISTEMA DE DISEÑO NEXA VOTE ---
const colors = {
    background: "#14121c",
    surface: "#1c1a25",
    surfaceContainer: "#201e29",
    primary: "#c9beff",
    secondary: "#41eec2",
    onSurface: "#e6e0ef",
    onSurfaceVariant: "#c9c3d9",
    outline: "rgba(255, 255, 255, 0.06)",
    accent: "#6c47ff"
};

const glassEffect = {
    background: 'rgba(19, 22, 42, 0.6)',
    backdropFilter: 'blur(12px)',
    border: `1px solid ${colors.outline}`,
};

export default function AdminDashboard() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [votingActive, setVotingActive] = useState(true);

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    return (
        <div style={{ 
            backgroundColor: colors.background, 
            color: colors.onSurface,
            minHeight: '100vh',
            fontFamily: 'Inter, sans-serif',
            display: 'flex',
            overflow: 'hidden'
        }}>
            
            {/* OVERLAY MÓVIL */}
            {isSidebarOpen && (
                <div 
                    onClick={toggleSidebar}
                    style={{
                        position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)',
                        zIndex: 45, transition: 'opacity 0.3s'
                    }}
                />
            )}

            {/* SIDEBAR ASIDE */}
            <aside style={{
                position: 'fixed', left: 0, top: 0, bottom: 0,
                width: '256px', backgroundColor: 'rgba(28, 26, 37, 0.95)',
                backdropFilter: 'blur(20px)', borderRight: `1px solid ${colors.outline}`,
                padding: '24px 16px', zIndex: 50, display: 'flex', flexDirection: 'column',
                transform: isSidebarOpen ? 'translateX(0)' : 'translateX(-100%)',
                transition: 'transform 0.3s ease',
                // En desktop forzamos visibilidad (esto se manejaría con media queries en CSS real, 
                // aquí simulamos el comportamiento responsivo)
            }} className="md:relative md:translate-x-0">
                
                <div style={{ marginBottom: '32px', padding: '0 8px' }}>
                    <h2 style={{ 
                        fontFamily: 'Space Grotesk', fontSize: '20px', fontWeight: 700, 
                        letterSpacing: '0.1em', textTransform: 'uppercase' 
                    }}>Admin Panel</h2>
                    <p style={{ fontSize: '12px', color: colors.onSurfaceVariant, opacity: 0.7 }}>Level 5 clearance</p>
                </div>

                <nav style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <NavItem icon="dashboard" label="Dashboard" active />
                    <NavItem icon="analytics" label="Live Results" />
                    <NavItem icon="history_edu" label="Audit Logs" />
                    <NavItem icon="how_to_reg" label="Voter Registry" />
                </nav>

                <div style={{ marginTop: 'auto', borderTop: `1px solid ${colors.outline}`, paddingTop: '16px' }}>
                    <button style={{
                        width: '100%', padding: '12px', backgroundColor: colors.accent,
                        color: '#fff', borderRadius: '8px', fontWeight: 600, fontSize: '14px',
                        marginBottom: '16px', border: 'none', cursor: 'pointer'
                    }}>Generate Report</button>
                    <NavItem icon="settings" label="Security Settings" small />
                    <NavItem icon="logout" label="Logout" small />
                </div>
            </aside>

            {/* MAIN CONTENT */}
            <main style={{ flexGrow: 1, height: '100vh', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
                
                {/* TOP BAR */}
                <header style={{
                    position: 'sticky', top: 0, zIndex: 40, height: '64px',
                    backgroundColor: 'rgba(20, 18, 28, 0.8)', backdropFilter: 'blur(20px)',
                    borderBottom: `1px solid ${colors.outline}`, display: 'flex',
                    alignItems: 'center', justifyContent: 'space-between', padding: '0 24px'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <span 
                            className="material-symbols-outlined md:hidden" 
                            style={{ color: colors.primary, cursor: 'pointer' }}
                            onClick={toggleSidebar}
                        >menu</span>
                        <h1 style={{ 
                            fontFamily: 'Space Grotesk', fontWeight: 700, color: colors.primary,
                            letterSpacing: '0.15em', fontSize: '18px'
                        }}>NEXA VOTE</h1>
                    </div>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                        <div className="hidden lg:flex" style={{ gap: '24px', fontSize: '14px' }}>
                            <span style={{ color: colors.primary, borderBottom: `2px solid ${colors.primary}`, paddingBottom: '4px', cursor: 'pointer' }}>Overview</span>
                            <span style={{ color: colors.onSurfaceVariant, cursor: 'pointer' }}>Regions</span>
                            <span style={{ color: colors.onSurfaceVariant, cursor: 'pointer' }}>Security</span>
                        </div>
                        <div style={{ width: '32px', height: '32px', borderRadius: '50%', overflow: 'hidden', border: `1px solid ${colors.outline}` }}>
                            <img src="https://lh3.googleusercontent.com/a/default-user" alt="Admin" style={{ width: '100%', height: '100%' }} />
                        </div>
                    </div>
                </header>

                {/* DASHBOARD GRID */}
                <div style={{ padding: '32px', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
                    
                    {/* TOP CARDS */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', marginBottom: '24px' }}>
                        
                        {/* Control Card */}
                        <div style={{ ...glassEffect, padding: '24px', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <h4 style={{ fontSize: '10px', letterSpacing: '0.1em', color: colors.onSurfaceVariant, textTransform: 'uppercase' }}>Control del Proceso</h4>
                                <p style={{ fontSize: '20px', fontWeight: 600 }}>Voting Status</p>
                            </div>
                            <div 
                                onClick={() => setVotingActive(!votingActive)}
                                style={{
                                    width: '48px', height: '24px', borderRadius: '12px',
                                    backgroundColor: votingActive ? colors.secondary : colors.surfaceContainer,
                                    position: 'relative', cursor: 'pointer', transition: '0.3s'
                                }}
                            >
                                <div style={{
                                    width: '18px', height: '18px', borderRadius: '50%', backgroundColor: '#fff',
                                    position: 'absolute', top: '3px', 
                                    left: votingActive ? '27px' : '3px', transition: '0.3s'
                                }} />
                            </div>
                        </div>

                        {/* Stats Card */}
                        <div style={{ ...glassEffect, padding: '24px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                            <div style={{ 
                                width: '48px', height: '48px', borderRadius: '8px', 
                                background: 'rgba(201, 190, 255, 0.1)', display: 'flex', 
                                alignItems: 'center', justifyContent: 'center', color: colors.primary 
                            }}>
                                <span className="material-symbols-outlined" style={{ fontSize: '32px' }}>how_to_vote</span>
                            </div>
                            <div>
                                <h4 style={{ fontSize: '10px', letterSpacing: '0.1em', color: colors.onSurfaceVariant, textTransform: 'uppercase' }}>Votos Emitidos</h4>
                                <p style={{ fontSize: '20px', fontWeight: 600 }}>2,677,920</p>
                            </div>
                        </div>
                    </div>

                    {/* RESULTS SECTION */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px' }}>
                        <section style={{ ...glassEffect, padding: '24px', borderRadius: '12px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '24px' }}>
                                <div>
                                    <h3 style={{ fontSize: '22px', fontWeight: 600 }}>Resultados por Candidato</h3>
                                    <p style={{ fontSize: '14px', color: colors.onSurfaceVariant }}>Live tallies from verified precincts</p>
                                </div>
                                <span style={{ fontSize: '10px', padding: '4px 8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px' }}>REFRESHED: 2m AGO</span>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                <ResultBar label="Sarah Jenkins" votes="1,240,512" percent="72%" color={colors.primary} />
                                <ResultBar label="Marcus Thorne" votes="985,210" percent="58%" color={colors.secondary} />
                                <ResultBar label="Elena Rodriguez" votes="452,198" percent="26%" color="rgba(255,255,255,0.3)" />
                            </div>
                        </section>

                        {/* RECENT AUDIT LOGS */}
                        <section style={{ ...glassEffect, borderRadius: '12px', overflow: 'hidden' }}>
                            <div style={{ padding: '24px', borderBottom: `1px solid ${colors.outline}` }}>
                                <h3 style={{ fontSize: '20px', fontWeight: 600 }}>Registro de Auditoría</h3>
                                <p style={{ fontSize: '14px', color: colors.onSurfaceVariant }}>Immutable ledger entries</p>
                            </div>
                            <div style={{ overflowX: 'auto' }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                                    <thead style={{ background: 'rgba(255,255,255,0.03)', color: colors.onSurfaceVariant, textTransform: 'uppercase' }}>
                                        <tr>
                                            <th style={{ padding: '16px' }}>Timestamp</th>
                                            <th style={{ padding: '16px' }}>Action</th>
                                            <th style={{ padding: '16px' }}>Region</th>
                                            <th style={{ padding: '16px' }}>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody style={{ color: colors.onSurface }}>
                                        <AuditRow time="14:22:15" action="Tally Validation" region="Western Sector 7" status="Verified" />
                                        <AuditRow time="14:21:58" action="Packet Integrity" region="Mainframe Alpha" status="Verified" />
                                        <AuditRow time="14:20:44" action="Credential Refresh" region="Security Terminal" status="Success" />
                                    </tbody>
                                </table>
                            </div>
                        </section>
                    </div>
                </div>

                {/* FOOTER */}
                <footer style={{ marginTop: 'auto', padding: '32px', borderTop: `1px solid ${colors.outline}`, textAlign: 'center' }}>
                    <p style={{ fontSize: '10px', color: colors.onSurfaceVariant, opacity: 0.6, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                        © 2024 Institutional Voting Authority • Encrypted by AES-256
                    </p>
                </footer>
            </main>
        </div>
    );
}

// --- SUB-COMPONENTES AUXILIARES ---

function NavItem({ icon, label, active = false, small = false }) {
    return (
        <div style={{
            display: 'flex', alignItems: 'center', gap: '12px',
            padding: small ? '8px 16px' : '12px 16px',
            borderRadius: '12px',
            backgroundColor: active ? 'rgba(65, 238, 194, 0.1)' : 'transparent',
            color: active ? colors.secondary : colors.onSurfaceVariant,
            fontWeight: active ? 700 : 400,
            cursor: 'pointer', transition: '0.2s'
        }}>
            <span className="material-symbols-outlined" style={{ fontSize: small ? '20px' : '24px' }}>{icon}</span>
            <span style={{ fontSize: small ? '13px' : '15px' }}>{label}</span>
        </div>
    );
}

function ResultBar({ label, votes, percent, color }) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                <span>{label}</span>
                <span style={{ color: color, fontWeight: 600 }}>{votes} votes</span>
            </div>
            <div style={{ height: '12px', backgroundColor: colors.surfaceContainer, borderRadius: '6px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: percent, backgroundColor: color }} />
            </div>
        </div>
    );
}

function AuditRow({ time, action, region, status }) {
    return (
        <tr style={{ borderBottom: `1px solid ${colors.outline}` }}>
            <td style={{ padding: '16px', fontFamily: 'monospace', opacity: 0.7 }}>{time}</td>
            <td style={{ padding: '16px', fontWeight: 700, color: colors.primary }}>{action}</td>
            <td style={{ padding: '16px' }}>{region}</td>
            <td style={{ padding: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: colors.secondary }} />
                    {status}
                </div>
            </td>
        </tr>
    );
}