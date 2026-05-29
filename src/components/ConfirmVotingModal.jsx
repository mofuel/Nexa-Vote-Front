export default function ConfirmVotingModal({ isOpen, nextState, onConfirm, onCancel }) {
  if (!isOpen) return null;

  const action = nextState ? 'ACTIVAR' : 'CERRAR';
  const warning = nextState
    ? 'Esto permitirá que los votantes registrados emitan su voto.'
    : 'Esto detendrá la recepción de votos. Los votantes no podrán continuar.';

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      background: 'rgba(0,0,0,0.7)',
      display: 'flex', alignItems: 'center', justifyContent: 'center'
    }}>
      <div style={{
        background: '#1a1f2e', border: '1px solid #2d3448',
        borderRadius: '12px', padding: '32px', maxWidth: '420px', width: '90%'
      }}>
        <h2 style={{ color: '#fff', fontSize: '18px', marginBottom: '12px' }}>
          {'\u00bf'}Confirmar: {action} votaci{'\u00f3'}n?
        </h2>
        <p style={{ color: '#8b92a5', fontSize: '14px', lineHeight: '1.6', marginBottom: '8px' }}>
          {warning}
        </p>
        <p style={{ color: '#e05c5c', fontSize: '13px', marginBottom: '28px' }}>
          Esta acci{'\u00f3'}n quedar{'\u00e1'} registrada en el log de auditor{'\u00ed'}a.
        </p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
          <button
            onClick={onCancel}
            style={{
              padding: '10px 20px', borderRadius: '8px',
              border: '1px solid #2d3448', background: 'transparent',
              color: '#8b92a5', cursor: 'pointer', fontSize: '14px'
            }}
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            style={{
              padding: '10px 20px', borderRadius: '8px',
              border: 'none', background: nextState ? '#00c896' : '#e05c5c',
              color: '#fff', cursor: 'pointer', fontSize: '14px', fontWeight: 600
            }}
          >
            S{'\u00ed'}, {action.toLowerCase()}
          </button>
        </div>
      </div>
    </div>
  );
}
