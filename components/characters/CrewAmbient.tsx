'use client'

export default function CrewAmbient() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 opacity-0 transition-opacity duration-700 ease-out"
      id="crew-ambient"
      style={{
        background:
          'radial-gradient(ellipse 900px 600px at var(--crew-x, 50%) var(--crew-y, 50%), rgba(var(--crew-rgb, 244,163,0), 0.12), transparent 60%)',
      }}
    />
  )
}
