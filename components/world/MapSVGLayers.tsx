import { SEA_LABELS, MAP_POSITIONS } from './map-data'

/** SVG defs — gradients, patterns, filters */
export function MapDefs() {
  return (
    <defs>
      <linearGradient id="oceanBg" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#060e1a" />
        <stop offset="30%" stopColor="#0a1628" />
        <stop offset="70%" stopColor="#0a1628" />
        <stop offset="100%" stopColor="#060e1a" />
      </linearGradient>

      <linearGradient id="redLineGrad" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="rgba(231,76,60,0)" />
        <stop offset="25%" stopColor="rgba(231,76,60,0.15)" />
        <stop offset="50%" stopColor="rgba(231,76,60,0.35)" />
        <stop offset="75%" stopColor="rgba(231,76,60,0.15)" />
        <stop offset="100%" stopColor="rgba(231,76,60,0)" />
      </linearGradient>

      <linearGradient id="redLineCenter" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="rgba(231,76,60,0)" />
        <stop offset="40%" stopColor="rgba(231,76,60,0.6)" />
        <stop offset="50%" stopColor="rgba(239,68,68,0.9)" />
        <stop offset="60%" stopColor="rgba(231,76,60,0.6)" />
        <stop offset="100%" stopColor="rgba(231,76,60,0)" />
      </linearGradient>

      <linearGradient id="grandLineGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="rgba(244,163,0,0)" />
        <stop offset="15%" stopColor="rgba(244,163,0,0.06)" />
        <stop offset="50%" stopColor="rgba(244,163,0,0.12)" />
        <stop offset="85%" stopColor="rgba(244,163,0,0.06)" />
        <stop offset="100%" stopColor="rgba(244,163,0,0)" />
      </linearGradient>

      <linearGradient id="calmBeltGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="rgba(100,116,139,0)" />
        <stop offset="50%" stopColor="rgba(100,116,139,0.08)" />
        <stop offset="100%" stopColor="rgba(100,116,139,0)" />
      </linearGradient>

      <filter id="routeGlow" x="-10%" y="-10%" width="120%" height="120%">
        <feGaussianBlur stdDeviation="2" result="blur" />
        <feMerge>
          <feMergeNode in="blur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>

      <pattern id="waterPattern" x="0" y="0" width="80" height="40" patternUnits="userSpaceOnUse">
        <path
          d="M0,20 Q20,10 40,20 Q60,30 80,20"
          fill="none"
          stroke="rgba(30,144,255,0.035)"
          strokeWidth="0.5"
        />
        <path
          d="M0,35 Q20,25 40,35 Q60,45 80,35"
          fill="none"
          stroke="rgba(30,144,255,0.02)"
          strokeWidth="0.3"
        />
      </pattern>

      <filter id="selectedGlow" x="-100%" y="-100%" width="300%" height="300%">
        <feGaussianBlur stdDeviation="6" result="blur" />
        <feMerge>
          <feMergeNode in="blur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>
  )
}

/** Ocean background + water pattern */
export function OceanLayer() {
  return (
    <>
      <rect width="1200" height="700" fill="url(#oceanBg)" />
      <rect width="1200" height="700" fill="url(#waterPattern)" />
    </>
  )
}

/** Subtle grid overlay */
export function GridLayer() {
  return (
    <g opacity="0.06">
      {Array.from({ length: 13 }, (_, i) => (
        <line
          key={`v${i}`}
          x1={i * 100} y1="0" x2={i * 100} y2="700"
          stroke="#1e90ff" strokeWidth="0.5"
        />
      ))}
      {Array.from({ length: 8 }, (_, i) => (
        <line
          key={`h${i}`}
          x1="0" y1={i * 100} x2="1200" y2={i * 100}
          stroke="#1e90ff" strokeWidth="0.5"
        />
      ))}
    </g>
  )
}

/** Grand Line band + Calm Belt zones */
export function SeaBands() {
  return (
    <>
      {/* Calm Belt (upper) */}
      <rect x="0" y="270" width="1200" height="50" fill="url(#calmBeltGrad)" />

      {/* Grand Line band */}
      <rect x="0" y="310" width="1200" height="80" fill="url(#grandLineGrad)" />
      <line x1="0" y1="312" x2="1200" y2="312" stroke="rgba(244,163,0,0.12)" strokeWidth="1" strokeDasharray="12,6" />
      <line x1="0" y1="388" x2="1200" y2="388" stroke="rgba(244,163,0,0.12)" strokeWidth="1" strokeDasharray="12,6" />
      <line x1="0" y1="350" x2="1200" y2="350" stroke="rgba(244,163,0,0.06)" strokeWidth="0.5" strokeDasharray="4,8" />

      {/* Calm Belt (lower) */}
      <rect x="0" y="380" width="1200" height="50" fill="url(#calmBeltGrad)" />

      {/* Calm Belt labels */}
      <text x="1050" y="298" fill="rgba(148,163,184,0.12)" fontSize="8" fontWeight="600" letterSpacing="3" fontFamily="var(--font-sans), sans-serif">
        CALM BELT
      </text>
      <text x="1050" y="418" fill="rgba(148,163,184,0.12)" fontSize="8" fontWeight="600" letterSpacing="3" fontFamily="var(--font-sans), sans-serif">
        CALM BELT
      </text>
    </>
  )
}

/** Red Line vertical stripe */
export function RedLine() {
  return (
    <>
      <rect x="488" y="0" width="44" height="700" fill="url(#redLineGrad)" />
      <rect x="505" y="0" width="10" height="700" fill="url(#redLineCenter)" />
      <text
        x="510" y="80" textAnchor="middle"
        fill="rgba(239,68,68,0.2)" fontSize="10" fontWeight="700"
        letterSpacing="4" fontFamily="var(--font-sans), sans-serif"
        transform="rotate(-90, 510, 80)"
      >
        RED LINE
      </text>
    </>
  )
}

/** Sea name labels */
export function SeaLabels() {
  return (
    <>
      {SEA_LABELS.map((label) => (
        <text
          key={label.text}
          x={label.x} y={label.y}
          textAnchor="middle" fill={label.color} opacity={label.opacity}
          fontSize={label.text === 'PARADISE' || label.text === 'NEW WORLD' ? '14' : '18'}
          fontWeight="800"
          letterSpacing={label.text === 'PARADISE' || label.text === 'NEW WORLD' ? '6' : '8'}
          fontFamily="var(--font-sans), sans-serif"
        >
          {label.text}
        </text>
      ))}
    </>
  )
}

/** Decorative intersection glows + sea-king silhouettes */
export function Decorations() {
  return (
    <>
      {/* Reverse Mountain intersection glow */}
      <circle cx="565" cy="350" r="20" fill="none" stroke="rgba(244,163,0,0.08)" strokeWidth="1" strokeDasharray="4,3" />
      {/* Red Line / Fish-Man Island crossing glow */}
      <circle cx="510" cy="350" r="20" fill="none" stroke="rgba(231,76,60,0.08)" strokeWidth="1" strokeDasharray="4,3" />

      {/* Decorative sea king silhouettes in Calm Belt */}
      <g opacity="0.04">
        <ellipse cx="700" cy="412" rx="18" ry="4" fill="#94a3b8" />
        <ellipse cx="350" cy="290" rx="14" ry="3" fill="#94a3b8" />
        <ellipse cx="850" cy="295" rx="12" ry="3" fill="#94a3b8" />
      </g>

      {/* Skypiea sky connection */}
      <line
        x1={MAP_POSITIONS.skypiea.x} y1={MAP_POSITIONS.skypiea.y + 8}
        x2={MAP_POSITIONS.skypiea.x} y2={340}
        stroke="rgba(244,163,0,0.12)" strokeWidth="1" strokeDasharray="3,4"
      />
      <text
        x={MAP_POSITIONS.skypiea.x + 10} y={MAP_POSITIONS.skypiea.y + 20}
        fill="rgba(244,163,0,0.15)" fontSize="6" fontFamily="var(--font-sans), sans-serif"
      >
        ↑ 10.000m
      </text>
    </>
  )
}

/** Journey route path (dashed golden line) */
export function JourneyRoute({ path }: { path: string }) {
  if (!path) return null
  return (
    <g>
      {/* Glow halo */}
      <path
        d={path}
        fill="none"
        stroke="rgba(244,163,0,0.20)"
        strokeWidth="6"
        strokeDasharray="8,5"
        strokeLinecap="round"
        filter="url(#routeGlow)"
      />
      {/* Crisp line with animation */}
      <path
        d={path}
        fill="none"
        stroke="rgba(244,163,0,0.65)"
        strokeWidth="2"
        strokeDasharray="8,5"
        strokeLinecap="round"
        style={{
          '--line-length': '3000',
          strokeDashoffset: 0,
          animation: 'draw-line 3s cubic-bezier(0.22,1,0.36,1) both',
        } as React.CSSProperties}
      />
    </g>
  )
}
