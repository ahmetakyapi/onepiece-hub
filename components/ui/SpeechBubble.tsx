'use client'

import { cn } from '@/lib/utils'
import type { ReactNode } from 'react'

type Tail = 'bottom-left' | 'bottom-right' | 'top-left' | 'top-right'
type Variant = 'normal' | 'shout' | 'thought' | 'whisper'

interface SpeechBubbleProps {
  children: ReactNode
  tail?: Tail
  variant?: Variant
  className?: string
  character?: string
}

const variantStyles: Record<Variant, string> = {
  normal: 'border-2 border-pirate-text bg-white text-ocean-deep',
  shout: 'border-[3px] border-ocean-deep bg-gold text-ocean-deep font-extrabold manga-shout',
  thought: 'border-2 border-dashed border-pirate-muted/40 bg-ocean-surface/90 text-pirate-text',
  whisper: 'border border-pirate-border/30 bg-ocean-surface/60 text-pirate-muted italic backdrop-blur-sm',
}

const tailPositions: Record<Tail, string> = {
  'bottom-left': 'after:left-6 after:top-full after:border-l-transparent after:border-r-[12px] after:border-r-transparent after:border-t-[16px] before:left-[22px] before:top-full before:border-l-transparent before:border-r-[14px] before:border-r-transparent before:border-t-[18px]',
  'bottom-right': 'after:right-6 after:top-full after:border-l-[12px] after:border-l-transparent after:border-r-transparent after:border-t-[16px] before:right-[22px] before:top-full before:border-l-[14px] before:border-l-transparent before:border-r-transparent before:border-t-[18px]',
  'top-left': 'after:left-6 after:bottom-full after:border-b-[16px] after:border-l-transparent after:border-r-[12px] after:border-r-transparent before:left-[22px] before:bottom-full before:border-b-[18px] before:border-l-transparent before:border-r-[14px] before:border-r-transparent',
  'top-right': 'after:right-6 after:bottom-full after:border-b-[16px] after:border-l-[12px] after:border-l-transparent after:border-r-transparent before:right-[22px] before:bottom-full before:border-b-[18px] before:border-l-[14px] before:border-l-transparent before:border-r-transparent',
}

export default function SpeechBubble({
  children,
  tail = 'bottom-left',
  variant = 'normal',
  className,
  character,
}: SpeechBubbleProps) {
  const isThought = variant === 'thought'

  return (
    <div className="relative inline-block">
      <div
        className={cn(
          'speech-bubble relative rounded-2xl px-5 py-3 text-sm leading-relaxed',
          variantStyles[variant],
          !isThought && 'speech-tail',
          !isThought && tailPositions[tail],
          isThought && 'rounded-[50%] px-6 py-4',
          className,
        )}
      >
        {character && (
          <span className="mb-1 block text-[10px] font-bold uppercase tracking-wider opacity-50">
            {character}
          </span>
        )}
        {children}
      </div>
      {isThought && (
        <div className={cn(
          'absolute',
          tail.startsWith('bottom') ? 'top-full mt-1' : 'bottom-full mb-1',
          tail.endsWith('left') ? 'left-8' : 'right-8',
        )}>
          <div className="h-3 w-3 rounded-full border-2 border-dashed border-pirate-muted/40 bg-ocean-surface/90" />
          <div className={cn(
            'h-2 w-2 rounded-full border-2 border-dashed border-pirate-muted/40 bg-ocean-surface/90 mt-1',
            tail.endsWith('left') ? 'ml-2' : 'mr-2 ml-auto',
          )} />
        </div>
      )}
    </div>
  )
}
