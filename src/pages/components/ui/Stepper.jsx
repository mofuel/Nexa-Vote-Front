export default function Stepper({ steps, currentStep }) {
    return (
        <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
            {steps.map((step, i) => (
                <div
                    key={step.n}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        flex: i < steps.length - 1 ? 1 : 'unset'
                    }}
                >
                    {/* STEP ITEM */}
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '8px',
                        minWidth: '80px'
                    }}>
                        <div style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontFamily: 'Space Grotesk, sans-serif',
                            fontWeight: 700,

                            // 🔥 MISMO ESTILO EXACTO
                            ...(step.n === currentStep
                                ? {
                                    background: '#6c47ff',
                                    color: '#fff',
                                    boxShadow: '0 0 0 4px rgba(108,71,255,0.2)'
                                }
                                : step.n < currentStep
                                    ? {
                                        background: 'rgba(65,238,194,0.15)',
                                        color: '#41eec2',
                                        border: '2px solid #41eec2'
                                    }
                                    : {
                                        border: '2px solid rgba(255,255,255,0.2)',
                                        color: '#c9c3d9',
                                        opacity: 0.4
                                    }
                            ),
                        }}>
                            {step.n < currentStep ? (
                                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
                                    check
                                </span>
                            ) : (
                                step.n
                            )}
                        </div>

                        <span style={{
                            fontFamily: 'Space Grotesk, sans-serif',
                            fontSize: '12px',
                            fontWeight: 600,
                            letterSpacing: '0.05em',
                            textAlign: 'center',

                            // MISMA LÓGICA DE COLOR
                            color:
                                step.n === currentStep
                                    ? '#c9beff'
                                    : step.n < currentStep
                                        ? '#41eec2'
                                        : '#c9c3d9',

                            opacity: step.n > currentStep ? 0.4 : 1,
                        }}>
                            {step.label}
                        </span>
                    </div>

                    {/* LINEA */}
                    {i < steps.length - 1 && (
                        <div
                            style={{
                                flex: 1,
                                height: '1px',
                                margin: '0 8px 24px',
                                background:
                                    step.n < currentStep
                                        ? 'rgba(65,238,194,0.4)'
                                        : 'rgba(255,255,255,0.1)',
                                transition: 'background 0.4s',
                            }}
                        />
                    )}
                </div>
            ))}
        </nav>
    )
}