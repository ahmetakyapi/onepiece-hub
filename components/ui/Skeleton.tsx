import { cn } from '@/lib/utils'

/* ─── Base skeleton pulse ────────────────────────────────────────────── */
interface SkeletonProps {
  className?: string
  style?: React.CSSProperties
}

export function Skeleton({ className, style }: SkeletonProps) {
  return (
    <div
      className={cn(
        'skeleton-shimmer rounded-lg bg-ocean-surface/60',
        className,
      )}
      style={style}
    />
  )
}

/* ─── Card skeleton ──────────────────────────────────────────────────── */
export function SkeletonCard({ className }: SkeletonProps) {
  return (
    <div className={cn('bento-card overflow-hidden rounded-3xl', className)}>
      <Skeleton className="h-48 w-full rounded-none" />
      <div className="space-y-3 p-4">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-5/6" />
        <div className="flex gap-2 pt-2">
          <Skeleton className="h-6 w-16 rounded-full" />
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>
      </div>
    </div>
  )
}

/* ─── Character card skeleton ────────────────────────────────────────── */
export function SkeletonCharacterCard({ className }: SkeletonProps) {
  return (
    <div className={cn('bento-card overflow-hidden rounded-3xl', className)}>
      <Skeleton className="h-52 w-full rounded-none" />
      <div className="space-y-2.5 p-4">
        <Skeleton className="h-5 w-2/3" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-4/5" />
        <div className="flex items-center justify-between pt-2">
          <Skeleton className="h-5 w-24 rounded-full" />
          <Skeleton className="h-4 w-16" />
        </div>
      </div>
    </div>
  )
}

/* ─── Arc card skeleton ──────────────────────────────────────────────── */
export function SkeletonArcCard({ className }: SkeletonProps) {
  return (
    <div className={cn('bento-card overflow-hidden rounded-3xl', className)}>
      <Skeleton className="h-44 w-full rounded-none" />
      <div className="space-y-2 p-4">
        <div className="flex items-center gap-2">
          <Skeleton className="h-5 w-5 rounded-full" />
          <Skeleton className="h-4 w-1/2" />
        </div>
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-3/4" />
      </div>
    </div>
  )
}

/* ─── Text block skeleton ────────────────────────────────────────────── */
export function SkeletonText({ lines = 3, className }: SkeletonProps & { lines?: number }) {
  return (
    <div className={cn('space-y-2', className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className="h-3"
          style={{ width: i === lines - 1 ? '60%' : `${85 + Math.random() * 15}%` } as React.CSSProperties}
        />
      ))}
    </div>
  )
}

/* ─── Profile/avatar skeleton ────────────────────────────────────────── */
export function SkeletonAvatar({ size = 'md', className }: SkeletonProps & { size?: 'sm' | 'md' | 'lg' }) {
  const sizes = { sm: 'h-8 w-8', md: 'h-12 w-12', lg: 'h-20 w-20' }
  return <Skeleton className={cn('rounded-full', sizes[size], className)} />
}

/* ─── Page hero skeleton ─────────────────────────────────────────────── */
export function SkeletonPageHero({ className }: SkeletonProps) {
  return (
    <div className={cn('flex flex-col items-center gap-4 py-20', className)}>
      <Skeleton className="h-14 w-14 rounded-2xl" />
      <Skeleton className="h-10 w-64" />
      <Skeleton className="h-4 w-96 max-w-full" />
      <Skeleton className="h-4 w-72 max-w-full" />
    </div>
  )
}
