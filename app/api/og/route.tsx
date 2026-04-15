import { ImageResponse } from 'next/og'
import { NextRequest } from 'next/server'

export const runtime = 'edge'

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const title = searchParams.get('title') || 'One Piece Hub'
  const subtitle = searchParams.get('subtitle') || ''
  const type = searchParams.get('type') || 'default' // default, character, arc, quiz
  const stat = searchParams.get('stat') || ''

  const typeColors: Record<string, { bg: string; accent: string }> = {
    default: { bg: '#060e1a', accent: '#f4a300' },
    character: { bg: '#060e1a', accent: '#1e90ff' },
    arc: { bg: '#060e1a', accent: '#f4a300' },
    quiz: { bg: '#060e1a', accent: '#e74c3c' },
    achievement: { bg: '#060e1a', accent: '#a855f7' },
  }

  const colors = typeColors[type] || typeColors.default

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          background: colors.bg,
          fontFamily: 'sans-serif',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Background decorative elements */}
        <div
          style={{
            position: 'absolute',
            top: '-100px',
            right: '-100px',
            width: '400px',
            height: '400px',
            borderRadius: '50%',
            background: `radial-gradient(circle, ${colors.accent}15, transparent)`,
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '-80px',
            left: '-80px',
            width: '300px',
            height: '300px',
            borderRadius: '50%',
            background: `radial-gradient(circle, rgba(30,144,255,0.08), transparent)`,
          }}
        />

        {/* Top border accent */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: `linear-gradient(90deg, transparent, ${colors.accent}, transparent)`,
          }}
        />

        {/* Logo area */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '24px',
            padding: '8px 20px',
            borderRadius: '999px',
            border: `1px solid ${colors.accent}30`,
            background: `${colors.accent}08`,
          }}
        >
          <span style={{ fontSize: '14px', fontWeight: 700, color: colors.accent, letterSpacing: '0.1em' }}>
            ONE PIECE HUB
          </span>
        </div>

        {/* Title */}
        <h1
          style={{
            fontSize: title.length > 30 ? '42px' : '56px',
            fontWeight: 800,
            color: '#e8eaf0',
            textAlign: 'center',
            lineHeight: 1.1,
            margin: '0 40px',
            maxWidth: '900px',
          }}
        >
          {title}
        </h1>

        {/* Subtitle */}
        {subtitle && (
          <p
            style={{
              fontSize: '22px',
              color: 'rgba(232,234,240,0.55)',
              marginTop: '12px',
              textAlign: 'center',
              maxWidth: '700px',
            }}
          >
            {subtitle}
          </p>
        )}

        {/* Stat badge */}
        {stat && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginTop: '24px',
              padding: '10px 24px',
              borderRadius: '14px',
              background: `${colors.accent}12`,
              border: `1px solid ${colors.accent}25`,
            }}
          >
            <span style={{ fontSize: '24px', fontWeight: 800, color: colors.accent }}>
              {stat}
            </span>
          </div>
        )}

        {/* Bottom bar */}
        <div
          style={{
            position: 'absolute',
            bottom: '24px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <span style={{ fontSize: '13px', color: 'rgba(232,234,240,0.3)' }}>
            onepiece-hub.vercel.app
          </span>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  )
}
