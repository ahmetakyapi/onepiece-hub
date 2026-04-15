import { Skeleton, SkeletonArcCard } from '@/components/ui/Skeleton'

export default function ArcsLoading() {
  return (
    <main className="relative min-h-screen pt-28 sm:pt-32">
      <div className="mx-auto max-w-6xl px-6">
        {/* Hero skeleton */}
        <div className="mb-10 flex flex-col items-center gap-4 py-10">
          <Skeleton className="h-12 w-12 rounded-2xl" />
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-4 w-80 max-w-full" />
        </div>

        {/* Search skeleton */}
        <Skeleton className="mb-6 h-12 w-full rounded-2xl" />

        {/* Grid skeleton */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 9 }).map((_, i) => (
            <SkeletonArcCard key={i} />
          ))}
        </div>
      </div>
    </main>
  )
}
