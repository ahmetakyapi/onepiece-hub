'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Clock, Star, BookOpen, Compass, Anchor, Flame, Swords, Crown, Globe, Sparkles, ChevronDown } from 'lucide-react'
import Link from 'next/link'
import PageHero from '@/components/wiki/PageHero'
import EraShowcase from '@/components/timeline/EraShowcase'
import { fadeUp, EASE } from '@/lib/variants'

type TimelineEvent = {
  year: string
  title: string
  description: string
  category: 'ancient' | 'past' | 'pre-story' | 'east-blue' | 'grand-line' | 'new-world'
  importance: 1 | 2 | 3
  relatedArc?: string
  relatedArcSlug?: string
}

const CATEGORY_INFO: Record<string, { label: string; color: string; bg: string; border: string; ring: string; icon: typeof Clock; dot: string }> = {
  ancient:      { label: 'Antik Tarih',       color: 'text-amber-300',  bg: 'bg-amber-500/10',  border: 'border-amber-400/40',  ring: 'ring-amber-400/30',  icon: Crown,   dot: 'bg-amber-400' },
  past:         { label: 'Geçmiş',            color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-400/40', ring: 'ring-purple-400/30', icon: Globe,   dot: 'bg-purple-400' },
  'pre-story':  { label: 'Hikaye Öncesi',     color: 'text-sea',        bg: 'bg-sea/10',        border: 'border-sea/40',        ring: 'ring-sea/30',        icon: Anchor,  dot: 'bg-sea' },
  'east-blue':  { label: 'East Blue Macerası', color: 'text-blue-400',   bg: 'bg-blue-500/10',   border: 'border-blue-400/40',   ring: 'ring-blue-400/30',   icon: Compass, dot: 'bg-blue-400' },
  'grand-line': { label: 'Grand Line',        color: 'text-gold',       bg: 'bg-gold/10',       border: 'border-gold/40',       ring: 'ring-gold/30',       icon: Flame,   dot: 'bg-gold' },
  'new-world':  { label: 'New World',         color: 'text-luffy',      bg: 'bg-luffy/10',      border: 'border-luffy/40',      ring: 'ring-luffy/30',      icon: Swords,  dot: 'bg-luffy' },
}

const ERA_LABELS: Record<string, string> = {
  ancient: 'Antik Tarih',
  past: 'Geçmiş',
  'pre-story': 'Hikaye Öncesi',
  'east-blue': 'East Blue Macerası',
  'grand-line': 'Grand Line',
  'new-world': 'New World',
}

const ERA_GRADIENT_COLORS: Record<string, { from: string; to: string }> = {
  ancient:      { from: 'rgba(251,191,36,0.6)',  to: 'rgba(251,191,36,0.15)' },
  past:         { from: 'rgba(168,85,247,0.6)',   to: 'rgba(168,85,247,0.15)' },
  'pre-story':  { from: 'rgba(30,144,255,0.6)',   to: 'rgba(30,144,255,0.15)' },
  'east-blue':  { from: 'rgba(96,165,250,0.5)',   to: 'rgba(96,165,250,0.15)' },
  'grand-line': { from: 'rgba(244,163,0,0.6)',    to: 'rgba(244,163,0,0.15)' },
  'new-world':  { from: 'rgba(231,76,60,0.6)',    to: 'rgba(231,76,60,0.15)' },
}

const TIMELINE: TimelineEvent[] = [
  { year: '~900 yıl önce', title: 'Büyük Krallığın Varlığı', description: 'Joy Boy\'un yaşadığı ve gizemli bir "Büyük Krallığın" var olduğu dönem. Bu krallık, Void Century sırasında 20 krallığın ittifakı tarafından yıkıldı.', category: 'ancient', importance: 3 },
  { year: '~800 yıl önce', title: 'Void Century (Boş Yüzyıl) Başlangıcı', description: 'Tarihin 100 yıllık bir bölümünün tamamen silindiği dönem. Dünya Hükümeti bu dönemi araştırmayı yasakladı. Poneglyph\'ler bu dönemin bilgilerini saklar.', category: 'ancient', importance: 3 },
  { year: '~800 yıl önce', title: 'Dünya Hükümeti\'nin Kuruluşu', description: '20 krallık birleşerek Dünya Hükümeti\'ni kurdu. Kurucuların soyundan gelenler "Celestial Dragon" (Tenryuubito) olarak Mary Geoise\'de yaşamaya başladı. Nefertari ailesi (Alabasta) katılmayı reddetti.', category: 'ancient', importance: 3 },
  { year: '~800 yıl önce', title: 'Poneglyph\'lerin Yaratılması', description: 'Kozuki ailesi, yok edilemez taşlara (Poneglyph) Void Century\'nin gerçeklerini ve antik silahların yerlerini kazıdı. Bu taşlar dünya geneline dağıtıldı.', category: 'ancient', importance: 3 },
  { year: '~40 yıl önce', title: 'Rocks Korsanlarının Dönemi', description: 'Rocks D. Xebec\'in mürettebatı — Whitebeard, Kaido, Big Mom ve Shiki aynı gemideydi. God Valley olayında Roger ve Garp\'ın ittifakıyla yenildiler.', category: 'past', importance: 3 },
  { year: '~38 yıl önce', title: 'God Valley Olayı', description: 'Roger ve Garp, birlikte Rocks Korsanları\'nı yendiler. Bu olay Garp\'a "Deniz Kuvvetlerinin Kahramanı" unvanını kazandırdı. God Valley gizemli biçimde haritadan silindi.', category: 'past', importance: 3 },
  { year: '~28 yıl önce', title: 'Roger Grand Line\'ı Fethetti', description: 'Gol D. Roger, mürettebatıyla birlikte Grand Line\'ın sonuna ulaştı ve Laugh Tale\'i keşfetti. One Piece\'i bulduğunda güldü — bu yüzden adaya "Laugh Tale" dedi.', category: 'past', importance: 3 },
  { year: '~26 yıl önce', title: 'Ohara Olayı (Buster Call)', description: 'Dünya Hükümeti, Void Century\'yi araştıran Ohara adasını Buster Call ile yok etti. Nico Robin (8 yaşında) tek hayatta kalan oldu. "Tarih çalışmak suç oldu."', category: 'past', importance: 3 },
  { year: '26 yıl önce', title: 'Roger\'ın İdamı — Büyük Korsan Çağı Başlıyor', description: 'Gol D. Roger, Loguetown\'da idam edildi. Son sözleri: "Hazinem mi? İstiyorsanız alabilirsiniz. Arayın! Onu dünyanın bir yerine bıraktım!" Bu sözler Büyük Korsan Çağı\'nı başlattı.', category: 'past', importance: 3 },
  { year: '~24 yıl önce', title: 'Fisher Tiger\'ın Köle Ayaklanması', description: 'Balık-Adam kahraman Fisher Tiger, Mary Geoise\'ye tırmanarak tüm köleleri (ırk ayrımı yapmadan) serbest bıraktı. Güneş Korsanları\'nı kurdu.', category: 'past', importance: 2 },
  { year: '~22 yıl önce', title: 'Kozuki Oden\'in İdamı', description: 'Wano\'nun efsanevi samurais Kozuki Oden, shogun Orochi ve Kaido\'nun ihaneti ile idam edildi. "Wano\'nun sınırlarını açın!" son sözleri 20 yıllık kehanet oldu.', category: 'past', importance: 3 },
  { year: '~12 yıl önce', title: 'Shanks, Luffy\'ye Hasır Şapkayı Verdi', description: 'Shanks, Luffy\'yi bir deniz canavarından kurtarırken sol kolunu kaybetti. Ayrılırken hasır şapkayı verdi: "Bunu bana geri ver, harika bir korsan olduğunda."', category: 'pre-story', importance: 3 },
  { year: '~12 yıl önce', title: 'Luffy, Ace ve Sabo Kardeş Oldu', description: 'Üç çocuk, sake içerek kardeş yemini etti. Sabo\'nun "ölümü" (aslında Dragon tarafından kurtarıldı) Ace ve Luffy\'yi derinden etkiledi.', category: 'pre-story', importance: 2 },
  { year: '~10 yıl önce', title: 'Nami\'nin Annesi Bellemere\'in Ölümü', description: 'Arlong, Cocoyashi Köyü\'nü işgal etti. Bellemere, Nami ve Nojiko\'yu korumak için hayatını feda etti. 8 yaşındaki Nami, Arlong\'un köleleri oldu.', category: 'pre-story', importance: 2 },
  { year: 'Yıl 1', title: 'Luffy Denize Açıldı', description: '17 yaşındaki Luffy, Foosha Köyü\'nden küçük bir tekneyle yola çıktı. Zoro, Nami, Usopp ve Sanji ile tanışarak mürettebatını kurdu.', category: 'east-blue', importance: 3, relatedArc: 'Romance Dawn', relatedArcSlug: 'romance-dawn' },
  { year: 'Yıl 1', title: 'Arlong Park Yıkıldı', description: 'Luffy, Arlong\'u yenip Nami\'yi 8 yıllık esaretten kurtardı. "Bana yardım et!" — One Piece\'in en duygusal anlarından biri.', category: 'east-blue', importance: 3, relatedArc: 'Arlong Park', relatedArcSlug: 'arlong-park' },
  { year: 'Yıl 1', title: 'Alabasta Kurtarıldı', description: 'Crocodile ve Baroque Works\'ün planı engellendi. Hasır Şapkalar ilk kez bir Shichibukai\'yi devirdi. Robin mürettebata katıldı.', category: 'grand-line', importance: 3, relatedArc: 'Arabasta', relatedArcSlug: 'arabasta' },
  { year: 'Yıl 1', title: 'Skypiea — Gökyüzü Adası Macerası', description: 'Enel\'in tiranlığı sona erdi. Roger\'ın Poneglyph\'e bıraktığı mesaj bulundu. 400 yıllık Shandian-Skypiean çatışması sona erdi.', category: 'grand-line', importance: 2, relatedArc: 'Skypiea', relatedArcSlug: 'skypiea' },
  { year: 'Yıl 1', title: 'Enies Lobby — Dünya Hükümeti\'ne Savaş İlanı', description: 'Robin\'i kurtarmak için Dünya Hükümeti bayrağı yakıldı. Gear 2 ve 3 ilk kez kullanıldı. Going Merry vedası. Franky mürettebata katıldı. Thousand Sunny inşa edildi.', category: 'grand-line', importance: 3, relatedArc: 'Enies Lobby', relatedArcSlug: 'enies-lobby' },
  { year: 'Yıl 1', title: 'Thriller Bark — "Hiçbir Şey Olmadı"', description: 'Brook mürettebata katıldı. Zoro, Kuma\'dan Luffy\'nin tüm acısını üstlendi. One Piece tarihinin en ikonik fedakarlığı.', category: 'grand-line', importance: 2, relatedArc: 'Thriller Bark', relatedArcSlug: 'thriller-bark' },
  { year: 'Yıl 1', title: 'Sabaody — Mürettebatın Dağılması', description: 'Kuma, tüm mürettebatı dünyanın dört bir yanına gönderdi. Luffy tek başına Amazon Lily\'ye düştü. 2 yıllık ayrılık başladı.', category: 'grand-line', importance: 3, relatedArc: 'Sabaody Archipelago', relatedArcSlug: 'sabaody-archipelago' },
  { year: 'Yıl 1', title: 'Marineford Savaşı — Ace\'in Ölümü', description: 'Dünyanın en büyük savaşı. Ace ve Whitebeard öldü. "One Piece gerçek!" Luffy\'nin en büyük kaybı. Shanks savaşı durdurdu.', category: 'grand-line', importance: 3, relatedArc: 'Marineford', relatedArcSlug: 'marineford' },
  { year: 'Yıl 1-3', title: '2 Yıllık Eğitim', description: 'Luffy, Rayleigh\'den Haki eğitimi aldı. Her mürettebat üyesi kendi alanında güçlendi. Zoro, Mihawk\'tan kılıç dersi aldı.', category: 'grand-line', importance: 2 },
  { year: 'Yıl 3', title: 'Mürettebat Yeniden Bir Araya Geldi', description: '2 yıl sonra Sabaody\'de buluştular. Herkes çok güçlenmişti. New World macerasına başladılar.', category: 'new-world', importance: 2, relatedArc: 'Return to Sabaody', relatedArcSlug: 'return-to-sabaody' },
  { year: 'Yıl 3', title: 'Doflamingo Devrildi — Hasır Şapka Büyük Filosu Kuruldu', description: 'Dressrosa\'da Doflamingo yenildi. Sabo geri döndü ve Mera Mera meyvesini yedi. 5.640+ kişilik Büyük Filo kuruldu.', category: 'new-world', importance: 3, relatedArc: 'Dressrosa', relatedArcSlug: 'dressrosa' },
  { year: 'Yıl 3', title: 'Whole Cake Island — Sanji\'nin Kurtarılması', description: 'Sanji\'nin geçmişi ve Germa 66 ortaya çıktı. Luffy, Katakuri\'yi yenip Gelecek Görüşü kazandı. Jinbe resmi olarak katıldı.', category: 'new-world', importance: 3, relatedArc: 'Whole Cake Island', relatedArcSlug: 'whole-cake-island' },
  { year: 'Yıl 3', title: 'Wano — Kaido Yenildi, Gear 5 Uyandı', description: 'Onigashima Savaşı. Luffy Gear 5\'i uyandırdı — Joy Boy\'un dönüşü. Kaido ve Big Mom yenildi. Wano 20 yıllık esaretten kurtuldu. Luffy Yonko ilan edildi.', category: 'new-world', importance: 3, relatedArc: 'Wano', relatedArcSlug: 'wano' },
  { year: 'Yıl 3', title: 'Egghead — Vegapunk\'ın Mesajı', description: 'Vegapunk dünyaya mesaj verdi. Void Century hakkında bilgiler ortaya çıktı. Kuma\'nın trajik geçmişi ve fedakarlığı. Gorosei ile yüzleşme.', category: 'new-world', importance: 3, relatedArc: 'Egghead', relatedArcSlug: 'egghead' },
]

// ─── Era divider component
function EraDivider({ category }: { category: string }) {
  const info = CATEGORY_INFO[category]
  const Icon = info.icon
  return (
    <div className="relative my-10 flex items-center gap-4 sm:my-14">
      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-pirate-border/60 to-pirate-border/30" />
      <div className={`bento-card flex items-center gap-3 rounded-2xl px-5 py-3 ${info.border} border`}>
        <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${info.bg}`}>
          <Icon className={`h-4.5 w-4.5 ${info.color}`} />
        </div>
        <span className={`text-sm font-bold tracking-wide uppercase ${info.color}`}>
          {ERA_LABELS[category]}
        </span>
      </div>
      <div className="h-px flex-1 bg-gradient-to-l from-transparent via-pirate-border/60 to-pirate-border/30" />
    </div>
  )
}

// ─── Timeline node (static — no infinite animations)
function TimelineNode({ event }: { event: TimelineEvent }) {
  const catInfo = CATEGORY_INFO[event.category]
  const isImportant = event.importance === 3

  return (
    <div className="relative z-10 flex-shrink-0">
      <div
        className={`relative flex h-12 w-12 items-center justify-center rounded-full border-2 bg-ocean-deep ${
          isImportant ? catInfo.border : 'border-pirate-border/60'
        }`}
      >
        <div className={`flex h-8 w-8 items-center justify-center rounded-full ${
          isImportant ? catInfo.bg : 'bg-pirate-border/10'
        }`}>
          {isImportant ? (
            <Star className={`h-4 w-4 ${catInfo.color}`} />
          ) : (
            <div className={`h-2.5 w-2.5 rounded-full ${catInfo.dot} opacity-70`} />
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Main page
export default function TimelinePage() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null)

  const filtered = useMemo(() => {
    return activeCategory
      ? TIMELINE.filter((e) => e.category === activeCategory)
      : TIMELINE
  }, [activeCategory])

  const categories = Object.entries(CATEGORY_INFO)

  const eraTransitions = useMemo(() => {
    const set = new Set<number>()
    for (let i = 0; i < filtered.length; i++) {
      if (i === 0 || filtered[i].category !== filtered[i - 1].category) {
        set.add(i)
      }
    }
    return set
  }, [filtered])

  return (
      <main className="relative min-h-screen pt-24">
        <div className="mx-auto max-w-5xl px-6">
          {/* Hero */}
          <PageHero
            icon={Clock}
            title="Zaman"
            subtitle="Çizelgesi"
            accentColor="gold"
            orbs={[
              { color: 'rgba(244,163,0,0.35)', size: 280, x: '70%', y: '10%', delay: 0 },
              { color: 'rgba(251,191,36,0.2)',  size: 200, x: '10%', y: '50%', delay: 1.5 },
              { color: 'rgba(168,85,247,0.15)', size: 160, x: '85%', y: '70%', delay: 3 },
              { color: 'rgba(30,144,255,0.15)', size: 180, x: '30%', y: '80%', delay: 2 },
            ]}
          >
            <div className="flex flex-wrap gap-4">
              <div className="bento-card rounded-xl px-4 py-2 text-sm">
                <span className="text-gold font-bold">{TIMELINE.length}</span>{' '}
                <span className="text-pirate-muted">olay</span>
              </div>
              <div className="bento-card rounded-xl px-4 py-2 text-sm">
                <span className="text-purple-400 font-bold">900+</span>{' '}
                <span className="text-pirate-muted">yıl</span>
              </div>
              <div className="bento-card rounded-xl px-4 py-2 text-sm">
                <span className="text-sea font-bold">6</span>{' '}
                <span className="text-pirate-muted">dönem</span>
              </div>
            </div>
          </PageHero>

          {/* Scroll-reveal intro — tells the user a sticky sequence is coming */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.6, ease: EASE }}
            className="relative mx-auto mb-6 flex max-w-xl flex-col items-center gap-3 rounded-2xl border border-gold/20 bg-ocean-surface/30 px-5 py-4 text-center backdrop-blur-sm sm:flex-row sm:text-left"
          >
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl border border-gold/25 bg-gold/10">
              <Sparkles className="h-4 w-4 text-gold" />
            </div>
            <div className="flex-1">
              <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-gold">
                Sinema modu
              </p>
              <p className="text-sm leading-relaxed text-pirate-text">
                Kaydırdıkça 6 dönem sırayla uyanacak — yavaşça scroll et.
              </p>
            </div>
            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
              className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border border-gold/30 bg-ocean-deep/60"
              aria-hidden
            >
              <ChevronDown className="h-4 w-4 text-gold" />
            </motion.div>
          </motion.div>
        </div>

        {/* Era Showcase — cinematic scroll-zoom sequence */}
        <EraShowcase />

        <div className="mx-auto max-w-5xl px-6">
          {/* Category filters */}
          <div className="mb-12 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 animate-fade-in-up">
            <button
              onClick={() => setActiveCategory(null)}
              className={`bento-card group flex items-center gap-3 rounded-xl px-4 py-3 text-left transition-all ${
                !activeCategory
                  ? 'border-gold/40 ring-2 ring-gold/20'
                  : 'hover:border-pirate-border/80'
              }`}
            >
              <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                !activeCategory ? 'bg-gold/15' : 'bg-pirate-border/10'
              }`}>
                <Sparkles className={`h-4 w-4 ${!activeCategory ? 'text-gold' : 'text-pirate-muted'}`} />
              </div>
              <div>
                <div className={`text-sm font-semibold ${!activeCategory ? 'text-gold' : 'text-pirate-text'}`}>
                  Tümü
                </div>
                <div className="text-[11px] text-pirate-muted">{TIMELINE.length} olay</div>
              </div>
            </button>

            {categories.map(([key, info]) => {
              const count = TIMELINE.filter((e) => e.category === key).length
              const Icon = info.icon
              const isActive = activeCategory === key
              return (
                <button
                  key={key}
                  onClick={() => setActiveCategory(activeCategory === key ? null : key)}
                  className={`bento-card group flex items-center gap-3 rounded-xl px-4 py-3 text-left transition-all ${
                    isActive
                      ? `${info.border} ring-2 ${info.ring}`
                      : 'hover:border-pirate-border/80'
                  }`}
                >
                  <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${info.bg}`}>
                    <Icon className={`h-4 w-4 ${info.color}`} />
                  </div>
                  <div>
                    <div className={`text-sm font-semibold ${isActive ? info.color : 'text-pirate-text'}`}>
                      {info.label}
                    </div>
                    <div className="text-[11px] text-pirate-muted">{count} olay</div>
                  </div>
                </button>
              )
            })}
          </div>

          {/* Timeline */}
          <div className="relative pb-12">
            {/* Vertical gradient line — static, no traveling glow */}
            <div className="absolute left-6 top-0 bottom-0 w-0.5 overflow-hidden sm:left-6">
              <div className="h-full w-full bg-gradient-to-b from-amber-400/40 via-purple-400/30 via-40% via-sea/30 via-55% via-blue-400/25 via-65% via-gold/35 via-80% to-luffy/30" />
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeCategory ?? 'all'}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                {filtered.map((event, i) => {
                  const catInfo = CATEGORY_INFO[event.category]
                  const showDivider = eraTransitions.has(i)
                  const isImportant = event.importance === 3
                  const gradientColors = ERA_GRADIENT_COLORS[event.category]

                  return (
                    <div key={`${event.year}-${event.title}`}>
                      {showDivider && <EraDivider category={event.category} />}

                      <div className="relative flex gap-5 py-4 sm:gap-7">
                        <TimelineNode event={event} />

                        <div
                          className={`bento-card group relative flex-1 overflow-hidden rounded-xl border-l-[3px] px-5 py-4 transition-all sm:px-6 sm:py-5 ${
                            isImportant
                              ? `${catInfo.border} hover:border-l-[3px]`
                              : 'border-l-pirate-border/40 hover:border-l-pirate-border/60'
                          }`}
                        >
                          {/* Subtle glow on the left edge for important events */}
                          {isImportant && (
                            <div
                              className="pointer-events-none absolute left-0 top-0 bottom-0 w-24 opacity-40"
                              style={{
                                background: `linear-gradient(to right, ${gradientColors.to}, transparent)`,
                              }}
                            />
                          )}

                          <div className="relative z-10">
                            <div className="mb-2 flex flex-wrap items-center gap-2.5">
                              <span className={`text-xs font-bold tracking-wide ${catInfo.color}`}>
                                {event.year}
                              </span>
                              <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${catInfo.bg} ${catInfo.color}`}>
                                <span className={`inline-block h-1.5 w-1.5 rounded-full ${catInfo.dot}`} />
                                {catInfo.label}
                              </span>
                              {isImportant && (
                                <span className="inline-flex items-center gap-1 rounded-full bg-gold/10 px-2 py-0.5 text-[10px] font-semibold text-gold">
                                  <Star className="h-2.5 w-2.5" />
                                  Önemli
                                </span>
                              )}
                            </div>

                            <h3 className={`mb-2 text-base font-bold sm:text-lg ${
                              isImportant ? 'text-pirate-text' : 'text-pirate-text/90'
                            }`}>
                              {event.title}
                            </h3>

                            <p className="text-sm leading-relaxed text-pirate-muted">
                              {event.description}
                            </p>

                            {event.relatedArcSlug && (
                              <Link
                                href={`/arcs/${event.relatedArcSlug}`}
                                className="mt-3 inline-flex items-center gap-2 rounded-lg border border-sea/20 bg-sea/5 px-3.5 py-1.5 text-xs font-semibold text-sea transition-all hover:bg-sea/15 hover:border-sea/40 hover:shadow-lg hover:shadow-sea/5"
                              >
                                <BookOpen className="h-3.5 w-3.5" />
                                {event.relatedArc} Arc&apos;ına Git
                              </Link>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </motion.div>
            </AnimatePresence>

            {/* Timeline end marker */}
            <div className="relative ml-3 flex items-center gap-4 pt-6 sm:ml-3">
              <div className="relative z-10 flex h-6 w-6 items-center justify-center rounded-full border-2 border-gold/40 bg-ocean-deep">
                <div className="h-2 w-2 rounded-full bg-gold" />
              </div>
              <span className="text-xs font-medium text-pirate-muted italic">
                Macera devam ediyor...
              </span>
            </div>
          </div>
        </div>

        <div className="mt-16" />
      </main>
  )
}
