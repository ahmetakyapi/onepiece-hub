# One Piece Hub

Türkçe One Piece fan platformu: arc bazlı filler'sız bölümler (OnePaceTR iframe),
karakter/wiki ansiklopedisi, izleme takibi, quiz, yorumlar.

## Commit yazarı

Commitler her zaman `Ahmet Akyapı <ahmetakyapii@gmail.com>` adına atılır;
yazarı yalnızca "Claude" olan commit atılmaz. Claude, mesajın sonundaki
`Co-Authored-By: Claude …` satırıyla ortak yazar olarak görünür. Oturum
başında, ilk committen önce:

```bash
git config user.name "Ahmet Akyapı"
git config user.email "ahmetakyapii@gmail.com"
```

Bu kural sahibinin tüm repolarında geçerli (9 Ekim 2026).

## Stack ve Komutlar

Next.js 14 App Router · TypeScript strict · Tailwind 3.4 (dark + light) ·
Manrope + Space Mono (`next/font`) · Framer Motion 11 · Lenis · Drizzle +
Neon (`@neondatabase/serverless`) · custom JWT (jose + bcryptjs) · Vercel.

```bash
npm run dev | build | lint | typecheck
npm run db:push | db:generate | db:migrate | db:studio   # drizzle-kit
```

Env: `DATABASE_URL`, `AUTH_SECRET` (`openssl rand -base64 32`),
`NEXT_PUBLIC_APP_URL` — üçü de zorunlu, yoksa `lib/env.ts` açılışta throw eder.
`NEXT_PUBLIC_APP_NAME` opsiyonel. `UPSTASH_REDIS_REST_URL/TOKEN` opsiyonel:
`middleware.ts` rate limit'i onlarla, yoksa in-memory çalışır.

## Mimari

- **Statik içerik** (arc, karakter, meyve, savaş, quiz, lokasyon, bounty, crew)
  `lib/constants/*` TS dosyalarında; DB'ye yazılmaz. Arc'lar saga başına
  `lib/constants/arcs/<saga>.ts`, birleşim `arcs/index.ts`.
- **Sayılar** `lib/constants/stats.ts` → `SITE_STATS` tek kaynak (+ `formatRuntime`,
  `getArcRuntimeSeconds`). Arc/bölüm/karakter sayısı UI'da, metadata'da ya da
  dokümanda **elle yazılmaz**.
- **Seri durumu** `lib/constants/series-status.ts` elle güncellenir; `STATUS_AS_OF`
  UI'da "son güncelleme" olarak görünür.
- **DB** (`lib/schema.ts`) yalnız kullanıcı etkileşimi: `users`, `watchProgress`,
  `quizScores`, `comments`, `favorites`. `users`'ta e-posta yok → şifre sıfırlama
  bilinçli olarak yok.
- **Auth**: `lib/token.ts` + `lib/password.ts`, httpOnly cookie, 30 gün.
  Middleware `/profile`'ı korur ve API'ye yol bazlı rate limit uygular.
- **İzleme**: girişli → `/api/progress`; anonim → localStorage, giriş/kayıtta
  `hooks/useAuth.tsx` DB'ye senkronlar.
- **API**: `lib/api.ts` → `ok()` / `err()` / `serverErr()`; mesajlar Türkçe.
- **Kabuk**: `app/layout.tsx` provider'ları (Theme → Auth → SpoilerGate) kurar;
  Header, Footer, Preloader, RouteCurtain, CommandPalette, MobileBottomNav vb.
  `components/layout/ClientLayout.tsx`'te. Yeni sayfa bunları import etmez.

## Tema — "Sinematik Okyanus"

Dark "gece seferi" (varsayılan) + light "gündüz seferi" (parşömen zemin).

### Token mimarisi — anlamadan renk değiştirme

- `app/globals.css` paleti **RGB kanal üçlüsü** tutar (`--gold: 244 163 0`, hex
  DEĞİL); `[data-theme='light']` light karşılıklarını verir; `tailwind.config.ts`
  `rgb(var(--x) / <alpha-value>)` ile sarar. Böylece `bg-gold`,
  `border-pirate-border/30` vb. iki temada da doğru. **Hex yazarsan opaklık
  modifier'ı çöker.**
- `--pirate-border` light'ta önceden harmanlanmış opak renk — modifier'sız da
  kullanılıyor, ham lacivert sert çizgi yapardı.
- Renk = token sınıfı. Inline `rgb(var(--x) / a)` yalnız sınıfın ulaşmadığı yerde
  (SVG fill, karmaşık degrade).

### Renk skalaları — ham Tailwind paleti YASAK

- **`accent-*`** (cyan/teal/emerald/lime/amber/orange/rose/pink/indigo/silver/
  bronze): çok öğeli sınıflandırmalar (saga, ekip, meyve türü, tehlike, başarım,
  deniz). Light'ta koyulaşır. Ham `cyan-* emerald-* amber-* teal-* rose-* pink-*
  indigo-* orange-* slate-*` light'ta parşömen üstünde görünmez oluyordu.
  Yeni öğeye mevcut bir öğenin tonunu verme.
- **`fruit` / `fruit-light|strong|deep`**: Şeytan Meyvesi, Haki, Shichibukai.
  Ham `purple-*` / `violet-*` yazma.
- Ekip renkleri: `lib/constants/crew-styles.ts` (`CREW_COLORS`) ve
  `CharacterAvatar` (`CREW_GRADIENTS`, `CREW_TEXT_COLORS`) — ikisi de token'lı.

### Kasıtlı olarak tema DIŞI

- Wanted poster sepyası (`app/bounties`, `WantedPosterCreator`) — iki temada koyu.
- `VideoStage` çerçevesi — koyu; içindeki butonlar `.btn-ghost` değil sabit beyaz.
- `app/api/og/route.tsx` — sunucuda temasız.
- Scrim/modal karartması `bg-black/*`. `bg-ocean-deep/*` KULLANMA (light'ta açar).
- `--map-ground-*` — harita zemini ayrı token (`ocean-deep`e bağlıyken light'ta
  harita kayboluyordu).

### Tema sürme

`<html data-theme>` · next-themes YOK (`hooks/useTheme.tsx` +
`lib/theme-config.ts`). `layout.tsx`'teki blocking script ilk boyamadan önce
yazar; `ThemeProvider` mount'ta **yeniden yazar** (gotcha 17–18).
Toggle: `components/layout/ThemeToggle.tsx`.

### Tipografi

- **Manrope** her şey (başlıklar dahil). **Space Mono** (`font-mono`, `.eyebrow`,
  `.eyebrow-lg`) yalnız veri/alan etiketi: stat başlığı, kart içi alan adı,
  rozet, bölüm no, ödül, süre.
- **Başlık üstü kicker/eyebrow YOK (Ekim 2026, sahibinin isteği)** — okunmuyor,
  kalabalık. Bölüm doğrudan başlıkla açılır. `MangaImpactDivider` `subtitle`'ı
  bu yüzden opsiyonel, varsayılan boş.
- **Cinzel / serif display KULLANILMIYOR** — denendi, beğenilmedi;
  `font-display` kaldırıldı. Wordmark'ta da yok (Manrope bold + Space Mono "HUB").
- **İki fontta `subsets: ['latin', 'latin-ext']` ŞART** — `latin` `ğ ş İ`
  içermez, başlıklar kelime ortasında fallback'e düşer.
- Global taban `globals.css`'te: `h1–h4` balance + negatif tracking, `p/li`
  pretty, `scroll-padding-top` (sabit header).

### Degrade metin — fallback zorunlu

`.text-*-gradient` önce solid rengi alır; `-webkit-text-fill-color: transparent`
+ `background-clip: text` yalnız `@supports` içinde. Koşulsuz yazılınca
desteksiz tarayıcıda metin tamamen görünmez oluyordu. Yeni utility aynı desende.

### Utility sınıfları (`globals.css`)

`.glass` `.glass-elevated` `.surface` `.bento-card` `.wanted-poster` ·
`.btn-gold` `.btn-luffy` `.btn-ghost` · `.text-{gold,sea,fire}-gradient`
`.stat-number` `.text-outline` · `.chip` `.tag` · `.glass-lift` `.shine-hover`
`.divider-glow` `.orb` `.scrollbar-thin` · `.roll-text` `.page-enter`
`.scroll-cue-drop` `.footer-giant`. (`.link-glow` tanımlı ama kullanılmıyor,
`@layer components` purge ediyor.)

### Marka ve ikonlar

- `components/brand/CompassMark.tsx` → `CompassMark` · `Wordmark` · `BrandLockup`;
  SVG renkleri token'lı, temayla döner.
- Favicon'lar temasız sabit renk (favicon'da CSS değişkeni çözülmez).
  `public/icon.svg` → favicon SVG, `icon-192/512`, `apple-touch-icon` (köşe
  yuvarlaması YOK, iOS maskeler); `public/icon-small.svg` (sade, kalın kollar) →
  `favicon-16/32`, `favicon.ico`. Rasterleştirme: headless Chrome (macOS
  `sips`/`qlmanage` SVG işlemiyor), `.ico` = 16+32+48 PNG.

### Detector bulguları — kasıtlı

`npx impeccable detect app components lib`: `gradient-text` (fallback'li marka
utility'leri), `bounce-easing` (`--ease-spring`, CSS mikro-etkileşim),
`layout-transition` (`.progress-bar-fill` degrade taşıdığı için `scaleX` değil
width) kasıtlı. `side-tab` (`border-l-4` kart vurgusu) açık madde.

## Hareket Sistemi

Orkestrasyon `lib/motion.ts` (`EASE_CURTAIN`, `EASE_REVEAL`, açılış durumu, rota
etiketleri); bileşenler `components/motion/*`; varyantlar `lib/variants.ts`
(`EASE` + `fadeUp`, `staggerContainer()` …) — bileşen içinde inline varyant
tanımlama. Hepsi `prefers-reduced-motion`'da kapalı.

- **Açılış — `Preloader.tsx`, "Seyir Haritası", sayaç YOK.** Çizim adımları CSS
  keyframe (`.op-i-*`, ilk boyamada başlar, hydration'ı beklemez); çıkış Framer.
  Oturumda bir kez (sessionStorage `onepiece-intro-seen`); `INTRO_INIT_SCRIPT`
  ilk boyamadan önce `<html data-intro>` yazar, CSS yalnız o varken gösterir →
  **SSR'da render edilir, `ssr:false` YAPMA** (içerik bir an görünüp örtülür).
  JS patlarsa CSS failsafe gizler. Kaydırma kilidi `body`'de (html'de olursa
  mobilde yatay taşma açılır). Dalga kenarının `scaleY`'si saran div'de — kök
  `<svg>`'ye Framer transform yazınca dalga perdeden kopuyor.
- **Hero bekleme**: `hooks/useIntroReady.ts` — hero animasyonları perde kalkınca
  başlar, yoksa perdenin arkasında oynayıp biter.
- **Rota perdesi — `RouteCurtain.tsx`**: `useRouter()` nesnesinin `push`ı
  sarılır; `next/link` aynı nesneyi çağırdığı için tüm gezinmeler yakalanır,
  linklerin kendi onClick'i (spoiler kilidi) bozulmaz. Bölümden bölüme, aynı
  rota, `replace` → perde yok. Aktifken `<html data-curtain>`; `useViewTransition`
  o zaman View Transition'ı atlar.
- **Sayfa girişi `app/template.tsx` YALNIZ opacity** — VideoStage'in atası
  (§ 2).
- **Lenis — `SmoothScroll.tsx`**: yalnız fare/trackpad; dialog/`.fixed`/iframe
  üstünde çekilir, `body.style.overflow='hidden'` olunca durur. Gerçek window
  scroll'u sürer → sticky/useScroll/IO çalışır.
- **Header** aşağı kaydırınca gizlenir (`.header-shell[data-hidden]`), menü
  açıkken gizlenmez.
- **View Transitions**: `hooks/useViewTransition.ts` (kartlar, spotlight, meyve
  ve keşfet sayfaları; `viewTransitionName` ile morph).

Tuzaklar:
- **Maske + IO**: `overflow:hidden` dışında bekleyen öğeye (`y:'110%'`) tek tek
  `whileInView` koyma — IO kırpılmış sayar, hiç tetiklenmez. Tetik kapsayıcıda,
  çocuklara varyantla yay (`SplitText`, footer wordmark böyle).
- **Sticky + overflow**: sticky'nin atalarında `overflow-hidden` olmamalı —
  kaydırma kabı yaratıp sticky'yi öldürür. Ana sayfa `<main>`i bu yüzden
  `overflow-x-clip` (SagaVoyage).

## Gotcha'lar

> Numaralar koddan referanslanıyor (`§ 2`, `§ 5b`, `§ 16`) — yeniden numaralama.

### 1. Global bölüm numarası ARCS sırasına bağlı
`getGlobalEpisodeNumber` (`lib/constants/arcs/index.ts`) `ARCS` sırasına göre
kümülatif sayar. Arc eklerken/sıra değiştirirken dikkat — yanlış sıra tüm video
embed'lerini kaydırır.

### 2. Video oynatıcı — kırpma + tek iframe
OnePaceTR sayfası iframe'e gömülüp **video alanına kırpılır** (SPA, API token
korumalı → video elementine erişim yok).
- Geometri ve oran `lib/player-config.ts` (`DEFAULT_GEOMETRY`,
  `STAGE_ASPECT_RATIO`). **Oranı değiştirmek kadrajı bozar** (iframe'in layout
  viewport'u kutu oranına bağlı) → değiştirirsen geometriyi yeniden kalibre et.
  Inline/sinema/mini aynı oranı kullanır.
- Kullanıcı `PlayerSettings`'ten kalibre edebilir ve `full` embed moduna düşebilir.
- **Cross-origin iframe'de `onError` tetiklenmez** → hata `onLoad` +
  `PLAYER_TIMINGS.loadTimeoutMs`. `ended`/`currentTime` da okunamaz:
  `hooks/useEpisodeTimer.ts` duvar saati sayar (sekme gizliyken durur), bu yüzden
  otomatik geçiş varsayılan kapalı (`usePlayerPrefs.autoAdvance`).
- **⚠️ Tek iframe**: `VideoStage` asla remount edilmez (oynatma sıfırlanır);
  mod geçişi yalnız saran div'in `className`'i. Sahnenin **hiçbir atasında
  `transform`/`filter`/`contain` olmaz** (`position: fixed` için containing block)
  — WatchPage'de oynatıcı kolonu Framer ile sarılmaz.
- Kısayollar tek kaynak `PLAYER_SHORTCUTS` (handler + yardım paneli).

### 3. `dynamic(..., { ssr: false })`
Yalnız window/canvas/Web Audio/localStorage'a render'da dokunan bileşenler
(ana sayfa sahneleri, `ClientLayout`'taki overlay'ler, `RelationshipGraph` …).
SVG statik render edilebilir. **İstisna: `Preloader` SSR ZORUNLU.**

### 4. KULLANMA
- `CustomCursor` / `useMagnetic` — generic AI deseni, silindi; geri ekleme.
- `next-auth` (custom JWT var) · `pg` (Neon serverless var).
- Recharts/Chart.js — çizimler custom SVG/div.

### 5. Body pseudo-element katmanları
`body::before` = noise (`z-9999`, pointer-events yok, mobilde kapalı);
`body::after` = ambient orb'lar (`fixed`, `z-0`). Konumlanmamış içerik orb
katmanının altında kalır → içerik `relative z-10` (ya da üstü).

### 5b. next/image optimizasyonu KAPALI
`next.config.mjs` → `images.unoptimized: true`: Vercel optimizasyon kotası dolunca
`/_next/image` production'da 402 döndü (yerelde görünmez). Kota açılırsa tek
satırı kaldır. Bedeli: tam boyut iner, ağırlık elle yönetilir:
- Kaynaklar `.webp`, makul kalitede yeniden kodlandı.
- ≤96px avatar gösterimi `getCharacterThumb(slug)` → `public/characters/thumbs/`
  (192px); büyük kullanım `getCharacterImage()`.
- **Yeni karakterde thumb da üret** — yoksa avatar 404. Üretim: headless Chrome
  canvas (`sips` webp yazamıyor), yöntem PR #6'da.

Dış görsel host'u eklerken hem `remotePatterns`'a hem `headers()` CSP
`img-src`'ye yaz.

### 7. Bounty kademeleri
Eşikler `app/bounties/page.tsx` → `TIERS` (≥3B İmparator, ≥1B Komutan, ≥300M
Supernova, altı Çaylak) — constant'a taşınmadı. Veri `lib/constants/bounties.ts`.

### 11. Tarayıcıda kalan kullanıcı verisi
DB'ye yazılmaz, cihaza özel: `onepiece-watched` (anonim izleme),
`onepiece-player-prefs`, `onepiece-last-watched`, `onepiece-theme`,
`onepiece-crew-affiliation` (kayıtta seçilir, profil aurası), `onepiece-sound-enabled`
(quiz sesi opt-in, `lib/audio.ts`), `onepiece-spoiler-gate`, sessionStorage
`onepiece-intro-seen`. Yeni anahtar `onepiece-` önekli, modülde sabit
(`PLAYER_STORAGE_KEYS` deseni).

### 16. Performans
- Ağır kaydırma efektleri (parallax, sabit yatay galeri, hız şeridi)
  `hooks/useMotionGate.ts` arkasında: yalnız md+ ve hareket azaltma kapalıyken.
- Liste/grid kartları `memo`, filtre/sıralama `useMemo`.
- Statik slug sayfaları server component + `generateStaticParams`.

### 17. Tema sabiti düz modülde ZORUNLU
`THEME_STORAGE_KEY`, `THEME_INIT_SCRIPT`, `INTRO_INIT_SCRIPT` → `lib/theme-config.ts`,
`'use client'` TAŞIMAZ. Server component `'use client'` modülünden sabit import
ederse gerçek string yerine client referansı gelir, script'e `'[object Object]'`
gömülür ve kayıtlı tema sessizce yok sayılır.

### 18. `<html>`'de `data-theme` JSX'te YOK — bilerek
React bu attribute'a sahip çıkarsa istemci render'ına düşen rotalarda
(`loading.tsx` taşıyanlar) SSR değerine döndürüp init script'in yazdığını siler.
Tek yazar: init script + `ThemeProvider` mount effect'i (yeniden yazar —
kaldırma). Hiç yazılmazsa `:root` dark verir, JS kapalıyken de doğru.

### 19. Mobil tuzaklar
390px'te 16 rota × 2 tema tarandı, yatay taşma sıfır — öyle kalmalı.
- **Dekoratif parıltı viewport'u büyütür**: `left-1/2 w-[500px] -translate-x-1/2`
  ya da negatif `-inset-*` kutular belgeyi genişletir; `body{overflow-x:hidden}`
  her zaman kurtarmaz. Kapsayıcıya `overflow-hidden` + yatayda `inset-x-0`.
- **Tam ödül rakamı mobil karta sığmaz** → mobilde `formatBounty()` kısa biçim
  (`5.6B`), `sm:` ve üstünde tam rakam.
- **Dokunma hedefi**: küçük metin linklerinde `-my-2 py-2` (alan büyür, aralık
  bozulmaz). Kasıtlı istisna: 30–32px ikincil chrome ve wanted poster'ın
  dekoratif mikro metni.
- `RelationshipGraph` mobilde (`max-width: 767px`) dairesel SVG yerine avatar
  rayı + liste; `EraShowcase` sticky sekansı yalnız md+ (mobilde scroll jail).

## Proje `.claude/`

- Komutlar: `/new-arc <slug> [saga]`, `/new-character <slug>`, `/new-quiz <arcSlug>`,
  `/add-bounty <slug> <miktar>`, `/mobile-audit`.
- Ajanlar: `op-data-surgeon` (`lib/constants/*` güvenli edit + referans
  bütünlüğü), `op-design-auditor` (mobil/erişilebilirlik/tema/performans
  denetimi, edit etmez).

Ekosistem: `~/.claude/CLAUDE.md` · `~/dev-starter/knowledge/{themes/ahmetakyapi,mistakes,patterns}.md`.
