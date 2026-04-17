let ctx: AudioContext | null = null

function getCtx(): AudioContext | null {
  if (typeof window === 'undefined') return null
  if (!ctx) {
    const Ctor = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    if (!Ctor) return null
    ctx = new Ctor()
  }
  if (ctx.state === 'suspended') ctx.resume().catch(() => {})
  return ctx
}

type Note = {
  freq: number
  start: number
  duration: number
  type?: OscillatorType
  gain?: number
}

function playNotes(notes: Note[]) {
  const audio = getCtx()
  if (!audio) return

  const now = audio.currentTime
  for (const note of notes) {
    const osc = audio.createOscillator()
    const gain = audio.createGain()
    osc.type = note.type ?? 'sine'
    osc.frequency.setValueAtTime(note.freq, now + note.start)

    const peak = note.gain ?? 0.18
    gain.gain.setValueAtTime(0, now + note.start)
    gain.gain.linearRampToValueAtTime(peak, now + note.start + 0.01)
    gain.gain.exponentialRampToValueAtTime(0.0001, now + note.start + note.duration)

    osc.connect(gain).connect(audio.destination)
    osc.start(now + note.start)
    osc.stop(now + note.start + note.duration + 0.02)
  }
}

export const SFX = {
  correct() {
    playNotes([
      { freq: 720, start: 0, duration: 0.12, type: 'triangle', gain: 0.14 },
      { freq: 960, start: 0.08, duration: 0.18, type: 'triangle', gain: 0.14 },
    ])
  },
  wrong() {
    playNotes([
      { freq: 200, start: 0, duration: 0.18, type: 'square', gain: 0.1 },
      { freq: 140, start: 0.12, duration: 0.22, type: 'square', gain: 0.08 },
    ])
  },
  streak(level: number) {
    // Ascending triumphant arpeggio, more notes for higher levels
    const base = 440
    const steps = Math.min(Math.max(Math.floor(level / 3) + 2, 3), 6)
    const notes: Note[] = []
    for (let i = 0; i < steps; i++) {
      notes.push({
        freq: base * Math.pow(1.1892, i * 2), // quarter-note intervals
        start: i * 0.08,
        duration: 0.2,
        type: 'triangle',
        gain: 0.13,
      })
    }
    // Final flourish
    notes.push({
      freq: base * Math.pow(1.1892, (steps - 1) * 2 + 3),
      start: steps * 0.08,
      duration: 0.35,
      type: 'triangle',
      gain: 0.16,
    })
    playNotes(notes)
  },
  yonko() {
    // Regal chord stack
    playNotes([
      { freq: 392, start: 0, duration: 0.6, type: 'sine', gain: 0.12 },
      { freq: 523, start: 0, duration: 0.6, type: 'sine', gain: 0.1 },
      { freq: 659, start: 0, duration: 0.6, type: 'sine', gain: 0.1 },
      { freq: 784, start: 0.15, duration: 0.55, type: 'triangle', gain: 0.12 },
      { freq: 1046, start: 0.3, duration: 0.5, type: 'triangle', gain: 0.14 },
    ])
  },
}

const STORAGE_KEY = 'onepiece-sound-enabled'

export function isSoundEnabled(): boolean {
  if (typeof window === 'undefined') return false
  return window.localStorage.getItem(STORAGE_KEY) === '1'
}

export function setSoundEnabled(enabled: boolean) {
  if (typeof window === 'undefined') return
  if (enabled) {
    window.localStorage.setItem(STORAGE_KEY, '1')
  } else {
    window.localStorage.removeItem(STORAGE_KEY)
  }
}
