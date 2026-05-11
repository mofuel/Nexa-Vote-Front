export default function Footer() {
  return (
    <footer style={{
      background: '#14121c',
      borderTop: '1px solid rgba(255,255,255,0.05)',
      padding: '32px 40px',
      marginTop: 'auto',
    }}>
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        maxWidth: '1280px', margin: '0 auto', flexWrap: 'wrap', gap: '16px',
      }}>
        <span style={{
          fontFamily: 'Space Grotesk, sans-serif', fontSize: '11px',
          color: '#c9c3d9', letterSpacing: '0.1em', opacity: 0.6,
        }}>
          © 2024 Institutional Voting Authority • Encrypted by AES-256
        </span>
        <div style={{ display: 'flex', gap: '24px' }}>
          {['Privacy Policy', 'Security Protocol', 'Audit Status'].map(link => (
            <a key={link} href="#" style={{
              color: '#c9c3d9', fontSize: '11px',
              textDecoration: 'underline', opacity: 0.8,
              fontFamily: 'Space Grotesk, sans-serif', letterSpacing: '0.1em',
            }}>
              {link}
            </a>
          ))}
        </div>
      </div>
    </footer>
  )
}