const steps = [
  { label: 'Escaneo DNI' },
  { label: 'Reconocimiento Facial' },
  { label: 'Biométrico WebAuthn' },
]

export default function MFAStepper({ currentStep }) {
  return (
    <div style={{ position: 'relative', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>

      <div style={{
        position: 'absolute', top: '20px', left: '0', width: '100%',
        height: '2px', background: 'var(--border)', zIndex: 0,
      }} />

      <div style={{
        position: 'absolute', top: '20px', left: '0',
        width: currentStep === 1 ? '0%' : currentStep === 2 ? '50%' : '100%',
        height: '2px', background: 'var(--color-icon-teal)', zIndex: 0,
        transition: 'width 0.4s ease',
      }} />

      {steps.map((step, index) => {
        const stepNum = index + 1
        const isCompleted = stepNum < currentStep
        const isActive = stepNum === currentStep
        const isPending = stepNum > currentStep

        return (
          <div key={step.label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', zIndex: 1, flex: 1 }}>

            <div style={{
              width: '40px', height: '40px', borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 700, fontSize: '16px',
              border: '4px solid var(--bg-page)',
              background: isCompleted ? 'var(--color-icon-teal)' : isActive ? 'var(--accent)' : 'var(--bg-badge)',
              color: isCompleted ? '#04342C' : isActive ? 'var(--text-on-accent)' : 'var(--text-secondary)',
              transition: 'all 0.3s',
            }}>
              {isCompleted
                ? <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>check</span>
                : stepNum
              }
            </div>

            <span style={{
              fontFamily: 'Space Grotesk, sans-serif',
              fontSize: '10px', letterSpacing: '0.08em',
              textTransform: 'uppercase', fontWeight: 700, textAlign: 'center',
              color: isCompleted ? 'var(--color-icon-teal)' : isActive ? 'var(--text-accent)' : 'var(--text-secondary)',
              maxWidth: '90px', lineHeight: '14px',
            }}>
              {step.label}
            </span>
          </div>
        )
      })}
    </div>
  )
}