---
description: BOUNTIES listesine yeni karakter ekle + tier doğrula
argument-hint: <slug> <amount>
---

Bounty eklenecek. Slug: `$1`, Miktar: `$2`.

## Adımlar

1. **Karakter doğrula**: `lib/constants/characters.ts` → CHARACTERS içinde `slug: '$1'` var mı? Yoksa kullanıcıya söyle.

2. **Miktar formatla**: `$2` sayı veya string olabilir. Virgüllü string formatına çevir (ör: `3000000000` → `'3,000,000,000'`).

3. **Tier hesapla** (`app/bounties/page.tsx` TIERS):
   - ≥ 3,000,000,000 → **Emperor** (İmparator Seviyesi)
   - ≥ 1,000,000,000 → **Commander** (Komutan Seviyesi)
   - ≥ 300,000,000 → **Supernova**
   - < 300,000,000 → **Rookie**

4. **Entry ekle** (`lib/constants/bounties.ts` → `BOUNTIES`):
   - Doğru sıra önemli: bounty'ye göre azalan (descending) sıralama. Eklediğin entry listede uygun yere gitmeli.

   ```ts
   { name: 'Karakter Adı', bounty: '$2', crew: 'Mürettebat', slug: '$1', epithet: 'Lakap' }
   ```

   - `name`: CHARACTERS'dan oku
   - `bounty`: formatlı string
   - `crew`: karakter objesinden `crew` değil, okunabilir label (ör: 'Hasır Şapka', 'Yonko', 'Heart Korsanları', 'Cross Guild', 'Big Mom Korsanları')
   - `slug`: karakter slug — detay sayfasına link için
   - `epithet`: karakter'in `epithet`'i (varsa)

5. **Karakter objesini de güncelle** (opsiyonel): `lib/constants/characters.ts`'de karakterin `bounty` alanı yoksa veya eskiyse onu da güncelle.

6. **Doğrulama**:
   - `npm run typecheck`
   - `/bounties` sayfasını açıp entry'nin doğru tier'a düştüğünü gör (podium için top 3, sonrası tier'larda listeleniyor)

## Örnek

```bash
/add-bounty luffy 3000000000
```
→ `{ name: 'Monkey D. Luffy', bounty: '3,000,000,000', crew: 'Hasır Şapka', slug: 'luffy', epithet: 'Hasır Şapka' }`
→ Emperor tier'a düşer.

## Önemli Notlar

- BOUNTIES listesi azalan sıralı olmalı. Sıralama bozulursa `/bounties` podium ve tier listeleri yanlış sıralanır.
- `crew` label'ı okunabilir Türkçe olmalı. Bu alan sadece UI'da gösterilir, filter değişkeni değil.
- Podium (top 3) `isFiltered === false` iken görünür.
- `EXTRA_BOUNTIES` dizisi `app/bounties/page.tsx`'de (constant'a taşınmamış) — kullanıcı "ek 32 bounty" kavramını kastediyorsa oraya eklenmeli, ama ana liste BOUNTIES'tir.
