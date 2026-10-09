/* Tema sabitleri — KASITLI olarak `'use client'` TAŞIMAYAN düz modül.

   Neden ayrı dosya: bu anahtarı hem `hooks/useTheme.tsx` (client) hem
   `app/layout.tsx` (server) okuyor. Anahtar client modülünde dururken
   layout onu import edince Next, değeri gerçek string yerine bir client
   referans nesnesine çeviriyordu — blocking script'e `'[object Object]'`
   olarak gömülüyor, yani script başka bir anahtara yazıp `useTheme`
   başka bir anahtardan okuyordu. Sonuç: kayıtlı tema tercihi her
   yüklemede yok sayılıyordu.

   `lib/player-config.ts` → `PLAYER_STORAGE_KEYS` deseninin devamı. */

export const THEME_STORAGE_KEY = 'onepiece-theme'

export type Theme = 'dark' | 'light'

/** Blocking script gövdesi — `<head>`de render edilir, ilk boyamadan önce
 *  çalışır. Kullanıcı seçimi > sistem tercihi > dark. Bu yalnızca İLK
 *  boyamayı çözer; istemci render'ına düşen rotalarda attribute'u
 *  `ThemeProvider`ın mount effect'i yeniden uygular. */
export const THEME_INIT_SCRIPT = `(function(){try{var s=localStorage.getItem('${THEME_STORAGE_KEY}');var t=s==='light'||s==='dark'?s:(window.matchMedia('(prefers-color-scheme: light)').matches?'light':'dark');document.documentElement.setAttribute('data-theme',t)}catch(e){document.documentElement.setAttribute('data-theme','dark')}})()`

/* ── Açılış sekansı (preloader) ───────────────────────────────────────────
   Aynı gerekçeyle burada: `layout.tsx` (server) bu script'i `<head>`e gömer.

   Oturum başına BİR kez oynar (sessionStorage). Script, ilk boyamadan önce
   `<html data-intro>` yazar; CSS preloader'ı yalnızca bu attribute varken
   gösterir. Böylece:
   - SSR HTML'inde preloader zaten var → içerik bir an görünüp sonra
     örtülmez (flash yok).
   - Oturumda daha önce izlendiyse attribute hiç yazılmaz → preloader hiç
     boyanmaz.
   - `prefers-reduced-motion` → hiç oynamaz.
   - JS patlarsa `globals.css`teki failsafe animasyonu 4.5 sn'de kendisi
     gizler; sayfa asla kilitli kalmaz.

   `data-intro` React'in yönettiği bir attribute DEĞİL (JSX'te yok), o yüzden
   gotcha 18'deki silinme sorunu burada yaşanmaz. */
export const INTRO_STORAGE_KEY = 'onepiece-intro-seen'

export const INTRO_INIT_SCRIPT = `(function(){try{if(sessionStorage.getItem('${INTRO_STORAGE_KEY}'))return;if(window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;document.documentElement.setAttribute('data-intro','1')}catch(e){}})()`
