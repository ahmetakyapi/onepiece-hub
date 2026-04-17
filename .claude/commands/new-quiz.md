---
description: Arc için quiz ekle — QUIZZES array'ine 5-10 soru iskeleti
argument-hint: <arc-slug>
---

Quiz eklenecek arc: `$1`.

## Adımlar

1. **Arc doğrula**: `lib/constants/arcs/*` içinde `slug: '$1'` olan arc var mı? Yoksa kullanıcıya söyle ve dur.

2. **Duplicate kontrolü**: `lib/constants/quizzes.ts` → QUIZZES array'inde zaten `arcSlug: '$1'` var mı? Varsa kullanıcıya sor — üstüne yazsın mı, yeni sorular mı eklensin.

3. **Quiz ekle** (`lib/constants/quizzes.ts`):

```ts
{
  arcSlug: '$1',
  questions: [
    { question: 'Soru metni?', options: ['A', 'B', 'C', 'D'], correctIndex: 0 },
    // 5-10 soru
  ],
},
```

4. **Tip kuralları** (`types/index.ts`):
   - `QuizQuestion`: `{ question, options: [string, string, string, string], correctIndex: number }`
   - `options` **tam 4 eleman** olmalı (tuple)
   - `correctIndex` 0-3 arası olmalı
   - `ArcQuiz`: `{ arcSlug, questions: QuizQuestion[] }`

5. **Soru kalitesi önerileri**:
   - 5 soru minimum, 10 soru ideal
   - Arc'ın karakteristik olaylarına odaklan (anahtar savaş, bounty rakamı, karakter ismi, önemli söz)
   - Zorluk karışık: 2 kolay, 2 orta, 1 zor örüntüsü
   - Yanıltıcı seçenekler gerçekçi olsun (ör: Luffy'nin bounty'sini sorarken diğer Hasır Şapkaların bounty'leri)
   - Türkçe karakterlere dikkat (ş, ç, ı, ü, ö)

6. **Doğrulama**:
   - `npm run typecheck`
   - Quiz sayfasını test et: `http://localhost:3000/quiz/$1` → 200 dönmeli
   - Bir soru cevapla, SFX + streak çalışıyor mu gör (isSoundEnabled açıksa)

## Örnek — Arabasta Quiz'inden

```ts
{
  arcSlug: '$1',
  questions: [
    { question: 'Crocodile\'ın kod adı nedir?', options: ['Mr. 0', 'Mr. 1', 'Mr. 2', 'Mr. 3'], correctIndex: 0 },
    { question: 'Vivi hangi krallığın prensesidir?', options: ['Dressrosa', 'Arabasta', 'Drum', 'Wano'], correctIndex: 1 },
  ],
},
```

## Önemli

- Quiz sayfası dynamic route: `app/quiz/[arcSlug]/page.tsx`. Yeni arc eklendiğinde otomatik çalışır.
- Rank hesaplaması: %90+ Yonko (yonko SFX), %70+ rozet, %50 altı Rookie. `percentage = (score / questions.length) * 100`.
- MangaSFX streak milestone: 3x/6x/9x doğru cevap serisi için otomatik tetiklenir (quiz page'de).
- Quiz skorları login kullanıcı için DB'ye yazılır (`/api/quiz-scores`, upsert — daha yüksek skor overwrite eder).
