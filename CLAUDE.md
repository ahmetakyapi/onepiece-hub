# One Piece Hub

Türkçe One Piece fan platformu. Arc bazlı filler'sız bölüm düzeni (OnePaceTR), karakter/wiki ansiklopedisi, izleme takibi, quiz sistemi, topluluk yorumları.

## Stack

Next.js 14 App Router · TypeScript strict · Tailwind 3.4 dark-only · Framer Motion 11 · Drizzle ORM + Neon (**`@neondatabase/serverless`** — `pg` değil) · Custom JWT (jose + bcryptjs) · OnePaceTR iframe · Vercel.

## Mimari

- **Statik veri**: arc, karakter, meyve, savaş, quiz, lokasyon, bounty, crew — hepsi `lib/constants/*` TS dosyalarında. **DB'ye yazılmaz.**
- **Dinamik veri (DB)**: sadece kullanıcı etkileşimi — `users`, `watchProgress`, `quizScores`, `comments`, `favorites`. Schema: `lib/schema.ts`.
- **İzleme takibi**: Giriş yapmış → `/api/progress` (DB). Anonim → localStorage (`onepiece-watched`). Login/register'da otomatik sync (`hooks/useAuth.tsx`).
- **Auth**: Custom JWT (`lib/token.ts` + `lib/password.ts`), httpOnly cookie, 30d TTL. next-auth kullanılmaz.
- **Layout**: Header + Footer + AuthProvider + ScrollProgress + CommandPalette + RippleEffect + ToastContainer + MobileBottomNav hepsi `app/layout.tsx`'de. Yeni sayfa bunları import etmez.
- **API pattern**: `ok()` / `err()` / `serverErr()` helpers from `lib/api.ts`. Mesajlar Türkçe.

## Tema

Dark-only "Okyanus Derinliği". Renk tokenları `app/globals.css` + `tailwind.config.ts` (gold/sea/luffy/ocean/pirate palet ailesi). Utility class'lar:
- **Layout**: `.glass`, `.glass-elevated`, `.surface`, `.bento-card`, `.wanted-poster`
- **Butonlar**: `.btn-gold`, `.btn-luffy`, `.btn-ghost`
- **Metin**: `.text-gold-gradient`, `.text-sea-gradient`, `.text-fire-gradient`, `.stat-number`
- **Rozet/Badge**: `.chip`, `.tag`
- **Efekt**: `.glass-lift`, `.shine-hover`, `.divider-glow`, `.link-glow`, `.orb`, `.scrollbar-thin`

**Tailwind sınıflarını tercih et** — CSS variables sadece `globals.css` içinde kullanılmalı.

## Framer Motion

Standart varyantlar `lib/variants.ts`: `fadeIn`, `fadeUp`, `fadeUpLarge`, `fadeLeft`, `fadeRight`, `scaleIn`, `slideDown`, `modalBackdrop`, `modalPanel`, `staggerContainer(stagger)`. Sabit ease: `EASE = [0.22, 1, 0.36, 1]`.

## Gotcha'lar — non-obvious

### 1. Global Episode Numarası ARCS Sırasına Bağlı
`getGlobalEpisodeNumber(arcSlug, episodeNumber)` `ARCS` dizisindeki arc sıralamasına göre kümülatif sayar. **Arc eklerken/sıra değiştirirken dikkat** — yanlış sıra tüm video embed'leri bozar.

### 2. OnePaceTR iframe Zoom Offset
`WatchPage` içinde iframe: `width: 200%, height: 255%, left: -55%, top: -38%`. OnePaceTR site yapısı değişirse bu değerler revize edilmeli. Aspect ratio: `4/3` (mobil), `16/11` (desktop). Fallback: `onError` → harici link butonu.

### 3. Dynamic Import Zorunluluğu (SSR Patlar)
Canvas/window erişimi yapan bileşenler **mutlaka** `dynamic(..., { ssr: false })` ile yüklenir:
`ParticleField`, `WaveBackground`, `StatsBar`, `ArcTimeline`, `ScrollProgress`, `MobileBottomNav`, `PoneglyphOverlay`, `FeaturedArcSpotlight`, `JourneyScroll`.

### 4. KULLANMA Listesi
- `components/CustomCursor.tsx` — generic AI pattern, kaldırıldı (dosya duruyor, import etme)
- `hooks/useMagnetic.ts` — aynı sebep
- `next-auth` — custom JWT tercih edildi
- `pg` paketi — Neon serverless yerine kullanılmaz

### 5. Body Pseudo-element Z-Index
`body::before` = noise texture (`z-9999`). `body::after` = ambient gradient orb'lar (`z-0`). İçerik `z-10+` olmalı, yoksa noise overlay'in altında kalır.

### 6. Next/Image Remote Host Whitelist
`next.config.mjs` → `remotePatterns`: `avatars.githubusercontent.com`, `static.wikia.nocookie.net`, `i.imgur.com`, `cdn.myanimelist.net`. Yeni dış host → ekle. Format: AVIF > WebP.

### 7. Bounty Tier Eşikleri Hardcoded
`app/bounties/page.tsx`'de: Emperor ≥ 3B, Commander ≥ 1B, Supernova ≥ 300M, Rookie < 300M. `EXTRA_BOUNTIES` dizisi de aynı dosyada — constant'a taşınmamış (TODO).

### 8. Ana Sayfa Hero Sticky Timing
`app/page.tsx`: section `h-[130vh] sm:h-[160vh]`. Scene 1 opacity `[0, 0.25, 0.4] → [1, 1, 0]`, Scene 2 `[0.32, 0.5, 0.95, 1] → [0, 1, 1, 0]`. Scene 2 sonunda `scene2HintOpacity` ile "Devam et" chevron beliriyor. Timing bozulursa mobilde Scene 2 hiç görünmeyebilir.

### 9. EraShowcase (Timeline) Sticky
`components/timeline/EraShowcase.tsx` → `h-[490vh] sm:h-[630vh]` = 7 era × 70/90vh. Mobilde kısaltıldı. Timeline sayfasında PageHero'dan sonra "sinema modu" intro banner var — kullanıcı sticky sekansın geldiğini anlar.

### 10. Relationship Graph Mobile Switch
`components/characters/RelationshipGraph.tsx` `matchMedia('(max-width: 767px)')` ile mobilde circular SVG yerine avatar rail + relation list gösterir. Desktop'ta orijinal 1200×1200 viewBox SVG.

### 11. Crew Affiliation — localStorage-only
Register sırasında kullanıcı crew seçer (`lib/crew-affiliation.ts`). DB'de saklanmaz — localStorage'da. Profile banner'da aura rengi buradan okunur.

### 12. Quiz Ses Efektleri Opt-in
`lib/audio.ts` Web Audio API ile synth ses. `isSoundEnabled()` localStorage flag kontrolü. `SFX.correct/wrong/streak/yonko` ile çağrılır. Quiz sayfasında Volume2/VolumeX toggle var.

### 13. View Transitions API
`hooks/useViewTransition.ts` — `document.startViewTransition` sarar. CharacterCard, ArcCard, FeaturedArcSpotlight, DevilFruitDetail'de aktif. `viewTransitionName` ile shared element morph.

### 14. Email Yok
Users tablosunda `email` kolonu yok → şifre sıfırlama özelliği eklenemez (design choice).

### 15. pixeldrainId Ölü Alan
`types/Episode.pixeldrainId?` — eski video stratejisinden kalma, artık kullanılmıyor.

### 16. Yeni Feature Performance Kuralları
**SVG > Canvas > External lib** — custom SVG/div çizimi tercih edilir (SSR-safe, no extra bundle). Recharts/Chart.js kullanma.

**React.memo + useMemo** — list/grid bileşenler (card grid, leaderboard) ve filter/sort işlemleri mutlaka optimize edilmeli. Listelenecek bileşenleri `memo()` ile wrap, hesaplı `useMemo` için dependency array'leri eksiksiz.

**dynamic(..., {ssr:false})** sadece window/canvas/Web Audio kullanan bileşenler için. SVG static render edilebilir.

**generateStaticParams + Server Component** — veri statik ise page server component, `generateStaticParams` ile tüm slug'ları build-time SSG yapılır.

**useScroll/useTransform gate** — parallax animasyonları `matchMedia('(min-width: 768px)')` ile md+ breakpoint'te aktif edilir (mobilde CPU yükü).

**Image: sizes + format** — her image `sizes` prop, AVIF/WebP formatları next.config `images.formats` ile.

**Inline animation objects** — `framer-motion` varyantları `lib/variants.ts`'den import et, component içinde inline tanımlama değil.

Örnek: `PowerStatBars` → `React.memo`, `useInView` trigger, `useMemo` yok (veri prop), bar fill `animate={{width}}` with EASE constant.

## CSS Reduced-Motion + Print

- `prefers-reduced-motion`: tüm animasyonlar disable
- `background-attachment: fixed` mobilde `scroll`'a döner (< 640px)
- `::selection` gold, focus-visible gold ring
- Print: dekoratif elementler gizlenir

## Komutlar

```bash
npm run dev          # Dev server (port 3000)
npm run build        # Production build
npm run lint         # ESLint
npm run typecheck    # tsc --noEmit
npm run db:push      # Drizzle schema push
npm run db:generate  # Migration generate
npm run db:migrate   # Migration run
npm run db:studio    # Drizzle Studio GUI
```

## Env Vars

- `DATABASE_URL` — Neon Postgres
- `AUTH_SECRET` — **zorunlu**, `openssl rand -base64 32`. Yoksa `lib/env.ts` throw eder.
- `NEXT_PUBLIC_APP_URL` — `http://localhost:3000`
- `NEXT_PUBLIC_APP_NAME` — `One Piece Hub`
- `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN` — opsiyonel, prod rate limit. Yoksa in-memory fallback.

## Slash Commands (Proje-özel)

`.claude/commands/` içinde:
- `/new-arc <slug>` — doğru saga dosyasına arc iskelet ekler
- `/new-character <slug>` — karakter iskelet ekler + images.ts güncellemesi hatırlatır
- `/new-quiz <arcSlug>` — arc'a quiz ekler
- `/add-bounty <slug>` — BOUNTIES'e entry ekler, tier doğrulaması yapar
- `/mobile-audit` — kapsamlı mobil responsive tarama + düzeltme

## Subagents (Proje-özel)

`.claude/agents/` içinde:
- `op-data-surgeon` — `lib/constants/*` güvenli edit + referans tutarlılığı
- `op-design-auditor` — mobil/erişilebilirlik/tema/performans auditleri

## Ekosistem Referansları

- Global kurallar: `~/.claude/CLAUDE.md`
- Tema: `~/dev-starter/knowledge/themes/ahmetakyapi.md`
- Hatalar: `~/dev-starter/knowledge/mistakes.md`
- Desenler: `~/dev-starter/knowledge/patterns.md`
