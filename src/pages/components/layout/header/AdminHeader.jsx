import { useTheme } from "../../../../context/ThemeContext";

export default function AdminHeader({ onMenuClick }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <header style={{
      position: 'sticky', top: 0, width: '100%', zIndex: 40,
      background: 'var(--bg-glass)', backdropFilter: 'blur(20px)',
      borderBottom: '1px solid var(--border-light)',
      height: '64px', display: 'flex', alignItems: 'center',
      justifyContent: 'space-between', padding: '0 40px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <button
          onClick={onMenuClick}
          style={{ background: 'none', border: 'none', color: 'var(--text-accent)', cursor: 'pointer', padding: '8px' }}
        >
          <span className="material-symbols-outlined">menu</span>
        </button>
        <h1 style={{
          fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700,
          fontSize: '20px', color: 'var(--text-accent)', letterSpacing: '0.15em',
          textTransform: 'uppercase',
        }}>
          NEXA VOTE
        </h1>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
        <div style={{ display: 'flex', gap: '24px' }}>
          {['Resumen', 'Regiones', 'Seguridad'].map((item, i) => (
            <span key={item} style={{
              color: i === 0 ? 'var(--text-accent)' : 'var(--text-secondary)',
              fontWeight: i === 0 ? 700 : 400,
              borderBottom: i === 0 ? '2px solid var(--text-accent)' : 'none',
              paddingBottom: i === 0 ? '4px' : '0',
              cursor: 'pointer', fontSize: '15px',
            }}>
              {item}
            </span>
          ))}
        </div>
        <button className="theme-toggle" onClick={toggleTheme} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-accent)' }}>
          <span className="material-symbols-outlined">{theme === "light" ? "dark_mode" : "light_mode"}</span>
        </button>
        <div style={{
          width: '32px', height: '32px', borderRadius: '50%',
          background: '#36333e', border: '1px solid var(--border)',
          overflow: 'hidden',
        }}>
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAR4p02u8Buk4sTYj6FWPMp-EIMZqhjTfAiDlgehAvo1IGMDUEThvXeWnYuiCQGFeQUL2cT882cL2FtT1iUkLQYoVTilg-vnUEPXbK-QMh-cz5DX2PrtPeALkMu510tWk31tpKBOt9iLFBisTOM2N78DJqOqO4eWIWvo5MVumd2PzfCVU65em-2uSwiqmL41WUCM5co8nJwmZFbhTTqvFUPe2mhA_lE9oxaHMyTfaqfas93B1dYDaFA8r5o_EXgkMLA1Si-QuQmVe0"
            alt="Admin"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>
      </div>
    </header>
  )
}