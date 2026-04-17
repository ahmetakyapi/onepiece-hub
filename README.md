<div align="center">

# One Piece Hub

**Filler'sız arc bazlı bölüm düzeni · Türkçe karakter ansiklopedisi · Kişisel izleme takibi**

<p align="center">
  <a href="https://onepiece-hub.vercel.app"><strong>Canlı Demo →</strong></a>
</p>

<p align="center">
  <img alt="Next.js" src="https://img.shields.io/badge/Next.js-14-black?logo=next.js">
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-strict-3178c6?logo=typescript">
  <img alt="Tailwind" src="https://img.shields.io/badge/Tailwind-3.4-38bdf8?logo=tailwindcss">
  <img alt="Framer Motion" src="https://img.shields.io/badge/Framer_Motion-11-0055ff?logo=framer">
  <img alt="Drizzle" src="https://img.shields.io/badge/Drizzle-Neon-c5f74f?logo=postgresql">
  <img alt="Vercel" src="https://img.shields.io/badge/Vercel-deployed-black?logo=vercel">
</p>

<p align="center">
  <em>Grand Line&apos;ın sonuna 900 yılda varılır. Bu platform seni 12 tıklama uzağa taşır.</em>
</p>

</div>

---

## Neden Bu Proje?

One Piece — 1100+ bölüm, 25+ yıl, ~% 40 filler oranı. Türk izleyici için mevcut çözümler ya filler dolu, ya İngilizce, ya dağınık. **One Piece Hub**, [OnePaceTR](https://www.onepacetr.net/) bölüm numaralandırmasını arc bazlı hale getirir, her arc'a karakter/meyve/savaş kontekstini ekler ve izleme ilerlemesini (anonim veya hesapla) hatırlar.

Ama asıl niyet başka: **dark-mode tasarımla bir anime wiki'sinin nasıl hissettirilebileceğini göstermek**. Her sayfa bir mikro deneyim — parallax hero, shared-element morph, sticky scroll-reveal, manga panel overlay, jolly roger watermark, scroll-driven zaman çizelgesi.

---

## İçerik

| Kategori | Adet |
|---|---|
| Arc | **36** |
| Bölüm | **463** |
| Karakter | **66** |
| Saga | **10** |
| Mürettebat | **12** |
| Şeytan Meyvesi | **43** |
| Efsanevi Savaş | **22** |
| Lokasyon | **32** |
| Bounty Entry | **46** |
| Arc Quiz | 15+ |

Tüm içerik `lib/constants/*` altında type-safe TypeScript dosyalarında. DB'ye yazılmaz — statik, SSG'ye uygun, git'te versiyonlanır.

---

## Öne Çıkan Özellikler

### Cinematic Hero
- Ken Burns zoom (22s self-loop, scroll-driven parallax değil)
- Gold shimmer sweep başlıkta (6s gradient loop)
- Jolly Roger skull watermark — ambient, gold, ±4° sallanan
- `shine-hover` primary CTA'da diagonal ışık sweep
- WaveBackground geçişi

### Karakter İlişki Grafiği
- Desktop: 1200×1200 SVG force-directed graph, 25 nod, 6 ilişki türü (nakama / aile / rakip / düşman / mentor / müttefik)
- Mobile: `matchMedia` ile otomatik geçiş — yatay avatar picker + dikey ilişki listesi
- Her seçim relation-type'a göre renk kodlu

### İzleme Takibi
- **Giriş yapmış kullanıcı** → Neon Postgres'e yazılır (`watchProgress` tablosu)
- **Anonim kullanıcı** → localStorage (`onepiece-watched`)
- Login / register sırasında localStorage → DB otomatik sync
- Arc ilerleme pusulası (SVG ring progress) her bölüm sidebar'ında

### Quiz Sistemi
- Her arc için 5-10 soru, 4 seçenek
- Streak takibi + milestone SFX'ler (3x / 6x / 9x)
- Web Audio API synth ses — `SFX.correct / wrong / streak / yonko`
- Opt-in (localStorage flag), Volume toggle her quiz'de
- %90+ rank'te Yonko chord + Confetti
- Skor DB'ye upsert (daha yüksek skor overwrite)

### Sinematik Zaman Çizelgesi
- 7 era × 90vh sticky scroll-zoom (490vh mobil, 630vh desktop)
- Her era blur-in, scale, parallax gradient
- "Sinema modu" intro banner + alt progress bar

### Komut Paleti (Cmd+K)
- Karakter / arc / meyve / sayfa fuzzy search
- Ok tuşu navigasyon, Enter ile git, Escape kapat
- Platform-aware kısayol: macOS'ta `⌘K`, Windows/Linux'ta `Ctrl+K`
- Mobile'da near-fullscreen sheet

### View Transitions API
`document.startViewTransition` ile shared-element morph — CharacterCard → /characters/[slug], ArcCard → arc detay, DevilFruit → meyve detay. Hero görsel smooth'ça yerine oturur.

### Mobil-First Detaylar
- Sabit alt nav (Home / Arcs / Karakter / Dünya / Profil)
- `env(safe-area-inset-bottom)` notched iPhone için
- Tüm sticky hero'lar mobile height-reduced
- Footer ilan padding'i MobileBottomNav safe-area

### Tema: Okyanus Derinliği
- Dark-only — gold (#f4a300), sea (#1e90ff), luffy (#e74c3c) palet ailesi
- Glassmorphism: `.glass`, `.glass-elevated`, `.surface`, `.bento-card`, `.wanted-poster`
- `prefers-reduced-motion` respect, print-friendly
- Noise overlay (body::before, z-9999) + ambient orb'lar (body::after, z-0)

---

## Teknik Yığın

| Katman | Teknoloji |
|---|---|
| Framework | Next.js 14 App Router + TypeScript strict |
| Stil | Tailwind CSS 3.4 (dark-only custom theme) |
| Animasyon | Framer Motion 11 (`lib/variants.ts` standart varyantlar) |
| Veritabanı | Drizzle ORM + Neon Postgres (`@neondatabase/serverless`) |
| Auth | Custom JWT (jose + bcryptjs), httpOnly cookie, 30d TTL |
| Rate Limit | Upstash Redis (opsiyonel, prod) / in-memory fallback |
| Sanitization | isomorphic-dompurify |
| İkonlar | lucide-react |
| Video | OnePaceTR iframe embed |
| Analytics | @vercel/analytics |
| Deploy | Vercel (SSG + serverless functions) |

---

## Hızlı Başlangıç

```bash
# Clone + kur
git clone https://github.com/ahmetakyapi/onepiece-hub.git
cd onepiece-hub
npm install

# Environment
cp .env.example .env.local
# .env.local dosyasını düzenle:
#   DATABASE_URL=postgres://...  (Neon)
#   AUTH_SECRET=$(openssl rand -base64 32)
#   NEXT_PUBLIC_APP_URL=http://localhost:3000
#   NEXT_PUBLIC_APP_NAME=One Piece Hub

# DB schema'yı yayınla
npm run db:push

# Dev server
npm run dev
# → http://localhost:3000
```

### Komutlar

```bash
npm run dev          # Geliştirme sunucusu
npm run build        # Production build
npm run lint         # ESLint
npm run typecheck    # tsc --noEmit
npm run db:push      # Drizzle schema push
npm run db:generate  # Migration oluştur
npm run db:migrate   # Migration uygula
npm run db:studio    # Drizzle Studio GUI
```

---

## Proje Yapısı

```
app/                    # Next.js App Router
  layout.tsx            # Root — Header/Footer/AuthProvider/ScrollProgress
  page.tsx              # Ana sayfa — hero + stats + timeline + featured + void + journey + wiki
  characters/           # Karakter listesi + [slug]/ detay
  arcs/                 # Arc listesi + [slug]/ + [slug]/[episode]/ (izleme)
  devil-fruits/ crews/ battles/ bounties/ haki/ world/ timeline/
  explore/ guide/ about/ quiz/[arcSlug]/
  login/ profile/
  api/                  # auth, progress, comments, favorites, quiz-scores

components/
  layout/               # Header, Footer, MobileBottomNav, ScrollProgress
  home/                 # ParticleField, WaveBackground, StatsBar, ArcTimeline,
                        # JourneyScroll, FeaturedArcSpotlight, VoidCenturySection,
                        # PoneglyphOverlay
  characters/           # CharacterCard, CharacterDetail, RelationshipGraph, CrewAmbient
  arcs/ crews/ devil-fruits/ world/ timeline/ battles/
  watch/ wiki/
  search/               # CommandPalette
  ui/                   # Button, GlassCard, MangaPanel, SpeechBubble, AmbientBackground,
                        # RippleEffect, ToastContainer, EmptyState, vb.

lib/
  constants/            # TÜM statik veri (arcs, characters, crews, devil-fruits,
                        # battles, locations, quizzes, bounties, relationships,
                        # sagas, navigation, crew-styles, crew-affiliation, images)
  schema.ts             # Drizzle (users, watchProgress, quizScores, comments, favorites)
  db.ts token.ts password.ts api.ts sanitize.ts env.ts
  audio.ts              # Web Audio API quiz SFX
  variants.ts           # Framer Motion standart varyantlar
  toast.ts              # Custom event-based toast system

hooks/
  useAuth.tsx           # AuthProvider + useAuth (custom JWT context)
  useWatchedEpisodes.ts # DB + localStorage unified
  useViewTransition.ts  # startViewTransition wrapper

types/
  index.ts              # Tüm domain types (Arc, Character, Crew, DevilFruit, vb.)
```

---

## Mimari Kararlar

**Statik / dinamik ayrımı.** Evren verisi (arc, karakter, meyve, savaş) TypeScript sabitleri olarak git'te tutulur — tip-güvenli, versiyonlu, SSG'ye uygun. DB sadece kullanıcıya özel etkileşim için (izleme, quiz, yorum, favori). Bu ayrım deploy'u ucuz + CDN'lenebilir yapar.

**Global episode numbering.** OnePaceTR URL'leri `/bolum/<globalEp>` formatında. `getGlobalEpisodeNumber(arcSlug, episodeNumber)` ARCS dizisindeki kronolojik sıraya göre kümülatif sayar. Yeni arc eklerken sıra korunur, aksi halde tüm video embed'leri kayar.

**Custom JWT > next-auth.** Site Turkish-first, dış OAuth sağlayıcıya ihtiyaç yok. jose + bcryptjs + httpOnly cookie ile ~200 satırlık minimal auth. 30 gün TTL, production'da `secure` flag.

**localStorage ↔ DB senkronizasyonu.** Kullanıcı anonim iken `onepiece-watched` anahtarına izleme kaydeder. Login/register sırasında `useAuth.tsx` bu listeyi `/api/progress/sync`'e POST eder, localStorage temizlenir. Böylece "izlemişim diye kaydettim ama hesabım yoktu" senaryosu kaybolmaz.

**Crew affiliation = localStorage-only.** Register'da kullanıcı mürettebat seçer (straw-hat / red-hair / heart / blackbeard / whitebeard / revolutionary). DB'ye yazılmaz, `lib/crew-affiliation.ts` localStorage ile yönetir. Profil banner'ında aura rengi buradan okunur. Hesap silinse bile tarayıcı değişmezse mürettebat sabit kalır — niyete uygun.

**Neon serverless (pg değil).** Vercel serverless ortamında `pg` havuzu açmaz. `@neondatabase/serverless` her request için HTTP fetch ile bağlanır, cold-start dostudur.

---

## Geliştirici Deneyimi

### Claude Code Entegrasyonu

Proje `.claude/` altında AI-assisted dev için komple kurulum içerir:

| Tür | Dosya | İşlev |
|---|---|---|
| Slash command | `/new-arc <slug>` | Saga dosyasına arc iskelet + registry güncellemeleri |
| Slash command | `/new-character <slug>` | CHARACTERS entry + images + opsiyonel relationships |
| Slash command | `/new-quiz <arcSlug>` | QUIZZES array'ine 5-10 soru iskelet |
| Slash command | `/add-bounty <slug> <amount>` | BOUNTIES entry + tier validasyon |
| Slash command | `/mobile-audit` | Kapsamlı responsive tarama + düzeltme workflow |
| Subagent | `op-data-surgeon` | `lib/constants/*` güvenli edit + slug referans bütünlüğü |
| Subagent | `op-design-auditor` | Mobil/a11y/tema/performans auditleri (rapor-only) |

`CLAUDE.md` proje-özel gotcha'ları içerir — OnePaceTR iframe offset'leri, Scene 2 timing, dynamic import zorunluluğu, crew affiliation localStorage-only, vb.

---

## Yol Haritası

- [ ] E-posta bazlı şifre sıfırlama (users tablosuna email kolonu)
- [ ] Unit tests (Jest/Vitest — şu an %0 coverage)
- [ ] Tam Wanted Poster oluşturucu (kullanıcı karakter seçer, kendi posterini kaydeder)
- [ ] Bounty tier eşikleri `lib/constants/`'a taşınsın (şu an `app/bounties/page.tsx`'de hardcode)
- [ ] Public API endpoint'leri (karakter/arc/meyve JSON feeds)
- [ ] i18n — EN variant (şu an Türkçe-first)

### KULLANILMAYANLAR

Bilinçli olarak dışarda bırakılanlar:
- `components/CustomCursor.tsx` — generic AI pattern, deneyim için kaldırıldı
- `hooks/useMagnetic.ts` — aynı sebep
- `next-auth` — custom JWT tercih edildi
- `pg` — Neon serverless yerine kullanılmaz
- `types/Episode.pixeldrainId` — eski video stratejisinden artık

---

## Çevre Değişkenleri

```env
DATABASE_URL=postgresql://...                         # Neon Postgres (required)
AUTH_SECRET=...                                       # openssl rand -base64 32 (required)
NEXT_PUBLIC_APP_URL=http://localhost:3000             # (required)
NEXT_PUBLIC_APP_NAME=One Piece Hub                    # (required)
UPSTASH_REDIS_REST_URL=...                            # optional (prod rate limit)
UPSTASH_REDIS_REST_TOKEN=...                          # optional (prod rate limit)
```

`AUTH_SECRET` olmadan `lib/env.ts` startup'ta throw eder. Redis vars yoksa in-memory rate-limit fallback devreye girer.

---

## Katkı

Proje şu an tek-geliştiricili bir portfolyo projesi, PR kabul edilmiyor. Fikir, bug raporu veya tasarım önerileri için issue açabilirsin.

Veri güncellemeleri (yeni karakter, arc, bounty) için `.claude/commands/` altındaki slash komutları kullanılabilir — structure'ı korur, referans bütünlüğünü doğrular.

---

## Lisans

**MIT** — Kişisel/eğitsel kullanım serbesttir.

One Piece evreni, karakterleri, logosu **Eiichiro Oda / Shueisha / Toei Animation** mülkiyetindedir. Bu platform fan-made, ticari kullanım yoktur, resmi bir üründür değildir. Bölüm içeriği [OnePaceTR](https://www.onepacetr.net/) tarafından sağlanır.

---

<div align="center">

**[Canlı Demo](https://onepiece-hub.vercel.app)** · **[OnePaceTR](https://www.onepacetr.net/)** · **[Drizzle Docs](https://orm.drizzle.team/)** · **[Next.js Docs](https://nextjs.org/docs)**

<sub>Built with Next.js 14, Framer Motion 11 and a deep respect for Oda's 25-year adventure.</sub>

</div>
