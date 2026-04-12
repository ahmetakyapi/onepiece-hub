'use client'

import { motion } from 'framer-motion'
import { Shield, Eye, Crown, Zap, Users, Sparkles, BookOpen, Star } from 'lucide-react'
import Link from 'next/link'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { fadeUp, staggerContainer, EASE } from '@/lib/variants'

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
  bg: string
  borderColor: string
  description: string
  howItWorks: string
  advancedForms: { name: string; description: string }[]
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
    bg: 'bg-sea/10',
    borderColor: 'border-sea/30',
    description: 'Çevredeki canlıların varlığını, duygularını ve niyetlerini hissetme yeteneği. İleri seviyede birkaç saniye geleceği görebilir. "Mantra" olarak da bilinir (Skypiea\'da).',
    howItWorks: 'Kullanıcının zihinsel farkındalığını genişleterek çevresindeki yaşam enerjilerini (aura) algılamasını sağlar. Her canlının benzersiz bir aurası vardır ve deneyimli kullanıcılar bu auraları uzak mesafelerden bile algılayabilir. Duygusal durum, niyet ve hatta düşünceler bile ileri seviye kullanıcılar tarafından okunabilir.',
    advancedForms: [
      {
        name: 'Gelecek Görüşü (Future Sight)',
        description: 'En ileri seviye Kenbunshoku. Kullanıcı birkaç saniye ilerisini görebilir — düşmanın saldırısını gerçekleşmeden önce görerek kaçınır. Charlotte Katakuri bu formun ustasıdır. Luffy, Whole Cake Island\'da bu seviyeye ulaştı.',
      },
      {
        name: 'Geniş Alan Taraması',
        description: 'Büyük bir alanı tarayarak tüm canlıları algılama. Enel, Goro Goro meyvesiyle kombine ederek tüm Skypiea\'yı tarayabiliyordu. Aisa ve Koby doğuştan bu yeteneğe sahip.',
      },
      {
        name: 'Duygu Okuma',
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
      { name: 'Aisa', level: 'basic', note: 'Doğuştan, Skypiea' },
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
    bg: 'bg-purple-500/10',
    borderColor: 'border-purple-500/30',
    description: 'Vücudu veya silahları görünmez bir zırhla kaplama yeteneği. Saldırı gücünü ve savunmayı artırır. En önemlisi, Logia tipi Şeytan Meyvesi kullanıcılarının gerçek vücuduna dokunabilmeyi sağlar.',
    howItWorks: 'Kullanıcının irade gücünü (ruhani enerjiyi) fiziksel bir zırha dönüştürür. Bu zırh genellikle görünmezdir ancak ileri seviyede vücudu siyah metalik bir katmanla kaplar (Hardening). Haki kaplı saldırılar Logia kullanıcılarının elementel formunu bypass ederek gerçek vücutlarına ulaşır. Silahlanma Haki\'si kılıçlara, oklara ve diğer silahlara da uygulanabilir.',
    advancedForms: [
      {
        name: 'Sertleştirme (Hardening / Koka)',
        description: 'Busoshoku\'nun görünür formu. Vücut veya silah siyah metalik bir katmanla kaplanır. Hem saldırı hem savunma gücünü dramatik olarak artırır. Vergo, Luffy ve Zoro bu tekniği sıklıkla kullanır.',
      },
      {
        name: 'Emisyon (Ryuo)',
        description: 'Wano\'da "Ryuo" olarak bilinen ileri seviye. Haki\'yi vücuttan dışarı yayarak dokunmadan hasar verme. Rayleigh bunu Luffy\'ye öğretti. Sentomaru bu tekniğin erken bir örneğiydi.',
      },
      {
        name: 'İç Yıkım',
        description: 'En ileri seviye Busoshoku. Haki\'yi düşmanın vücudunun içine göndererek içeriden hasar verme. Zırh ve savunma aşılmaz — hasar doğrudan iç organlara gider. Luffy bunu Wano\'da Kaido\'ya karşı kullandı.',
      },
    ],
    users: [
      { name: 'Monkey D. Luffy', slug: 'luffy', level: 'master', note: 'İç yıkım + Gear 4' },
      { name: 'Roronoa Zoro', slug: 'zoro', level: 'master', note: 'Enma kılıcıyla kombine' },
      { name: 'Sanji', slug: 'sanji', level: 'advanced', note: 'Ifrit Jambe ile kombine' },
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
    bg: 'bg-gold/10',
    borderColor: 'border-gold/30',
    description: 'Milyonda bir kişide bulunan en nadir Haki türü. Kullanıcının iradesini başkalarına dayatmasını sağlar. Zayıf iradeli kişiler bayılır. İleri seviyede saldırılara Haki akıtılarak yıkıcı güç elde edilir. "Kral Nitelikleri" taşıyan kişilere özgüdür.',
    howItWorks: 'Haoshoku Haki, kullanıcının ruhani iradesinin (ambisyon, kararlılık) fiziksel bir güç olarak dışa vurumudur. Eğitimle öğrenilemez — ya doğuştan sahipsinizdir ya da değilsinizdir. Temel formda iradenizi dalgalar halinde yayarak zayıf iradeliyi bayıltırsınız. Hayvanları evcilleştirebilir, denizcileri tek bakışla alt edebilirsiniz. İleri seviyede ise fiziksel temas olmadan saldırı yapılabilir.',
    advancedForms: [
      {
        name: 'Haoshoku İnfüzyonu (Coating)',
        description: 'En ileri seviye. Saldırılara Haoshoku Haki akıtarak fiziksel temas olmadan yıkıcı hasar verme. Gök ikiye bölünür, çevre sallanır. Whitebeard ve Roger\'ın efsanevi çarpışmasında gökleri ikiye böldüler. Luffy, Kaido\'ya karşı bu seviyeye ulaştı. Zoro da Enma ile kılıcına Haoshoku akıttı.',
      },
      {
        name: 'İrade Dalgası',
        description: 'Geniş alana irade dalgası yayarak zayıf iradeliyi bayıltma. Luffy, Fish-Man Island\'da 50.000 Balık-Adam\'ı tek seferde bayılttı. Shanks, Whitebeard\'ın gemisinde yürürken mürettebatı bayılttı.',
      },
      {
        name: 'Hayvan Evcilleştirme',
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
      { name: 'Charlotte Linlin / Big Mom', slug: 'bigmom', level: 'master', note: 'Doğuştan' },
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

const LEVEL_LABELS: Record<string, { label: string; color: string }> = {
  basic: { label: 'Temel', color: 'text-pirate-muted' },
  advanced: { label: 'İleri', color: 'text-sea' },
  master: { label: 'Usta', color: 'text-gold' },
}

export default function HakiPage() {
  return (
    <>
      <Header />
      <main className="relative min-h-screen pt-24">
        <div className="mx-auto max-w-5xl px-6">
          {/* Header */}
          <motion.div
            variants={staggerContainer(0.1)}
            initial="hidden"
            animate="visible"
            className="mb-12"
          >
            <motion.h1
              variants={fadeUp}
              className="mb-3 text-3xl font-extrabold sm:text-4xl"
            >
              <span className="text-gold-gradient">Haki</span>{' '}
              <span className="text-pirate-text">Rehberi</span>
            </motion.h1>
            <motion.p variants={fadeUp} className="max-w-2xl text-pirate-muted">
              Haki, One Piece evrenindeki tüm canlılarda potansiyel olarak var olan ruhani güçtür.
              &quot;İrade&quot;, &quot;ambisyon&quot; ve &quot;ruh&quot; anlamlarına gelir. Üç temel türü vardır ve
              yalnızca en güçlü savaşçılar üçünü de kullanabilir.
            </motion.p>

            {/* Quick summary */}
            <motion.div variants={fadeUp} className="mt-6 glass rounded-xl p-5">
              <div className="mb-3 flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-gold" />
                <h2 className="text-sm font-bold text-pirate-text">Haki Nedir?</h2>
              </div>
              <p className="text-sm leading-relaxed text-pirate-muted">
                Haki (覇気), tüm canlılarda potansiyel olarak bulunan gizemli bir güçtür.
                Rayleigh&apos;in açıklamasına göre Haki &quot;tüm canlılarda var olan iradenin tezahürüdür&quot;.
                Çoğu insan bu gücün farkında bile değildir veya onu uyandıramaz. Grand Line&apos;da,
                özellikle New World&apos;de Haki kullanmak hayatta kalmak için zorunludur.
                Silvers Rayleigh, Luffy&apos;ye 2 yıllık zaman atlama süresinde Haki eğitimi vermiştir.
              </p>
            </motion.div>
          </motion.div>

          {/* Haki Types */}
          <div className="space-y-16">
            {HAKI_TYPES.map((haki, idx) => {
              const HakiIcon = haki.icon
              return (
                <motion.section
                  key={haki.name}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: 0.6, ease: EASE }}
                >
                  {/* Section header */}
                  <div className="mb-6 flex items-center gap-4">
                    <div className={`flex h-14 w-14 items-center justify-center rounded-2xl border ${haki.borderColor} ${haki.bg}`}>
                      <HakiIcon className={`h-7 w-7 ${haki.color}`} />
                    </div>
                    <div>
                      <h2 className={`text-xl font-extrabold ${haki.color}`}>{haki.name}</h2>
                      <p className="font-mono text-xs text-pirate-muted/60">{haki.japaneseName} — {haki.meaning}</p>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="glass mb-6 rounded-xl p-5">
                    <p className="mb-4 text-sm leading-relaxed text-pirate-muted">
                      {haki.description}
                    </p>
                    <div className="border-t border-pirate-border pt-4">
                      <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-pirate-text">Nasıl Çalışır?</h3>
                      <p className="text-sm leading-relaxed text-pirate-muted">
                        {haki.howItWorks}
                      </p>
                    </div>
                  </div>

                  {/* Meta info */}
                  <div className="mb-6 flex flex-wrap gap-3">
                    <div className="glass rounded-xl px-4 py-2">
                      <p className="text-xs text-pirate-muted">İlk Görünüm</p>
                      <p className="text-sm font-semibold text-pirate-text">{haki.firstSeen}</p>
                    </div>
                    <div className="glass rounded-xl px-4 py-2">
                      <p className="text-xs text-pirate-muted">Nadirlik</p>
                      <p className={`text-sm font-semibold ${haki.color}`}>{haki.rarity}</p>
                    </div>
                  </div>

                  {/* Advanced Forms */}
                  <div className="mb-6">
                    <h3 className="mb-4 flex items-center gap-2 text-base font-bold text-pirate-text">
                      <Star className="h-4 w-4 text-gold" />
                      İleri Seviye Formlar
                    </h3>
                    <div className="space-y-3">
                      {haki.advancedForms.map((form) => (
                        <div key={form.name} className="glass rounded-xl p-4">
                          <h4 className={`mb-2 text-sm font-bold ${haki.color}`}>{form.name}</h4>
                          <p className="text-xs leading-relaxed text-pirate-muted">{form.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Known Users */}
                  <div>
                    <h3 className="mb-4 flex items-center gap-2 text-base font-bold text-pirate-text">
                      <Users className="h-4 w-4 text-sea" />
                      Bilinen Kullanıcılar
                    </h3>
                    <div className="glass rounded-xl p-4">
                      <div className="grid gap-2 sm:grid-cols-2">
                        {haki.users.map((user) => {
                          const levelInfo = LEVEL_LABELS[user.level]
                          const content = (
                            <div className="flex items-center justify-between rounded-lg bg-ocean-surface px-3 py-2.5 transition-colors hover:bg-ocean-surface/80">
                              <div>
                                <p className="text-sm font-semibold text-pirate-text">{user.name}</p>
                                {user.note && (
                                  <p className="text-xs text-pirate-muted">{user.note}</p>
                                )}
                              </div>
                              <span className={`text-xs font-medium ${levelInfo.color}`}>
                                {levelInfo.label}
                              </span>
                            </div>
                          )
                          return user.slug ? (
                            <Link key={user.name} href={`/characters/${user.slug}`}>
                              {content}
                            </Link>
                          ) : (
                            <div key={user.name}>{content}</div>
                          )
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Divider */}
                  {idx < HAKI_TYPES.length - 1 && (
                    <div className="mt-12 divider-glow" />
                  )}
                </motion.section>
              )
            })}
          </div>

          {/* Fun Facts */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: EASE }}
            className="mt-16 mb-8"
          >
            <h2 className="mb-6 flex items-center gap-2 text-xl font-extrabold text-pirate-text">
              <Sparkles className="h-5 w-5 text-gold" />
              Haki Hakkında İlginç Bilgiler
            </h2>
            <div className="glass rounded-xl p-6">
              <ul className="space-y-3">
                {[
                  'Haoshoku Haki milyonda bir kişide bulunur — öğretilemez, doğuştan gelir.',
                  'Shanks, Whitebeard\'ın gemisine çıktığında sadece Haoshoku Haki\'siyle gemiyi çatırdattı.',
                  'Luffy, Fish-Man Island\'da 50.000 Balık-Adam\'ı tek seferde bayılttı.',
                  'Rayleigh, Luffy\'ye 18 ay boyunca Rusukaina Adası\'nda Haki eğitimi verdi.',
                  'Roger ve Whitebeard\'ın Haoshoku çarpışmasında silahları temas etmeden gökyüzü ikiye bölündü.',
                  'Zoro, Wano\'da farkında olmadan kılıcına Haoshoku Haki akıttı — King\'i yenmesini sağladı.',
                  'Koby, Marineford Savaşı\'nda aşırı stres altında Kenbunshoku Haki\'yi uyandırdı.',
                  'Garp, Şeytan Meyvesi olmadan sadece Haki ile "Deniz Kuvvetlerinin Kahramanı" ünvanını kazandı.',
                  'Usopp, Dressrosa\'da Sugar\'ı vurabilmek için bilinçsizce Kenbunshoku Haki uyandırdı.',
                  'Big Mom, 5 yaşında farkında olmadan Haoshoku Haki kullanarak Elbaf devlerini bayılttı.',
                ].map((fact, i) => (
                  <li key={i} className="flex gap-3 text-sm text-pirate-muted">
                    <Zap className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-gold" />
                    <span>{fact}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.section>
        </div>

        <div className="mt-16" />
      </main>
      <Footer />
    </>
  )
}
