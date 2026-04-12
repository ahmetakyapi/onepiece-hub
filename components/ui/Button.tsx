'use client'

import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import { useMagnetic } from '@/hooks/useMagnetic'

type Variant = 'primary' | 'ghost' | 'outline'
type Size    = 'sm' | 'md' | 'lg'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  magnetic?: boolean
}

const variants: Record<Variant, string> = {
  primary: 'bg-gradient-to-br from-gold to-gold-dim text-ocean-deep font-bold shadow-[0_4px_16px_rgba(244,163,0,0.3)] hover:shadow-[0_8px_32px_rgba(244,163,0,0.4)]',
  ghost:   'bento-card text-pirate-text hover:text-white hover:border-pirate-border/40',
  outline: 'border border-pirate-border/40 text-pirate-text hover:border-gold/20 hover:text-gold',
}

const sizes: Record<Size, string> = {
  sm: 'px-4 py-2 text-xs',
  md: 'px-6 py-3 text-sm',
  lg: 'px-8 py-4 text-base',
}

export function Button({
  variant = 'primary',
  size = 'md',
  magnetic = false,
  className,
  children,
  ...props
}: ButtonProps) {
  const { mx, my, onMove, onLeave } = useMagnetic(0.26)

  if (magnetic) {
    return (
      <motion.button
        style={{ x: mx, y: my }}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        whileTap={{ scale: 0.96 }}
        className={cn(
          'rounded-2xl font-semibold transition-all duration-300 ease-expo-out',
          variants[variant],
          sizes[size],
          className,
        )}
        {...(props as React.ComponentPropsWithoutRef<typeof motion.button>)}
      >
        {children}
      </motion.button>
    )
  }

  return (
    <button
      className={cn(
        'rounded-2xl font-semibold transition-all duration-300 ease-expo-out active:scale-[0.97]',
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  )
}
