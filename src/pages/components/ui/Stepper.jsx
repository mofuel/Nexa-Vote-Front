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

                            ...(step.n === currentStep
                                ? {
                                    background: 'var(--accent)',
                                    color: 'var(--text-on-accent)',
                                    boxShadow: '0 0 0 4px rgba(108,71,255,0.2)'
                                }
                                : step.n < currentStep
                                    ? {
                                        background: 'rgba(65,238,194,0.15)',
                                        color: 'var(--color-icon-teal)',
                                        border: '2px solid var(--color-icon-teal)'
                                    }
                                    : {
                                        border: '2px solid var(--border)',
                                        color: 'var(--text-secondary)',
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

                            color:
                                step.n === currentStep
                                    ? 'var(--text-accent)'
                                    : step.n < currentStep
                                        ? 'var(--color-icon-teal)'
                                        : 'var(--text-secondary)',

                            opacity: step.n > currentStep ? 0.4 : 1,
                        }}>
                            {step.label}
                        </span>
                    </div>

                    {i < steps.length - 1 && (
                        <div
                            style={{
                                flex: 1,
                                height: '1px',
                                margin: '0 8px 24px',
                                background:
                                    step.n < currentStep
                                        ? 'rgba(65,238,194,0.4)'
                                        : 'var(--border-light)',
                                transition: 'background 0.4s',
                            }}
                        />
                    )}
                </div>
            ))}
        </nav>
    )
}