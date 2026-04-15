export default function CompassRose({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x}, ${y})`} opacity="0.3">
      {/* Outer ring */}
      <circle r="28" fill="none" stroke="rgba(244,163,0,0.3)" strokeWidth="1" />
      <circle r="22" fill="none" stroke="rgba(244,163,0,0.15)" strokeWidth="0.5" />

      {/* Cardinal directions */}
      <line y1="-26" y2="-18" stroke="#f4a300" strokeWidth="1.5" />
      <line y1="18" y2="26" stroke="rgba(244,163,0,0.4)" strokeWidth="1" />
      <line x1="-26" x2="-18" stroke="rgba(244,163,0,0.4)" strokeWidth="1" />
      <line x1="18" x2="26" stroke="rgba(244,163,0,0.4)" strokeWidth="1" />

      {/* Diagonal ticks */}
      {[45, 135, 225, 315].map((angle) => (
        <line
          key={angle}
          x1={Math.cos((angle * Math.PI) / 180) * 18}
          y1={Math.sin((angle * Math.PI) / 180) * 18}
          x2={Math.cos((angle * Math.PI) / 180) * 23}
          y2={Math.sin((angle * Math.PI) / 180) * 23}
          stroke="rgba(244,163,0,0.2)"
          strokeWidth="0.5"
        />
      ))}

      {/* N label */}
      <text y="-32" textAnchor="middle" fill="#f4a300" fontSize="8" fontWeight="700">
        N
      </text>

      {/* Center diamond */}
      <polygon points="0,-12 4,0 0,12 -4,0" fill="rgba(244,163,0,0.25)" />
      <polygon points="0,-8 2.5,0 0,8 -2.5,0" fill="rgba(244,163,0,0.5)" />
    </g>
  )
}
