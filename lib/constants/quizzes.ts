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
  {
    arcSlug: 'orange-town',
    questions: [
      { question: 'Buggy hangi Şeytan Meyvesini yedi?', options: ['Gomu Gomu no Mi', 'Bara Bara no Mi', 'Suna Suna no Mi', 'Chop Chop no Mi'], correctIndex: 1 },
      { question: 'Buggy\'nin Şeytan Meyvesi ne işe yarar?', options: ['Vücudunu uzatır', 'Vücudunu parçalara ayırır', 'Ateş çıkarır', 'Görünmez yapar'], correctIndex: 1 },
      { question: 'Luffy, Orange Town\'da kimi kurtardı?', options: ['Nami', 'Zoro', 'Kasaba halkını ve Shushu\'yu', 'Usopp'], correctIndex: 2 },
      { question: 'Buggy daha önce kimin mürettebatındaydı?', options: ['Beyaz Sakal', 'Roger', 'Shiki', 'Kaido'], correctIndex: 1 },
      { question: 'Nami\'nin Orange Town\'daki asıl amacı neydi?', options: ['Luffy\'ye katılmak', 'Buggy\'nin hazine haritasını çalmak', 'Kasabayı kurtarmak', 'Grand Line\'a gitmek'], correctIndex: 1 },
    ],
  },
  {
    arcSlug: 'syrup-village',
    questions: [
      { question: 'Kaptan Kuro\'nun asıl planı neydi?', options: ['Korsanlar Kralı olmak', 'Kaya\'nın mirasını ele geçirmek', 'Deniz Kuvvetleri\'ne katılmak', 'Şeytan Meyvesi bulmak'], correctIndex: 1 },
      { question: 'Usopp\'un babası kimdir?', options: ['Shanks', 'Beckman', 'Yasopp', 'Lucky Roux'], correctIndex: 2 },
      { question: 'Going Merry\'yi kim tasarladı?', options: ['Franky', 'Usopp', 'Merry', 'Kaya'], correctIndex: 2 },
      { question: 'Usopp\'un en belirgin özelliği nedir?', options: ['Çok güçlü olması', 'Yalan söylemeyi sevmesi', 'Şeytan Meyvesi yemesi', 'Kılıç kullanması'], correctIndex: 1 },
      { question: 'Kuro\'nun savaş tarzı neydi?', options: ['Kılıç', 'Uzun bıçaklı eldivenler', 'Yumruk', 'Tabanca'], correctIndex: 1 },
    ],
  },
  {
    arcSlug: 'baratie',
    questions: [
      { question: 'Sanji\'nin rüyası nedir?', options: ['Korsanlar Kralı olmak', 'En iyi aşçı olmak', 'All Blue\'yu bulmak', 'Dünyayı gezmek'], correctIndex: 2 },
      { question: 'Zeff neden bacağını kaybetti?', options: ['Savaşta', 'Sanji\'yi kurtarmak için yedi', 'Kaza geçirdi', 'Hastalık'], correctIndex: 1 },
      { question: 'Mihawk, Zoro ile savaşta ne kullandı?', options: ['Yoru', 'Küçük bir bıçak', 'Kılıç kullanmadı', 'İki kılıç'], correctIndex: 1 },
      { question: 'Baratie nedir?', options: ['Bir ada', 'Yüzen bir restoran', 'Bir kale', 'Bir köy'], correctIndex: 1 },
      { question: 'Don Krieg\'in en güçlü silahı neydi?', options: ['Kılıç', 'Wootz çelik mızrak', 'Savaş zırhı', 'Tabanca'], correctIndex: 2 },
    ],
  },
  {
    arcSlug: 'loguetown',
    questions: [
      { question: 'Loguetown\'un diğer adı nedir?', options: ['Başlangıç Şehri', 'Son Şehir', 'Başlangıç ve Son Şehri', 'Korsan Şehri'], correctIndex: 2 },
      { question: 'Gol D. Roger bu şehirde ne yaşadı?', options: ['Doğdu ve idam edildi', 'Sadece doğdu', 'Sadece idam edildi', 'Hiçbiri'], correctIndex: 0 },
      { question: 'Luffy\'yi idam sehpasından kim kurtardı?', options: ['Zoro', 'Shanks', 'Dragon', 'Sanji'], correctIndex: 2 },
      { question: 'Smoker\'ın Şeytan Meyvesi nedir?', options: ['Moku Moku no Mi', 'Mera Mera no Mi', 'Suna Suna no Mi', 'Goro Goro no Mi'], correctIndex: 0 },
      { question: 'Zoro Loguetown\'da hangi kılıcı aldı?', options: ['Wado Ichimonji', 'Yubashiri ve Sandai Kitetsu', 'Enma', 'Shusui'], correctIndex: 1 },
    ],
  },
  {
    arcSlug: 'reverse-mountain',
    questions: [
      { question: 'Grand Line\'a girmek için nereden geçilir?', options: ['Calm Belt', 'Reverse Mountain', 'Red Line altından', 'Skypiea üzerinden'], correctIndex: 1 },
      { question: 'Laboon ne tür bir hayvandır?', options: ['Dev ahtapot', 'Deniz kralı', 'Ada balinası', 'Dev köpekbalığı'], correctIndex: 2 },
      { question: 'Laboon kimi bekliyordu?', options: ['Roger', 'Shanks', 'Rumbar Korsanları', 'Luffy'], correctIndex: 2 },
      { question: 'Crocus\'un görevi neydi?', options: ['Denizci', 'Laboon\'un bakıcısı ve deniz feneri bekçisi', 'Korsan', 'Tüccar'], correctIndex: 1 },
      { question: 'Luffy Laboon\'a ne söz verdi?', options: ['Onu denize götürmek', 'Tekrar gelip dövüşmek', 'Ona yemek vermek', 'Onu kurtarmak'], correctIndex: 1 },
    ],
  },
  {
    arcSlug: 'whiskey-peak',
    questions: [
      { question: 'Whiskey Peak\'teki kasaba halkı aslında kimdi?', options: ['Deniz Kuvvetleri ajanları', 'Baroque Works ajanları', 'Devrimci ordu', 'Normal kasaba halkı'], correctIndex: 1 },
      { question: 'Miss Wednesday\'in gerçek kimliği nedir?', options: ['Robin', 'Nami', 'Vivi', 'Hancock'], correctIndex: 2 },
      { question: 'Zoro Whiskey Peak\'te kaç ödül avcısını yendi?', options: ['50', '100', '200', '300'], correctIndex: 1 },
      { question: 'Baroque Works\'ün lideri kimdir?', options: ['Buggy', 'Crocodile', 'Doflamingo', 'Arlong'], correctIndex: 1 },
      { question: 'Vivi\'nin yanındaki ördek ne tür bir hayvandır?', options: ['Normal ördek', 'Spot-Billed Duck (Karoo)', 'Deniz atı', 'Penguen'], correctIndex: 1 },
    ],
  },
  {
    arcSlug: 'little-garden',
    questions: [
      { question: 'Dorry ve Brogy ne kadar süredir savaşıyordu?', options: ['10 yıl', '50 yıl', '100 yıl', '100 yıldan fazla'], correctIndex: 2 },
      { question: 'Mr. 3\'ün Şeytan Meyvesi ne üretir?', options: ['Ateş', 'Balmumu', 'Çelik', 'Buz'], correctIndex: 1 },
      { question: 'Dorry ve Brogy hangi ırktan?', options: ['İnsan', 'Balık-Adam', 'Dev', 'Mink'], correctIndex: 2 },
      { question: 'Little Garden\'ın ortamı neye benziyordu?', options: ['Çöl', 'Buz çölü', 'Tarih öncesi orman (dinozorlar)', 'Modern şehir'], correctIndex: 2 },
      { question: 'Devlerin memleketi neresidir?', options: ['Wano', 'Elbaf', 'Zou', 'Skypiea'], correctIndex: 1 },
    ],
  },
  {
    arcSlug: 'drum-island',
    questions: [
      { question: 'Chopper hangi Şeytan Meyvesini yedi?', options: ['Gomu Gomu no Mi', 'Hito Hito no Mi', 'Ushi Ushi no Mi', 'Tori Tori no Mi'], correctIndex: 1 },
      { question: 'Dr. Hiluluk\'un hayali neydi?', options: ['Korsanlar Kralı olmak', 'Drum Adası\'nda sakura çiçeği açtırmak', 'En iyi doktor olmak', 'All Blue\'yu bulmak'], correctIndex: 1 },
      { question: 'Wapol\'ün Şeytan Meyvesi ne yapabilir?', options: ['Her şeyi yiyip vücuduna katmak', 'Ateş çıkarmak', 'Uçmak', 'Buz üretmek'], correctIndex: 0 },
      { question: 'Dr. Kureha kaç yaşında görünüyor?', options: ['70', '100', '130 yaşın üzerinde', '50'], correctIndex: 2 },
      { question: 'Drum Adası\'nda gökyüzünde ne görüldü?', options: ['Gökkuşağı', 'Pembe sakura kar taneleri', 'Aurora', 'Yıldız kayması'], correctIndex: 1 },
    ],
  },
  {
    arcSlug: 'jaya',
    questions: [
      { question: 'Bellamy Luffy\'ye neden saldırdı?', options: ['Ödül için', 'Luffy\'nin rüyalarla dalga geçmediği için', 'Deniz Kuvvetleri emri', 'Kişisel kin'], correctIndex: 1 },
      { question: 'Blackbeard, Jaya\'da Luffy\'ye ne dedi?', options: ['"Seni yeneceğim"', '"İnsanların hayalleri bitmez"', '"Grand Line tehlikeli"', '"Bana katıl"'], correctIndex: 1 },
      { question: 'Mont Blanc Cricket ne arıyordu?', options: ['One Piece', 'Altın şehir Shandora\'nın kanıtı', 'Şeytan Meyvesi', 'Laboon'], correctIndex: 1 },
      { question: 'Skypiea\'ya çıkmak için ne gerekiyordu?', options: ['Uçan bir gemi', 'Knock-Up Stream', 'Şeytan Meyvesi gücü', 'Deniz Kralı yardımı'], correctIndex: 1 },
      { question: 'Bellamy\'nin Şeytan Meyvesi ne yapıyor?', options: ['Kauçuk gibi uzatır', 'Yay gibi sıçratır', 'Ateş çıkarır', 'Buz üretir'], correctIndex: 1 },
    ],
  },
  {
    arcSlug: 'skypiea',
    questions: [
      { question: 'Enel\'in Şeytan Meyvesi nedir?', options: ['Mera Mera no Mi', 'Goro Goro no Mi', 'Pika Pika no Mi', 'Rumble Rumble'], correctIndex: 1 },
      { question: 'Luffy neden Enel\'e karşı avantajlıydı?', options: ['Haki kullandığı için', 'Kauçuk vücudu elektriği iletmediği için', 'Daha hızlı olduğu için', 'Deniz taşı kullandığı için'], correctIndex: 1 },
      { question: 'Shandora\'nın altın çanı ne işe yarıyordu?', options: ['Hazine', 'Poneglyph taşıyordu', 'Silah', 'Süs'], correctIndex: 1 },
      { question: 'Robin Skypiea\'da ne buldu?', options: ['Şeytan Meyvesi', 'Altın', 'Poneglyph', 'Silah'], correctIndex: 2 },
      { question: 'Enel kendini ne ilan etmişti?', options: ['Korsanlar Kralı', 'Tanrı (God)', 'İmparator', 'Amiral'], correctIndex: 1 },
    ],
  },
  {
    arcSlug: 'long-ring-long-land',
    questions: [
      { question: 'Davy Back Fight nedir?', options: ['Ölüm kalım savaşı', 'Korsanlar arası bahisli oyun/yarış', 'Deniz Kuvvetleri turnuvası', 'Hazine avı'], correctIndex: 1 },
      { question: 'Foxy\'nin Şeytan Meyvesi ne yapar?', options: ['Hızlandırır', 'Noro Noro ışınıyla yavaşlatır', 'Görünmez yapar', 'Klonlar'], correctIndex: 1 },
      { question: 'Aokiji ilk kez nerede karşılarına çıktı?', options: ['Water Seven', 'Long Ring Long Land', 'Enies Lobby', 'Marineford'], correctIndex: 1 },
      { question: 'Aokiji\'nin Şeytan Meyvesi nedir?', options: ['Magu Magu no Mi', 'Hie Hie no Mi', 'Goro Goro no Mi', 'Pika Pika no Mi'], correctIndex: 1 },
      { question: 'Aokiji Robin\'i görünce ne yaptı?', options: ['Tutukladı', 'Dondurdu', 'Görmezden geldi', 'Yardım etti'], correctIndex: 1 },
    ],
  },
  {
    arcSlug: 'water-seven',
    questions: [
      { question: 'CP9 ajanları nereye sızmıştı?', options: ['Deniz Kuvvetleri\'ne', 'Galley-La Şirketi\'ne', 'Baroque Works\'e', 'Franky Ailesi\'ne'], correctIndex: 1 },
      { question: 'Going Merry\'nin artık tamir edilemez olduğunu kim söyledi?', options: ['Franky', 'Usopp', 'Iceburg', 'Kaku'], correctIndex: 2 },
      { question: 'Usopp neden Luffy ile kavga etti?', options: ['Hazine yüzünden', 'Going Merry\'yi bırakmak istemediği için', 'Robin yüzünden', 'Kaptan olmak istediği için'], correctIndex: 1 },
      { question: 'Aqua Laguna nedir?', options: ['Bir içecek', 'Yıllık dev gelgit dalgası', 'Bir gemi', 'Bir ada'], correctIndex: 1 },
      { question: 'Franky\'nin asıl adı nedir?', options: ['Franky', 'Cutty Flam', 'Tom', 'Iceburg'], correctIndex: 1 },
    ],
  },
  {
    arcSlug: 'post-enies-lobby',
    questions: [
      { question: 'Garp\'ın Luffy ile ilişkisi nedir?', options: ['Babası', 'Amcası', 'Dedesi', 'Akrabası değil'], correctIndex: 2 },
      { question: 'Thousand Sunny\'yi kim inşa etti?', options: ['Galley-La', 'Franky', 'Tom', 'Iceburg'], correctIndex: 1 },
      { question: 'Usopp mürettebata geri dönmek için ne yaptı?', options: ['Hiçbir şey', 'Özür diledi', 'Savaştı', 'Kaçtı'], correctIndex: 1 },
      { question: 'Shanks ve Beyaz Sakal nerede buluştu?', options: ['Marineford', 'Moby Dick gemisinde', 'Raftel', 'Wano'], correctIndex: 1 },
      { question: 'Luffy\'nin yeni bounty\'si ne oldu?', options: ['100 milyon', '200 milyon', '300 milyon', '400 milyon'], correctIndex: 2 },
    ],
  },
  {
    arcSlug: 'thriller-bark',
    questions: [
      { question: 'Moria\'nın Şeytan Meyvesi ne yapıyor?', options: ['Gölgeleri manipüle eder', 'Ateş çıkarır', 'Zombi yaratır (doğrudan)', 'Karanlık üretir'], correctIndex: 0 },
      { question: 'Brook hangi mürettebatın üyesiydi?', options: ['Roger Korsanları', 'Rumbar Korsanları', 'Beyaz Sakal Korsanları', 'Kızıl Saç Korsanları'], correctIndex: 1 },
      { question: 'Oars\'ın vücuduna kimin gölgesi konuldu?', options: ['Zoro', 'Sanji', 'Luffy', 'Robin'], correctIndex: 2 },
      { question: '"Hiçbir şey olmadı" sözünü kim söyledi?', options: ['Luffy', 'Sanji', 'Zoro', 'Brook'], correctIndex: 2 },
      { question: 'Kuma, Zoro\'ya ne teklif etti?', options: ['Mürettebata katılmak', 'Luffy\'nin acısını almasını', 'Hazine', 'Kaçış yolu'], correctIndex: 1 },
    ],
  },
  {
    arcSlug: 'sabaody-archipelago',
    questions: [
      { question: 'Sabaody\'de kaç Supernova tanıtıldı?', options: ['9', '10', '11', '12'], correctIndex: 2 },
      { question: 'Luffy Celestial Dragon\'a neden yumruk attı?', options: ['Hazine için', 'Arkadaşını vurduğu için (Hatchan)', 'Meydan okudu', 'Kaçmak için'], correctIndex: 1 },
      { question: 'Silvers Rayleigh kimdir?', options: ['Deniz Kuvvetleri amirali', 'Roger\'ın sağ kolu', 'Yonko', 'Shichibukai'], correctIndex: 1 },
      { question: 'Kuma mürettebatı ne yaptı?', options: ['Hepsini öldürdü', 'Hepsini farklı adalara fırlattı', 'Hapsetti', 'Hiçbir şey'], correctIndex: 1 },
      { question: 'Kizaru\'nun Şeytan Meyvesi nedir?', options: ['Magu Magu no Mi', 'Hie Hie no Mi', 'Pika Pika no Mi', 'Goro Goro no Mi'], correctIndex: 2 },
    ],
  },
  {
    arcSlug: 'amazon-lily',
    questions: [
      { question: 'Amazon Lily\'de sadece hangi cinsiyet yaşar?', options: ['Erkekler', 'Kadınlar', 'İkisi de', 'Hiçbiri'], correctIndex: 1 },
      { question: 'Boa Hancock\'un Şeytan Meyvesi nedir?', options: ['Hebi Hebi no Mi', 'Mero Mero no Mi', 'Hana Hana no Mi', 'Sube Sube no Mi'], correctIndex: 1 },
      { question: 'Hancock Luffy\'ye neden yardım etti?', options: ['Deniz Kuvvetleri emri', 'Luffy\'ye aşık oldu', 'Para için', 'Zorunluluktan'], correctIndex: 1 },
      { question: 'Luffy hangi Haki türünü burada gösterdi?', options: ['Kenbunshoku', 'Busoshoku', 'Haoshoku (Kral\'ın Hakisi)', 'Hiçbiri'], correctIndex: 2 },
      { question: 'Kuja Korsanları\'nın özelliği nedir?', options: ['Hepsi erkek', 'Hepsi kadın savaşçı', 'Balık-Adam', 'Dev'], correctIndex: 1 },
    ],
  },
  {
    arcSlug: 'impel-down',
    questions: [
      { question: 'Impel Down kaç seviyeden oluşur?', options: ['4', '5', '6', '7'], correctIndex: 2 },
      { question: 'Magellan\'ın Şeytan Meyvesi ne üretir?', options: ['Ateş', 'Buz', 'Zehir', 'Asit'], correctIndex: 2 },
      { question: 'Bon Clay (Mr. 2) Luffy için ne yaptı?', options: ['Savaştı', 'Kaçış kapısını açık tutmak için kendini feda etti', 'İhanet etti', 'Hiçbir şey'], correctIndex: 1 },
      { question: 'İvankov\'un Şeytan Meyvesi ne yapar?', options: ['Hormonları kontrol eder', 'Zaman durdurur', 'Klonlar', 'Teleportasyon'], correctIndex: 0 },
      { question: 'Blackbeard Impel Down\'a neden girdi?', options: ['Luffy\'yi durdurmak', 'Level 6 mahkumlarını almak', 'Magellan\'ı yenmek', 'Ace\'i görmek'], correctIndex: 1 },
    ],
  },
  {
    arcSlug: 'post-war',
    questions: [
      { question: 'Luffy "3D2Y" mesajıyla ne demek istedi?', options: ['3 gün 2 yıl', '3 gün değil 2 yıl sonra buluşalım', '3. adada 2. yılda', 'Koordinat'], correctIndex: 1 },
      { question: 'Luffy 2 yıl boyunca kimden eğitim aldı?', options: ['Garp', 'Shanks', 'Rayleigh', 'Dragon'], correctIndex: 2 },
      { question: 'Ace\'in ölümü Luffy\'yi nasıl etkiledi?', options: ['Hiç etkilemedi', 'Daha güçlü olmaya karar verdi', 'Korsanlığı bıraktı', 'İntikam yemini etti'], correctIndex: 1 },
      { question: 'Jinbe, Luffy\'ye ne hatırlattı?', options: ['One Piece\'i', 'Hâlâ sahip olduğu nakamalarını', 'Ace\'in son sözlerini', 'Shanks\'in sözünü'], correctIndex: 1 },
      { question: '2 yıllık eğitim nerede gerçekleşti?', options: ['Amazon Lily', 'Sabaody', 'Rusukaina Adası', 'Raftel'], correctIndex: 2 },
    ],
  },
  {
    arcSlug: 'return-to-sabaody',
    questions: [
      { question: 'Sahte Hasır Şapkalar\'ın lideri kimdi?', options: ['Buggy', 'Demalo Black', 'Foxy', 'Bellamy'], correctIndex: 1 },
      { question: 'Mürettebat kaç yıl sonra yeniden buluştu?', options: ['1 yıl', '2 yıl', '3 yıl', '5 yıl'], correctIndex: 1 },
      { question: 'Rayleigh gemiyi ne ile kaplamıştı?', options: ['Deniz taşı', 'Özel reçine ile (coating)', 'Altın', 'Çelik'], correctIndex: 1 },
      { question: 'Sahte Luffy\'nin gerçek Luffy\'den farkı neydi?', options: ['Daha uzundu', 'Şişman ve farklı görünümlüydü', 'Aynıydılar', 'Daha kısaydı'], correctIndex: 1 },
      { question: 'Mürettebat Sabaody\'den sonra nereye gitti?', options: ['Wano', 'Balık-Adam Adası', 'Punk Hazard', 'Dressrosa'], correctIndex: 1 },
    ],
  },
  {
    arcSlug: 'fish-man-island',
    questions: [
      { question: 'Hody Jones\'un asıl motivasyonu neydi?', options: ['Kişisel deneyim', 'Nesiller boyu aktarılan nefret', 'Para', 'Güç'], correctIndex: 1 },
      { question: 'Shirahoshi\'nin gerçek gücü nedir?', options: ['Şeytan Meyvesi', 'Poseidon - Deniz Krallarını çağırabilir', 'Haki', 'Savaşçı'], correctIndex: 1 },
      { question: 'Nuh gemisi ne için kullanılacak?', options: ['Savaş', 'Balık-Adamları taşımak', 'Hazine taşımak', 'Turizm'], correctIndex: 1 },
      { question: 'Jinbe Luffy\'ye ne teklif etti?', options: ['Hazine', 'İleride mürettebata katılmak', 'Ada', 'Silah'], correctIndex: 1 },
      { question: 'Luffy Balık-Adam Adası\'nda kaç kişiyi Haoshoku Haki ile bayılttı?', options: ['10,000', '30,000', '50,000', '100,000'], correctIndex: 2 },
    ],
  },
  {
    arcSlug: 'punk-hazard',
    questions: [
      { question: 'Caesar Clown ne üretiyordu?', options: ['Silah', 'SAD (yapay Zoan için)', 'Şeytan Meyvesi', 'Deniz taşı'], correctIndex: 1 },
      { question: 'Trafalgar Law Luffy\'ye ne teklif etti?', options: ['Dövüş', 'Korsan ittifakı', 'Hazine', 'Gemi'], correctIndex: 1 },
      { question: 'Punk Hazard\'da ne tür bir ejderha vardı?', options: ['Gerçek ejderha', 'Vegapunk\'un yapay ejderhası', 'Kaido', 'İllüzyon'], correctIndex: 1 },
      { question: 'Vergo kimdi?', options: ['Deniz Kuvvetleri ajanı', 'Doflamingo\'nun Deniz Kuvvetleri\'ndeki casusu', 'Devrimci', 'Korsan'], correctIndex: 1 },
      { question: 'Adanın yarısı ateş yarısı buz olmasının sebebi neydi?', options: ['Doğal afet', 'Akainu ve Aokiji\'nin savaşı', 'Caesar\'ın deneyi', 'Vegapunk\'un icadı'], correctIndex: 1 },
    ],
  },
  {
    arcSlug: 'dressrosa',
    questions: [
      { question: 'Doflamingo\'nun iplerle ne yapabiliyordu?', options: ['Sadece bağlamak', 'İnsanları kukla gibi kontrol etmek ve daha fazlası', 'Sadece kesmek', 'Sadece uçmak'], correctIndex: 1 },
      { question: 'Sabo\'nun yediği Şeytan Meyvesi nedir?', options: ['Gomu Gomu no Mi', 'Ope Ope no Mi', 'Mera Mera no Mi', 'Gura Gura no Mi'], correctIndex: 2 },
      { question: 'Luffy Gear 4\'ü ilk kez kime karşı kullandı?', options: ['Bellamy', 'Doflamingo', 'Fujitora', 'Burgess'], correctIndex: 1 },
      { question: 'Sugar\'ın Şeytan Meyvesi ne yapıyordu?', options: ['İnsanları taşa çeviriyordu', 'İnsanları oyuncağa çeviriyordu', 'İnsanları küçültüyordu', 'İnsanları donduruyordu'], correctIndex: 1 },
      { question: 'Dressrosa\'da Luffy\'ye yardım eden filo ne oldu?', options: ['Dağıldı', 'Hasır Şapka Büyük Filosu kuruldu', 'Deniz Kuvvetleri\'ne katıldı', 'Hiçbir şey'], correctIndex: 1 },
    ],
  },
  {
    arcSlug: 'zou',
    questions: [
      { question: 'Zou nedir?', options: ['Bir ada', 'Devasa bir filin sırtındaki medeniyet', 'Bir gemi', 'Denizaltı şehri'], correctIndex: 1 },
      { question: 'Mink kabilesinin özel savaş gücü nedir?', options: ['Haki', 'Electro (Sulong formunda güçlenir)', 'Şeytan Meyvesi', 'Silah ustalığı'], correctIndex: 1 },
      { question: 'Jack Zou\'ya neden saldırdı?', options: ['Hazine için', 'Raizo\'yu bulmak için', 'Luffy\'yi yakalamak için', 'Kaido\'nun emri dışında'], correctIndex: 1 },
      { question: 'Ninja-Korsan-Mink ittifakının hedefi neydi?', options: ['One Piece\'i bulmak', 'Kaido\'yu devirmek', 'Deniz Kuvvetleri\'ni yenmek', 'Blackbeard\'ı durdurmak'], correctIndex: 1 },
      { question: 'Road Poneglyph ne işe yarar?', options: ['Tarih anlatır', 'Silah yerini gösterir', 'Laugh Tale\'in yerini bulmak için gerekli', 'Şeytan Meyvesi sırrı'], correctIndex: 2 },
    ],
  },
  {
    arcSlug: 'whole-cake-island',
    questions: [
      { question: 'Sanji\'nin soyadı nedir?', options: ['Monkey', 'Portgas', 'Vinsmoke', 'Donquixote'], correctIndex: 2 },
      { question: 'Big Mom\'un Şeytan Meyvesi ne yapıyor?', options: ['Ruhları manipüle eder (Soru Soru no Mi)', 'Ateş çıkarır', 'Dev yapar', 'Yıldırım düşürür'], correctIndex: 0 },
      { question: 'Katakuri\'nin özel Haki yeteneği neydi?', options: ['Busoshoku', 'İleri seviye Kenbunshoku (geleceği görme)', 'Haoshoku', 'Hiçbiri'], correctIndex: 1 },
      { question: 'Sanji düğüne neden gitmek zorundaydı?', options: ['Aşık olduğu için', 'Ailesini ve Zeff\'i korumak için', 'Big Mom\'a katılmak için', 'Yemek yapmak için'], correctIndex: 1 },
      { question: 'Luffy Katakuri\'yi yendikten sonra ne oldu?', options: ['Big Mom\'u da yendi', 'Zar zor kaçtılar', 'Ada battı', 'İttifak kurdular'], correctIndex: 1 },
    ],
  },
  {
    arcSlug: 'reverie',
    questions: [
      { question: 'İm-sama nedir?', options: ['Bir amiral', 'Dünya Hükümeti\'nin gizli hükümdarı', 'Yonko', 'Devrimci lider'], correctIndex: 1 },
      { question: 'Reverie sırasında Sabo ne yaptı?', options: ['Kaçtı', 'Cobra olayına karıştı (suçlandı)', 'İm-sama\'yı yendi', 'Hiçbir şey'], correctIndex: 1 },
      { question: 'Shichibukai sistemi ne oldu?', options: ['Devam etti', 'Kaldırıldı', 'Genişletildi', 'Değiştirildi'], correctIndex: 1 },
      { question: 'Vivi Reverie\'de ne yaşadı?', options: ['Normal katılım', 'Babası Cobra öldürüldü', 'Korsanlara katıldı', 'Tutsak edildi'], correctIndex: 1 },
      { question: 'İm-sama\'nın oturduğu tahtın adı nedir?', options: ['Demir Taht', 'Boş Taht (Empty Throne)', 'Altın Taht', 'Deniz Tahtı'], correctIndex: 1 },
    ],
  },
  {
    arcSlug: 'egghead',
    questions: [
      { question: 'Vegapunk kaç "Satellite" (uydu kişilik) yarattı?', options: ['4', '5', '6', '7'], correctIndex: 2 },
      { question: 'Seraphim\'ler nedir?', options: ['Robotlar', 'Eski Shichibukai\'nin klonlanmış çocuk versiyonları', 'Şeytan Meyvesi kullanıcıları', 'Cyborg\'lar'], correctIndex: 1 },
      { question: 'Kuma\'nın geçmişinde hangi trajedi yaşandı?', options: ['Ailesi öldürüldü', 'Buccaneer ırkından olup köle yapıldı ve Bonney\'den ayrıldı', 'Hafızasını kaybetti', 'Denize düştü'], correctIndex: 1 },
      { question: 'Vegapunk\'un dünyaya yayınladığı mesaj ne hakkındaydı?', options: ['Silah yapımı', 'Void Century gerçekleri ve dünyanın batacağı', 'Şeytan Meyvesi sırları', 'Korsanların sonu'], correctIndex: 1 },
      { question: 'Egghead\'e hangi Gorosei üyesi geldi?', options: ['Sadece biri', 'Hiçbiri', 'Hepsi (beşi de)', 'İkisi'], correctIndex: 2 },
    ],
  },
]

export function getQuizByArcSlug(slug: string): ArcQuiz | undefined {
  return QUIZZES.find((q) => q.arcSlug === slug)
}
