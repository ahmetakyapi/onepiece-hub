import type { ArcQuiz } from '@/types'

export const QUIZZES: ArcQuiz[] = [
  {
    arcSlug: 'romance-dawn',
    questions: [
      { question: 'Luffy\'nin hasır şapkasını kim verdi?', options: ['Gol D. Roger', 'Shanks', 'Rayleigh', 'Garp'], correctIndex: 1 },
      { question: 'Luffy hangi Şeytan Meyvesini yedi?', options: ['Mera Mera no Mi', 'Gomu Gomu no Mi', 'Bara Bara no Mi', 'Suna Suna no Mi'], correctIndex: 1 },
      { question: 'Zoro\'nun rüyası nedir?', options: ['Korsanlar Kralı olmak', 'All Blue\'yu bulmak', 'Dünyanın en iyi kılıç ustası olmak', 'Dünyanın haritasını çizmek'], correctIndex: 2 },
      { question: 'Luffy\'nin köyünün adı nedir?', options: ['Cocoyashi', 'Foosha', 'Syrup', 'Loguetown'], correctIndex: 1 },
      { question: 'Shanks hangi kolunu kaybetti?', options: ['Sağ kol', 'Sol kol', 'İkisi de', 'Hiçbiri'], correctIndex: 1 },
    ],
  },
  {
    arcSlug: 'arlong-park',
    questions: [
      { question: 'Arlong hangi ırka ait?', options: ['İnsan', 'Dev', 'Balık-Adam', 'Uzun Bacaklı'], correctIndex: 2 },
      { question: 'Nami Arlong\'a neden çalışmak zorundaydı?', options: ['Borcu vardı', 'Köyünü kurtarmak için', 'Haritacı olduğu için', 'Rehin alınmıştı'], correctIndex: 1 },
      { question: 'Nami\'nin üvey annesinin adı nedir?', options: ['Nojiko', 'Bellemere', 'Robin', 'Vivi'], correctIndex: 1 },
      { question: 'Luffy, Arlong Park\'ı yıktığında ne dedi?', options: ['"Ben Korsanlar Kralıyım"', '"Nami benim arkadaşım"', '"Seni yeneceğim"', 'Hiçbir şey demedi'], correctIndex: 1 },
      { question: 'Arlong\'un bounty\'si ne kadardı?', options: ['10,000,000', '20,000,000', '30,000,000', '15,000,000'], correctIndex: 1 },
    ],
  },
  {
    arcSlug: 'arabasta',
    questions: [
      { question: 'Crocodile\'ın kod adı nedir?', options: ['Mr. 0', 'Mr. 1', 'Mr. 2', 'Mr. 3'], correctIndex: 0 },
      { question: 'Vivi hangi krallığın prensesidir?', options: ['Dressrosa', 'Arabasta', 'Drum', 'Wano'], correctIndex: 1 },
      { question: 'Crocodile hangi Şeytan Meyvesine sahip?', options: ['Gomu Gomu no Mi', 'Hana Hana no Mi', 'Suna Suna no Mi', 'Mera Mera no Mi'], correctIndex: 2 },
      { question: 'Hasır Şapkalar vedalaşırken ne yaptılar?', options: ['El salladılar', 'X işaretlerini gösterdiler', 'Bağırdılar', 'Ağladılar'], correctIndex: 1 },
      { question: 'Robin hangi arc\'ta mürettebata katıldı?', options: ['Arabasta', 'Water Seven', 'Skypiea', 'Jaya'], correctIndex: 0 },
    ],
  },
  {
    arcSlug: 'enies-lobby',
    questions: [
      { question: 'Robin "Yaşamak istiyorum!" diye kime bağırdı?', options: ['Luffy\'ye', 'Mürettebata', 'CP9\'a', 'Spandam\'a'], correctIndex: 1 },
      { question: 'Luffy hangi yeni tekniği ilk kez burada kullandı?', options: ['Gear 4', 'Gear 2 ve 3', 'Gear 5', 'Haki'], correctIndex: 1 },
      { question: 'CP9\'un en güçlü üyesi kimdir?', options: ['Kaku', 'Blueno', 'Rob Lucci', 'Jabra'], correctIndex: 2 },
      { question: 'Enies Lobby\'de ne yandı?', options: ['Deniz Kuvvetleri bayrağı', 'Dünya Hükümeti bayrağı', 'Korsan bayrağı', 'Going Merry'], correctIndex: 1 },
      { question: 'Franky mürettebata hangi gemiyi yaptı?', options: ['Going Merry', 'Thousand Sunny', 'Oro Jackson', 'Moby Dick'], correctIndex: 1 },
    ],
  },
  {
    arcSlug: 'marineford',
    questions: [
      { question: 'Beyaz Sakal\'ın gerçek adı nedir?', options: ['Gol D. Roger', 'Edward Newgate', 'Marshall D. Teach', 'Garp'], correctIndex: 1 },
      { question: 'Ace\'i kim öldürdü?', options: ['Blackbeard', 'Sengoku', 'Akainu', 'Kizaru'], correctIndex: 2 },
      { question: 'Savaşı kim durdurdu?', options: ['Luffy', 'Shanks', 'Dragon', 'Garp'], correctIndex: 1 },
      { question: 'Luffy\'nin Marineford\'daki en büyük gücü neydi?', options: ['Gear 4', 'Haoshoku Haki', 'Gear 2', 'Gomu Gomu no Storm'], correctIndex: 1 },
      { question: 'Savaş sonunda ne oldu?', options: ['Luffy kazandı', 'Ace kurtarıldı', 'Beyaz Sakal öldü', 'Deniz Kuvvetleri dağıldı'], correctIndex: 2 },
    ],
  },
  {
    arcSlug: 'wano',
    questions: [
      { question: 'Luffy Wano\'da hangi yeni formunu açığa çıkardı?', options: ['Gear 3', 'Gear 4', 'Gear 5', 'Gear 2'], correctIndex: 2 },
      { question: 'Wano\'nun shogun\'u kimdi?', options: ['Oden', 'Orochi', 'Kaido', 'Momonosuke'], correctIndex: 1 },
      { question: 'Kaido hangi forma dönüşebilir?', options: ['Kaplan', 'Ejderha', 'Aslan', 'Kartal'], correctIndex: 1 },
      { question: 'Oden\'in kılıçlarının adı nedir?', options: ['Yoru ve Shusui', 'Enma ve Ame no Habakiri', 'Wado Ichimonji ve Sandai Kitetsu', 'Shusui ve Enma'], correctIndex: 1 },
      { question: 'Luffy\'nin Gear 5 formu neye benziyor?', options: ['Ejderhaya', 'Nika\'ya (Güneş Tanrısı)', 'Deva\'ya', 'Asura\'ya'], correctIndex: 1 },
    ],
  },
]

export function getQuizByArcSlug(slug: string): ArcQuiz | undefined {
  return QUIZZES.find((q) => q.arcSlug === slug)
}
