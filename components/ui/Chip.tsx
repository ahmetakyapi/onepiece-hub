import { cn } from '@/lib/utils'

interface ChipProps {
  children: React.ReactNode
  className?: string
  dot?: string  // dot rengi — token sınıfı ver ('bg-haki', 'bg-gold', 'bg-sea', 'bg-fruit')
}

/**
 * Pill/chip badge bileşeni.
 * dot prop'u ile renkli nokta eklenebilir.
 *
 * Ham Tailwind rengi (`bg-accent-emerald`) verme — tema ile dönmez.
 *
 * <Chip dot="bg-haki">Yeni Özellik</Chip>
 */
export function Chip({ children, className, dot }: ChipProps) {
  return (
    <span className={cn('chip', className)}>
      {dot && <span className={cn('h-1.5 w-1.5 rounded-full', dot)} />}
      {children}
    </span>
  )
}
