'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Shield, Eye, Crown, Zap, Users, Sparkles, BookOpen, Star,
  Flame, Target, Radio, Award, ChevronRight,
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import PageHero from '@/components/wiki/PageHero'
import { getCharacterImage } from '@/lib/constants/images'
import { fadeUp, staggerContainer, EASE, scaleIn } from '@/lib/variants'

/* ─── Types ──────────────────────────────────────────────────── */

type HakiUser = {
  name: string
  slug?: string
  level: 'basic' | 'advanced' | 'master'
  note?: string
}

type AdvancedForm = {
  name: string
  description: string
  icon: typeof Shield
}

type HakiType = {
  id: string
  name: string
  japaneseName: string
  meaning: string
  icon: typeof Shield
  color: string
  colorHex: string
  bg: string
  borderColor: string
  glowColor: string
  description: string
  howItWorks: string
  advancedForms: AdvancedForm[]
  users: HakiUser[]
  firstSeen: string
  rarity: string
}

/* ─── Data ───────────────────────────────────────────────────── */

const HAKI_TYPES: HakiType[] = [
  {
    id: 'kenbunshoku',
    name: 'Kenbunshoku Haki',
    japaneseName: '見聞色の覇気',
    meaning: 'Gözlem Haki\'si',
    icon: Eye,
    color: 'text-sea-light',
    colorHex: '#63b3ed',
    bg: 'bg-sea/10',
    borderColor: 'border-sea/30',
    glowColor: 'rgba(30, 144, 255, 0.15)',
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
      { name: 'Charlotte Katakuri', slug: 'katakuri', level: 'master', note: 'Gelecek görüşü ustası' },
      { name: 'Sanji', slug: 'sanji', level: 'advanced', note: 'Doğal yetenek, niyetleri algılama' },
      { name: 'Usopp', slug: 'usopp', level: 'basic', note: 'Dressrosa\'da uyandı' },
      { name: 'Enel', slug: 'enel', level: 'advanced', note: 'Meyvesiyle kombine' },
      { name: 'Koby', slug: 'koby', level: 'advanced', note: 'Marineford\'da uyandı' },
      { name: 'Fujitora / Issho', slug: 'fujitora', level: 'master', note: 'Kör olmasına rağmen usta' },
      { name: 'Silvers Rayleigh', slug: 'rayleigh', level: 'master', note: 'Üç Haki türünde de usta' },
      { name: 'Aisa', slug: 'aisa', level: 'basic', note: 'Doğastan, Skypiea' },
    ],
    firstSeen: 'Skypiea (Mantra olarak)',
    rarity: 'Yaygın — eğitimle öğrenilebilir',
  },
  {
    id: 'busoshoku',
    name: 'Busoshoku Haki',
    japaneseName: '武装色の覇気',
    meaning: 'Silahlanma Haki\'si',
    icon: Shield,
    color: 'text-purple-400',
    colorHex: '#a78bfa',
    bg: 'bg-purple-500/10',
    borderColor: 'border-purple-500/30',
    glowColor: 'rgba(139, 92, 246, 0.15)',
    description: 'Vücudu veya silahları görünmez bir zırhla kaplama yeteneği. Saldırı gücünü ve savunmayı artırır. En önemlisi, Logia tipi Şeytan Meyvesi kullanıcılarının gerçek vücuduna dokunabilmeyi sağlar.',
    howItWorks: 'Kullanıcının irade gücünü fiziksel bir zırha dönüştürür. Bu zırh genellikle görünmezdir ancak ileri seviyede vücudu siyah metalik bir katmanla kaplar (Hardening). Haki kaplı saldırılar Logia kullanıcılarının elementel formunu bypass ederek gerçek vücutlarına ulaşır.',
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
        description: 'En ileri seviye Busoshoku. Haki\'yi düşmanın vücudunun içine göndererek içeriden hasar verme. Luffy bunu Wano\'da Kaido\'ya karşı kullandı.',
      },
    ],
    users: [
      { name: 'Monkey D. Luffy', slug: 'luffy', level: 'master', note: 'İç yıkım + Gear 4' },
      { name: 'Roronoa Zoro', slug: 'zoro', level: 'master', note: 'Enma kılıcıyla kombine' },
      { name: 'Sanji', slug: 'sanji', level: 'advanced', note: 'İfrit Jambe ile kombine' },
      { name: 'Garp', slug: 'garp', level: 'master', note: 'Galaxy Impact' },
      { name: 'Silvers Rayleigh', slug: 'rayleigh', level: 'master', note: 'Luffy\'nin hocası' },
      { name: 'Vergo', slug: 'vergo', level: 'advanced', note: 'Tam vücut sertleştirme' },
      { name: 'Sentomaru', slug: 'sentomaru', level: 'advanced', note: 'Emisyon tekniği' },
      { name: 'Jinbe', slug: 'jinbe', level: 'advanced', note: 'Balık-Adam Karatesi ile kombine' },
      { name: 'Smoker', slug: 'smoker', level: 'basic' },
      { name: 'Tashigi', slug: 'tashigi', level: 'basic' },
    ],
    firstSeen: 'Sabaody Archipelago',
    rarity: 'Yaygın — eğitimle öğrenilebilir',
  },
  {
    id: 'haoshoku',
    name: 'Haoshoku Haki',
    japaneseName: '覇王色の覇気',
    meaning: 'Fatih Haki\'si / Kralın Haki\'si',
    icon: Crown,
    color: 'text-gold',
    colorHex: '#f4a300',
    bg: 'bg-gold/10',
    borderColor: 'border-gold/30',
    glowColor: 'rgba(244, 163, 0, 0.15)',
    description: 'Milyonda bir kişide bulunan en nadir Haki türü. Kullanıcının iradesini başkalarına dayatmasını sağlar. Zayıf iradeli kişiler bayılır. İleri seviyede saldırılara Haki akıtılarak yıkıcı güç elde edilir.',
    howItWorks: 'Haoshoku Haki, kullanıcının ruhani iradesinin fiziksel bir güç olarak dışa vurumudur. Eğitimle öğrenilemez — ya doğastan sahipsinizdir ya da değilsinizdir. Temel formda iradenizi dalgalar halinde yayarak zayıf iradeliyi bayıltırsınız. İleri seviyede fiziksel temas olmadan saldırı yapılabilir.',
    advancedForms: [
      {
        name: 'Haoshoku İnfüzyonu (Coating)',
        icon: Crown,
        description: 'En ileri seviye. Saldırılara Haoshoku Haki akıtarak fiziksel temas olmadan yıkıcı hasar verme. Gök ikiye bölünür. Luffy, Kaido\'ya karşı bu seviyeye ulaştı. Zoro da Enma ile kılıcına Haoshoku akıttı.',
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
      { name: 'Shanks', slug: 'shanks', level: 'master', note: 'En güçlü kullanıcılarından' },
      { name: 'Gol D. Roger', slug: 'roger', level: 'master', note: 'Korsanlar Kralı' },
      { name: 'Edward Newgate', slug: 'whitebeard', level: 'master', note: 'Dünyanın en güçlü adamı' },
      { name: 'Kaido', slug: 'kaido', level: 'master', note: 'İnfüzyon ustası' },
      { name: 'Charlotte Linlin', slug: 'bigmom', level: 'master', note: 'Doğastan' },
      { name: 'Silvers Rayleigh', slug: 'rayleigh', level: 'master', note: 'Karanlık Kral' },
      { name: 'Boa Hancock', slug: 'hancock', level: 'advanced' },
      { name: 'Portgas D. Ace', slug: 'ace', level: 'basic' },
      { name: 'Donquixote Doflamingo', slug: 'doflamingo', level: 'advanced' },
      { name: 'Eustass Kid', slug: 'kid', level: 'basic' },
      { name: 'Kozuki Oden', slug: 'oden', level: 'master', note: 'Enma\'nın orijinal sahibi' },
      { name: 'Yamato', slug: 'yamato', level: 'advanced' },
      { name: 'Sengoku', slug: 'sengoku', level: 'advanced' },
      { name: 'Monkey D. Garp', slug: 'garp', level: 'master', note: 'Galaxy Impact' },
    ],
    firstSeen: 'Marineford (bilinçsiz)',
    rarity: 'Ultra nadir — milyonda bir',
  },
]

const LEVEL_CONFIG: Record<string, { label: string; color: string; percent: number }> = {
  basic: { label: 'Temel', color: 'text-pirate-muted', percent: 33 },
  advanced: { label: 'İleri', color: 'text-sea', percent: 66 },
  master: { label: 'Usta', color: 'text-gold', percent: 100 },
}

/* Haki masters — characters who possess multiple types */
type HakiMaster = {
  name: string
  slug?: string
  title: string
  types: { id: string; level: 'basic' | 'advanced' | 'master' }[]
}

const HAKI_MASTERS: HakiMaster[] = [
  { name: 'Monkey D. Luffy', slug: 'luffy', title: 'Beşinci Yonko',
    types: [{ id: 'kenbunshoku', level: 'advanced' }, { id: 'busoshoku', level: 'master' }, { id: 'haoshoku', level: 'master' }] },
  { name: 'Silvers Rayleigh', slug: 'rayleigh', title: 'Karanlık Kral',
    types: [{ id: 'kenbunshoku', level: 'master' }, { id: 'busoshoku', level: 'master' }, { id: 'haoshoku', level: 'master' }] },
  { name: 'Gol D. Roger', slug: 'roger', title: 'Korsanlar Kralı',
    types: [{ id: 'kenbunshoku', level: 'master' }, { id: 'busoshoku', level: 'master' }, { id: 'haoshoku', level: 'master' }] },
  { name: 'Shanks', slug: 'shanks', title: 'Kızıl Saçlı Yonko',
    types: [{ id: 'kenbunshoku', level: 'master' }, { id: 'busoshoku', level: 'master' }, { id: 'haoshoku', level: 'master' }] },
  { name: 'Edward Newgate', slug: 'whitebeard', title: 'En Güçlü Adam',
    types: [{ id: 'kenbunshoku', level: 'advanced' }, { id: 'busoshoku', level: 'master' }, { id: 'haoshoku', level: 'master' }] },
  { name: 'Kaido', slug: 'kaido', title: 'En Güçlü Yaratık',
    types: [{ id: 'kenbunshoku', level: 'advanced' }, { id: 'busoshoku', level: 'master' }, { id: 'haoshoku', level: 'master' }] },
  { name: 'Charlotte Linlin', slug: 'bigmom', title: 'Big Mom',
    types: [{ id: 'kenbunshoku', level: 'advanced' }, { id: 'busoshoku', level: 'master' }, { id: 'haoshoku', level: 'master' }] },
  { name: 'Roronoa Zoro', slug: 'zoro', title: 'Korsan Avcısı',
    types: [{ id: 'busoshoku', level: 'master' }, { id: 'haoshoku', level: 'advanced' }] },
  { name: 'Vinsmoke Sanji', slug: 'sanji', title: 'Kara Bacak',
    types: [{ id: 'kenbunshoku', level: 'advanced' }, { id: 'busoshoku', level: 'advanced' }] },
  { name: 'Monkey D. Garp', slug: 'garp', title: 'Denizlerin Kahramanı',
    types: [{ id: 'busoshoku', level: 'master' }, { id: 'haoshoku', level: 'master' }] },
]

type HakiFact = {
  text: string
  character: string
  slug?: string
  hakiType: 'haoshoku' | 'busoshoku' | 'kenbunshoku' | 'all'
  arc?: string
}

const FUN_FACTS: HakiFact[] = [
  { text: 'Whitebeard\'in gemisine çıktığında sadece Haoshoku Haki\'siyle gemiyi çatırdattı.', character: 'Shanks', slug: 'shanks', hakiType: 'haoshoku', arc: 'Marineford' },
  { text: 'Fish-Man Island\'da 50.000 Balık-Adam\'ı tek seferde Haoshoku ile bayılttı.', character: 'Luffy', slug: 'luffy', hakiType: 'haoshoku', arc: 'Fish-Man Island' },
  { text: 'Luffy\'ye 18 ay boyunca Rusukaina Adası\'nda üç Haki türünün eğitimini verdi.', character: 'Rayleigh', slug: 'rayleigh', hakiType: 'all' },
  { text: 'Haoshoku çarpışmasında silahları temas etmeden gökyüzü ikiye bölündü.', character: 'Roger & Whitebeard', slug: 'roger', hakiType: 'haoshoku', arc: 'Wano (flashback)' },
  { text: 'Wano\'da farkında olmadan kılıcına Haoshoku Haki akıttı — King\'i yenmesini sağladı.', character: 'Zoro', slug: 'zoro', hakiType: 'haoshoku', arc: 'Wano' },
  { text: 'Marineford Savaşı\'nda aşırı stres altında Kenbunshoku Haki\'yi uyandırdı.', character: 'Koby', slug: 'koby', hakiType: 'kenbunshoku', arc: 'Marineford' },
  { text: 'Şeytan Meyvesi olmadan sadece Haki ile "Deniz Kuvvetlerinin Kahramanı" unvanını kazandı.', character: 'Garp', slug: 'garp', hakiType: 'busoshoku' },
  { text: 'Dressrosa\'da Sugar\'ı vurabilmek için bilinçsizce Kenbunshoku Haki uyandırdı.', character: 'Usopp', slug: 'usopp', hakiType: 'kenbunshoku', arc: 'Dressrosa' },
  { text: '5 yaşında farkında olmadan Haoshoku Haki kullanarak Elbaf devlerini bayılttı.', character: 'Big Mom', slug: 'bigmom', hakiType: 'haoshoku', arc: 'Whole Cake Island (flashback)' },
  { text: 'Galaxy Impact ile sadece Haki gücüyle Yonko seviyesinde savaştı — Şeytan Meyvesi kullanmadan.', character: 'Garp', slug: 'garp', hakiType: 'busoshoku', arc: 'Hachinosu' },
]

const HERO_ORBS = [
  { color: 'rgba(30, 144, 255, 0.4)', size: 280, x: '5%', y: '10%', delay: 0 },
  { color: 'rgba(244, 163, 0, 0.35)', size: 220, x: '65%', y: '20%', delay: 1.5 },
  { color: 'rgba(139, 92, 246, 0.3)', size: 200, x: '35%', y: '60%', delay: 3 },
  { color: 'rgba(30, 144, 255, 0.2)', size: 160, x: '80%', y: '70%', delay: 2 },
]

const HAKI_COLOR_MAP: Record<string, { hex: string; label: string }> = {
  kenbunshoku: { hex: '#63b3ed', label: 'Gözlem' },
  busoshoku: { hex: '#a78bfa', label: 'Silahlanma' },
  haoshoku: { hex: '#f4a300', label: 'Fatih' },
}

/* ─── Helper Components ──────────────────────────────────────── */

function LevelBadge({ level, colorHex }: { level: string; colorHex: string }) {
  const config = LEVEL_CONFIG[level]
  return (
    <div className="flex items-center gap-2.5">
      <div className="h-2 w-20 overflow-hidden rounded-full bg-ocean-surface">
        <motion.div
          className="h-full rounded-full"
          style={{ background: colorHex }}
          initial={{ width: 0 }}
          whileInView={{ width: `${config.percent}%` }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: EASE, delay: 0.2 }}
        />
      </div>
      <span className={`text-xs font-bold uppercase tracking-wider ${config.color}`}>
        {config.label}
      </span>
    </div>
  )
}

function UserCard({ user, colorHex }: { user: HakiUser; colorHex: string }) {
  const img = user.slug ? getCharacterImage(user.slug) : ''

  const content = (
    <motion.div
      variants={fadeUp}
      className="group flex items-center gap-4 rounded-2xl border border-pirate-border/30 bg-ocean-surface/50 px-5 py-4 transition-all duration-300 hover:border-pirate-border/60 hover:bg-ocean-surface"
    >
      {/* Character image */}
      {img ? (
        <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-xl border border-pirate-border/40 bg-ocean-deep">
          <Image src={img} alt={user.name} fill className="object-cover object-top" sizes="56px" />
        </div>
      ) : (
        <div
          className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-xl border border-pirate-border/40"
          style={{ background: `${colorHex}10` }}
        >
          <span className="text-sm font-bold" style={{ color: colorHex }}>
            {user.name.charAt(0)}
          </span>
        </div>
      )}

      {/* Info */}
      <div className="min-w-0 flex-1">
        <p className="truncate text-base font-bold text-pirate-text transition-colors group-hover:text-white">
          {user.name}
        </p>
        {user.note && (
          <p className="mt-1 truncate text-sm text-pirate-muted">{user.note}</p>
        )}
      </div>

      {/* Level */}
      <LevelBadge level={user.level} colorHex={colorHex} />
    </motion.div>
  )

  return user.slug ? (
    <Link href={`/characters/${user.slug}`}>{content}</Link>
  ) : (
    <div>{content}</div>
  )
}

/* ─── Page ───────────────────────────────────────────────────── */

export default function HakiPage() {
  const [activeTab, setActiveTab] = useState(0)
  const activeHaki = HAKI_TYPES[activeTab]
  const HakiIcon = activeHaki.icon

  const totalUsers = HAKI_TYPES.reduce((sum, h) => sum + h.users.length, 0)
  const masterCount = HAKI_MASTERS.filter((m) => m.types.length === 3).length

  return (
    <>
      <Header />
      <main className="relative min-h-screen pt-24">
        <div className="mx-auto max-w-6xl px-6">
          {/* Hero */}
          <PageHero
            icon={Shield}
            title="Haki"
            subtitle="Rehberi"
            accentColor="gold"
            description="Haki, One Piece evrenindeki tüm canlılarda potansiyel olarak var olan ruhani güçtür. 'İrade', 'ambisyon' ve 'ruh' anlamlarına gelir. Yalnızca en güçlü savaşçıların üçü de kullanabilir."
            orbs={HERO_ORBS}
          >
            <div className="flex flex-wrap items-center gap-4">
              <div className="bento-card inline-flex items-center gap-3 rounded-xl px-5 py-3">
                <Shield className="h-5 w-5 text-purple-400" />
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-pirate-muted">Haki Türü</p>
                  <p className="text-lg font-extrabold text-pirate-text stat-number">3</p>
                </div>
              </div>
              <div className="bento-card inline-flex items-center gap-3 rounded-xl px-5 py-3">
                <Users className="h-5 w-5 text-sea" />
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-pirate-muted">Bilinen Kullanıcı</p>
                  <p className="text-lg font-extrabold text-sea stat-number">{totalUsers}</p>
                </div>
              </div>
              <div className="bento-card inline-flex items-center gap-3 rounded-xl px-5 py-3">
                <Crown className="h-5 w-5 text-gold" />
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-pirate-muted">Üç Haki Ustası</p>
                  <p className="text-lg font-extrabold text-gold stat-number">{masterCount}</p>
                </div>
              </div>
            </div>
          </PageHero>

          {/* ── Haki Nedir? Summary ─────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: EASE }}
            className="bento-card mb-10 p-6 sm:p-8"
          >
            <div className="mb-4 flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-gold" />
              <h2 className="text-base font-bold text-pirate-text">Haki Nedir?</h2>
            </div>
            <p className="text-sm leading-relaxed text-pirate-muted">
              Haki (覇気), tüm canlılarda potansiyel olarak bulunan gizemli bir güçtür.
              Rayleigh&apos;in açıklamasına göre Haki &quot;tüm canlılarda var olan iradenin tezahürüdür&quot;.
              Çoğu insan bu gücün farkında bile değildir veya onu uyandırmaz. Grand Line&apos;da,
              özellikle New World&apos;de Haki kullanmak hayatta kalmak için zorunludur.
              Silvers Rayleigh, Luffy&apos;ye 2 yıllık zaman atlama süresinde Rusukaina Adası&apos;nda Haki eğitimi vermiştir.
            </p>
          </motion.div>

          {/* ── Tab Navigation ──────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: EASE, delay: 0.2 }}
            className="mb-8 grid grid-cols-3 gap-3"
          >
            {HAKI_TYPES.map((haki, idx) => {
              const TabIcon = haki.icon
              const isActive = activeTab === idx
              return (
                <button
                  key={haki.id}
                  onClick={() => setActiveTab(idx)}
                  className={`group relative overflow-hidden rounded-2xl border p-4 sm:p-5 text-left transition-all duration-500 ${
                    isActive
                      ? `${haki.borderColor} ${haki.bg}`
                      : 'border-pirate-border/30 bg-ocean-surface/30 hover:border-pirate-border/50 hover:bg-ocean-surface/50'
                  }`}
                >
                  {/* Active glow */}
                  {isActive && (
                    <motion.div
                      layoutId="haki-tab-glow"
                      className="absolute inset-0 rounded-2xl"
                      style={{
                        boxShadow: `0 0 40px ${haki.glowColor}, inset 0 1px 0 ${haki.colorHex}15`,
                      }}
                      transition={{ duration: 0.4, ease: EASE }}
                    />
                  )}

                  <div className="relative z-10">
                    <div className="mb-3 flex items-center gap-3">
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-xl border transition-colors ${
                          isActive ? `${haki.borderColor} ${haki.bg}` : 'border-pirate-border/30 bg-ocean-surface/50'
                        }`}
                      >
                        <TabIcon className={`h-5 w-5 transition-colors ${isActive ? haki.color : 'text-pirate-muted group-hover:text-pirate-text'}`} />
                      </div>
                      <div className="min-w-0">
                        <p className={`text-sm font-bold transition-colors sm:text-base ${isActive ? haki.color : 'text-pirate-muted group-hover:text-pirate-text'}`}>
                          {haki.meaning}
                        </p>
                        <p className="hidden text-[10px] text-pirate-muted/60 sm:block">{haki.japaneseName}</p>
                      </div>
                    </div>
                    <p className={`text-[11px] leading-relaxed transition-colors sm:text-xs ${isActive ? 'text-pirate-muted' : 'text-pirate-muted/60'}`}>
                      {haki.users.length} kullanıcı · {haki.advancedForms.length} ileri form
                    </p>
                  </div>

                  {/* Bottom accent line */}
                  <div
                    className="absolute inset-x-0 bottom-0 h-0.5 transition-opacity duration-500"
                    style={{
                      background: `linear-gradient(90deg, transparent, ${haki.colorHex}, transparent)`,
                      opacity: isActive ? 1 : 0,
                    }}
                  />
                </button>
              )
            })}
          </motion.div>

          {/* ── Active Haki Content ─────────────────────────────────── */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeHaki.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4, ease: EASE }}
              className="relative mb-16"
            >
              {/* Background glow */}
              <div
                className="pointer-events-none absolute -right-40 -top-20 h-96 w-96 rounded-full blur-3xl"
                style={{ background: activeHaki.glowColor, opacity: 0.3 }}
              />

              {/* Section Header */}
              <div className="relative z-10 mb-8 flex items-center gap-4">
                <div
                  className={`flex h-16 w-16 items-center justify-center rounded-2xl border ${activeHaki.borderColor} ${activeHaki.bg} shadow-lg`}
                >
                  <HakiIcon className={`h-8 w-8 ${activeHaki.color}`} />
                </div>
                <div>
                  <h2 className={`text-2xl font-extrabold sm:text-3xl ${activeHaki.color}`}>{activeHaki.name}</h2>
                  <p className="font-mono text-xs text-pirate-muted/60">
                    {activeHaki.japaneseName} — {activeHaki.meaning}
                  </p>
                </div>
              </div>

              {/* Description + How it works */}
              <div className="relative z-10 mb-8 grid gap-4 sm:grid-cols-2">
                <div className="bento-card p-6">
                  <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-pirate-text">Açıklama</h3>
                  <p className="text-sm leading-relaxed text-pirate-muted">{activeHaki.description}</p>
                </div>
                <div className="bento-card p-6">
                  <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-pirate-text">Nasıl Çalışır?</h3>
                  <p className="text-sm leading-relaxed text-pirate-muted">{activeHaki.howItWorks}</p>
                </div>
              </div>

              {/* Meta info */}
              <div className="relative z-10 mb-8 flex flex-wrap gap-3">
                <div className="bento-card rounded-xl px-5 py-3">
                  <p className="text-[10px] uppercase tracking-wider text-pirate-muted">İlk Görünüm</p>
                  <p className="text-sm font-semibold text-pirate-text">{activeHaki.firstSeen}</p>
                </div>
                <div className="bento-card rounded-xl px-5 py-3">
                  <p className="text-[10px] uppercase tracking-wider text-pirate-muted">Nadirlik</p>
                  <p className={`text-sm font-semibold ${activeHaki.color}`}>{activeHaki.rarity}</p>
                </div>
                <div className="bento-card rounded-xl px-5 py-3">
                  <p className="text-[10px] uppercase tracking-wider text-pirate-muted">Kullanıcı Sayısı</p>
                  <p className={`text-sm font-semibold ${activeHaki.color}`}>{activeHaki.users.length}</p>
                </div>
              </div>

              {/* Advanced Forms */}
              <div className="relative z-10 mb-8">
                <h3 className="mb-5 flex items-center gap-2 text-base font-bold text-pirate-text">
                  <Star className={`h-4 w-4 ${activeHaki.color}`} />
                  İleri Seviye Formlar
                </h3>
                <motion.div
                  className="grid gap-4 sm:grid-cols-3"
                  variants={staggerContainer(0.1)}
                  initial="hidden"
                  animate="visible"
                  key={`forms-${activeHaki.id}`}
                >
                  {activeHaki.advancedForms.map((form) => {
                    const FormIcon = form.icon
                    return (
                      <motion.div
                        key={form.name}
                        variants={scaleIn}
                        className="bento-card group relative overflow-hidden p-5"
                      >
                        {/* Colored top border */}
                        <div
                          className="absolute inset-x-0 top-0 h-0.5"
                          style={{ background: `linear-gradient(90deg, ${activeHaki.colorHex}, transparent)` }}
                        />
                        <div className="mb-3 flex items-center gap-2">
                          <div
                            className="flex h-8 w-8 items-center justify-center rounded-lg"
                            style={{ background: `${activeHaki.colorHex}15` }}
                          >
                            <FormIcon className={`h-4 w-4 ${activeHaki.color}`} />
                          </div>
                          <h4 className={`text-sm font-bold ${activeHaki.color}`}>{form.name}</h4>
                        </div>
                        <p className="text-xs leading-relaxed text-pirate-muted">{form.description}</p>
                      </motion.div>
                    )
                  })}
                </motion.div>
              </div>

              {/* Known Users */}
              <div className="relative z-10">
                <h3 className="mb-6 flex items-center gap-2 text-lg font-extrabold text-pirate-text">
                  <Users className={`h-5 w-5 ${activeHaki.color}`} />
                  Bilinen Kullanıcılar
                </h3>
                <motion.div
                  className="grid gap-3 sm:grid-cols-2"
                  variants={staggerContainer(0.04)}
                  initial="hidden"
                  animate="visible"
                  key={`users-${activeHaki.id}`}
                >
                  {activeHaki.users.map((user) => (
                    <UserCard key={user.name} user={user} colorHex={activeHaki.colorHex} />
                  ))}
                </motion.div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* ── Haki Ustaları ───────────────────────────────────────── */}
          <motion.section
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: EASE }}
            className="mb-16"
          >
            {/* Section divider */}
            <div className="relative mb-10 flex items-center justify-center">
              <div className="h-px w-full bg-gradient-to-r from-transparent via-gold/25 to-transparent" />
              <div className="absolute flex h-10 w-10 items-center justify-center rounded-full border border-gold/30 bg-ocean-deep">
                <Award className="h-4 w-4 text-gold" />
              </div>
            </div>

            <h2 className="mb-3 text-center text-2xl font-extrabold text-pirate-text sm:text-3xl">
              Haki <span className="text-gold-gradient">Ustaları</span>
            </h2>
            <p className="mx-auto mb-8 max-w-xl text-center text-sm text-pirate-muted">
              Birden fazla Haki türüne hükmeden efsanevi savaşçılar. Üç türde de usta olanlar tarihin en güçlüleridir.
            </p>

            <motion.div
              className="grid gap-4 sm:grid-cols-2"
              variants={staggerContainer(0.06)}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {HAKI_MASTERS.map((master) => {
                const img = master.slug ? getCharacterImage(master.slug) : ''
                const isTriple = master.types.length === 3

                return (
                  <motion.div key={master.name} variants={fadeUp}>
                    <Link
                      href={master.slug ? `/characters/${master.slug}` : '#'}
                      className={`group flex items-center gap-4 rounded-2xl border p-4 transition-all duration-300 ${
                        isTriple
                          ? 'border-gold/25 bg-gradient-to-r from-gold/[0.04] to-transparent hover:border-gold/40 hover:shadow-[0_0_30px_rgba(244,163,0,0.08)]'
                          : 'border-pirate-border/30 bg-ocean-surface/40 hover:border-pirate-border/60 hover:bg-ocean-surface/60'
                      }`}
                    >
                      {/* Character portrait */}
                      {img ? (
                        <div className={`relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-xl border ${
                          isTriple ? 'border-gold/30' : 'border-pirate-border/40'
                        } bg-ocean-deep`}>
                          <Image src={img} alt={master.name} fill className="object-cover object-top" sizes="56px" />
                        </div>
                      ) : (
                        <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-xl border border-pirate-border/40 bg-ocean-surface">
                          <Crown className="h-6 w-6 text-gold/40" />
                        </div>
                      )}

                      {/* Info */}
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-bold text-pirate-text transition-colors group-hover:text-white">
                          {master.name}
                        </p>
                        <p className={`text-[11px] ${isTriple ? 'text-gold/70' : 'text-pirate-muted/70'}`}>
                          {master.title}
                        </p>
                        {/* Haki type dots */}
                        <div className="mt-2 flex items-center gap-2">
                          {master.types.map((t) => {
                            const hakiInfo = HAKI_COLOR_MAP[t.id]
                            return (
                              <div key={t.id} className="flex items-center gap-1">
                                <div
                                  className="h-2 w-2 rounded-full"
                                  style={{ background: hakiInfo.hex }}
                                />
                                <span className="text-[9px] font-semibold text-pirate-muted">
                                  {hakiInfo.label}
                                </span>
                              </div>
                            )
                          })}
                        </div>
                      </div>

                      {/* Badge */}
                      <div className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg ${
                        isTriple ? 'bg-gold/15' : 'bg-ocean-surface'
                      }`}>
                        <span className={`text-xs font-extrabold ${isTriple ? 'text-gold' : 'text-pirate-muted'}`}>
                          {master.types.length}
                        </span>
                      </div>

                      <ChevronRight className="h-4 w-4 flex-shrink-0 text-pirate-muted/40 transition-transform group-hover:translate-x-0.5 group-hover:text-pirate-muted" />
                    </Link>
                  </motion.div>
                )
              })}
            </motion.div>
          </motion.section>

          {/* ── Fun Facts ───────────────────────────────────────────── */}
          <motion.section
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: EASE }}
            className="mb-8"
          >
            {/* Section divider */}
            <div className="relative mb-10 flex items-center justify-center">
              <div className="h-px w-full bg-gradient-to-r from-transparent via-sea/25 to-transparent" />
              <div className="absolute flex h-10 w-10 items-center justify-center rounded-full border border-sea/30 bg-ocean-deep">
                <Sparkles className="h-4 w-4 text-sea" />
              </div>
            </div>

            <h2 className="mb-3 text-center text-2xl font-extrabold text-pirate-text sm:text-3xl">
              Haki <span className="text-gold-gradient">Efsaneleri</span>
            </h2>
            <p className="mx-auto mb-8 max-w-lg text-center text-sm text-pirate-muted">
              One Piece tarihinde Haki ile yazılmış unutulmaz anlar.
            </p>

            <motion.div
              className="grid gap-4 sm:grid-cols-2"
              variants={staggerContainer(0.06)}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {FUN_FACTS.map((fact, i) => {
                const hakiInfo = HAKI_COLOR_MAP[fact.hakiType] ?? { hex: '#f4a300', label: 'Haki' }
                const colorHex = fact.hakiType === 'all' ? '#f4a300' : hakiInfo.hex
                const img = fact.slug ? getCharacterImage(fact.slug) : ''

                return (
                  <motion.div
                    key={i}
                    variants={fadeUp}
                    className="group relative overflow-hidden rounded-2xl border border-pirate-border/30 bg-ocean-surface/40 transition-all duration-500 hover:border-pirate-border/50 hover:bg-ocean-surface/60"
                  >
                    {/* Haki type accent top */}
                    <div
                      className="h-0.5 w-full"
                      style={{ background: `linear-gradient(90deg, ${colorHex}, transparent)` }}
                    />

                    <div className="flex items-center gap-4 p-5">
                      {/* Character portrait */}
                      {img ? (
                        <div
                          className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl border bg-ocean-deep"
                          style={{ borderColor: `${colorHex}30` }}
                        >
                          <Image src={img} alt={fact.character} fill className="object-cover object-top" sizes="64px" />
                          {/* Haki type glow */}
                          <div
                            className="absolute inset-0 rounded-xl opacity-0 transition-opacity group-hover:opacity-100"
                            style={{ boxShadow: `inset 0 0 20px ${colorHex}20` }}
                          />
                        </div>
                      ) : (
                        <div
                          className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-xl border"
                          style={{ borderColor: `${colorHex}30`, background: `${colorHex}08` }}
                        >
                          <Zap className="h-6 w-6" style={{ color: colorHex }} />
                        </div>
                      )}

                      {/* Content */}
                      <div className="min-w-0 flex-1">
                        <div className="mb-1.5 flex items-center gap-2">
                          <span className="text-sm font-bold text-pirate-text">{fact.character}</span>
                          <span
                            className="rounded-md px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider"
                            style={{ background: `${colorHex}15`, color: colorHex }}
                          >
                            {fact.hakiType === 'all' ? 'Tüm Haki' : hakiInfo.label}
                          </span>
                          {fact.arc && (
                            <span className="hidden text-[10px] text-pirate-muted/50 sm:inline">
                              {fact.arc}
                            </span>
                          )}
                        </div>
                        <p className="text-sm leading-relaxed text-pirate-muted transition-colors group-hover:text-pirate-text/90">
                          {fact.text}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </motion.div>
          </motion.section>
        </div>

        <div className="mt-16" />
      </main>
      <Footer />
    </>
  )
}
