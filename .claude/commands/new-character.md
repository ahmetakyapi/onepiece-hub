---
description: Yeni karakter ekle — CHARACTERS array + image registry + ilişkiler
argument-hint: <slug>
---

Yeni karakter eklenecek. Slug: `$1`.

## Adımlar

1. **Tip kontrolü** (`types/index.ts` → `Character`):
   - `name`, `slug: '$1'`, `image: '/characters/$1.webp'`
   - `crew: CrewType` (straw-hat, marine, shichibukai, yonko, revolutionary, baroque-works, cp9, supernova, beast-pirates, big-mom-pirates, roger-pirates, whitebeard-pirates, red-hair-pirates, ally, other)
   - `epithet?: string`, `bounty?: string` (ör: `'3,000,000,000'`)
   - `devilFruit?: { name, type, description }` — type: Paramecia / Zoan / Logia / Mythical Zoan / Ancient Zoan / Special Paramecia
   - `description: string` (1-2 cümle — listeleme kartında gösterilir)
   - `backstory: string` (detaylı — detay sayfasında gösterilir, 2-3 paragraf)
   - `role: string` (ör: "Kaptan — mürettebatın kalbi")
   - `age?`, `height?`, `origin?`
   - `firstArc: string` (ARC slug — `lib/constants/arcs/*`'da mevcut olmalı)
   - `appearances: string[]` (arc slug'ları)
   - `abilities: Ability[]` — `{ name, description, category? }` — category: Haki/Şeytan Meyvesi/Kılıç/Fiziksel/Silah/Özel/Bilim

2. **Tek yer — `lib/constants/characters.ts`**: CHARACTERS array'inin sonuna yeni entry ekle. Mevcut karakterleri referans al — özellikle Luffy (straw-hat) veya Akainu (marine) yakın bir karakteri template olarak kullan.

3. **Image registry** (`lib/constants/images.ts` → `CHARACTER_IMAGES`):
   - `'$1': '/characters/$1.webp'` ekle

4. **Public asset**: Kullanıcıya `public/characters/$1.webp` dosyasını eklemesi gerektiğini söyle.

5. **İlişkiler opsiyonel** (`lib/constants/relationships.ts` → `CHARACTER_RELATIONS`):
   - Nakama/family/rival/enemy/mentor/ally bağlantıları varsa ekle
   - Graph'ta görünmesi için `GRAPH_CHARACTERS` array'ine slug eklenmeli

6. **Bounty registry** (opsiyonel, `lib/constants/bounties.ts`): Bounty belirlenmişse ekle. Tier:
   - ≥ 3B Berry = Emperor
   - ≥ 1B = Commander
   - ≥ 300M = Supernova
   - < 300M = Rookie

7. **Mürettebat üyesi** (`lib/constants/crews.ts`): Eğer crew'ün `notableMembers` listesine eklenecekse oraya da ekle.

8. **Doğrulama**: `npm run typecheck`. Ayrıca `/characters` ve `/characters/$1` sayfalarının compile ettiğini dev server'da curl ile kontrol et.

## Önemli Notlar

- `slug` tüm proje boyunca tek referans noktası — değiştirilmemeli. Başka dosyalardan (arcs, battles, devil-fruits, bounties, relationships) referans verilirken aynı slug kullanılır.
- `appearances` boş bırakılmasın — en az bir arc olmalı, yoksa hangi arc'larda göründüğü gösterilemez.
- `description` listeleme kartında truncate edilir, kısa tut.
- Bounty format: `'1,234,567,890'` string (virgüllü). `parseBounty` helper'ı bunu number'a çevirir.
- Eğer karakter bir Şeytan Meyvesi kullanıcısıysa, `lib/constants/devil-fruits.ts`'deki meyvenin `user` ve `userSlug` alanlarıyla bu karakter bağlanmalı.

## Örnek İskelet

```ts
{
  name: 'Karakter Adı',
  slug: '$1',
  image: '/characters/$1.webp',
  crew: 'straw-hat',
  epithet: 'Lakap',
  bounty: '500,000,000',
  devilFruit: {
    name: 'Meyve Adı',
    type: 'Paramecia',
    description: 'Meyvenin ne yaptığı.',
  },
  description: 'Kısa açıklama, 1-2 cümle.',
  backstory: 'Detaylı geçmiş, 2-3 paragraf.',
  role: 'Rol — alt açıklama',
  age: '24',
  height: '180 cm',
  origin: 'Doğduğu yer',
  firstArc: 'arc-slug',
  appearances: ['arc-slug-1', 'arc-slug-2'],
  abilities: [
    { name: 'Yetenek 1', description: 'Nasıl çalışır.', category: 'Haki' },
  ],
},
```
