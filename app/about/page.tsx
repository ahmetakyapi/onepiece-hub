'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import {
  Compass, Film, Users, BrainCircuit,
  MessageCircle, Shield, Heart, Sparkles,
  Anchor, Map, Play, Trophy, Swords, Crown, Eye,
} from 'lucide-react'
import { fadeUp, staggerContainer, EASE } from '@/lib/variants'

/* ─── Data ───────────────────────────────────────────────────── */

const FEATURES = [
  {
    icon: Film,
    title: 'Arc Bazlı İzleme',
    description: 'One Pace düzeniyle filler bölümler çıkarılmış, saf hikâye deneyimi. 32 arc, 341 bölüm — derli toplu.',
    color: 'text-sea',
    bg: 'bg-sea/10',
    borderColor: 'border-sea/20',
    hex: '#1e90ff',
  },
  {
    icon: Compass,
    title: 'İzleme Takibi',
    description: 'Giriş yap, izlediğin bölümleri işaretle, kaldığın yerden devam et. İlerlemen her zaman seninle.',
    color: 'text-gold',
    bg: 'bg-gold/10',
    borderColor: 'border-gold/20',
    hex: '#f4a300',
  },
  {
    icon: Users,
    title: 'Karakter Ansiklopedisi',
    description: 'Hasır Şapkalardan Dört İmparator\'lara, Devrimcilerden Deniz Kuvvetleri\'ne 60+ karakterin detaylı profili.',
    color: 'text-luffy',
    bg: 'bg-luffy/10',
    borderColor: 'border-luffy/20',
    hex: '#e74c3c',
  },
  {
    icon: BrainCircuit,
    title: 'Şeytan Meyveleri & Haki',
    description: '43+ Şeytan Meyvesi ansiklopedisi ve 3 Haki türünün detaylı rehberi. Güçler, kullanıcılar ve uyanışlar.',
    color: 'text-emerald-400',
    bg: 'bg-emerald-400/10',
    borderColor: 'border-emerald-400/20',
    hex: '#34d399',
  },
  {
    icon: MessageCircle,
    title: 'Dünya Haritası & Lore',
    description: '25+ lokasyon, 12 organizasyon, efsanevi savaşlar ve zaman çizelgesi ile eksiksiz One Piece ansiklopedisi.',
    color: 'text-gold-bright',
    bg: 'bg-gold-bright/10',
    borderColor: 'border-gold-bright/20',
    hex: '#fbbf24',
  },
  {
    icon: Swords,
    title: 'Ödül Sıralaması & Savaşlar',
    description: '30+ karakterin ödül sıralaması ve 12 efsanevi savaşın detaylı analizi. Güç seviyeleri ve kilit anlar.',
    color: 'text-sea-light',
    bg: 'bg-sea-light/10',
    borderColor: 'border-sea-light/20',
    hex: '#60b8ff',
  },
]

const STATS = [
  { value: '32', label: 'Arc', icon: Map, color: 'text-gold' },
  { value: '341', label: 'Bölüm', icon: Film, color: 'text-sea' },
  { value: '61', label: 'Karakter', icon: Users, color: 'text-luffy' },
  { value: '43', label: 'Şeytan Meyvesi', icon: BrainCircuit, color: 'text-emerald-400' },
]

const STEPS = [
  {
    step: '01',
    title: 'Arc Seç',
    desc: 'East Blue\'dan Egghead\'e kadar 32 arc arasından birini seç. Her arcın detaylı özeti ve bölüm listesi seni bekliyor.',
    icon: Map,
    color: 'text-gold',
    hex: '#f4a300',
  },
  {
    step: '02',
    title: 'İzlemeye Başla',
    desc: 'Filler\'sız, sıralı bölümleri izle. OnePaceTR embed player ile kesintisiz deneyim.',
    icon: Play,
    color: 'text-sea',
    hex: '#1e90ff',
  },
  {
    step: '03',
    title: 'İlerlemeni Takip Et',
    desc: 'Giriş yap, izlediğin bölümleri işaretle. Profilinde tüm istatistiklerin görünsün.',
    icon: Compass,
    color: 'text-emerald-400',
    hex: '#34d399',
  },
  {
    step: '04',
    title: 'Bilgini Test Et',
    desc: 'Arc quizleriyle ne kadar dikkatli izlediğini kanıtla. Skorlarını kaydet, geliştir.',
    icon: Trophy,
    color: 'text-luffy',
    hex: '#e74c3c',
  },
]

const QUOTES = [
  { text: '"Korsanlar Kralı mı? Bu konuda hiç şüphem yok."', character: 'Roronoa Zoro' },
  { text: '"İnsanların hayalleri bitmez!"', character: 'Marshall D. Teach' },
  { text: '"One Piece... Gerçek!"', character: 'Edward Newgate' },
]

/* ─── Page ───────────────────────────────────────────────────── */

export default function AboutPage() {
  return (
      <main className="relative min-h-screen overflow-hidden">
        {/* ─── Hero ─────────────────────────────────────────────── */}
        <section className="relative pt-28 pb-24">
          {/* Background orbs */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <motion.div
              className="absolute -left-40 top-20 h-96 w-96 rounded-full bg-gold/[0.06] blur-3xl"
              animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
              transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
            />
            <motion.div
              className="absolute -right-40 top-40 h-[28rem] w-[28rem] rounded-full bg-sea/[0.06] blur-3xl"
              animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }}
              transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
            />
            <motion.div
              className="absolute left-1/3 bottom-0 h-72 w-72 rounded-full bg-luffy/[0.04] blur-3xl"
              animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.35, 0.2] }}
              transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 4 }}
            />
          </div>

          <div className="relative mx-auto max-w-5xl px-6">
            <motion.div
              variants={staggerContainer(0.12)}
              initial="hidden"
              animate="visible"
              className="text-center"
            >
              {/* Logo */}
              <motion.div variants={fadeUp} className="mb-8 flex justify-center">
                <Image
                  src="/logo.webp"
                  alt="One Piece Hub"
                  width={280}
                  height={112}
                  className="h-24 w-auto drop-shadow-2xl sm:h-28"
                  priority
                />
              </motion.div>

              {/* Title */}
              <motion.h1
                variants={fadeUp}
                className="mb-6 text-4xl font-extrabold leading-tight sm:text-5xl lg:text-6xl"
              >
                <span className="text-pirate-text">Türkçe </span>
                <span className="text-gold-gradient">One Piece</span>
                <br />
                <span className="text-pirate-text">Deneyiminin </span>
                <span className="text-sea-gradient">Merkezi</span>
              </motion.h1>

              {/* Subtitle */}
              <motion.p
                variants={fadeUp}
                className="mx-auto mb-12 max-w-2xl text-base leading-relaxed text-pirate-muted sm:text-lg"
              >
                Filler&apos;sız arc bazlı bölüm düzeni, detaylı karakter ansiklopedisi,
                kişisel izleme takibi ve topluluk özellikleriyle One Piece deneyimini
                bir üst seviyeye taşıyan platform.
              </motion.p>

              {/* Stats */}
              <motion.div
                variants={fadeUp}
                className="mx-auto mb-10 grid max-w-3xl grid-cols-2 gap-4 sm:grid-cols-4"
              >
                {STATS.map((stat) => (
                  <div
                    key={stat.label}
                    className="bento-card flex flex-col items-center gap-1.5 rounded-2xl px-4 py-5"
                  >
                    <stat.icon className={`h-5 w-5 ${stat.color}`} />
                    <span className={`text-3xl font-extrabold stat-number ${stat.color}`}>{stat.value}</span>
                    <span className="text-xs font-semibold text-pirate-muted">{stat.label}</span>
                  </div>
                ))}
              </motion.div>

              {/* CTA */}
              <motion.div variants={fadeUp} className="flex flex-wrap items-center justify-center gap-4">
                <Link href="/arcs" className="btn-gold">
                  <Play className="h-4 w-4" />
                  İzlemeye Başla
                </Link>
                <Link href="/characters" className="btn-ghost">
                  <Users className="h-4 w-4" />
                  Karakterleri Keşfet
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* ─── Neden Bu Platform? ────────────────────────────────── */}
        <section className="relative py-20">
          {/* Section divider */}
          <div className="mx-auto mb-16 max-w-5xl px-6">
            <div className="relative flex items-center justify-center">
              <div className="h-px w-full bg-gradient-to-r from-transparent via-gold/25 to-transparent" />
              <div className="absolute flex h-10 w-10 items-center justify-center rounded-full border border-gold/30 bg-ocean-deep">
                <Sparkles className="h-4 w-4 text-gold" />
              </div>
            </div>
          </div>

          <div className="mx-auto max-w-6xl px-6">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6, ease: EASE }}
              className="mb-12 text-center"
            >
              <h2 className="mb-4 text-2xl font-extrabold text-pirate-text sm:text-3xl">
                1000+ bölümü <span className="text-gold-gradient">düzenli</span> izle
              </h2>
              <p className="mx-auto max-w-xl text-sm leading-relaxed text-pirate-muted">
                One Piece, anime tarihinin en uzun ve en sevilen serisi. Ancak filler bölümler
                ve dağınık yapılar yeni başlayanların önünde büyük bir engel. Biz bu sorunu çözüyoruz.
              </p>
            </motion.div>

            {/* Feature grid */}
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {FEATURES.map((feature, i) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.5, ease: EASE, delay: i * 0.08 }}
                  className="group relative overflow-hidden rounded-2xl border border-pirate-border/30 bg-ocean-surface/40 p-6 transition-all duration-500 hover:border-pirate-border/50 hover:bg-ocean-surface/60"
                >
                  {/* Top accent */}
                  <div
                    className="absolute inset-x-0 top-0 h-0.5"
                    style={{ background: `linear-gradient(90deg, ${feature.hex}, transparent)` }}
                  />

                  {/* Hover glow */}
                  <div
                    className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full blur-3xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                    style={{ background: `${feature.hex}10` }}
                  />

                  <div className="relative z-10">
                    <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl border ${feature.borderColor} ${feature.bg}`}>
                      <feature.icon className={`h-6 w-6 ${feature.color}`} />
                    </div>
                    <h3 className="mb-2 text-base font-bold text-pirate-text">{feature.title}</h3>
                    <p className="text-sm leading-relaxed text-pirate-muted">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── Nasıl Çalışır? ───────────────────────────────────── */}
        <section className="relative py-20">
          {/* Section divider */}
          <div className="mx-auto mb-16 max-w-5xl px-6">
            <div className="relative flex items-center justify-center">
              <div className="h-px w-full bg-gradient-to-r from-transparent via-sea/25 to-transparent" />
              <div className="absolute flex h-10 w-10 items-center justify-center rounded-full border border-sea/30 bg-ocean-deep">
                <Compass className="h-4 w-4 text-sea" />
              </div>
            </div>
          </div>

          <div className="mx-auto max-w-4xl px-6">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6, ease: EASE }}
              className="mb-12 text-center"
            >
              <h2 className="mb-4 text-2xl font-extrabold text-pirate-text sm:text-3xl">
                Nasıl <span className="text-sea-gradient">Çalışır?</span>
              </h2>
            </motion.div>

            <div className="relative space-y-0">
              {/* Vertical line */}
              <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-gold/40 via-sea/30 to-luffy/20 sm:left-8" />

              {STEPS.map((item, i) => (
                <motion.div
                  key={item.step}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.5, ease: EASE, delay: i * 0.1 }}
                  className="relative flex gap-5 py-6 sm:gap-8"
                >
                  {/* Step icon */}
                  <div
                    className="relative z-10 flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl border bg-ocean-deep sm:h-16 sm:w-16"
                    style={{ borderColor: `${item.hex}30` }}
                  >
                    <item.icon className={`h-5 w-5 ${item.color} sm:h-6 sm:w-6`} />
                  </div>

                  <div className="flex-1 pt-1">
                    <span
                      className="inline-block rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest"
                      style={{ background: `${item.hex}15`, color: item.hex }}
                    >
                      Adım {item.step}
                    </span>
                    <h3 className="mt-1.5 mb-1 text-lg font-bold text-pirate-text">{item.title}</h3>
                    <p className="text-sm leading-relaxed text-pirate-muted">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── Quotes ───────────────────────────────────────────── */}
        <section className="relative py-20">
          {/* Section divider */}
          <div className="mx-auto mb-16 max-w-5xl px-6">
            <div className="relative flex items-center justify-center">
              <div className="h-px w-full bg-gradient-to-r from-transparent via-luffy/25 to-transparent" />
              <div className="absolute flex h-10 w-10 items-center justify-center rounded-full border border-luffy/30 bg-ocean-deep">
                <Crown className="h-4 w-4 text-luffy" />
              </div>
            </div>
          </div>

          <div className="mx-auto max-w-5xl px-6">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: EASE }}
              className="mb-10 text-center"
            >
              <h2 className="text-2xl font-extrabold text-pirate-text sm:text-3xl">
                Büyük <span className="text-fire-gradient">Korsan Çağı</span>
              </h2>
            </motion.div>

            <div className="grid gap-5 sm:grid-cols-3">
              {QUOTES.map((q, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, ease: EASE, delay: i * 0.1 }}
                  className="group relative overflow-hidden rounded-2xl border border-gold/15 bg-gradient-to-br from-gold/[0.03] to-transparent p-6 transition-all duration-500 hover:border-gold/30"
                >
                  {/* Quote mark */}
                  <div className="absolute -left-2 -top-4 text-6xl font-black text-gold/[0.06] select-none">
                    &ldquo;
                  </div>
                  <p className="relative z-10 mb-4 text-base font-semibold italic leading-relaxed text-pirate-text/90">
                    {q.text}
                  </p>
                  <div className="flex items-center gap-2">
                    <div className="h-px flex-1 bg-gradient-to-r from-gold/20 to-transparent" />
                    <span className="text-xs font-bold text-gold/70">{q.character}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── Footer CTA ───────────────────────────────────────── */}
        <section className="relative py-24">
          <div className="mx-auto max-w-3xl px-6 text-center">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: EASE }}
            >
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-luffy/20 bg-luffy/[0.06]"
              >
                <Heart className="h-8 w-8 text-luffy" />
              </motion.div>

              <h2 className="mb-4 text-2xl font-extrabold text-pirate-text sm:text-3xl">
                <span className="text-gold-gradient">Macera</span> seni bekliyor
              </h2>
              <p className="mx-auto mb-8 max-w-lg text-base leading-relaxed text-pirate-muted">
                One Piece hayranlarının hayranları tarafından, sevgiyle yapıldı.
                Grand Line&apos;da görüşmek üzere!
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <Link href="/arcs" className="btn-gold">
                  <Anchor className="h-4 w-4" />
                  Maceraya Başla
                </Link>
                <Link href="/bounties" className="btn-ghost">
                  <Eye className="h-4 w-4" />
                  Ödül Sıralaması
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        <div className="mt-8" />
      </main>
  )
}
