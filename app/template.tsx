/* Her gezinmede sayfa içeriği yumuşakça belirir — rota perdesi kalkarken
   ve perdesiz gezinmede (geri/ileri tuşu, programatik push) aynı his.

   YALNIZCA opacity. `transform`/`filter` YAZMA: bu sarmalayıcı izleme
   sayfasındaki `VideoStage`'in atası, ve o ikisi `position: fixed` için
   containing block yaratıp mini/sinema oynatıcıyı bozar (CLAUDE.md § 2). */
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="page-enter">{children}</div>
}
