import { useNavigate } from 'react-router-dom'
import { useRef, useState, useEffect, useCallback } from 'react'
import Stepper from '../components/ui/Stepper'

const glassCard = {
    background: 'rgba(19, 22, 42, 0.8)',
    backdropFilter: 'blur(12px)',
    border: '1px solid rgba(255, 255, 255, 0.06)',
}



const steps = [
    { n: 1, label: 'Identidad' },
    { n: 2, label: 'Facial' },
    { n: 3, label: 'Biométrico' },
    { n: 4, label: 'Verificación' },
]

// Scanning animation line
function ScanLine() {
    return (
        <div style={{
            position: 'absolute',
            top: 0, left: 0, right: 0,
            height: '2px',
            background: 'linear-gradient(90deg, transparent, #c9beff, transparent)',
            animation: 'scanLine 3s linear infinite',
            zIndex: 10,
            pointerEvents: 'none',
        }} />
    )
}

export default function RegistroReconocimiento() {
    const navigate = useNavigate()
    const videoRef = useRef(null)
    const canvasRef = useRef(null)
    const streamRef = useRef(null)

    const [cameraState, setCameraState] = useState('idle') // idle | active | captured | error
    const [capturedImage, setCapturedImage] = useState(null)
    const [checks, setChecks] = useState({
        neutral: false,
        lighting: false,
        centered: false,
    })

    // Simulate detection checks when camera is active
    useEffect(() => {
        if (cameraState !== 'active') return
        const t1 = setTimeout(() => setChecks(c => ({ ...c, neutral: true })), 1200)
        const t2 = setTimeout(() => setChecks(c => ({ ...c, lighting: true })), 2000)
        const t3 = setTimeout(() => setChecks(c => ({ ...c, centered: true })), 2800)
        return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3) }
    }, [cameraState])

    const startCamera = useCallback(async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user', width: 640, height: 480 } })
            streamRef.current = stream
            if (videoRef.current) {
                videoRef.current.srcObject = stream
                videoRef.current.play()
            }
            setCameraState('active')
            setChecks({ neutral: false, lighting: false, centered: false })
            setCapturedImage(null)
        } catch {
            setCameraState('error')
        }
    }, [])

    const stopCamera = useCallback(() => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(t => t.stop())
            streamRef.current = null
        }
    }, [])

    const capturePhoto = useCallback(() => {
        if (!videoRef.current || !canvasRef.current) return
        const video = videoRef.current
        const canvas = canvasRef.current
        canvas.width = video.videoWidth || 640
        canvas.height = video.videoHeight || 480
        const ctx = canvas.getContext('2d')
        ctx.drawImage(video, 0, 0)
        const dataUrl = canvas.toDataURL('image/jpeg', 0.9)
        setCapturedImage(dataUrl)
        setCameraState('captured')
        stopCamera()
    }, [stopCamera])

    const retake = useCallback(() => {
        setCapturedImage(null)
        startCamera()
    }, [startCamera])

    // Cleanup on unmount
    useEffect(() => () => stopCamera(), [stopCamera])



    return (
        <>
            <style>{`
        @keyframes scanLine {
          0%   { transform: translateY(0); }
          100% { transform: translateY(calc(100vh)); }
        }
        @keyframes pulse-ring {
          0%, 100% { opacity: 0.3; }
          50%       { opacity: 0.8; }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .check-item { animation: fadeIn 0.3s ease forwards; }
      `}</style>

            <div style={{ background: '#14121c', color: '#e6e0ef', minHeight: '100vh', fontFamily: 'Inter, sans-serif', display: 'flex', flexDirection: 'column' }}>

                {/* HEADER */}
                <header style={{
                    position: 'fixed',
                    top: 0,
                    width: '100%',
                    zIndex: 50,
                    background: 'rgba(20,18,28,0.8)',
                    backdropFilter: 'blur(20px)',
                    borderBottom: '1px solid rgba(255,255,255,0.1)',
                    height: '64px',
                    display: 'flex',
                    alignItems: 'center',
                }}>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '0 40px',
                        width: '100%',
                        maxWidth: '1280px',
                        margin: '0 auto',
                    }}>
                        <span
                            onClick={() => navigate('/')}
                            style={{
                                fontFamily: 'Space Grotesk, sans-serif',
                                fontWeight: 700,
                                fontSize: '20px',
                                color: '#c9beff',
                                letterSpacing: '0.15em',
                                cursor: 'pointer'
                            }}
                        >
                            NEXA VOTE
                        </span>

                        <div style={{ display: 'flex', gap: '8px' }}>
                            <span className="material-symbols-outlined" style={{ color: '#41eec2' }}>lock</span>
                            <span className="material-symbols-outlined" style={{ color: '#41eec2' }}>verified_user</span>
                        </div>
                    </div>
                </header>

                {/* Main */}
                <main style={{ paddingTop: '96px', paddingBottom: '48px', flex: 1 }}>
                    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 24px', display: 'flex', flexDirection: 'column', gap: '32px' }}>

                        {/* Progress Stepper */}
                        <Stepper steps={steps} currentStep={2} />

                        {/* Title */}
                        <div style={{ textAlign: 'center' }}>
                            <div style={{
                                display: 'inline-flex', alignItems: 'center', gap: '8px',
                                padding: '4px 14px', background: 'rgba(108,71,255,0.1)',
                                borderRadius: '999px', border: '1px solid rgba(108,71,255,0.2)',
                                marginBottom: '16px',
                            }}>
                                <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '10px', color: '#c9beff', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Paso 2</span>
                                <span style={{ width: '3px', height: '3px', background: '#6c47ff', borderRadius: '50%' }} />
                                <span className="material-symbols-outlined" style={{ color: '#c9beff', fontSize: '12px' }}>security</span>
                                <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '10px', color: '#c9c3d9', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Encriptado AES-256</span>
                            </div>
                            <h1 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: '28px', color: '#fff', marginBottom: '12px' }}>
                                Reconocimiento Facial
                            </h1>
                            <p style={{ color: '#c9c3d9', fontSize: '16px', lineHeight: '24px', maxWidth: '480px', margin: '0 auto' }}>
                                Posicione su rostro dentro del marco para completar la validación de identidad institucional.
                            </p>
                        </div>

                        {/* Camera Section */}
                        <section style={{ ...glassCard, borderRadius: '16px', padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px' }}>

                            {/* Camera viewport */}
                            <div style={{
                                position: 'relative',
                                width: '100%',
                                aspectRatio: '4/3',
                                borderRadius: '12px',
                                overflow: 'hidden',
                                background: '#0e0d17',
                                border: '1px solid rgba(255,255,255,0.08)',
                            }}>
                                {/* Hidden canvas for capture */}
                                <canvas ref={canvasRef} style={{ display: 'none' }} />

                                {/* IDLE state */}
                                {cameraState === 'idle' && (
                                    <div style={{
                                        position: 'absolute', inset: 0,
                                        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '20px',
                                    }}>
                                        <div style={{
                                            width: '80px', height: '80px', borderRadius: '50%',
                                            background: 'rgba(108,71,255,0.12)',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            border: '1px solid rgba(108,71,255,0.25)',
                                        }}>
                                            <span className="material-symbols-outlined" style={{ color: '#6c47ff', fontSize: '40px' }}>face</span>
                                        </div>
                                        <div style={{ textAlign: 'center' }}>
                                            <p style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600, fontSize: '16px', color: '#e6e0ef', marginBottom: '6px' }}>
                                                Cámara lista
                                            </p>
                                            <p style={{ fontSize: '13px', color: '#c9c3d9' }}>Pulse "Iniciar Cámara" para comenzar</p>
                                        </div>
                                    </div>
                                )}

                                {/* ERROR state */}
                                {cameraState === 'error' && (
                                    <div style={{
                                        position: 'absolute', inset: 0,
                                        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px',
                                    }}>
                                        <span className="material-symbols-outlined" style={{ color: '#ffb4ab', fontSize: '48px' }}>videocam_off</span>
                                        <p style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600, fontSize: '15px', color: '#ffb4ab', textAlign: 'center', maxWidth: '260px' }}>
                                            No se pudo acceder a la cámara. Verifique los permisos del navegador.
                                        </p>
                                    </div>
                                )}

                                {/* ACTIVE state */}
                                {(cameraState === 'active') && (
                                    <>
                                        <video
                                            ref={videoRef}
                                            autoPlay
                                            playsInline
                                            muted
                                            style={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'scaleX(-1)' }}
                                        />
                                        {/* Scan line animation */}
                                        <ScanLine />
                                        {/* Face frame overlay */}
                                        <div style={{
                                            position: 'absolute', inset: 0,
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            pointerEvents: 'none',
                                        }}>
                                            <div style={{
                                                width: '220px', height: '280px',
                                                border: '2px solid rgba(201,190,255,0.3)',
                                                borderRadius: '50% 50% 45% 45%',
                                                position: 'relative',
                                                animation: 'pulse-ring 2s ease-in-out infinite',
                                            }}>
                                                {/* Corner accents */}
                                                {[
                                                    { top: '-2px', left: '-2px', borderTop: '3px solid #c9beff', borderLeft: '3px solid #c9beff', borderTopLeftRadius: '12px' },
                                                    { top: '-2px', right: '-2px', borderTop: '3px solid #c9beff', borderRight: '3px solid #c9beff', borderTopRightRadius: '12px' },
                                                    { bottom: '-2px', left: '-2px', borderBottom: '3px solid #c9beff', borderLeft: '3px solid #c9beff', borderBottomLeftRadius: '12px' },
                                                    { bottom: '-2px', right: '-2px', borderBottom: '3px solid #c9beff', borderRight: '3px solid #c9beff', borderBottomRightRadius: '12px' },
                                                ].map((s, idx) => (
                                                    <div key={idx} style={{ position: 'absolute', width: '28px', height: '28px', boxShadow: '0 0 12px rgba(201,190,255,0.35)', ...s }} />
                                                ))}
                                                {/* Inner pulse ring */}
                                                <div style={{
                                                    position: 'absolute', inset: '12px',
                                                    border: '1px solid rgba(201,190,255,0.15)',
                                                    borderRadius: '50% 50% 40% 40%',
                                                }} />
                                            </div>
                                        </div>
                                        {/* Status chips */}
                                        <div style={{
                                            position: 'absolute', bottom: '12px', left: '12px', right: '12px',
                                            display: 'flex', gap: '8px', flexWrap: 'wrap',
                                        }}>
                                            {[
                                                { key: 'neutral', label: 'Expresión neutra' },
                                                { key: 'lighting', label: 'Iluminación óptima' },
                                                { key: 'centered', label: 'Rostro centrado' },
                                            ].map(({ key, label }) => (
                                                <div key={key} className={checks[key] ? 'check-item' : ''} style={{
                                                    display: 'flex', alignItems: 'center', gap: '6px',
                                                    padding: '4px 10px',
                                                    background: checks[key] ? 'rgba(65,238,194,0.1)' : 'rgba(20,18,28,0.7)',
                                                    backdropFilter: 'blur(8px)',
                                                    borderRadius: '999px',
                                                    border: checks[key] ? '1px solid rgba(65,238,194,0.3)' : '1px solid rgba(255,255,255,0.1)',
                                                    transition: 'all 0.35s ease',
                                                }}>
                                                    <span style={{
                                                        width: '6px', height: '6px', borderRadius: '50%',
                                                        background: checks[key] ? '#41eec2' : '#6c47ff',
                                                        boxShadow: checks[key] ? '0 0 6px #41eec2' : 'none',
                                                        transition: 'all 0.35s',
                                                    }} />
                                                    <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '10px', color: checks[key] ? '#41eec2' : '#c9c3d9', letterSpacing: '0.05em' }}>
                                                        {label}
                                                    </span>
                                                    {checks[key] && (
                                                        <span className="material-symbols-outlined" style={{ color: '#41eec2', fontSize: '12px' }}>check_circle</span>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </>
                                )}

                                {/* CAPTURED state */}
                                {cameraState === 'captured' && capturedImage && (
                                    <>
                                        <img
                                            src={capturedImage}
                                            alt="Foto capturada"
                                            style={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'scaleX(-1)' }}
                                        />
                                        <div style={{
                                            position: 'absolute', inset: 0,
                                            background: 'rgba(65,238,194,0.05)',
                                            display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
                                            paddingBottom: '16px',
                                        }}>
                                            <div style={{
                                                display: 'flex', alignItems: 'center', gap: '8px',
                                                padding: '8px 20px', background: 'rgba(65,238,194,0.15)',
                                                backdropFilter: 'blur(12px)', borderRadius: '999px',
                                                border: '1px solid rgba(65,238,194,0.4)',
                                            }}>
                                                <span className="material-symbols-outlined" style={{ color: '#41eec2', fontSize: '18px' }}>check_circle</span>
                                                <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '13px', color: '#41eec2', fontWeight: 600, letterSpacing: '0.05em' }}>
                                                    Foto capturada correctamente
                                                </span>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>

                            {/* Action buttons */}
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center', justifyContent: 'space-between' }}>

                                {/* Left: Start / Retake */}
                                <div style={{ display: 'flex', gap: '12px' }}>
                                    {(cameraState === 'idle' || cameraState === 'error') && (
                                        <button
                                            onClick={startCamera}
                                            style={{
                                                display: 'flex', alignItems: 'center', gap: '8px',
                                                padding: '12px 28px', background: '#6c47ff',
                                                borderRadius: '999px', border: 'none', color: '#fff',
                                                fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600, fontSize: '14px',
                                                cursor: 'pointer', boxShadow: '0 8px 24px rgba(108,71,255,0.3)',
                                                letterSpacing: '0.05em', transition: 'opacity 0.2s',
                                            }}
                                            onMouseOver={e => e.currentTarget.style.opacity = '0.9'}
                                            onMouseOut={e => e.currentTarget.style.opacity = '1'}
                                        >
                                            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>videocam</span>
                                            Iniciar Cámara
                                        </button>
                                    )}

                                    {cameraState === 'active' && (
                                        <button
                                            onClick={capturePhoto}
                                            style={{
                                                display: 'flex', alignItems: 'center', gap: '8px',
                                                padding: '12px 28px', background: '#6c47ff',
                                                borderRadius: '999px', border: 'none', color: '#fff',
                                                fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600, fontSize: '14px',
                                                cursor: 'pointer', boxShadow: '0 8px 24px rgba(108,71,255,0.3)',
                                                letterSpacing: '0.05em', transition: 'opacity 0.2s',
                                            }}
                                            onMouseOver={e => e.currentTarget.style.opacity = '0.9'}
                                            onMouseOut={e => e.currentTarget.style.opacity = '1'}
                                        >
                                            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>photo_camera</span>
                                            Capturar Foto
                                        </button>
                                    )}

                                    {cameraState === 'captured' && (
                                        <button
                                            onClick={retake}
                                            style={{
                                                display: 'flex', alignItems: 'center', gap: '8px',
                                                padding: '12px 24px', background: 'transparent',
                                                borderRadius: '999px', border: '1px solid rgba(255,255,255,0.15)', color: '#c9c3d9',
                                                fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600, fontSize: '14px',
                                                cursor: 'pointer', letterSpacing: '0.05em', transition: 'background 0.2s',
                                            }}
                                            onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                                            onMouseOut={e => e.currentTarget.style.background = 'transparent'}
                                        >
                                            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>refresh</span>
                                            Reintentar
                                        </button>
                                    )}
                                </div>

                                {/* Tips */}
                                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                    {['Luz Natural', 'Sin Reflejos', 'Rostro centrado'].map(tip => (
                                        <div key={tip} style={{
                                            display: 'flex', alignItems: 'center', gap: '5px',
                                            padding: '4px 12px', background: 'rgba(255,255,255,0.04)',
                                            borderRadius: '999px', border: '1px solid rgba(255,255,255,0.06)',
                                        }}>
                                            <span className="material-symbols-outlined" style={{ color: '#41eec2', fontSize: '13px' }}>check_circle</span>
                                            <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '10px', color: '#c9c3d9', letterSpacing: '0.08em', textTransform: 'uppercase' }}>{tip}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </section>

                        {/* Navigation */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '8px', gap: '16px', flexWrap: 'wrap' }}>
                            <button
                                onClick={() => { stopCamera(); navigate('/registro/identidad') }}
                                style={{
                                    padding: '14px 32px', border: '1px solid rgba(255,255,255,0.1)',
                                    borderRadius: '999px', background: 'transparent', color: '#c9c3d9',
                                    fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600, fontSize: '14px',
                                    cursor: 'pointer', transition: 'background 0.2s', letterSpacing: '0.05em',
                                }}
                                onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                                onMouseOut={e => e.currentTarget.style.background = 'transparent'}
                            >
                                ← Volver
                            </button>
                            <button
                                onClick={() => { stopCamera(); navigate('/registro/huella') }}
                                disabled={cameraState !== 'captured'}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: '8px',
                                    padding: '14px 48px', background: cameraState === 'captured' ? '#6c47ff' : 'rgba(108,71,255,0.25)',
                                    borderRadius: '999px', border: 'none', color: cameraState === 'captured' ? '#fff' : 'rgba(255,255,255,0.3)',
                                    fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600, fontSize: '14px',
                                    cursor: cameraState === 'captured' ? 'pointer' : 'not-allowed',
                                    letterSpacing: '0.05em',
                                    boxShadow: cameraState === 'captured' ? '0 8px 24px rgba(108,71,255,0.25)' : 'none',
                                    transition: 'all 0.3s',
                                }}
                                onMouseOver={e => { if (cameraState === 'captured') e.currentTarget.style.opacity = '0.9' }}
                                onMouseOut={e => { e.currentTarget.style.opacity = '1' }}
                            >
                                Continuar
                                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>arrow_forward</span>
                            </button>
                        </div>

                        {/* Trust indicator */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '24px', opacity: 0.4, flexWrap: 'wrap' }}>
                            {[
                                { icon: 'encrypted', label: 'Punto a punto' },
                                { icon: 'cloud_off', label: 'Procesamiento Local' },
                                { icon: 'policy', label: 'GDPR Compliant' },
                            ].map(({ icon, label }) => (
                                <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>{icon}</span>
                                    <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{label}</span>
                                </div>
                            ))}
                        </div>

                    </div>
                </main>

                {/* Footer */}
                <footer style={{ background: '#14121c', borderTop: '1px solid rgba(255,255,255,0.05)', padding: '32px 40px', marginTop: '48px' }}>
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
        </>
    )
}