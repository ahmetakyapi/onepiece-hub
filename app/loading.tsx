export default function Loading() {
  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <div className="manga-panel manga-speed-lines relative flex flex-col items-center gap-4 rounded-2xl px-10 py-8">
        <div className="manga-speed-line" style={{ top: '18%', width: '90%', left: '-5%' }} />
        <div className="manga-speed-line" style={{ top: '38%', width: '80%', left: '-5%', animationDelay: '0.08s' }} />
        <div className="manga-speed-line" style={{ top: '62%', width: '85%', left: '-5%', animationDelay: '0.16s' }} />
        <div className="manga-speed-line" style={{ top: '82%', width: '75%', left: '-5%', animationDelay: '0.24s' }} />

        <div className="relative h-14 w-14">
          <div className="absolute inset-0 rounded-full border-2 border-gold/20" />
          <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-gold animate-spin" />
          <div className="absolute inset-2 rounded-full border border-sea/10" />
          <div className="absolute inset-[12px] rounded-full bg-gold/10" />
        </div>
        <p className="relative z-10 text-[10px] font-black uppercase tracking-[0.3em] text-gold">
          Rotayı hesaplıyor
        </p>
      </div>
    </main>
  )
}
