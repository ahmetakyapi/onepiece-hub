# One Piece Hub — Proje Kuralları

## Proje Özeti

One Piece hayranları için kapsamlı Türkçe platform. Arc bazlı bölüm düzeni, karakter ansiklopedisi, izleme takibi, quiz sistemi ve topluluk yorumları.

## Teknik Stack

- **Framework**: Next.js 14 App Router
- **Stil**: Tailwind CSS 3 — "Okyanus Derinliği" teması (dark-only)
- **Animasyon**: Framer Motion
- **DB**: Drizzle ORM + Neon Postgres (`@neondatabase/serverless`)
- **Auth**: next-auth v5 (Google + Discord)
- **Video**: Pixeldrain embed
- **Deployment**: Vercel

## Tema: Okyanus Derinliği

- Background: `#0a1628` (derin lacivert)
- Primary: `#f4a300` (hasır şapka altını)
- Secondary: `#1e90ff` (okyanus mavisi)
- Accent: `#e74c3c` (Luffy kırmızısı)
- Text: `#e8eaf0`
- Dark-only tema, light mode yok

## Özel Kurallar

- Arc ve karakter verileri statik (`lib/constants/`), DB sadece kullanıcı etkileşimleri için
- Video Pixeldrain embed ile oynatılır
- Tüm glassmorphism bileşenleri `.glass` class kullanır
- Buton varyantları: `.btn-gold`, `.btn-luffy`, `.btn-ghost`
- Gradient text: `.text-gold-gradient`, `.text-sea-gradient`

## Ekosistem Referansları

- Tema: `~/dev-starter/knowledge/themes/ahmetakyapi.md`
- Hatalar: `~/dev-starter/knowledge/mistakes.md`
- Desenler: `~/dev-starter/knowledge/patterns.md`

## Kurulum

```bash
cp .env.example .env.local
npm install
npm run db:push
npm run dev
```

## Deployment

```bash
/deploy   # Vercel checklist
```
