
import { useNavigate } from 'react-router-dom';
import Stepper from '../components/ui/Stepper'

// --- ESTILOS COMPARTIDOS (Idénticos a RegistroIdentidad) ---
const glassCard = {
    background: 'rgba(19, 22, 42, 0.8)',
    backdropFilter: 'blur(12px)',
    border: '1px solid rgba(255, 255, 255, 0.06)',
};

const steps = [
    { n: 1, label: 'Identidad' },
    { n: 2, label: 'Facial' },
    { n: 3, label: 'Biométrico' },
    { n: 4, label: 'Verificación' },
];

export default function ConfirmacionRegistro() {
    const navigate = useNavigate();
    const currentStep = 4; // Paso actual es Verificación

    return (
        <div style={{ background: '#14121c', color: '#e6e0ef', minHeight: '100vh', fontFamily: 'Inter, sans-serif', display: 'flex', flexDirection: 'column' }}>

            {/* HEADER (Idéntico) */}
            <header style={{
                position: 'fixed', top: 0, width: '100%', zIndex: 50,
                background: 'rgba(20,18,28,0.8)', backdropFilter: 'blur(20px)',
                borderBottom: '1px solid rgba(255,255,255,0.1)', height: '64px',
                display: 'flex', alignItems: 'center',
            }}>
                <div style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '0 40px', width: '100%', maxWidth: '1280px', margin: '0 auto',
                }}>
                    <span onClick={() => navigate('/')} style={{
                        fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700,
                        fontSize: '20px', color: '#c9beff', letterSpacing: '0.15em', cursor: 'pointer'
                    }}>
                        NEXA VOTE
                    </span>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <span className="material-symbols-outlined" style={{ color: '#41eec2' }}>lock</span>
                        <span className="material-symbols-outlined" style={{ color: '#41eec2' }}>verified_user</span>
                    </div>
                </div>
            </header>

            {/* MAIN */}
            <main style={{ paddingTop: '96px', paddingBottom: '48px', flex: 1 }}>
                <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 24px', display: 'flex', flexDirection: 'column', gap: '32px' }}>

                    {/* STEPPER */}
                    <Stepper steps={steps} currentStep={4} />

                    {/* TITLE */}
                    <div style={{ textAlign: 'center' }}>
                        <h1 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: '28px', color: '#fff', marginBottom: '12px' }}>
                            Confirmación de Registro
                        </h1>
                        <p style={{ color: '#c9c3d9', fontSize: '16px', lineHeight: '24px', maxWidth: '520px', margin: '0 auto' }}>
                            Por favor, revise que toda la información capturada sea correcta antes de finalizar el proceso.
                        </p>
                    </div>

                    {/* CONTENT CARD */}
                    <section style={{ ...glassCard, borderRadius: '16px', padding: '32px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
                        
                        {/* Perfil y Header de Datos */}
                        <div style={{ display: 'flex', gap: '24px', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '24px' }}>
                            <div style={{ width: '100px', height: '100px', borderRadius: '12px', overflow: 'hidden', border: '2px solid #6c47ff' }}>
                                <img 
                                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCeWuNUhk99LQRkOfMyu5_kTKiESepjmLTkMpSCHJW1PUvivLvmSeOul1_prLjECurrAWcf1Jz3u9LxAwaETgdI85ba_ZnebxldCFid4RRmASuae6a0_T__17vzvU8EnFNzGFlcUtbXCsARg4NgmwI5hSHlbGPjAuOkvDMpBteJ1Zdby31zdY5m7mQ-5jBpBdEljl1PVHLAHENSJuWemCuTPDEg_-HmYRFmL-Oj52ySq9puR8iHqQEqgvuAyKf7w4RBBxmoXht0psg" 
                                    alt="Captura" 
                                    style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(100%) brightness(0.8)' }}
                                />
                            </div>
                            <div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(65, 238, 194, 0.1)', padding: '4px 12px', borderRadius: '999px', width: 'fit-content', marginBottom: '8px' }}>
                                    <span className="material-symbols-outlined" style={{ color: '#41eec2', fontSize: '14px' }}>verified</span>
                                    <span style={{ fontSize: '10px', color: '#41eec2', fontWeight: 700, letterSpacing: '0.1em' }}>IDENTIDAD VERIFICADA</span>
                                </div>
                                <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '22px', fontWeight: 700, color: '#c9beff', margin: 0 }}>
                                    ALBERTO ENRIQUE RODRÍGUEZ
                                </h2>
                                <p style={{ fontSize: '14px', color: '#c9c3d9', opacity: 0.7, margin: '4px 0 0 0', fontFamily: 'Space Grotesk, sans-serif', letterSpacing: '0.05em' }}>
                                    V-29.485.102-K
                                </p>
                            </div>
                        </div>

                        {/* Info Grid */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                            {[
                                { label: 'Nombre Completo', value: 'Alberto Enrique Rodríguez S.' },
                                { label: 'Estado DNI', value: 'Documento Nacional Verificado', ok: true },
                                { label: 'Validación Facial', value: 'Prueba de Vida Exitosa', ok: true },
                                { label: 'Registro Biométrico', value: 'Huella Dactilar Indexada', ok: true }
                            ].map((item, idx) => (
                                <div key={idx} style={{ background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                    <span style={{ fontSize: '10px', color: '#c9c3d9', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: '4px' }}>{item.label}</span>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span style={{ fontSize: '15px', color: '#fff', fontWeight: 500 }}>{item.value}</span>
                                        {item.ok && <span className="material-symbols-outlined" style={{ color: '#41eec2', fontSize: '18px' }}>check_circle</span>}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Certification Message */}
                        <div style={{ display: 'flex', gap: '12px', padding: '16px', background: 'rgba(108,71,255,0.05)', borderRadius: '12px', border: '1px solid rgba(108,71,255,0.2)' }}>
                            <span className="material-symbols-outlined" style={{ color: '#6c47ff' }}>info</span>
                            <p style={{ fontSize: '13px', color: '#c9beff', lineHeight: '1.5', margin: 0 }}>
                                Al completar el registro, usted certifica que los datos proporcionados son verídicos y autoriza su uso para procesos de votación institucional.
                            </p>
                        </div>
                    </section>

                    {/* BUTTONS (Idénticos) */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', marginTop: '8px' }}>
                        <button
                            onClick={() => navigate(-1)}
                            style={{
                                padding: '14px 32px', border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: '999px', background: 'transparent', color: '#c9c3d9',
                                fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600, fontSize: '14px',
                                cursor: 'pointer', transition: 'background 0.2s', letterSpacing: '0.05em',
                            }}
                            onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                            onMouseOut={e => e.currentTarget.style.background = 'transparent'}
                        >
                            Editar Información
                        </button>
                        <button
                            onClick={() => alert('Registro Completado')}
                            style={{
                                display: 'flex', alignItems: 'center', gap: '8px',
                                padding: '14px 48px', background: '#6c47ff',
                                borderRadius: '999px', border: 'none', color: '#fff',
                                fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600, fontSize: '14px',
                                cursor: 'pointer', letterSpacing: '0.05em',
                                boxShadow: '0 8px 24px rgba(108,71,255,0.25)',
                                transition: 'opacity 0.2s',
                            }}
                            onMouseOver={e => e.currentTarget.style.opacity = '0.9'}
                            onMouseOut={e => e.currentTarget.style.opacity = '1'}
                        >
                            Finalizar Registro
                            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>how_to_reg</span>
                        </button>
                    </div>

                    {/* Indicator */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', opacity: 0.4 }}>
                        <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>lock</span>
                        <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                            Transacción Protegida con Blockchain
                        </span>
                    </div>

                </div>
            </main>

            {/* FOOTER (Idéntico) */}
            <footer style={{ background: '#14121c', borderTop: '1px solid rgba(255,255,255,0.05)', padding: '32px 40px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '1280px', margin: '0 auto', flexWrap: 'wrap', gap: '16px' }}>
                    <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '12px', color: '#c9c3d9', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                        © 2024 NEXA VOTE • Encrypted by AES-256
                    </span>
                    <div style={{ display: 'flex', gap: '16px' }}>
                        {['Privacy Policy', 'Security Protocol', 'Audit Status'].map(link => (
                            <span key={link} style={{ color: '#c9c3d9', fontSize: '12px', textDecoration: 'underline', cursor: 'pointer', fontFamily: 'Space Grotesk, sans-serif', letterSpacing: '0.05em' }}>{link}</span>
                        ))}
                    </div>
                </div>
            </footer>
        </div>
    );
}