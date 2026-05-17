# Xabarlar Tizimi (Chat System) - To'liq Qo'llanma

## ✅ Amalga Oshirilgan Funksiyalar

### 1. **Bildirishnomalar va Xabarlar Ajratildi**

#### Bildirishnomalar (🔔 Qo'ng'iroq belgisi)
- **Faqat tizim bildirshnomalari** ko'rsatiladi
- Masalan: "Tovar qoldig'i kam" kabi ogohlantirishlar
- Maksimal **5 ta** bildirishnoma ko'rsatiladi
- Turi: `type='SYSTEM'`

#### Xabarlar (✈️ Samalyot belgisi)
- **To'liq chat tizimi** alohida sahifada: `/messages`
- Barcha foydalanuvchi xabarlari
- Yangi xabarlar **pastda**, eski xabarlar **tepada**
- Mening xabarlarim: **O'ng tomonda**, **ko'k fon** (bg-blue-600)
- Boshqalarning xabarlari: **Chap tomonda**, **oq fon** (bg-white)

---

### 2. **Xabar Yuborish Funksiyalari**

#### Matn Xabarlari
- Enter = yuborish
- Shift+Enter = yangi qator
- Emoji qo'shish: 😊 👍 ❤️ 🎉 🔥 ✅ va boshqalar

#### Rasm Yuborish
- **KATTA** rasm ko'rinadi (max-h-96, to'liq kenglik)
- Rasmni bosish = yangi oynada to'liq hajmda ochiladi
- Maksimal hajm: **20MB**
- Faqat rasm formatlar: JPG, PNG, GIF, va boshqalar

#### Fayl Yuborish
- Har qanday fayl turi
- Maksimal hajm: **20MB**
- Fayl nomi va yuklab olish tugmasi ko'rsatiladi

#### ⚠️ MUHIM: Faqat BITTA Qo'shimcha
- **Bir xabarda faqat BITTA qo'shimcha** yuboriladi
- Agar rasm tanlasangiz → fayl tozalanadi
- Agar fayl tanlasangiz → rasm tozalanadi
- Rasm **YOKI** fayl, ikkalasi emas!

---

### 3. **Xabar Boshqaruvi**

#### Chatni To'liq Tozalash
- Headerda **"Chatni tozalash"** tugmasi (qizil rang, chiqindi belgisi 🗑️)
- Bosilganda barcha xabarlar o'chiriladi
- Tasdiqlash oynasi: "Barcha xabarlarni o'chirmoqchimisiz? Bu amalni qaytarib bo'lmaydi!"
- Xabarlar bo'lmasa tugma disabled

#### Har Bir Xabarga Menyu
- Xabar ustiga hover qiling → **3 nuqta tugmasi** paydo bo'ladi
- Mening xabarlarim: o'ng tomonda
- Boshqalarning xabarlari: chap tomonda
- Menyu ochiladi:
  - **😊 Emoji qo'shish** - xabarga emoji qo'shadi
  - **↩️ Javob berish** - xabarga javob yozish
  - **✏️ Tahrirlash** - faqat o'z xabarlarim uchun
  - **🗑️ O'chirish** - faqat o'z xabarlarim uchun

#### Emoji Qo'shish
- Menyu → "Emoji qo'shish" ni bosing
- Emoji picker ochiladi
- Emoji tanlang → xabar matni oxiriga qo'shiladi
- 20 ta emoji: 😊 👍 ❤️ 🎉 🔥 ✅ ⚠️ 📌 💡 🚀 👏 🙏 💪 🎯 📝 📊 💰 🏆 ⭐ ✨

#### Tahrirlash (Edit)
- Faqat o'z xabarlaringizni tahrirlash mumkin
- Xabar ustiga hover qiling → 3 nuqta tugmasi paydo bo'ladi
- "Tahrirlash" tugmasini bosing
- Matnni o'zgartiring va yuborish tugmasini bosing

#### O'chirish (Delete)
- Faqat o'z xabarlaringizni o'chirish mumkin
- Xabar ustiga hover qiling → 3 nuqta tugmasi
- "O'chirish" tugmasini bosing
- Tasdiqlash oynasi paydo bo'ladi

#### Javob Berish (Reply)
- Har qanday xabarga javob berish mumkin
- Xabar ustiga hover qiling → javob tugmasi
- Asl xabar ko'rsatiladi, keyin javobingizni yozing

---

### 4. **O'qilganlik Belgilari (Read Receipts)**

Faqat **mening xabarlarimda** ko'rsatiladi:

- **✓** (1 ta belgi) = Yuborildi, hali o'qilmagan
- **✓✓** (2 ta belgi) = O'qildi

Boshqalar xabarni ochganda avtomatik ravishda "o'qildi" deb belgilanadi.

---

### 5. **Chatni Yoqish/O'chirish**

#### Profil Sahifasida
- **Profil** sahifasiga o'ting
- **"Chat"** bo'limida toggle tugmasi bor
- **Yoqilgan** = ✈️ samalyot belgisi headerda ko'rinadi
- **O'chirilgan** = ✈️ samalyot belgisi butunlay yo'qoladi

#### Sozlamalar
- Holat `localStorage` da saqlanadi
- Sahifani yangilasangiz ham sozlama saqlanadi

---

### 6. **Fayllar Saqlash**

#### Local Storage (Mahalliy Saqlash)
- Barcha rasmlar va fayllar `/public/uploads` papkasida saqlanadi
- Cloudinary kerak emas
- Avtomatik ravishda papka yaratiladi
- Fayl nomlari: `timestamp-original_name.ext`

#### Xavfsizlik
- Faqat tizimga kirgan foydalanuvchilar yuklashi mumkin
- Maksimal hajm: 20MB
- Noto'g'ri fayl nomlari tozalanadi

---

### 7. **Interfeys Xususiyatlari**

#### Header (Yuqori Qism)
- **Qattiq** (fixed) - scroll qilganda ham ko'rinadi
- Xabarlar soni ko'rsatiladi
- Chiroyli dizayn

#### Xabarlar Ro'yxati
- **Scroll** qilinadi
- Yangi xabarlar **pastda**
- Eski xabarlar **tepada**
- Avtomatik ravishda eng oxirgi xabarga scroll qiladi

#### Xabar Yozish Maydoni
- **Qattiq** (fixed) - scroll qilganda ham ko'rinadi
- Emoji tanlash
- Rasm yuklash
- Fayl yuklash
- Matn yozish
- Yuborish tugmasi

#### Animatsiyalar
- Xabarlar paydo bo'lishi: `animate-fadeIn`
- Tugmalar hover: rang o'zgarishi
- Silliq o'tishlar: `transition-colors`, `transition-opacity`

---

### 8. **Texnik Ma'lumotlar**

#### Texnologiyalar
- **Next.js 14** - Framework
- **TypeScript** - Dasturlash tili
- **Tailwind CSS** - Dizayn
- **Prisma** - Database ORM
- **SQLite** - Database
- **NextAuth.js** - Autentifikatsiya

#### Database Schema
```prisma
model Message {
  id        Int      @id @default(autoincrement())
  body      String
  image     String?
  file      String?
  fileName  String?
  createdAt DateTime @default(now())
  createdBy Int
  replyTo   Int?
  seenBy    String   @default("")
  
  creator   User     @relation(fields: [createdBy], references: [id])
  replyToMessage Message? @relation("MessageReplies", fields: [replyTo], references: [id])
  replies   Message[] @relation("MessageReplies")
}
```

#### API Endpoints
- `GET /api/messages` - Barcha xabarlarni olish
- `POST /api/messages` - Yangi xabar yuborish
- `PATCH /api/messages/[id]` - Xabarni tahrirlash
- `DELETE /api/messages/[id]` - Xabarni o'chirish
- `PATCH /api/messages/[id]/seen` - Xabarni o'qilgan deb belgilash
- `POST /api/upload` - Rasm/fayl yuklash

---

### 9. **Foydalanish Qo'llanmasi**

#### Xabar Yuborish
1. `/messages` sahifasiga o'ting
2. Pastdagi matn maydoniga xabar yozing
3. (Ixtiyoriy) Emoji, rasm yoki fayl qo'shing
4. Enter bosing yoki yuborish tugmasini bosing

#### Chatni Tozalash
1. Headerda "Chatni tozalash" tugmasini bosing
2. Tasdiqlash oynasida "OK" ni bosing
3. Barcha xabarlar o'chiriladi

#### Xabarga Emoji Qo'shish
1. Xabar ustiga hover qiling
2. 3 nuqta tugmasini bosing
3. "Emoji qo'shish" ni tanlang
4. Emoji tanlang
5. Emoji xabar oxiriga qo'shiladi

#### Rasm Yuborish
1. 📷 Rasm belgisini bosing
2. Rasmni tanlang (maksimal 20MB)
3. Preview ko'rinadi
4. Xabar yozing (ixtiyoriy)
5. Yuborish tugmasini bosing

#### Fayl Yuborish
1. 📎 Qog'oz qisqich belgisini bosing
2. Faylni tanlang (maksimal 20MB)
3. Fayl nomi ko'rinadi
4. Xabar yozing (ixtiyoriy)
5. Yuborish tugmasini bosing

#### Xabarni Tahrirlash
1. O'z xabaringiz ustiga hover qiling
2. 3 nuqta tugmasini bosing
3. "Tahrirlash" ni tanlang
4. Matnni o'zgartiring
5. Yuborish tugmasini bosing

#### Xabarni O'chirish
1. O'z xabaringiz ustiga hover qiling
2. 3 nuqta tugmasini bosing
3. "O'chirish" ni tanlang
4. Tasdiqlash oynasida "Ha" ni bosing

#### Javob Berish
1. Xabar ustiga hover qiling
2. Javob tugmasini bosing (↩️)
3. Asl xabar ko'rsatiladi
4. Javobingizni yozing va yuboring

---

### 10. **Muammolarni Hal Qilish**

#### Rasmlar Ko'rinmayapti
- ✅ **Hal qilindi**: Middleware `/uploads` yo'lini exclude qiladi
- Rasmlar endi to'g'ri ko'rsatiladi

#### Rasm va Fayl Bir Vaqtda Yuboriladi
- ✅ **Hal qilindi**: Faqat bitta qo'shimcha yuborish mumkin
- Rasm tanlasangiz → fayl tozalanadi
- Fayl tanlasangiz → rasm tozalanadi

#### Chat Belgisi Ko'rinmayapti
- Profil sahifasiga o'ting
- "Chat" bo'limida toggle tugmasini yoqing
- ✈️ belgisi headerda paydo bo'ladi

#### Xabar Yuborilmayapti
- Internet aloqasini tekshiring
- Tizimga kirganingizni tekshiring
- Xabar yoki qo'shimcha mavjudligini tekshiring

---

### 11. **Kelajakda Qo'shilishi Mumkin**

- [ ] Xabar qidirish
- [ ] Xabarlarni filtrlash (faqat rasmlar, faqat fayllar)
- [ ] Guruh chatlari
- [ ] Shaxsiy chatlar (1-1)
- [ ] Ovozli xabarlar
- [ ] Video xabarlar
- [ ] Xabarni forward qilish
- [ ] Xabarni pin qilish
- [ ] Typing indicator (yozayapti...)
- [ ] Online/offline status
- [ ] Emoji reactions (xabarga emoji bosish)

---

## 🎯 Xulosa

Xabarlar tizimi to'liq ishlamoqda va professional darajada amalga oshirilgan:

✅ Bildirishnomalar va xabarlar ajratildi
✅ Rasmlar KATTA ko'rinadi va bosilsa to'liq ochiladi
✅ Faqat BITTA qo'shimcha (rasm YOKI fayl)
✅ Tahrirlash, o'chirish, javob berish
✅ **Chatni to'liq tozalash tugmasi**
✅ **Har bir xabarga menyu (emoji, javob, tahrirlash, o'chirish)**
✅ **Xabarga emoji qo'shish funksiyasi**
✅ O'qilganlik belgilari (✓ va ✓✓)
✅ Chatni yoqish/o'chirish
✅ Local storage (Cloudinary kerak emas)
✅ Professional dizayn va animatsiyalar
✅ Xatosiz ishlaydi

**Server:** http://localhost:3010
**Login:** ulugbek / ulugbek
**Xabarlar sahifasi:** http://localhost:3010/uz/messages

---

**Yaratildi:** 2026-05-16
**Versiya:** 1.0.0
**Holat:** ✅ Tayyor va ishlamoqda
