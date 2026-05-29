import { useState } from 'react';

const COLORS = ['#6c47ff', '#41eec2', '#ffd93d', '#ff6b6b', '#c9beff', '#ffb691', '#4ecdc4', '#45b7d1'];

function polarToCartesian(cx, cy, r, angleDeg) {
  const angleRad = (angleDeg - 90) * Math.PI / 180;
  return {
    x: cx + r * Math.cos(angleRad),
    y: cy + r * Math.sin(angleRad)
  };
}

function describeArc(cx, cy, r, startAngle, endAngle) {
  const start = polarToCartesian(cx, cy, r, endAngle);
  const end = polarToCartesian(cx, cy, r, startAngle);
  const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0;
  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`;
}

export default function CandidatePieChart({ candidates }) {
  const [hovered, setHovered] = useState(null);

  const total = candidates.reduce((s, c) => s + c.votes, 0);
  if (total === 0) {
    return (
      <div style={{ width: '160px', height: '160px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: '#8b92a5', fontSize: '14px' }}>Sin votos</p>
      </div>
    );
  }

  const cx = 80, cy = 80, r = 67.2;
  let currentAngle = 0;

  const slices = candidates.map((c, i) => {
    const pct = (c.votes / total) * 100;
    const angle = (pct / 100) * 360;
    const startAngle = currentAngle;
    const endAngle = currentAngle + angle;
    const color = COLORS[i % COLORS.length];
    currentAngle = endAngle;
    return { ...c, pct, startAngle, endAngle, color };
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ position: 'relative', width: '160px', height: '160px' }}>
        <svg viewBox="0 0 160 160" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
          {slices.map((slice, i) => {
            const isFullCircle = slice.endAngle - slice.startAngle >= 360 - 0.01;
            if (isFullCircle) {
              return (
                <circle
                  key={slice.name}
                  cx={cx} cy={cy} r={r}
                  fill="none" stroke={slice.color}
                  strokeWidth="8"
                  opacity={hovered === null || hovered === i ? 1 : 0.25}
                  style={{ cursor: 'pointer', transition: 'opacity 0.2s' }}
                  onMouseEnter={() => setHovered(i)}
                  onMouseLeave={() => setHovered(null)}
                />
              );
            }
            return (
              <path
                key={slice.name}
                d={describeArc(cx, cy, r, slice.startAngle, slice.endAngle)}
                fill="none"
                stroke={slice.color}
                strokeWidth="8"
                strokeLinecap="butt"
                opacity={hovered === null || hovered === i ? 1 : 0.25}
                style={{ cursor: 'pointer', transition: 'opacity 0.2s' }}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
              />
            );
          })}
        </svg>

        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        }}>
          <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: '22px', lineHeight: 1.2, color: '#fff' }}>
            {total}
          </span>
          <span style={{ color: '#c9c3d9', fontSize: '11px', marginTop: '2px' }}>votos</span>
        </div>
      </div>

      <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '6px', width: '100%' }}>
        {slices.map((slice, i) => (
          <div
            key={slice.name}
            style={{
              display: 'flex', alignItems: 'center', gap: '8px', padding: '4px 8px',
              borderRadius: '6px', cursor: 'pointer',
              background: hovered === i ? 'rgba(255,255,255,0.05)' : 'transparent',
              transition: 'background 0.2s',
            }}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
          >
            <div style={{ width: '10px', height: '10px', borderRadius: '2px', background: slice.color, flexShrink: 0 }} />
            <span style={{ fontSize: '12px', color: '#c9c3d9', flexGrow: 1 }}>{slice.name}</span>
            <span style={{ fontSize: '12px', fontWeight: 600, color: '#fff' }}>{slice.pct.toFixed(1)}%</span>
          </div>
        ))}
      </div>

      {hovered !== null && slices[hovered] && (
        <div style={{
          marginTop: '12px', padding: '8px 16px',
          background: 'rgba(255,255,255,0.05)', borderRadius: '8px',
          textAlign: 'center', width: '100%',
        }}>
          <span style={{ color: slices[hovered].color, fontSize: '20px', fontWeight: 700, fontFamily: 'Space Grotesk, sans-serif' }}>
            {slices[hovered].pct.toFixed(1)}%
          </span>
          <span style={{ color: '#c9c3d9', fontSize: '13px', marginLeft: '8px' }}>
            {slices[hovered].name}
          </span>
        </div>
      )}
    </div>
  );
}
