---
description: Yeni bir arc ekle — doğru saga dosyasına iskelet + registry güncellemeleri
argument-hint: <slug> [saga-slug]
---

Kullanıcı yeni bir arc ekleyecek. Slug: `$1`, Saga: `$2` (opsiyonel, verilmezse sor).

## Adımlar

1. **Saga belirle**: Eğer `$2` verildiyse onu kullan. Değilse kullanıcıya sor:
   - east-blue, alabasta, sky-island, water-7, thriller-bark, summit-war, fish-man-island, dressrosa, four-emperors, final
   - Doğru saga dosyası: `lib/constants/arcs/<saga>.ts`

2. **Arc iskeleti ekle** (saga dosyasındaki array'in sonuna). Tip: `Arc` from `@/types`. Zorunlu alanlar:
   - `name`, `slug: '$1'`, `saga: '<saga>'`, `cover: '/arcs/$1.webp'`
   - `episodeCount` (bölüm sayısı), `summary` (kısa), `detailedSummary` (uzun, 2-3 paragraf)
   - `keyEvents: string[]` (5-8 madde)
   - `themes: string[]` (3-5 tema — ör: 'Dostluk', 'Özgürlük', 'Fedakarlık')
   - `location: string`, `villain?: string`
   - `characters: string[]` (karakter slug listesi — CHARACTERS'da mevcut olanlar)
   - `episodes: Episode[]` — `{ number, title, slug: '$1-NN', duration, summary }`

3. **Saga registry güncelle** (`lib/constants/sagas.ts`):
   - İlgili saga'nın `arcs` array'ine slug ekle — **doğru sıraya**
   - Kronolojik sıra kritik; `getGlobalEpisodeNumber` bu sıraya bakar

4. **Image registry güncelle** (`lib/constants/images.ts`):
   - `ARC_IMAGES` objesine `'$1': '/arcs/$1.webp'` ekle
   - Kullanıcıya `public/arcs/$1.webp` dosyasını eklemesi gerektiğini hatırlat (AVIF > WebP tercih)

5. **Quiz opsiyonel**: Sor — quiz de eklensin mi? Evet ise `/new-quiz $1` öner.

6. **Doğrulama**: `npm run typecheck` çalıştır.

## Önemli

- Arc sıralaması `ARCS` dizisindeki kronoloji = OnePaceTR global episode numbering'i etkiler. Saga ortasına arc eklersen sıra bozulur.
- `character` slug'ları CHARACTERS'da mevcut olmalı — yoksa detay sayfasında hata.
- `episodes` array'inde `slug` pattern: `<arc-slug>-NN` (iki haneli, sıfır dolgulu — ör: `wano-01`, `wano-02`).
- SSG için bölüm slug'ları unique olmalı.

## Örnek iskelet

```ts
{
  name: 'Yeni Arc Adı',
  slug: '$1',
  saga: '<saga-slug>',
  cover: '/arcs/$1.webp',
  episodeCount: 10,
  summary: 'Kısa özet — 1-2 cümle.',
  detailedSummary: 'Detaylı özet — 2-3 paragraf, arc'\''ın tam hikayesi.',
  keyEvents: [
    'Önemli olay 1',
    'Önemli olay 2',
  ],
  themes: ['Tema 1', 'Tema 2'],
  location: 'Mekan adı',
  villain: 'Düşman adı',
  characters: ['luffy', 'zoro'],
  episodes: [
    { number: 1, title: 'Bölüm başlığı', slug: '$1-01', duration: '24:30', summary: 'Bölüm özeti.' },
  ],
},
```

Tamamlayınca kullanıcıya: "`public/arcs/$1.webp` dosyasını ekle + gerekiyorsa `/new-quiz $1` çalıştır" hatırlat.
