export default function AdminHeader({ onMenuClick }) {
  return (
    <header style={{
      position: 'sticky', top: 0, width: '100%', zIndex: 40,
      background: 'rgba(20,18,28,0.8)', backdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(255,255,255,0.1)',
      height: '64px', display: 'flex', alignItems: 'center',
      justifyContent: 'space-between', padding: '0 40px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <button
          onClick={onMenuClick}
          style={{ background: 'none', border: 'none', color: '#c9beff', cursor: 'pointer', padding: '8px' }}
        >
          <span className="material-symbols-outlined">menu</span>
        </button>
        <h1 style={{
          fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700,
          fontSize: '20px', color: '#c9beff', letterSpacing: '0.15em',
          textTransform: 'uppercase',
        }}>
          NEXA VOTE
        </h1>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
        <div style={{ display: 'flex', gap: '24px' }}>
          {['Overview', 'Regions', 'Security'].map((item, i) => (
            <span key={item} style={{
              color: i === 0 ? '#c9beff' : '#c9c3d9',
              fontWeight: i === 0 ? 700 : 400,
              borderBottom: i === 0 ? '2px solid #c9beff' : 'none',
              paddingBottom: i === 0 ? '4px' : '0',
              cursor: 'pointer', fontSize: '15px',
            }}>
              {item}
            </span>
          ))}
        </div>
        <div style={{
          width: '32px', height: '32px', borderRadius: '50%',
          background: '#36333e', border: '1px solid rgba(255,255,255,0.1)',
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