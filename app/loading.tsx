export default function Loading() {
  return (
    <main className="flex min-h-screen items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        {/* Animated compass */}
        <div className="relative h-12 w-12">
          <div className="absolute inset-0 rounded-full border-2 border-gold/20" />
          <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-gold animate-spin" />
          <div className="absolute inset-2 rounded-full border border-sea/10" />
          <div className="absolute inset-[10px] rounded-full bg-gold/10" />
        </div>
        <p className="text-sm text-pirate-muted animate-pulse">Rotayı hesaplıyor...</p>
      </div>
    </main>
  )
}
