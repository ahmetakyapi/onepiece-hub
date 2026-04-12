'use client'

import { motion } from 'framer-motion'
import { Shield, Eye, Crown, Zap, Users, Sparkles, BookOpen, Star, Flame, Target, Radio } from 'lucide-react'
import Link from 'next/link'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import PageHero from '@/components/wiki/PageHero'
import { fadeUp, staggerContainer, EASE, scaleIn } from '@/lib/variants'

type HakiUser = {
  name: string
  slug?: string
  level: 'basic' | 'advanced' | 'master'
  note?: string
}

type HakiType = {
  name: string
  japaneseName: string
  meaning: string
  icon: typeof Shield
  color: string
  colorHex: string
  bg: string
  borderColor: string
  glowColor: string
  gradientFrom: string
  gradientTo: string
  description: string
  howItWorks: string
  advancedForms: { name: string; description: string; icon: typeof Shield }[]
  users: HakiUser[]
  firstSeen: string
  rarity: string
}

const HAKI_TYPES: HakiType[] = [
  {
    name: 'Kenbunshoku Haki',
    japaneseName: '見聞色の覇気',
    meaning: 'Gözlem Haki\'si',
    icon: Eye,
    color: 'text-sea-light',
    colorHex: '#63b3ed',
    bg: 'bg-sea/10',
    borderColor: 'border-sea/30',
    glowColor: 'rgba(30, 144, 255, 0.15)',
    gradientFrom: 'from-sea/60',
    gradientTo: 'to-sea-light/60',
    description: 'Çevredeki canlıların varlığını, duygularını ve niyetlerini hissetme yeteneği. İleri seviyede birkaç saniye geleceği görebilir. "Mantra" olarak da bilinir (Skypiea\'da).',
    howItWorks: 'Kullanıcının zihinsel farkındalığını genişleterek çevresindeki yaşam enerjilerini (aura) algılamasını sağlar. Her canlının benzersiz bir aurası vardır ve deneyimli kullanıcılar bu auraları uzak mesafelerden bile algılayabilir. Duygusal durum, niyet ve hatta düşünceler bile ileri seviye kullanıcılar tarafından okunabilir.',
    advancedForms: [
      {
        name: 'Gelecek Görüşü (Future Sight)',
        icon: Eye,
        description: 'En ileri seviye Kenbunshoku. Kullanıcı birkaç saniye ilerisini görebilir — düşmanın saldırısını gerçekleşmeden önce görerek kaçınır. Charlotte Katakuri bu formun ustasıdır. Luffy, Whole Cake Island\'da bu seviyeye ulaştı.',
      },
      {
        name: 'Geniş Alan Taraması',
        icon: Radio,
        description: 'Büyük bir alanı tarayarak tüm canlıları algılama. Enel, Goro Goro meyvesiyle kombine ederek tüm Skypiea\'yı tarayabiliyordu. Aisa ve Koby doğastan bu yeteneğe sahip.',
      },
      {
        name: 'Duygu Okuma',
        icon: Sparkles,
        description: 'Canlıların duygusal durumunu ve niyetini okuma. Otohime bu konuda ustaydı. Luffy, hayvanlarla bile iletişim kurabilecek seviyeye ulaştı.',
      },
    ],
    users: [
      { name: 'Monkey D. Luffy', slug: 'luffy', level: 'advanced', note: 'Gelecek görüşü' },
      { name: 'Charlotte Katakuri', level: 'master', note: 'Gelecek görüşü ustası' },
      { name: 'Sanji', slug: 'sanji', level: 'advanced', note: 'Doğal yetenek, niyetleri algılama' },
      { name: 'Usopp', slug: 'usopp', level: 'basic', note: 'Dressrosa\'da uyandı' },
      { name: 'Enel', slug: 'enel', level: 'advanced', note: 'Meyvesiyle kombine' },
      { name: 'Koby', slug: 'koby', level: 'advanced', note: 'Marineford\'da uyandı' },
      { name: 'Fujitora / Issho', level: 'master', note: 'Kör olmasına rağmen usta' },
      { name: 'Rayleigh', level: 'master', note: 'Üç Haki türünde de usta' },
      { name: 'Aisa', level: 'basic', note: 'Doğastan, Skypiea' },
    ],
    firstSeen: 'Skypiea (Mantra olarak), Sabaody Archipelago (Haki olarak)',
    rarity: 'Yaygın — eğitimle öğrenilebilir',
  },
  {
    name: 'Busoshoku Haki',
    japaneseName: '武装色の覇気',
    meaning: 'Silahlanma Haki\'si',
    icon: Shield,
    color: 'text-purple-400',
    colorHex: '#a78bfa',
    bg: 'bg-purple-500/10',
    borderColor: 'border-purple-500/30',
    glowColor: 'rgba(139, 92, 246, 0.15)',
    gradientFrom: 'from-purple-500/60',
    gradientTo: 'to-purple-400/60',
    description: 'Vücudu veya silahları görünmez bir zırhla kaplama yeteneği. Saldırı gücünü ve savunmayı artırır. En önemlisi, Logia tipi Şeytan Meyvesi kullanıcılarının gerçek vücuduna dokunabilmeyi sağlar.',
    howItWorks: 'Kullanıcının irade gücünü (ruhani enerjiyi) fiziksel bir zırha dönüştürür. Bu zırh genellikle görünmezdir ancak ileri seviyede vücudu siyah metalik bir katmanla kaplar (Hardening). Haki kaplı saldırılar Logia kullanıcılarının elementel formunu bypass ederek gerçek vücutlarına ulaşır. Silahlanma Haki\'si kılıçlara, oklara ve diğer silahlara da uygulanabilir.',
    advancedForms: [
      {
        name: 'Sertleştirme (Hardening / Koka)',
        icon: Shield,
        description: 'Busoshoku\'nun görünür formu. Vücut veya silah siyah metalik bir katmanla kaplanır. Hem saldırı hem savunma gücünü dramatik olarak artırır. Vergo, Luffy ve Zoro bu tekniği sıklıkla kullanır.',
      },
      {
        name: 'Emisyon (Ryuo)',
        icon: Target,
        description: 'Wano\'da "Ryuo" olarak bilinen ileri seviye. Haki\'yi vücuttan dışarı yayarak dokunmadan hasar verme. Rayleigh bunu Luffy\'ye öğretti. Sentomaru bu tekniğin erken bir örneğiydi.',
      },
      {
        name: 'İç Yıkım',
        icon: Flame,
        description: 'En ileri seviye Busoshoku. Haki\'yi düşmanın vücudunun içine göndererek içeriden hasar verme. Zırh ve savunma aşılmaz — hasar doğrudan iç organlara gider. Luffy bunu Wano\'da Kaido\'ya karşı kullandı.',
      },
    ],
    users: [
      { name: 'Monkey D. Luffy', slug: 'luffy', level: 'master', note: 'İç yıkım + Gear 4' },
      { name: 'Roronoa Zoro', slug: 'zoro', level: 'master', note: 'Enma kılıcıyla kombine' },
      { name: 'Sanji', slug: 'sanji', level: 'advanced', note: 'İfrit Jambe ile kombine' },
      { name: 'Garp', slug: 'garp', level: 'master', note: 'Galaxy Impact' },
      { name: 'Rayleigh', level: 'master', note: 'Luffy\'nin hocası' },
      { name: 'Vergo', level: 'advanced', note: 'Tam vücut sertleştirme' },
      { name: 'Sentomaru', level: 'advanced', note: 'Emisyon tekniği' },
      { name: 'Jinbe', slug: 'jinbe', level: 'advanced', note: 'Balık-Adam Karatesi ile kombine' },
      { name: 'Smoker', slug: 'smoker', level: 'basic' },
      { name: 'Tashigi', level: 'basic' },
    ],
    firstSeen: 'Sabaody Archipelago (Sentomaru ve Boa kardeşler)',
    rarity: 'Yaygın — eğitimle öğrenilebilir',
  },
  {
    name: 'Haoshoku Haki',
    japaneseName: '覇王色の覇気',
    meaning: 'Fatih Haki\'si / Kralın Haki\'si',
    icon: Crown,
    color: 'text-gold',
    colorHex: '#f4a300',
    bg: 'bg-gold/10',
    borderColor: 'border-gold/30',
    glowColor: 'rgba(244, 163, 0, 0.15)',
    gradientFrom: 'from-gold/60',
    gradientTo: 'to-gold-bright/60',
    description: 'Milyonda bir kişide bulunan en nadir Haki türü. Kullanıcının iradesini başkalarına dayatmasını sağlar. Zayıf iradeli kişiler bayılır. İleri seviyede saldırılara Haki akıtılarak yıkıcı güç elde edilir. "Kral Nitelikleri" taşıyan kişilere özgüdür.',
    howItWorks: 'Haoshoku Haki, kullanıcının ruhani iradesinin (ambisyon, kararlılık) fiziksel bir güç olarak dışa vurumudur. Eğitimle öğrenilemez — ya doğastan sahipsinizdir ya da değilsinizdir. Temel formda iradenizi dalgalar halinde yayarak zayıf iradeliyi bayıltırsınız. Hayvanları evcilleştirebilir, denizcileri tek bakışla alt edebilirsiniz. İleri seviyede ise fiziksel temas olmadan saldırı yapılabilir.',
    advancedForms: [
      {
        name: 'Haoshoku İnfüzyonu (Coating)',
        icon: Crown,
        description: 'En ileri seviye. Saldırılara Haoshoku Haki akıtarak fiziksel temas olmadan yıkıcı hasar verme. Gök ikiye bölünür, çevre sallanır. Whitebeard ve Roger\'in efsanevi çarpışmasında gökleri ikiye böldüler. Luffy, Kaido\'ya karşı bu seviyeye ulaştı. Zoro da Enma ile kılıcına Haoshoku akıttı.',
      },
      {
        name: 'İrade Dalgası',
        icon: Zap,
        description: 'Geniş alana irade dalgası yayarak zayıf iradeliyi bayıltma. Luffy, Fish-Man Island\'da 50.000 Balık-Adam\'ı tek seferde bayılttı. Shanks, Whitebeard\'in gemisinde yürürken mürettebatı bayılttı.',
      },
      {
        name: 'Hayvan Evcilleştirme',
        icon: Sparkles,
        description: 'Dev ve vahşi hayvanları tek bakışla evcilleştirme. Luffy bunu Amazon Lily\'de ve Fish-Man Island\'da gösterdi.',
      },
    ],
    users: [
      { name: 'Monkey D. Luffy', slug: 'luffy', level: 'master', note: 'İnfüzyon, 50k bayıltma' },
      { name: 'Roronoa Zoro', slug: 'zoro', level: 'advanced', note: 'Enma ile Haoshoku kılıç' },
      { name: 'Shanks', slug: 'shanks', level: 'master', note: 'En güçlü Haoshoku kullanıcılarından' },
      { name: 'Gol D. Roger', level: 'master', note: 'Korsanlar Kralı' },
      { name: 'Edward Newgate / Whitebeard', slug: 'whitebeard', level: 'master', note: 'Dünyanın en güçlü adamı' },
      { name: 'Kaido', slug: 'kaido', level: 'master', note: 'İnfüzyon ustası' },
      { name: 'Charlotte Linlin / Big Mom', slug: 'bigmom', level: 'master', note: 'Doğastan' },
      { name: 'Silvers Rayleigh', level: 'master', note: 'Karanlık Kral' },
      { name: 'Boa Hancock', slug: 'hancock', level: 'advanced' },
      { name: 'Portgas D. Ace', slug: 'ace', level: 'basic' },
      { name: 'Donquixote Doflamingo', slug: 'doflamingo', level: 'advanced' },
      { name: 'Eustass Kid', slug: 'kid', level: 'basic' },
      { name: 'Kozuki Oden', level: 'master', note: 'İnfüzyon, Enma\'nın orijinal sahibi' },
      { name: 'Yamato', slug: 'yamato', level: 'advanced' },
      { name: 'Sengoku', level: 'advanced' },
      { name: 'Monkey D. Garp', slug: 'garp', level: 'master', note: 'Galaxy Impact' },
    ],
    firstSeen: 'Marineford (Luffy, bilinçsizce), Amazon Lily (bilinçli kullanım)',
    rarity: 'Ultra nadir — milyonda bir',
  },
]

const LEVEL_CONFIG: Record<string, { label: string; color: string; percent: number }> = {
  basic: { label: 'Temel', color: 'text-pirate-muted', percent: 33 },
  advanced: { label: 'İleri', color: 'text-sea', percent: 66 },
  master: { label: 'Usta', color: 'text-gold', percent: 100 },
}

const FUN_FACTS = [
  'Haoshoku Haki milyonda bir kişide bulunur — öğretilemez, doğastan gelir.',
  'Shanks, Whitebeard\'in gemisine çıktığında sadece Haoshoku Haki\'siyle gemiyi çatırdattı.',
  'Luffy, Fish-Man Island\'da 50.000 Balık-Adam\'ı tek seferde bayılttı.',
  'Rayleigh, Luffy\'ye 18 ay boyunca Rusukaina Adası\'nda Haki eğitimi verdi.',
  'Roger ve Whitebeard\'in Haoshoku çarpışmasında silahları temas etmeden gökyüzü ikiye bölündü.',
  'Zoro, Wano\'da farkında olmadan kılıcına Haoshoku Haki akıttı — King\'i yenmesini sağladı.',
  'Koby, Marineford Savaşı\'nda aşırı stres altında Kenbunshoku Haki\'yi uyandırdı.',
  'Garp, Şeytan Meyvesi olmadan sadece Haki ile "Deniz Kuvvetlerinin Kahramanı" unvanını kazandı.',
  'Usopp, Dressrosa\'da Sugar\'ı vurabilmek için bilinçsizce Kenbunshoku Haki uyandırdı.',
  'Big Mom, 5 yaşında farkında olmadan Haoshoku Haki kullanarak Elbaf devlerini bayılttı.',
]

function SectionDivider({ colorHex }: { colorHex: string }) {
  return (
    <div className="relative my-16 flex items-center justify-center">
      <motion.div
        className="h-px w-full"
        style={{
          background: `linear-gradient(90deg, transparent, ${colorHex}40, transparent)`,
        }}
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1, ease: EASE }}
      />
      <motion.div
        className="absolute flex h-10 w-10 items-center justify-center rounded-full border border-pirate-border/50 bg-ocean-deep"
        initial={{ scale: 0, rotate: -180 }}
        whileInView={{ scale: 1, rotate: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: EASE, delay: 0.3 }}
      >
        <Zap className="h-4 w-4 text-gold" />
      </motion.div>
    </div>
  )
}

function LevelBar({ level, colorHex }: { level: string; colorHex: string }) {
  const config = LEVEL_CONFIG[level]
  return (
    <div className="flex items-center gap-2">
      <span className={`text-xs font-semibold ${config.color}`}>{config.label}</span>
      <div className="h-1.5 w-16 overflow-hidden rounded-full bg-ocean-surface">
        <motion.div
          className="h-full rounded-full"
          style={{ background: colorHex }}
          initial={{ width: 0 }}
          whileInView={{ width: `${config.percent}%` }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: EASE, delay: 0.2 }}
        />
      </div>
    </div>
  )
}

export default function HakiPage() {
  return (
    <>
      <Header />
      <main className="relative min-h-screen pt-24">
        <div className="mx-auto max-w-5xl px-6">
          {/* Hero */}
          <PageHero
            icon={Shield}
            title="Haki"
            subtitle="Rehberi"
            accentColor="gold"
            description="Haki, One Piece evrenindeki tüm canlılarda potansiyel olarak var olan ruhani güçtür. 'İrade', 'ambisyon' ve 'ruh' anlamlarına gelir. Yalnızca en güçlü savaşçıların üçü de kullanabilir."
            orbs={[
              { color: 'rgba(30, 144, 255, 0.4)', size: 280, x: '5%', y: '10%', delay: 0 },
              { color: 'rgba(244, 163, 0, 0.35)', size: 220, x: '65%', y: '20%', delay: 1.5 },
              { color: 'rgba(139, 92, 246, 0.3)', size: 200, x: '35%', y: '60%', delay: 3 },
              { color: 'rgba(30, 144, 255, 0.2)', size: 160, x: '80%', y: '70%', delay: 2 },
            ]}
          >
            {/* Quick summary inside hero */}
            <div className="glass rounded-xl p-5">
              <div className="mb-3 flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-gold" />
                <h2 className="text-sm font-bold text-pirate-text">Haki Nedir?</h2>
              </div>
              <p className="text-sm leading-relaxed text-pirate-muted">
                Haki (覇気), tüm canlılarda potansiyel olarak bulunan gizemli bir güçtür.
                Rayleigh&apos;in açıklamasına göre Haki &quot;tüm canlılarda var olan iradenin tezahürüdür&quot;.
                Çoğu insan bu gücün farkında bile değildir veya onu uyandırmaz. Grand Line&apos;da,
                özellikle New World&apos;de Haki kullanmak hayatta kalmak için zorunludur.
                Silvers Rayleigh, Luffy&apos;ye 2 yıllık zaman atlama süresinde Haki eğitimi vermiştir.
              </p>
            </div>
          </PageHero>

          {/* Haki Types */}
          <div>
            {HAKI_TYPES.map((haki, idx) => {
              const HakiIcon = haki.icon
              return (
                <div key={haki.name}>
                  <motion.section
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-80px' }}
                    transition={{ duration: 0.7, ease: EASE }}
                    className="relative overflow-hidden rounded-2xl border border-pirate-border/40"
                  >
                    {/* Colored left border accent */}
                    <div
                      className="absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl"
                      style={{ background: `linear-gradient(to bottom, ${haki.colorHex}, transparent)` }}
                    />

                    {/* Background glow orb */}
                    <div
                      className="pointer-events-none absolute -right-20 -top-20 h-80 w-80 rounded-full blur-3xl animate-pulse-slow"
                      style={{ background: haki.glowColor }}
                    />
                    <div
                      className="pointer-events-none absolute -left-32 -bottom-32 h-64 w-64 rounded-full blur-3xl animate-float-slow"
                      style={{ background: haki.glowColor, opacity: 0.5 }}
                    />

                    <div className="relative z-10 p-6 sm:p-8">
                      {/* Section header */}
                      <motion.div
                        className="mb-8 flex items-center gap-4"
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, ease: EASE, delay: 0.1 }}
                      >
                        <div className={`flex h-16 w-16 items-center justify-center rounded-2xl border ${haki.borderColor} ${haki.bg} shadow-lg`}>
                          <HakiIcon className={`h-8 w-8 ${haki.color}`} />
                        </div>
                        <div>
                          <h2 className={`text-2xl font-extrabold ${haki.color}`}>{haki.name}</h2>
                          <p className="font-mono text-xs text-pirate-muted/60">{haki.japaneseName} — {haki.meaning}</p>
                        </div>
                      </motion.div>

                      {/* Description */}
                      <motion.div
                        className="glass mb-8 rounded-xl p-6"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, ease: EASE, delay: 0.15 }}
                      >
                        <p className="mb-5 text-sm leading-relaxed text-pirate-muted">
                          {haki.description}
                        </p>
                        <div className="border-t border-pirate-border/50 pt-5">
                          <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-pirate-text">Nasıl Çalışır?</h3>
                          <p className="text-sm leading-relaxed text-pirate-muted">
                            {haki.howItWorks}
                          </p>
                        </div>
                      </motion.div>

                      {/* Meta info */}
                      <motion.div
                        className="mb-8 flex flex-wrap gap-3"
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, ease: EASE, delay: 0.2 }}
                      >
                        <div className="glass rounded-xl px-5 py-3">
                          <p className="text-xs text-pirate-muted">İlk Görünüm</p>
                          <p className="text-sm font-semibold text-pirate-text">{haki.firstSeen}</p>
                        </div>
                        <div className="glass rounded-xl px-5 py-3">
                          <p className="text-xs text-pirate-muted">Nadirlik</p>
                          <p className={`text-sm font-semibold ${haki.color}`}>{haki.rarity}</p>
                        </div>
                      </motion.div>

                      {/* Advanced Forms */}
                      <div className="mb-8">
                        <motion.h3
                          className="mb-5 flex items-center gap-2 text-base font-bold text-pirate-text"
                          initial={{ opacity: 0 }}
                          whileInView={{ opacity: 1 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.4, ease: EASE }}
                        >
                          <Star className={`h-4 w-4 ${haki.color}`} />
                          İleri Seviye Formlar
                        </motion.h3>
                        <motion.div
                          className="grid gap-4 sm:grid-cols-3"
                          variants={staggerContainer(0.1)}
                          initial="hidden"
                          whileInView="visible"
                          viewport={{ once: true }}
                        >
                          {haki.advancedForms.map((form) => {
                            const FormIcon = form.icon
                            return (
                              <motion.div
                                key={form.name}
                                variants={scaleIn}
                                className="glass glass-lift group relative overflow-hidden rounded-xl p-5"
                              >
                                {/* Colored top border gradient */}
                                <div
                                  className="absolute inset-x-0 top-0 h-0.5"
                                  style={{
                                    background: `linear-gradient(90deg, ${haki.colorHex}, transparent)`,
                                  }}
                                />
                                <div className="mb-3 flex items-center gap-2">
                                  <div
                                    className="flex h-7 w-7 items-center justify-center rounded-lg"
                                    style={{ background: `${haki.colorHex}15` }}
                                  >
                                    <FormIcon className={`h-3.5 w-3.5 ${haki.color}`} />
                                  </div>
                                  <h4 className={`text-sm font-bold ${haki.color}`}>{form.name}</h4>
                                </div>
                                <p className="text-xs leading-relaxed text-pirate-muted">{form.description}</p>
                              </motion.div>
                            )
                          })}
                        </motion.div>
                      </div>

                      {/* Known Users */}
                      <div>
                        <motion.h3
                          className="mb-5 flex items-center gap-2 text-base font-bold text-pirate-text"
                          initial={{ opacity: 0 }}
                          whileInView={{ opacity: 1 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.4, ease: EASE }}
                        >
                          <Users className={`h-4 w-4 ${haki.color}`} />
                          Bilinen Kullanıcılar
                        </motion.h3>
                        <motion.div
                          className="grid gap-2.5 sm:grid-cols-2"
                          variants={staggerContainer(0.04)}
                          initial="hidden"
                          whileInView="visible"
                          viewport={{ once: true }}
                        >
                          {haki.users.map((user) => {
                            const content = (
                              <motion.div
                                variants={fadeUp}
                                className="group flex items-center justify-between rounded-xl border border-pirate-border/30 bg-ocean-surface/60 px-4 py-3 transition-all duration-300 hover:border-pirate-border/60 hover:bg-ocean-surface"
                              >
                                <div className="min-w-0 flex-1">
                                  <p className="text-sm font-semibold text-pirate-text group-hover:text-white transition-colors">
                                    {user.name}
                                  </p>
                                  {user.note && (
                                    <p className="mt-0.5 truncate text-xs text-pirate-muted">{user.note}</p>
                                  )}
                                </div>
                                <LevelBar level={user.level} colorHex={haki.colorHex} />
                              </motion.div>
                            )
                            return user.slug ? (
                              <Link key={user.name} href={`/characters/${user.slug}`}>
                                {content}
                              </Link>
                            ) : (
                              <div key={user.name}>{content}</div>
                            )
                          })}
                        </motion.div>
                      </div>
                    </div>
                  </motion.section>

                  {/* Animated divider between sections */}
                  {idx < HAKI_TYPES.length - 1 && (
                    <SectionDivider colorHex={HAKI_TYPES[idx + 1].colorHex} />
                  )}
                </div>
              )
            })}
          </div>

          {/* Fun Facts */}
          <motion.section
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: EASE }}
            className="mt-16 mb-8"
          >
            <h2 className="mb-8 flex items-center gap-2 text-2xl font-extrabold text-pirate-text">
              <Sparkles className="h-6 w-6 text-gold" />
              Haki Hakkında İlginç Bilgiler
            </h2>
            <motion.div
              className="grid gap-4 sm:grid-cols-2"
              variants={staggerContainer(0.06)}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {FUN_FACTS.map((fact, i) => (
                <motion.div
                  key={i}
                  variants={fadeUp}
                  className="glass glass-lift group relative overflow-hidden rounded-xl p-5"
                >
                  {/* Number badge */}
                  <div className="absolute -right-2 -top-2 flex h-12 w-12 items-center justify-center rounded-full bg-gold/5 font-extrabold text-gold/20 text-2xl">
                    {String(i + 1).padStart(2, '0')}
                  </div>
                  <div className="flex gap-3">
                    <div className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-lg bg-gold/10">
                      <Zap className="h-3 w-3 text-gold" />
                    </div>
                    <p className="text-sm leading-relaxed text-pirate-muted group-hover:text-pirate-text transition-colors">
                      {fact}
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.section>
        </div>

        <div className="mt-16" />
      </main>
      <Footer />
    </>
  )
}
