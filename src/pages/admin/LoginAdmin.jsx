import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// --- ESTILOS COMPARTIDOS (Basados en tu sistema de diseño) ---
const glassPanel = {
    background: 'rgba(19, 22, 42, 0.8)',
    backdropFilter: 'blur(12px)',
    border: '1px solid rgba(255, 255, 255, 0.06)',
};

const inputStyle = {
    background: '#13162A',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    transition: 'all 0.3s ease',
};

export default function AdminLogin() {
    const navigate = useNavigate();
    const [credentials, setCredentials] = useState({ username: '', password: '' });

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Accediendo como admin:", credentials.username);
        // Aquí iría tu lógica de autenticación
    };

    return (
        <div style={{ 
            backgroundColor: '#0A0C14', 
            backgroundImage: 'radial-gradient(rgba(108, 71, 255, 0.05) 1px, transparent 1px)', 
            backgroundSize: '32px 32px',
            minHeight: '100vh',
            color: '#e6e0ef',
            fontFamily: 'Inter, sans-serif',
            display: 'flex',
            flexDirection: 'column'
        }}>

            {/* HEADER */}
            <header style={{
                position: 'fixed', top: 0, width: '100%', zIndex: 50,
                background: 'rgba(20, 18, 28, 0.8)', backdropFilter: 'blur(20px)',
                borderBottom: '1px solid rgba(255, 255, 255, 0.1)', height: '64px'
            }}>
                <div style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '0 40px', maxWidth: '1280px', margin: '0 auto', height: '100%'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <span onClick={() => navigate('/')} style={{
                            fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700,
                            fontSize: '20px', color: '#c9beff', letterSpacing: '0.15em', cursor: 'pointer'
                        }}>
                            NEXA VOTE
                        </span>
                        <div style={{ height: '24px', width: '1px', background: 'rgba(255,255,255,0.1)' }} className="hidden md:block"></div>
                        <span style={{ 
                            fontFamily: 'Space Grotesk, sans-serif', fontSize: '10px', 
                            color: '#c9c3d9', letterSpacing: '0.2em', textTransform: 'uppercase' 
                        }} className="hidden sm:block">
                            Portal de Administración
                        </span>
                    </div>
                    <div style={{ display: 'flex', gap: '12px' }}>
                        <span className="material-symbols-outlined" style={{ color: '#c9beff', fontVariationSettings: "'FILL' 1" }}>lock</span>
                        <span className="material-symbols-outlined" style={{ color: '#c9beff' }}>verified_user</span>
                    </div>
                </div>
            </header>

            {/* MAIN CONTENT */}
            <main style={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '96px 16px 48px' }}>
                <div style={{ width: '100%', maxWidth: '480px' }}>
                    
                    {/* Header de Acceso */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '40px' }}>
                        <div style={{ 
                            width: '64px', height: '64px', background: 'rgba(108, 71, 255, 0.1)', 
                            borderRadius: '50%', display: 'flex', alignItems: 'center', 
                            justifyContent: 'center', marginBottom: '16px', border: '1px solid rgba(201, 190, 255, 0.2)' 
                        }}>
                            <span className="material-symbols-outlined" style={{ color: '#c9beff', fontSize: '32px' }}>admin_panel_settings</span>
                        </div>
                        <h1 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '28px', fontWeight: 600, textAlign: 'center', color: '#fff' }}>
                            Acceso Restringido
                        </h1>
                        <p style={{ 
                            fontFamily: 'Space Grotesk, sans-serif', fontSize: '10px', color: '#c9c3d9', 
                            marginTop: '8px', letterSpacing: '0.15em', textTransform: 'uppercase' 
                        }}>
                            Institutional Voting Authority • Admin v4.0
                        </p>
                    </div>

                    {/* FORM CARD */}
                    <section style={{ ...glassPanel, borderRadius: '16px', padding: '32px', position: 'relative', overflow: 'hidden' }}>
                        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '4px', background: '#c9beff' }}></div>
                        
                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                            {/* Usuario */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <label style={{ fontSize: '14px', color: '#c9c3d9', fontWeight: 600 }}>Nombre de Usuario</label>
                                <div style={{ position: 'relative' }}>
                                    <span className="material-symbols-outlined" style={{ 
                                        position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)',
                                        fontSize: '20px', color: '#c9c3d9'
                                    }}>person</span>
                                    <input 
                                        type="text" 
                                        name="username"
                                        placeholder="IDENTIFICADOR_ADMIN"
                                        value={credentials.username}
                                        onChange={handleChange}
                                        style={{ 
                                            ...inputStyle, width: '100%', padding: '14px 16px 14px 48px', 
                                            borderRadius: '8px', color: '#fff', outline: 'none' 
                                        }}
                                        onFocus={(e) => e.target.style.borderColor = '#c9beff'}
                                        onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                                    />
                                </div>
                            </div>

                            {/* Password */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <label style={{ fontSize: '14px', color: '#c9c3d9', fontWeight: 600 }}>Contraseña</label>
                                    <a href="#" style={{ fontSize: '10px', color: '#c9beff', textTransform: 'uppercase', textDecoration: 'none' }}>¿Olvido de Credenciales?</a>
                                </div>
                                <div style={{ position: 'relative' }}>
                                    <span className="material-symbols-outlined" style={{ 
                                        position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)',
                                        fontSize: '20px', color: '#c9c3d9'
                                    }}>key</span>
                                    <input 
                                        type="password" 
                                        name="password"
                                        placeholder="••••••••••••"
                                        value={credentials.password}
                                        onChange={handleChange}
                                        style={{ 
                                            ...inputStyle, width: '100%', padding: '14px 16px 14px 48px', 
                                            borderRadius: '8px', color: '#fff', outline: 'none' 
                                        }}
                                        onFocus={(e) => e.target.style.borderColor = '#c9beff'}
                                        onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                                    />
                                </div>
                            </div>

                            {/* Submit */}
                            <button type="submit" style={{
                                background: '#6c47ff', color: '#fff', border: 'none', padding: '16px',
                                borderRadius: '8px', fontWeight: 700, fontSize: '16px', cursor: 'pointer',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px',
                                transition: 'all 0.2s'
                            }}
                            onMouseOver={e => e.currentTarget.style.filter = 'brightness(1.1)'}
                            onMouseOut={e => e.currentTarget.style.filter = 'brightness(1)'}
                            >
                                <span className="material-symbols-outlined">login</span>
                                Acceder como Administrador
                            </button>
                        </form>

                        {/* Security Badges */}
                        <div style={{ marginTop: '32px', paddingTop: '24px', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '8px 12px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                <span className="material-symbols-outlined" style={{ color: '#41eec2', fontSize: '18px', fontVariationSettings: "'FILL' 1" }}>shield_lock</span>
                                <span style={{ fontSize: '10px', color: '#c9c3d9', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Encriptación AES-256 en curso</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '8px 12px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                <span className="material-symbols-outlined" style={{ color: '#ffb691', fontSize: '18px', fontVariationSettings: "'FILL' 1" }}>location_on</span>
                                <span style={{ fontSize: '10px', color: '#c9c3d9', textTransform: 'uppercase', letterSpacing: '0.1em' }}>IP: 192.168.1.104</span>
                            </div>
                        </div>
                    </section>

                    {/* Secondary Links */}
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', marginTop: '24px' }}>
                        {['Soporte IT', 'Protocolos', 'Verificar Nodo'].map((text, idx) => (
                            <React.Fragment key={text}>
                                <a href="#" style={{ fontSize: '11px', color: '#c9c3d9', textTransform: 'uppercase', letterSpacing: '0.15em', textDecoration: 'none' }}>{text}</a>
                                {idx < 2 && <span style={{ color: 'rgba(255,255,255,0.1)' }}>•</span>}
                            </React.Fragment>
                        ))}
                    </div>
                </div>
            </main>

            {/* FOOTER */}
            <footer style={{ background: '#14121c', borderTop: '1px solid rgba(255, 255, 255, 0.05)', padding: '32px 40px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '1280px', margin: '0 auto', flexWrap: 'wrap', gap: '16px' }}>
                    <span style={{ fontSize: '10px', color: '#c9c3d9', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                        © 2024 NEXA VOTE • Institutional Voting Authority • Encrypted by AES-256
                    </span>
                    <div style={{ display: 'flex', gap: '24px' }}>
                        {['Privacy Policy', 'Security Protocol', 'Audit Status'].map(link => (
                            <a key={link} href="#" style={{ color: '#c9c3d9', fontSize: '11px', textDecoration: 'underline' }}>{link}</a>
                        ))}
                    </div>
                </div>
            </footer>
        </div>
    );
}