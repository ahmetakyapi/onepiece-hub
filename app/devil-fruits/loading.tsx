import { Skeleton, SkeletonCard } from '@/components/ui/Skeleton'

export default function DevilFruitsLoading() {
  return (
    <main className="relative min-h-screen pt-28 sm:pt-32">
      <div className="mx-auto max-w-6xl px-6">
        {/* Hero skeleton */}
        <div className="mb-10 flex flex-col items-center gap-4 py-10">
          <Skeleton className="h-12 w-12 rounded-2xl" />
          <Skeleton className="h-10 w-56" />
          <Skeleton className="h-4 w-72 max-w-full" />
        </div>

        {/* Search + filter skeleton */}
        <div className="mb-6 flex gap-3">
          <Skeleton className="h-12 flex-1 rounded-2xl" />
          <Skeleton className="h-12 w-32 rounded-2xl" />
        </div>

        {/* Grid skeleton */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 9 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    </main>
  )
}
