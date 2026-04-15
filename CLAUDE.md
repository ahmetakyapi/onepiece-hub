# One Piece Hub — Proje Kuralları

## Proje Ozeti

One Piece hayranları için kapsamlı Türkçe platform. Arc bazlı filler'sız bölüm düzeni (OnePaceTR), karakter ansiklopedisi (61 karakter), izleme takibi, quiz sistemi, wiki (şeytan meyveleri, haki, savaşlar, bounty, zaman çizelgesi, dünya haritası, mürettebatlar) ve topluluk yorumları.

---

## Teknik Stack

| Katman | Teknoloji | Detay |
|--------|-----------|-------|
| Framework | Next.js 14 | App Router, `strict: true` TypeScript |
| Stil | Tailwind CSS 3.4 | Dark-only "Okyanus Derinliği" teması |
| Animasyon | Framer Motion 11 | Standart varyantlar `lib/variants.ts` |
| DB | Drizzle ORM + Neon | `@neondatabase/serverless` (pg kullanma!) |
| Auth | Custom JWT (jose) | `httpOnly` cookie, 30 gün TTL |
| Auth (eski) | next-auth v5 | Google + Discord — `lib/auth.ts`'de config var ama aktif kullanım custom JWT |
| Video | OnePaceTR iframe | `onepacetr.net/bolum/{globalEp}` embed, fallback harici link |
| İkonlar | lucide-react | |
| Analytics | @vercel/analytics | |
| Deploy | Vercel | |

---

## Dosya Yapısı Haritası

```
middleware.ts             # Rate limiting (auth, 10/dk) + route koruması (/profile)
app/
  layout.tsx              # Root layout — Manrope + IBM Plex Mono, AuthProvider, Header, Footer, ScrollProgress, skip-to-content
  page.tsx                # Ana sayfa — hero, stats, arc timeline, wiki bento grid
  globals.css             # Tüm CSS: design tokens, glass, butonlar, animasyonlar, ocean dekoratif
  error.tsx               # One Piece temalı hata sınırı
  loading.tsx             # Pusula animasyonlu yükleme ekranı
  robots.ts               # SEO robot yapılandırması
  sitemap.ts              # Dinamik sitemap — arcs, characters, devil-fruits, crews, quizzes
  login/page.tsx          # Giriş/kayıt sayfası (split-layout, ?from= redirect)
  profile/page.tsx        # Kullanıcı profili (izleme, quiz, favoriler)
  arcs/
    page.tsx              # Tüm arc'lar listesi (saga bazlı gruplu)
    [slug]/page.tsx       # Tek arc detay sayfası
    [slug]/[episode]/page.tsx  # Bölüm izleme sayfası (SSG: generateStaticParams)
  characters/
    page.tsx              # Karakter listesi (filtrelenebilir)
    [slug]/page.tsx       # Karakter detay
  crews/
    page.tsx              # Mürettebat listesi
    [slug]/page.tsx       # Mürettebat detay
  devil-fruits/
    page.tsx              # Şeytan meyveleri listesi
    [slug]/page.tsx       # Meyve detay
  battles/page.tsx        # Efsanevi savaşlar
  bounties/page.tsx       # Ödül sıralaması
  haki/page.tsx           # Haki rehberi
  timeline/page.tsx       # Kronolojik zaman çizelgesi
  world/page.tsx          # Dünya haritası
  guide/page.tsx          # İzleme rehberi (nereden başla?)
  about/page.tsx          # Hakkında
  quiz/[arcSlug]/page.tsx # Arc bazlı quiz
  api/
    auth/login/route.ts   # POST: username/password -> JWT cookie
    auth/register/route.ts # POST: yeni kullanıcı oluştur
    auth/logout/route.ts  # POST: cookie sil
    auth/me/route.ts      # GET: session kontrol (cookie'den JWT verify)
    progress/route.ts     # GET/POST: izleme takibi toggle
    comments/route.ts     # GET/POST/DELETE: yorumlar (kullanıcı kendi yorumunu silebilir)
    favorites/route.ts    # GET/POST: favoriler (toggle mantığı)
    progress/sync/route.ts # POST: localStorage → DB senkronizasyonu
    quiz-scores/route.ts  # GET/POST: quiz skorları (upsert — daha yüksek skor güncellenir)
    health/route.ts       # Sağlık kontrolü

components/
  layout/
    Header.tsx            # Sabit header — floating pill nav, wiki dropdown, mobil drawer
    Footer.tsx            # Site alt bilgi
    ScrollProgress.tsx    # Sayfa scroll çubuğu (dynamic import, SSR: false)
  home/
    ParticleField.tsx     # Canvas parçacık efekti (dynamic, SSR: false)
    WaveBackground.tsx    # SVG dalga geçişi (dynamic, SSR: false)
    StatsBar.tsx          # İstatistik sayaçları (dynamic, SSR: false)
    ArcTimeline.tsx       # Arc zaman çizelgesi (dynamic, SSR: false)
  arcs/
    ArcCard.tsx           # Arc kart bileşeni
    ArcDetail.tsx         # Arc detay bileşeni
  characters/
    CharacterDetail.tsx   # Karakter detay bileşeni
  crews/
    CrewDetail.tsx        # Mürettebat detay
  devil-fruits/
    DevilFruitDetail.tsx  # Meyve detay
  watch/
    WatchPage.tsx         # Video izleme — iframe + bölüm listesi sidebar
  wiki/
    PageHero.tsx          # Wiki sayfaları için hero bölümü
  world/
    WorldMap.tsx          # Dünya haritası bileşeni
  ui/
    Button.tsx            # Buton bileşeni
    GlassCard.tsx         # 3D tilt + spotlight glassmorphism kart
    CharacterAvatar.tsx   # Karakter avatar
    Chip.tsx              # Pill chip/badge
    Confetti.tsx          # Konfeti efekti (quiz sonucu)
    CommentSection.tsx    # Yorum bileşeni — fetch, submit, delete, optimistic update
    FavoriteButton.tsx    # Favori toggle butonu — aria-pressed, optimistic
    WaveSeparator.tsx     # Dalga ayırıcı bileşen — subtle/bold/gold varyantları
  CustomCursor.tsx        # KULLANMA — feedback'e göre eklenmemeli
  PageTransition.tsx      # Sayfa geçiş animasyonu

hooks/
  useAuth.tsx             # Auth context provider + hook (custom JWT, React Context)
  useWatchedEpisodes.ts   # İzleme takibi — login: DB, anonim: localStorage
  useSpotlight.ts         # Mouse-following radial gradient spotlight
  useMagnetic.ts          # Manyetik buton efekti (feedback'e göre kullanma)

lib/
  db.ts                   # Neon serverless bağlantısı (drizzle + neon-http)
  schema.ts               # Drizzle şema: users, watchProgress, quizScores, comments, favorites
  auth.ts                 # next-auth v5 config (Google + Discord) — YEDEKTEKİ SİSTEM
  token.ts                # JWT oluşturma/doğrulama (jose, HS256, 30d) — AUTH_SECRET zorunlu
  password.ts             # bcryptjs (12 rounds) + eski SHA-256 geriye uyumluluk
  api.ts                  # API response helpers: ok(), err(), serverErr()
  utils.ts                # cn(), formatDate(), truncate(), parseBounty(), formatBounty(), getTimeAgo()
  variants.ts             # Framer Motion standart varyantlar (fadeUp, scaleIn, staggerContainer...)
  constants/
    arcs.ts               # Legacy — arcs/index.ts'e yönlendirir
    arcs/index.ts         # Tüm arc'lar birleşik export + yardımcı fonksiyonlar
    arcs/east-blue.ts     # East Blue saga arc'ları
    arcs/alabasta.ts      # ...saga bazlı dosyalar
    arcs/sky-island.ts
    arcs/water-7.ts
    arcs/thriller-bark.ts
    arcs/summit-war.ts
    arcs/fish-man-island.ts
    arcs/dressrosa.ts
    arcs/four-emperors.ts
    arcs/final.ts
    characters.ts         # 61 karakter verisi (slug, crew, abilities, backstory...)
    crews.ts              # Mürettebat verileri
    devil-fruits.ts       # Şeytan meyveleri
    battles.ts            # Efsanevi savaşlar
    locations.ts          # Lokasyonlar (dünya haritası)
    quizzes.ts            # Arc bazlı quiz soruları
    images.ts             # Görsel yol eşlemeleri (ARC_IMAGES, CHARACTER_IMAGES)
    sagas.ts              # 10 saga tanımı (arc slug dizileri)
    navigation.ts         # Merkezi nav linkleri (MAIN_LINKS, WIKI_LINKS, FOOTER_SECTIONS)
    crew-styles.ts        # Mürettebat renk/ikon yapılandırması (CREW_COLORS, CREW_ICONS)

types/
  index.ts                # Tüm tipler: Arc, Episode, Character, DevilFruit, Ability, CrewType, QuizQuestion, ArcQuiz, Saga
```

---

## Tema: Okyanus Derinliği (Dark-Only)

### Renk Paleti (CSS Variables — globals.css)
| Token | Değer | Kullanım |
|-------|-------|----------|
| `--bg-deep` | `#060e1a` | Body background |
| `--bg-surface` | `#0c1829` | Kart arka planları |
| `--bg-elevated` | `#111f36` | Yükseltilmiş yüzeyler |
| `--color-gold` | `#f4a300` | Primary — hasır şapka altını |
| `--color-gold-bright` | `#fbbf24` | Gold bright varyant |
| `--color-sea` | `#1e90ff` | Secondary — okyanus mavisi |
| `--color-sea-light` | `#60b8ff` | Sea light varyant |
| `--color-luffy` | `#e74c3c` | Accent — Luffy kırmızısı |
| `--color-text` | `#e8eaf0` | Ana metin |
| `--color-muted` | `rgba(232,234,240,0.55)` | İkincil metin |
| `--color-border` | `rgba(30,144,255,0.12)` | Border |

### Tailwind Renk Sistemi (tailwind.config.ts)
- `ocean-{deep,surface,elevated,mid,shallow,light}` — arka plan seviyeleri
- `gold-{DEFAULT,soft,glow,bright,dim}` — primary varyantlar
- `sea-{DEFAULT,soft,glow,light}` — secondary varyantlar
- `luffy-{DEFAULT,soft,glow}` — accent varyantlar
- `pirate-{text,muted,border}` — metin/border

### CSS Bileşen Class'ları
| Class | Açıklama |
|-------|----------|
| `.glass` | Standard glassmorphism — `blur(20px)`, gradient bg, subtle border |
| `.glass-elevated` | Modal/dropdown — daha yoğun blur(24px) |
| `.surface` | Panel/modal — en yoğun blur(32px) |
| `.bento-card` | Grid kart — gradient border hover efekti |
| `.wanted-poster` | Bounty poster tarzı kart |
| `.btn-gold` | Primary CTA — altın gradient, hover lift |
| `.btn-luffy` | Kırmızı CTA |
| `.btn-ghost` | Outline/subtle buton |
| `.chip` | Pill badge |
| `.text-gold-gradient` | Altın gradient metin |
| `.text-sea-gradient` | Mavi gradient metin |
| `.text-fire-gradient` | Kırmızı-altın gradient metin |
| `.glass-lift` | Hover'da yukarı kaldırma efekti |
| `.shine-hover` | Hover'da ışık süpürme efekti |
| `.divider-glow` | Bölüm ayırıcı gradient çizgi |
| `.link-glow` | Link hover alt çizgi animasyonu |
| `.tag` | Kategori etiketi |
| `.scrollbar-thin` | İnce scrollbar (3px) |
| `.progress-bar` / `.progress-bar-fill` | İlerleme çubuğu |
| `.orb` | Dekoratif blur daire |
| `.stat-number` | Tabular sayı gösterimi |

### Easing Fonksiyonları
- `--ease-out-expo`: `cubic-bezier(0.16, 1, 0.3, 1)` — genel geçişler
- `--ease-spring`: `cubic-bezier(0.34, 1.56, 0.64, 1)` — spring efekt
- `--ease-smooth`: `cubic-bezier(0.22, 1, 0.36, 1)` — yumuşak geçişler
- Tailwind: `ease-expo-out`, `ease-spring`, `ease-smooth`

### Animasyonlar (Tailwind + CSS)
- `animate-float` / `float-delayed` / `float-slow`
- `animate-morph` — organik şekil değişimi
- `animate-orbit` — yörünge dönüşü
- `animate-shimmer` — ışıltı efekti
- `animate-text-shimmer` — metin ışıltısı
- `animate-pulse-ring` — nabız halkası
- `animate-slide-up` / `scale-in` — giriş animasyonları
- `animate-ocean-wave-{1,2,3,4}` — okyanus dalgası

### Fontlar
- **Sans**: Manrope (400–800) — `var(--font-sans)`
- **Mono**: IBM Plex Mono (400–600) — `var(--font-mono)`
- `next/font/google` ile yüklenir, CSS variable olarak atanır

---

## Mimari Kurallar

### Veri Akışı
- **Statik veri**: Arc, karakter, şeytan meyvesi, savaş, quiz... hepsi `lib/constants/` altında TypeScript dosyaları. DB'ye YAZILMAZ.
- **Dinamik veri (DB)**: Sadece kullanıcı etkileşimleri — `users`, `watchProgress`, `quizScores`
- **İzleme takibi**: Login → DB (`/api/progress`), anonim → `localStorage` (`onepiece-watched` key)

### Auth Sistemi (İKİLİ — dikkat)
Projede iki auth sistemi mevcut:
1. **Aktif**: Custom JWT — `lib/token.ts` (jose), `lib/password.ts` (SHA-256+salt), cookie-based
   - API routes: `/api/auth/login`, `/api/auth/register`, `/api/auth/logout`, `/api/auth/me`
   - Client: `hooks/useAuth.tsx` (React Context)
2. **Pasif**: next-auth v5 — `lib/auth.ts`, Google + Discord providers
   - Mevcut ama aktif kullanılmıyor, ileride entegre edilebilir

### Video Oynatma (OnePaceTR)
- URL pattern: `https://www.onepacetr.net/bolum/{globalEpisodeNumber}`
- Global numara: `getGlobalEpisodeNumber(arcSlug, episodeNumber)` — tüm arc'ların bölümlerini sırayla toplar
- iframe embed: `width: 200%, height: 255%, left: -55%, top: -38%` — video alanını zoom'lamak için
- Fallback: `onError` → harici link butonu göster
- Aspect ratio: `4/3` (mobil), `16/11` (desktop)

### Sayfa Pattern'ları
- **SSG sayfalar**: `generateStaticParams()` kullanır — `arcs/[slug]/[episode]` gibi
- **Metadata**: Her sayfa `generateMetadata()` ile SEO metadata üretir
- **Layout**: Her sayfa `<Header />` ve `<Footer />` dahil eder (layout.tsx'de değil, sayfa seviyesinde)
- **Ana sayfa**: `'use client'` — scroll parallax, Framer Motion animasyonları gerektiği için
- **Wiki sayfaları**: Server component olabilir, statik veri kullanır

### Bileşen Pattern'ları
- `'use client'` sadece gerçekten gereken yerlerde — Framer Motion, useState, event handler
- Heavy bileşenler `dynamic(() => import(...), { ssr: false })` ile yüklenir: ParticleField, WaveBackground, StatsBar, ArcTimeline, ScrollProgress
- `cn()` (clsx + tailwind-merge) her yerde kullanılır
- GlassCard: 3D tilt + spotlight efektli bileşen, `tilt` ve `glow` prop'ları

### Framer Motion Varyantları (`lib/variants.ts`)
```
fadeIn, fadeUp, fadeUpLarge, fadeLeft, fadeRight, scaleIn
staggerContainer(stagger = 0.12)
slideDown, modalBackdrop, modalPanel
EASE = [0.22, 1, 0.36, 1]
```
Sayfalarda kullanım: `variants={staggerContainer(0.08)}` + `variants={fadeUp}`

---

## Veritabanı Şeması

5 tablo:
1. **users**: `id` (uuid), `username` (unique), `password`, `name`, `image`, `createdAt`
2. **watchProgress**: `id`, `userId` (FK cascade), `arcSlug`, `episodeSlug` (unique per user), `watchedAt`
3. **quizScores**: `id`, `userId` (FK cascade), `arcSlug`, `score`, `totalQ`, `completedAt` (unique per user+arc)
4. **comments**: `id`, `userId` (FK cascade), `username`, `targetType`, `targetSlug`, `content`, `createdAt`
5. **favorites**: `id`, `userId` (FK cascade), `targetType`, `targetSlug`, `createdAt` (unique per user+type+slug)

Scripts: `npm run db:push` (Drizzle Kit push), `db:generate`, `db:migrate`, `db:studio`

---

## API Route Pattern'ı

Tüm route'lar aynı pattern'ı takip eder:
```ts
import { ok, err, serverErr } from '@/lib/api'

// Auth kontrol
const token = req.cookies.get('session')?.value
const user = await verifyToken(token)
if (!user) return err('Geçersiz oturum', 401)

// İş mantığı...
return ok({ data })
```
- Tüm mesajlar Türkçe
- `ok(data, status)` ve `err(message, status)` wrapper'ları

---

## Environment Variables

```
DATABASE_URL          # Neon Postgres bağlantı string'i
AUTH_SECRET           # JWT secret — openssl rand -base64 32
NEXTAUTH_URL          # http://localhost:3000
GOOGLE_CLIENT_ID      # Google OAuth
GOOGLE_CLIENT_SECRET
DISCORD_CLIENT_ID     # Discord OAuth
DISCORD_CLIENT_SECRET
NEXT_PUBLIC_APP_URL   # http://localhost:3000
NEXT_PUBLIC_APP_NAME  # One Piece Hub
```

---

## Bilinen Eksiklikler / TODO'lar

1. ~~**Yorum sistemi**~~: ✅ Tamamlandı — `comments` tablosu, GET/POST/DELETE API, `CommentSection` UI bileşeni
2. **next-auth vs custom JWT**: İki auth sistemi var. `lib/auth.ts` (next-auth v5) pasif, custom JWT aktif. İleride birleştirilmeli veya next-auth kaldırılmalı
3. **CustomCursor.tsx**: Dosya mevcut ama KULLANILMAMALI (feedback: generic AI pattern)
4. **useMagnetic.ts**: Dosya mevcut ama KULLANILMAMALI (feedback: generic AI pattern)
5. ~~**Middleware**~~: ✅ `middleware.ts` mevcut — rate limiting (auth endpoints) + route koruması (/profile → /login redirect)
6. ~~**Fallback secret**~~: ✅ Düzeltildi — `AUTH_SECRET` yoksa hata fırlatılıyor
7. ~~**Password hashing**~~: ✅ bcryptjs'e geçildi (12 rounds), eski SHA-256 ile geriye uyumluluk var
8. **pixeldrainId**: `Episode` tipinde tanımlı ama hiçbir yerde kullanılmıyor — eski video stratejisinden kalma
9. ~~**localStorage-DB senkronizasyonu**~~: ✅ Login sonrası otomatik sync (`/api/progress/sync`)
10. **In-memory rate limiter**: Serverless cold start'larda sıfırlanıyor — Upstash Redis'e taşınmalı
11. **Email alanı yok**: Users tablosunda email yok — şifre sıfırlama yapılamıyor
12. **Legacy SHA-256 migration**: Eski SHA-256 hesaplar login'de bcrypt'e otomatik migrate edilmeli

---

## Sık Karşılaşılan Hatalar ve Gotcha'lar

### 1. Global Episode Numarası
`getGlobalEpisodeNumber(arcSlug, episodeNumber)` fonksiyonu arc sırasına göre kümülatif sayar. Arc sıralaması `ARCS` dizisindeki sıraya bağlı — yeni arc eklenirken sıraya dikkat et, aksi halde tüm global numaralar kayar.

### 2. iframe Zoom Trick
WatchPage'deki iframe `width: 200%, height: 255%, left: -55%, top: -38%` ile sadece video alanını gösterir. OnePaceTR site yapısı değişirse bu offset'ler bozulur.

### 3. Neon Serverless
`lib/db.ts`'de `@neondatabase/serverless` kullanılıyor, `pg` DEĞİL. Vercel serverless ortamında `pg` çalışmaz.

### 4. İki Auth Sistemi
`lib/auth.ts` (next-auth v5) ve `lib/token.ts` + `hooks/useAuth.tsx` (custom JWT) birlikte var. Aktif olan custom JWT sistemi. next-auth config'i ileride entegrasyon için saklanıyor.

### 5. Header/Footer Layout'ta
`app/layout.tsx` Header, Footer, AuthProvider, ScrollProgress ve skip-to-content linkini içerir. Yeni sayfa eklerken Header/Footer import etmeye gerek yok — layout otomatik sağlar.

### 6. Dynamic Import Kuralı
Canvas/ağır bileşenler (ParticleField, WaveBackground, StatsBar, ArcTimeline, ScrollProgress) `dynamic(() => import(...), { ssr: false })` ile yüklenmeli. SSR'da window/document erişimi patlar.

### 7. Statik Veri Tipleri
`types/index.ts`'deki `Episode.pixeldrainId?` alanı opsiyonel — bazı bölümlerde var, çoğunda yok. Video oynatmada `getGlobalEpisodeNumber` kullanılıyor, `pixeldrainId` değil.

### 8. CSS Custom Properties vs Tailwind
Bazı renkler hem CSS variable (`--color-gold`) hem Tailwind (`text-gold`) olarak tanımlı. **Tailwind class'larını tercih et**, CSS variable'ları sadece `globals.css` içindeki bileşen class'larında kullan.

### 9. Body Pseudo-elements
`body::before` noise texture overlay, `body::after` ambient gradient orbs. `z-index: 9999` (noise) ve `z-index: 0` (orbs). İçerik `z-index: 10+` olmalı.

### 10. Scroll Progress Bileşeni
`dynamic(() => import('@/components/layout/ScrollProgress'), { ssr: false })` — layout.tsx'de. Tüm sayfalarda otomatik çalışır.

### 11. Cookie Auth
Login response `Set-Cookie: session=JWT` ile cookie atar. `httpOnly`, `secure` (prod), `sameSite: lax`, 30 gün. Tüm API auth kontrolleri `req.cookies.get('session')` ile yapar.

### 12. LocalStorage Fallback
`useWatchedEpisodes` hook'u: login yoksa `localStorage('onepiece-watched')` kullanır. Login sonrası DB'ye geçer. İki sistem arası senkronizasyon YOK — login olan kullanıcı localStorage verilerini kaybeder.

### 13. Next.js Image Config
`next.config.mjs`'de izin verilen remote host'lar: `avatars.githubusercontent.com`, `static.wikia.nocookie.net`, `i.imgur.com`, `cdn.myanimelist.net`. Yeni dış görsel kaynağı eklenirken `remotePatterns`'e eklenmeli. Format: AVIF > WebP.

### 14. Service Worker Temizliği
`layout.tsx`'de `<head>` içinde eski service worker'ları unregister eden inline script var. PWA özelliği kaldırılmış ama temizlik kodu duruyor.

### 15. Bounty Tier Sistemi
`app/bounties/page.tsx`'de hardcoded tier eşikleri var: Emperor >= 3B, Commander >= 1B, Supernova >= 300M, Rookie < 300M. Ek bounty verileri `EXTRA_BOUNTIES` dizisinde (32 karakter), constant dosyasına taşınmamış.

---

## Özel CSS Kuralları Hatırlatma

- `prefers-reduced-motion`: Tüm animasyonlar disable edilir
- `background-attachment: fixed`: Mobilde `scroll`'a döner (640px altı)
- Noise overlay: `will-change: auto` (performans)
- `::selection`: Gold tonu
- Focus visible: Gold ring (`outline: 2px solid rgba(244,163,0,0.5)`)
- Print: Dekoratif elementler gizlenir

---

## Komutlar

```bash
npm run dev          # Geliştirme sunucusu
npm run build        # Production build
npm run lint         # ESLint
npm run typecheck    # TypeScript kontrol
npm run db:push      # Schema'yı DB'ye uygula
npm run db:generate  # Migration dosyası oluştur
npm run db:migrate   # Migration çalıştır
npm run db:studio    # Drizzle Studio (DB GUI)
```

---

## Ekosistem Referansları

- Global kurallar: `~/.claude/CLAUDE.md`
- Tema: `~/dev-starter/knowledge/themes/ahmetakyapi.md`
- Hatalar: `~/dev-starter/knowledge/mistakes.md`
- Desenler: `~/dev-starter/knowledge/patterns.md`
