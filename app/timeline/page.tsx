'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Clock, Star, Anchor, Skull, Crown, BookOpen, Globe, Flame } from 'lucide-react'
import Link from 'next/link'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { fadeUp, staggerContainer, EASE } from '@/lib/variants'

type TimelineEvent = {
  year: string
  title: string
  description: string
  category: 'ancient' | 'past' | 'pre-story' | 'east-blue' | 'grand-line' | 'new-world'
  importance: 1 | 2 | 3
  relatedArc?: string
  relatedArcSlug?: string
}

const CATEGORY_INFO: Record<string, { label: string; color: string; bg: string }> = {
  ancient: { label: 'Antik Tarih', color: 'text-amber-300', bg: 'bg-amber-500/10' },
  past: { label: 'Geçmiş', color: 'text-purple-400', bg: 'bg-purple-500/10' },
  'pre-story': { label: 'Hikaye Öncesi', color: 'text-sea', bg: 'bg-sea/10' },
  'east-blue': { label: 'East Blue Macerası', color: 'text-blue-400', bg: 'bg-blue-500/10' },
  'grand-line': { label: 'Grand Line', color: 'text-gold', bg: 'bg-gold/10' },
  'new-world': { label: 'New World', color: 'text-luffy', bg: 'bg-luffy/10' },
}

const TIMELINE: TimelineEvent[] = [
  // ─── ANCIENT ──────────────────────────────────────────────────────
  {
    year: '~900 yıl önce',
    title: 'Büyük Krallığın Varlığı',
    description: 'Joy Boy\'un yaşadığı ve gizemli bir "Büyük Krallığın" var olduğu dönem. Bu krallık, Void Century sırasında 20 krallığın ittifakı tarafından yıkıldı.',
    category: 'ancient',
    importance: 3,
  },
  {
    year: '~800 yıl önce',
    title: 'Void Century (Boş Yüzyıl) Başlangıcı',
    description: 'Tarihin 100 yıllık bir bölümünün tamamen silindiği dönem. Dünya Hükümeti bu dönemi araştırmayı yasakladı. Poneglyph\'ler bu dönemin bilgilerini saklar.',
    category: 'ancient',
    importance: 3,
  },
  {
    year: '~800 yıl önce',
    title: 'Dünya Hükümeti\'nin Kuruluşu',
    description: '20 krallık birleşerek Dünya Hükümeti\'ni kurdu. Kurucuların soyundan gelenler "Celestial Dragon" (Tenryuubito) olarak Mary Geoise\'de yaşamaya başladı. Nefertari ailesi (Alabasta) katılmayı reddetti.',
    category: 'ancient',
    importance: 3,
  },
  {
    year: '~800 yıl önce',
    title: 'Poneglyph\'lerin Yaratılması',
    description: 'Kozuki ailesi, yok edilemez taşlara (Poneglyph) Void Century\'nin gerçeklerini ve antik silahların yerlerini kazıdı. Bu taşlar dünya geneline dağıtıldı.',
    category: 'ancient',
    importance: 3,
  },
  // ─── PAST (decades ago) ────────────────────────────────────────────
  {
    year: '~40 yıl önce',
    title: 'Rocks Korsanlarının Dönemi',
    description: 'Rocks D. Xebec\'in mürettebatı — Whitebeard, Kaido, Big Mom ve Shiki aynı gemideydi. God Valley olayında Roger ve Garp\'ın ittifakıyla yenildiler.',
    category: 'past',
    importance: 3,
  },
  {
    year: '~38 yıl önce',
    title: 'God Valley Olayı',
    description: 'Roger ve Garp, birlikte Rocks Korsanları\'nı yendiler. Bu olay Garp\'a "Deniz Kuvvetlerinin Kahramanı" unvanını kazandırdı. God Valley gizemli biçimde haritadan silindi.',
    category: 'past',
    importance: 3,
  },
  {
    year: '~28 yıl önce',
    title: 'Roger Grand Line\'ı Fethetti',
    description: 'Gol D. Roger, mürettebatıyla birlikte Grand Line\'ın sonuna ulaştı ve Laugh Tale\'i keşfetti. One Piece\'i bulduğunda güldü — bu yüzden adaya "Laugh Tale" dedi.',
    category: 'past',
    importance: 3,
  },
  {
    year: '~26 yıl önce',
    title: 'Ohara Olayı (Buster Call)',
    description: 'Dünya Hükümeti, Void Century\'yi araştıran Ohara adasını Buster Call ile yok etti. Nico Robin (8 yaşında) tek hayatta kalan oldu. "Tarih çalışmak suç oldu."',
    category: 'past',
    importance: 3,
  },
  {
    year: '26 yıl önce',
    title: 'Roger\'ın İdamı — Büyük Korsan Çağı Başlıyor',
    description: 'Gol D. Roger, Loguetown\'da idam edildi. Son sözleri: "Hazinem mi? İstiyorsanız alabilirsiniz. Arayın! Onu dünyanın bir yerine bıraktım!" Bu sözler Büyük Korsan Çağı\'nı başlattı.',
    category: 'past',
    importance: 3,
  },
  {
    year: '~24 yıl önce',
    title: 'Fisher Tiger\'ın Köle Ayaklanması',
    description: 'Balık-Adam kahraman Fisher Tiger, Mary Geoise\'ye tırmanarak tüm köleleri (ırk ayrımı yapmadan) serbest bıraktı. Güneş Korsanları\'nı kurdu.',
    category: 'past',
    importance: 2,
  },
  {
    year: '~22 yıl önce',
    title: 'Kozuki Oden\'in İdamı',
    description: 'Wano\'nun efsanevi samurais Kozuki Oden, shogun Orochi ve Kaido\'nun ihaneti ile idam edildi. "Wano\'nun sınırlarını açın!" son sözleri 20 yıllık kehanet oldu.',
    category: 'past',
    importance: 3,
  },
  // ─── PRE-STORY ────────────────────────────────────────────────────
  {
    year: '~12 yıl önce',
    title: 'Shanks, Luffy\'ye Hasır Şapkayı Verdi',
    description: 'Shanks, Luffy\'yi bir deniz canavarından kurtarırken sol kolunu kaybetti. Ayrılırken hasır şapkayı verdi: "Bunu bana geri ver, harika bir korsan olduğunda."',
    category: 'pre-story',
    importance: 3,
  },
  {
    year: '~12 yıl önce',
    title: 'Luffy, Ace ve Sabo Kardeş Oldu',
    description: 'Üç çocuk, sake içerek kardeş yemini etti. Sabo\'nun "ölümü" (aslında Dragon tarafından kurtarıldı) Ace ve Luffy\'yi derinden etkiledi.',
    category: 'pre-story',
    importance: 2,
  },
  {
    year: '~10 yıl önce',
    title: 'Nami\'nin Annesi Bellemere\'in Ölümü',
    description: 'Arlong, Cocoyashi Köyü\'nü işgal etti. Bellemere, Nami ve Nojiko\'yu korumak için hayatını feda etti. 8 yaşındaki Nami, Arlong\'un köleleri oldu.',
    category: 'pre-story',
    importance: 2,
  },
  // ─── EAST BLUE ────────────────────────────────────────────────────
  {
    year: 'Yıl 1',
    title: 'Luffy Denize Açıldı',
    description: '17 yaşındaki Luffy, Foosha Köyü\'nden küçük bir tekneyle yola çıktı. Zoro, Nami, Usopp ve Sanji ile tanışarak mürettebatını kurdu.',
    category: 'east-blue',
    importance: 3,
    relatedArc: 'Romance Dawn',
    relatedArcSlug: 'romance-dawn',
  },
  {
    year: 'Yıl 1',
    title: 'Arlong Park Yıkıldı',
    description: 'Luffy, Arlong\'u yenip Nami\'yi 8 yıllık esaretten kurtardı. "Bana yardım et!" — One Piece\'in en duygusal anlarından biri.',
    category: 'east-blue',
    importance: 3,
    relatedArc: 'Arlong Park',
    relatedArcSlug: 'arlong-park',
  },
  // ─── GRAND LINE ───────────────────────────────────────────────────
  {
    year: 'Yıl 1',
    title: 'Alabasta Kurtarıldı',
    description: 'Crocodile ve Baroque Works\'ün planı engellendi. Hasır Şapkalar ilk kez bir Shichibukai\'yi devirdi. Robin mürettebata katıldı.',
    category: 'grand-line',
    importance: 3,
    relatedArc: 'Arabasta',
    relatedArcSlug: 'arabasta',
  },
  {
    year: 'Yıl 1',
    title: 'Skypiea — Gökyüzü Adası Macerası',
    description: 'Enel\'in tiranlığı sona erdi. Roger\'ın Poneglyph\'e bıraktığı mesaj bulundu. 400 yıllık Shandian-Skypiean çatışması sona erdi.',
    category: 'grand-line',
    importance: 2,
    relatedArc: 'Skypiea',
    relatedArcSlug: 'skypiea',
  },
  {
    year: 'Yıl 1',
    title: 'Enies Lobby — Dünya Hükümeti\'ne Savaş İlanı',
    description: 'Robin\'i kurtarmak için Dünya Hükümeti bayrağı yakıldı. Gear 2 ve 3 ilk kez kullanıldı. Going Merry vedası. Franky mürettebata katıldı. Thousand Sunny inşa edildi.',
    category: 'grand-line',
    importance: 3,
    relatedArc: 'Enies Lobby',
    relatedArcSlug: 'enies-lobby',
  },
  {
    year: 'Yıl 1',
    title: 'Thriller Bark — "Hiçbir Şey Olmadı"',
    description: 'Brook mürettebata katıldı. Zoro, Kuma\'dan Luffy\'nin tüm acısını üstlendi. One Piece tarihinin en ikonik fedakarlığı.',
    category: 'grand-line',
    importance: 2,
    relatedArc: 'Thriller Bark',
    relatedArcSlug: 'thriller-bark',
  },
  {
    year: 'Yıl 1',
    title: 'Sabaody — Mürettebatın Dağılması',
    description: 'Kuma, tüm mürettebatı dünyanın dört bir yanına gönderdi. Luffy tek başına Amazon Lily\'ye düştü. 2 yıllık ayrılık başladı.',
    category: 'grand-line',
    importance: 3,
    relatedArc: 'Sabaody Archipelago',
    relatedArcSlug: 'sabaody-archipelago',
  },
  {
    year: 'Yıl 1',
    title: 'Marineford Savaşı — Ace\'in Ölümü',
    description: 'Dünyanın en büyük savaşı. Ace ve Whitebeard öldü. "One Piece gerçek!" Luffy\'nin en büyük kaybı. Shanks savaşı durdurdu.',
    category: 'grand-line',
    importance: 3,
    relatedArc: 'Marineford',
    relatedArcSlug: 'marineford',
  },
  {
    year: 'Yıl 1-3',
    title: '2 Yıllık Eğitim',
    description: 'Luffy, Rayleigh\'den Haki eğitimi aldı. Her mürettebat üyesi kendi alanında güçlendi. Zoro, Mihawk\'tan kılıç dersi aldı.',
    category: 'grand-line',
    importance: 2,
  },
  // ─── NEW WORLD ────────────────────────────────────────────────────
  {
    year: 'Yıl 3',
    title: 'Mürettebat Yeniden Bir Araya Geldi',
    description: '2 yıl sonra Sabaody\'de buluştular. Herkes çok güçlenmişti. New World macerasına başladılar.',
    category: 'new-world',
    importance: 2,
    relatedArc: 'Return to Sabaody',
    relatedArcSlug: 'return-to-sabaody',
  },
  {
    year: 'Yıl 3',
    title: 'Doflamingo Devrildi — Hasır Şapka Büyük Filosu Kuruldu',
    description: 'Dressrosa\'da Doflamingo yenildi. Sabo geri döndü ve Mera Mera meyvesini yedi. 5.640+ kişilik Büyük Filo kuruldu.',
    category: 'new-world',
    importance: 3,
    relatedArc: 'Dressrosa',
    relatedArcSlug: 'dressrosa',
  },
  {
    year: 'Yıl 3',
    title: 'Whole Cake Island — Sanji\'nin Kurtarılması',
    description: 'Sanji\'nin geçmişi ve Germa 66 ortaya çıktı. Luffy, Katakuri\'yi yenip Gelecek Görüşü kazandı. Jinbe resmi olarak katıldı.',
    category: 'new-world',
    importance: 3,
    relatedArc: 'Whole Cake Island',
    relatedArcSlug: 'whole-cake-island',
  },
  {
    year: 'Yıl 3',
    title: 'Wano — Kaido Yenildi, Gear 5 Uyandı',
    description: 'Onigashima Savaşı. Luffy Gear 5\'i uyandırdı — Joy Boy\'un dönüşü. Kaido ve Big Mom yenildi. Wano 20 yıllık esaretten kurtuldu. Luffy Yonko ilan edildi.',
    category: 'new-world',
    importance: 3,
    relatedArc: 'Wano',
    relatedArcSlug: 'wano',
  },
  {
    year: 'Yıl 3',
    title: 'Egghead — Vegapunk\'ın Mesajı',
    description: 'Vegapunk dünyaya mesaj verdi. Void Century hakkında bilgiler ortaya çıktı. Kuma\'nın trajik geçmişi ve fedakarlığı. Gorosei ile yüzleşme.',
    category: 'new-world',
    importance: 3,
    relatedArc: 'Egghead',
    relatedArcSlug: 'egghead',
  },
]

export default function TimelinePage() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null)

  const filtered = activeCategory
    ? TIMELINE.filter((e) => e.category === activeCategory)
    : TIMELINE

  const categories = Object.entries(CATEGORY_INFO)

  return (
    <>
      <Header />
      <main className="relative min-h-screen pt-24">
        <div className="mx-auto max-w-4xl px-6">
          {/* Header */}
          <motion.div
            variants={staggerContainer(0.1)}
            initial="hidden"
            animate="visible"
            className="mb-10"
          >
            <motion.h1
              variants={fadeUp}
              className="mb-3 text-3xl font-extrabold sm:text-4xl"
            >
              <span className="text-gold-gradient">Zaman</span>{' '}
              <span className="text-pirate-text">Çizelgesi</span>
            </motion.h1>
            <motion.p variants={fadeUp} className="max-w-2xl text-pirate-muted">
              One Piece evreninin kronolojik tarihçesi. Void Century&apos;den günümüze,
              dünyayı şekillendiren olaylar.
            </motion.p>
          </motion.div>

          {/* Category filters */}
          <div className="mb-8 flex flex-wrap gap-2">
            <button
              onClick={() => setActiveCategory(null)}
              className={`chip transition-all ${!activeCategory ? 'border-gold/40 bg-gold/10 text-gold' : ''}`}
            >
              Tümü
            </button>
            {categories.map(([key, { label, color }]) => (
              <button
                key={key}
                onClick={() => setActiveCategory(activeCategory === key ? null : key)}
                className={`chip transition-all ${activeCategory === key ? 'border-gold/40 bg-gold/10 text-gold' : ''}`}
              >
                <span className={color}>{label}</span>
              </button>
            ))}
          </div>

          {/* Timeline */}
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-gold/40 via-sea/30 to-luffy/20 sm:left-8" />

            <div className="space-y-0">
              {filtered.map((event, i) => {
                const catInfo = CATEGORY_INFO[event.category]
                return (
                  <motion.div
                    key={`${event.year}-${event.title}`}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: '-40px' }}
                    transition={{ duration: 0.5, ease: EASE, delay: i * 0.03 }}
                    className="relative flex gap-5 py-5 sm:gap-8"
                  >
                    {/* Dot */}
                    <div className={`relative z-10 flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl border ${
                      event.importance === 3 ? 'border-gold/40' : 'border-pirate-border'
                    } bg-ocean-deep sm:h-16 sm:w-16`}>
                      {event.importance === 3 ? (
                        <Star className={`h-5 w-5 ${catInfo.color} sm:h-6 sm:w-6`} />
                      ) : (
                        <Clock className="h-4 w-4 text-pirate-muted sm:h-5 sm:w-5" />
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 pt-1">
                      <div className="mb-1 flex flex-wrap items-center gap-2">
                        <span className={`text-xs font-bold ${catInfo.color}`}>{event.year}</span>
                        <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${catInfo.bg} ${catInfo.color}`}>
                          {catInfo.label}
                        </span>
                      </div>
                      <h3 className="mb-2 text-base font-bold text-pirate-text sm:text-lg">{event.title}</h3>
                      <p className="text-sm leading-relaxed text-pirate-muted">{event.description}</p>
                      {event.relatedArcSlug && (
                        <Link
                          href={`/arcs/${event.relatedArcSlug}`}
                          className="mt-2 inline-flex items-center gap-1 rounded-full bg-sea/10 px-2.5 py-1 text-[10px] font-medium text-sea transition-colors hover:bg-sea/20"
                        >
                          <BookOpen className="h-3 w-3" />
                          {event.relatedArc}
                        </Link>
                      )}
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </div>

        <div className="mt-16" />
      </main>
      <Footer />
    </>
  )
}
