import { Skeleton, SkeletonCharacterCard } from '@/components/ui/Skeleton'

export default function CharactersLoading() {
  return (
    <main className="relative min-h-screen pt-28 sm:pt-32">
      <div className="mx-auto max-w-7xl px-6">
        {/* Hero skeleton */}
        <div className="mb-10 flex flex-col items-center gap-4 py-10">
          <Skeleton className="h-12 w-12 rounded-2xl" />
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-4 w-96 max-w-full" />
        </div>

        {/* Search bar skeleton */}
        <Skeleton className="mb-5 h-12 w-full rounded-2xl" />

        {/* Filter chips skeleton */}
        <div className="mb-10 flex flex-wrap gap-2">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-8 w-24 rounded-full" />
          ))}
        </div>

        {/* Grid skeleton */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <SkeletonCharacterCard key={i} />
          ))}
        </div>
      </div>
    </main>
  )
}
