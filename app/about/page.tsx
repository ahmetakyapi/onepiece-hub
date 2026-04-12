'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import {
  Compass, Film, Users, BrainCircuit,
  MessageCircle, Shield, Heart, Sparkles,
  Anchor, Map, Play, Trophy
} from 'lucide-react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { fadeUp, staggerContainer, EASE } from '@/lib/variants'

const FEATURES = [
  {
    icon: Film,
    title: 'Arc Bazlı İzleme',
    description: 'One Pace düzeniyle filler bölümler çıkarılmış, saf hikâye deneyimi. 32 arc, 341 bölüm — derli toplu.',
    color: 'text-sea',
    bg: 'bg-sea/10',
  },
  {
    icon: Compass,
    title: 'İzleme Takibi',
    description: 'Giriş yap, izlediğin bölümleri işaretle, kaldığın yerden devam et. İlerlemen her zaman seninle.',
    color: 'text-gold',
    bg: 'bg-gold/10',
  },
  {
    icon: Users,
    title: 'Karakter Ansiklopedisi',
    description: 'Hasır Şapkalardan Dört İmparator\'lara, Devrimcilerden Deniz Kuvvetleri\'ne 60+ karakterin detaylı profili, güçleri ve ödül bilgileri.',
    color: 'text-luffy',
    bg: 'bg-luffy/10',
  },
  {
    icon: BrainCircuit,
    title: 'Şeytan Meyveleri & Haki Wiki',
    description: '43+ Şeytan Meyvesi ansiklopedisi ve 3 Haki türünün detaylı rehberi. Güçler, kullanıcılar, uyanışlar ve daha fazlası.',
    color: 'text-emerald-400',
    bg: 'bg-emerald-400/10',
  },
  {
    icon: MessageCircle,
    title: 'Dünya Haritası & Organizasyonlar',
    description: '25+ lokasyon, 12 organizasyon, efsanevi savaşlar ve zaman çizelgesi ile eksiksiz One Piece ansiklopedisi.',
    color: 'text-gold-bright',
    bg: 'bg-gold-bright/10',
  },
  {
    icon: Shield,
    title: 'Ödül Sıralaması & Savaşlar',
    description: '30+ karakterin ödül sıralaması ve 12 efsanevi savaşın detaylı analizi ile One Piece bilgini test et.',
    color: 'text-sea-light',
    bg: 'bg-sea-light/10',
  },
]

const STATS = [
  { value: '32', label: 'Arc', icon: Map },
  { value: '341', label: 'Bölüm', icon: Film },
  { value: '61', label: 'Karakter', icon: Users },
  { value: '43', label: 'Şeytan Meyvesi', icon: Play },
]

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="relative min-h-screen overflow-hidden">
        {/* ─── Hero Section ─────────────────────────────────────────────── */}
        <section className="relative pt-28 pb-20">
          {/* Background accents */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute -left-40 top-20 h-80 w-80 rounded-full bg-gold/5 blur-3xl" />
            <div className="absolute -right-40 top-40 h-96 w-96 rounded-full bg-sea/5 blur-3xl" />
            <div className="absolute left-1/2 bottom-0 h-64 w-64 -translate-x-1/2 rounded-full bg-luffy/5 blur-3xl" />
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
                  src="/logo.png"
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
                className="mb-6 text-4xl font-extrabold leading-tight sm:text-5xl"
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
                bir üst seviyeye taşıyan açık kaynak platform.
              </motion.p>

              {/* Stats row */}
              <motion.div
                variants={fadeUp}
                className="mx-auto mb-8 grid max-w-2xl grid-cols-4 gap-4"
              >
                {STATS.map((stat) => (
                  <div key={stat.label} className="flex flex-col items-center gap-1">
                    <stat.icon className="mb-1 h-5 w-5 text-gold/60" />
                    <span className="text-2xl font-extrabold text-gold sm:text-3xl">{stat.value}</span>
                    <span className="text-[11px] text-pirate-muted">{stat.label}</span>
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

        {/* ─── Neden Bu Platform? ───────────────────────────────────────── */}
        <section className="relative py-20">
          <div className="mx-auto max-w-5xl px-6">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6, ease: EASE }}
              className="mb-16 text-center"
            >
              <span className="chip mb-4 inline-flex">
                <Sparkles className="h-3.5 w-3.5 text-gold" />
                Neden One Piece Hub?
              </span>
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
                  className="bento-card group p-6 transition-all duration-500 hover:border-gold/15"
                >
                  <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl ${feature.bg}`}>
                    <feature.icon className={`h-6 w-6 ${feature.color}`} />
                  </div>
                  <h3 className="mb-2 text-base font-bold text-pirate-text">
                    {feature.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-pirate-muted">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── Nasıl Çalışır? ──────────────────────────────────────────── */}
        <section className="relative py-20">
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
              <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-gold/40 via-sea/30 to-transparent sm:left-8" />

              {[
                {
                  step: '01',
                  title: 'Arc Seç',
                  desc: 'East Blue\'dan Egghead\'e kadar 32 arc arasından birini seç. Her arcın detaylı özeti ve bölüm listesi seni bekliyor.',
                  icon: Map,
                  color: 'text-gold',
                  borderColor: 'border-gold/30',
                },
                {
                  step: '02',
                  title: 'İzlemeye Başla',
                  desc: 'Filler\'sız, sıralı bölümleri izle. Pixeldrain embed player ile kesintisiz deneyim.',
                  icon: Play,
                  color: 'text-sea',
                  borderColor: 'border-sea/30',
                },
                {
                  step: '03',
                  title: 'İlerlemeni Takip Et',
                  desc: 'Giriş yap, izlediğin bölümleri işaretle. Profilinde tüm istatistiklerin görünsün.',
                  icon: Compass,
                  color: 'text-emerald-400',
                  borderColor: 'border-emerald-400/30',
                },
                {
                  step: '04',
                  title: 'Bilgini Test Et',
                  desc: 'Arc quizleriyle ne kadar dikkatli izlediğini kanıtla. Skorlarını kaydet, geliştir.',
                  icon: Trophy,
                  color: 'text-luffy',
                  borderColor: 'border-luffy/30',
                },
              ].map((item, i) => (
                <motion.div
                  key={item.step}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.5, ease: EASE, delay: i * 0.1 }}
                  className="relative flex gap-5 py-6 sm:gap-8"
                >
                  {/* Step dot */}
                  <div className={`relative z-10 flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl border ${item.borderColor} bg-ocean-deep sm:h-16 sm:w-16`}>
                    <item.icon className={`h-5 w-5 ${item.color} sm:h-6 sm:w-6`} />
                  </div>

                  <div className="flex-1 pt-1">
                    <span className={`text-xs font-bold ${item.color}`}>ADIM {item.step}</span>
                    <h3 className="mb-1 text-lg font-bold text-pirate-text">{item.title}</h3>
                    <p className="text-sm leading-relaxed text-pirate-muted">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── Teknoloji ───────────────────────────────────────────────── */}
        <section className="relative py-20">
          <div className="mx-auto max-w-4xl px-6">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: EASE }}
              className="bento-card p-8 sm:p-10"
            >
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold/10">
                  <Shield className="h-5 w-5 text-gold" />
                </div>
                <h2 className="text-lg font-bold text-pirate-text">Teknoloji Yığını</h2>
              </div>
              <p className="mb-6 text-sm leading-relaxed text-pirate-muted">
                Modern web teknolojileriyle geliştirilmiş, performans ve kullanıcı deneyimi odaklı platform.
              </p>
              <div className="flex flex-wrap gap-2">
                {[
                  'Next.js 14', 'React 18', 'TypeScript', 'Tailwind CSS',
                  'Framer Motion', 'PostgreSQL', 'Drizzle ORM', 'NextAuth.js', 'Vercel',
                ].map((tech) => (
                  <span key={tech} className="chip text-sm">
                    {tech}
                  </span>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* ─── Footer CTA ──────────────────────────────────────────────── */}
        <section className="relative py-20">
          <div className="mx-auto max-w-3xl px-6 text-center">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: EASE }}
            >
              <Heart className="mx-auto mb-6 h-10 w-10 text-luffy/60" />
              <h2 className="mb-4 text-2xl font-extrabold text-pirate-text sm:text-3xl">
                <span className="text-gold-gradient">Macera</span> seni bekliyor
              </h2>
              <p className="mx-auto mb-8 max-w-lg text-sm leading-relaxed text-pirate-muted">
                One Piece hayranlarının hayranları tarafından, sevgiyle yapıldı.
                Grand Line&apos;da görüşmek üzere!
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <Link href="/arcs" className="btn-gold">
                  <Anchor className="h-4 w-4" />
                  Maceraya Başla
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        <div className="mt-8" />
      </main>
      <Footer />
    </>
  )
}
