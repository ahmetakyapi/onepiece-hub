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
