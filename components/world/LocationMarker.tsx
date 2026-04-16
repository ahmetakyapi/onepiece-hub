import { memo } from 'react'
import type { Location } from '@/types'
import { SEA_MARKER_COLORS, SEA_MARKER_GLOW } from './map-data'

function LocationMarkerInner({
  location,
  position,
  isSelected,
  isHovered,
  onSelect,
  onHover,
  onLeave,
}: {
  location: Location
  position: { x: number; y: number }
  isSelected: boolean
  isHovered: boolean
  onSelect: () => void
  onHover: () => void
  onLeave: () => void
}) {
  const color = SEA_MARKER_COLORS[location.sea] ?? '#f4a300'
  const glowColor = SEA_MARKER_GLOW[location.sea] ?? 'rgba(244,163,0,0.6)'
  const isActive = isSelected || isHovered

  return (
    <g
      className="cursor-pointer"
      onClick={onSelect}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
    >
      {/* Pulse ring — always visible, slower for selected */}
      <circle cx={position.x} cy={position.y} r="12" fill="none" stroke={color} opacity="0">
        <animate
          attributeName="r"
          values="6;16;6"
          dur={isSelected ? '2.5s' : '3s'}
          repeatCount="indefinite"
        />
        <animate
          attributeName="opacity"
          values={isActive ? '0.5;0;0.5' : '0.2;0;0.2'}
          dur={isSelected ? '2.5s' : '3s'}
          repeatCount="indefinite"
        />
        <animate attributeName="stroke-width" values="2;0.5;2" dur="3s" repeatCount="indefinite" />
      </circle>
      <circle
        cx={position.x}
        cy={position.y}
        r="6"
        fill="none"
        stroke={color}
        strokeWidth="1"
        opacity="0"
      >
        <animate
          attributeName="r"
          values="6;16;6"
          dur="3s"
          repeatCount="indefinite"
        />
        <animate
          attributeName="opacity"
          values={isActive ? '0.4;0;0.4' : '0.15;0;0.15'}
          dur="3s"
          repeatCount="indefinite"
        />
      </circle>

      {/* Selected ring */}
      {isSelected && (
        <circle
          cx={position.x}
          cy={position.y}
          r="10"
          fill="none"
          stroke={color}
          strokeWidth="1.5"
          opacity="0.5"
        />
      )}

      {/* Glow */}
      <circle
        cx={position.x}
        cy={position.y}
        r={isActive ? 8 : 5}
        fill={glowColor}
        opacity={isActive ? 0.35 : 0.15}
        style={{ transition: 'all 0.3s ease-out' }}
      />

      {/* Main dot */}
      <circle
        cx={position.x}
        cy={position.y}
        r={isActive ? 5 : 3.5}
        fill={color}
        stroke={isActive ? '#fff' : 'transparent'}
        strokeWidth={isActive ? 1 : 0}
        style={{ transition: 'all 0.3s ease-out' }}
      />

      {/* Hover tooltip */}
      {isHovered && !isSelected && (
        <g>
          <rect
            x={position.x - 50}
            y={position.y - 32}
            width={100}
            height={20}
            rx="6"
            fill="rgba(6,14,26,0.9)"
            stroke={`${color}40`}
            strokeWidth="1"
          />
          <text
            x={position.x}
            y={position.y - 18}
            textAnchor="middle"
            fill={color}
            fontSize="9"
            fontWeight="700"
            fontFamily="var(--font-sans), sans-serif"
          >
            {location.name}
          </text>
        </g>
      )}

      {/* Always-visible label for selected */}
      {isSelected && (
        <g>
          <rect
            x={position.x - 55}
            y={position.y - 34}
            width={110}
            height={22}
            rx="7"
            fill="rgba(6,14,26,0.95)"
            stroke={`${color}50`}
            strokeWidth="1.5"
          />
          <text
            x={position.x}
            y={position.y - 19}
            textAnchor="middle"
            fill="#e8eaf0"
            fontSize="9.5"
            fontWeight="800"
            fontFamily="var(--font-sans), sans-serif"
          >
            {location.name}
          </text>
        </g>
      )}
    </g>
  )
}

const LocationMarker = memo(LocationMarkerInner)
export default LocationMarker
