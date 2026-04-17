---
description: Kapsamlı mobil responsive tarama + düzeltme workflow'u
---

Kullanıcı mobil UX iyileştirmesi istiyor. Aşağıdaki sistematik audit'i çalıştır.

## 1. Audit Aşaması

`Agent` tool'unu `subagent_type: "op-design-auditor"` ile çalıştır (varsa) veya `Explore` ile. Şu alanlara odaklan:

### A. Sticky/vh-based heights
Dosyalar: `app/page.tsx` (hero), `components/timeline/EraShowcase.tsx`, `components/home/FeaturedArcSpotlight.tsx`, `components/home/JourneyScroll.tsx`, `components/arcs/ArcDetail.tsx`, `components/crews/CrewDetail.tsx`, `components/devil-fruits/DevilFruitDetail.tsx`, `components/characters/CharacterDetail.tsx`
- vh-based heights mobilde çok uzun mu?
- Sticky container'lar dead scroll zone oluşturuyor mu?
- min-h-[Npx] mobilde fold altında mı kalıyor?

### B. Fixed-size SVG/Canvas
- `components/characters/RelationshipGraph.tsx` (1200×1200 viewBox)
- `components/world/WorldMap.tsx` (1200×700 viewBox, min-w-[800px] scroll OK)
- `components/home/StatsBar.tsx` (92px rings)
- Canvas'lar: ParticleField, PoneglyphOverlay

### C. Tap targets < 44px
- `components/layout/MobileBottomNav.tsx`
- Filter chips ve küçük butonlar
- SVG node click targets

### D. Text sizes
- text-4xl / text-5xl / text-6xl mobilde çok büyük mü?
- text-[9px] veya daha küçük okunaklı mı?
- line-clamp'ler doğru seviyede mi?

### E. Grid layout
- `grid-cols-3`/`grid-cols-4` mobilde zorluyor mu?
- Podium gibi fixed layout'lar cramped mı?

### F. Z-index + positioning
- Absolute positioned elementler mobilde overlap mi?
- Fixed elementler (header, bottom nav, toast) safe-area-inset uyumlu mu?

### G. Cinematic hero content placement
- `flex flex-col justify-end` içeriği mobilde görünür mü?
- Text overlay gradient'ler yeterli kontrast veriyor mu?

## 2. Raporlama

Auditör her bulgu için:
- Dosya:line
- 1 cümle sorun açıklaması
- Severity: HIGH / MED / LOW
- Önerilen düzeltme

## 3. Düzeltme Sırası

Severity'ye göre: HIGH → MED → LOW. Her düzeltmeden sonra:
1. File edit'ten sonra `Read` tool ile doğrulama
2. `npm run typecheck` (sessizce, 10 dosyada bir)
3. Dev server'da curl ile page compile kontrolü

## 4. Yaygın Kalıp Düzeltmeler

### Hero height responsive
```tsx
// Kötü
className="h-[60vh] min-h-[480px] sm:h-[70vh]"
// İyi — mobilde daha uzun vh, daha kısa min-h
className="h-[72vh] min-h-[420px] sm:h-[70vh] sm:min-h-[480px]"
```

### Text overlay kompakt mobilde
```tsx
// Kötü
<h3 className="mb-3 text-4xl sm:text-5xl md:text-6xl">
<p className="mb-5 text-sm sm:text-base">

// İyi — mobilde kısa, sm+'da zengin
<h3 className="mb-2 text-3xl sm:mb-3 sm:text-5xl md:text-6xl">
<p className="mb-4 line-clamp-3 text-[13px] sm:mb-5 sm:line-clamp-none sm:text-base">
```

### Stats bar cramped mobilde
```tsx
// Fixed px → responsive
className="h-[72px] w-[72px] sm:h-[92px] sm:w-[92px]"
```

### Sticky scroll intro banner
Kullanıcı sticky sekansın geleceğini anlamıyorsa, hero'nun altına intro banner ekle:
```tsx
<motion.div className="mb-6 flex max-w-xl items-center gap-3 rounded-2xl border border-gold/20 bg-ocean-surface/30 px-5 py-4">
  <Sparkles /> <p>Kaydırdıkça N sahne sırayla uyanacak — yavaşça scroll et.</p>
  <ChevronDown animate={{ y: [0, 6, 0] }} />
</motion.div>
```

### RelationshipGraph-style mobile split
Karmaşık SVG + desktop-only: `matchMedia('(max-width: 767px)')` ile mobilde list view, desktop'ta SVG.

## 5. Bitiş

- TypeScript temiz olmalı
- Dev server tüm kritik sayfalar için 200 dönmeli (home, characters, explore, timeline, arc-detail, character-detail, quiz, bounties, world, login)
- Commit mesajı: `mobile: <özet> on <touched-files>`
