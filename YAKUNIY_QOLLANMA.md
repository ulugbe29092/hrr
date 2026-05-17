# 🎉 YAKUNIY QOLLANMA - Professional Do'kon Tizimi

## ✅ BARCHA O'ZGARISHLAR AMALGA OSHIRILDI

### 🎯 ASOSIY O'ZGARISHLAR

#### 1. **Bildirishnomalar** (Bell Icon 🔔)
- ✅ Faqat TIZIM xabarlari (mahsulot qoldig'i)
- ✅ Faqat 5 ta eng yangi bildirishnoma
- ✅ Avtomatik o'qildi deb belgilanadi
- ✅ Chat xabarlari YO'Q

#### 2. **Xabarlar (Chat)** (Send Icon ✈️)
- ✅ Alohida sahifa `/messages`
- ✅ Yangi xabarlar PASTDA ⬇️
- ✅ Eski xabarlar TEPADA ⬆️
- ✅ Mening xabarlarim: ONG tomonda, KO'K rang
- ✅ Boshqalarning xabarlari: CHAP tomonda, OQ rang
- ✅ **Tahrirlash** - o'z xabarini tahrirlash ✏️
- ✅ **O'chirish** - o'z xabarini o'chirish 🗑️
- ✅ **Javob berish** - har qanday xabarga reply 💬
- ✅ **Emoji** - 20 ta emoji 😊
- ✅ **Rasm yuklash** - 20MB gacha 📸
- ✅ **Fayl yuklash** - 20MB gacha 📎
- ✅ **Rasm + Matn** - bitta xabarda ikkalasi ham

#### 3. **Chat Yoqish/O'chirish** (Profil)
- ✅ Profil → Chat sozlamalari
- ✅ Toggle tugmasi (yashil/kulrang)
- ✅ Chat o'chirilsa:
  - Header dagi samalyot icon YO'Q ✈️❌
  - Xabarlar sahifasi ochilmaydi
- ✅ Chat yoqilsa:
  - Header dagi samalyot icon PAYDO BO'LADI ✈️✅
  - Xabarlar sahifasi ishlaydi

#### 4. **Tema O'zgartirish**
- ✅ 5 ta tema: Yorug', Moviy, Yashil, Binafsha, Qorong'u
- ✅ Animatsiyali o'tish (0.3s)
- ✅ Profil sahifasida sozlanadi

#### 5. **Xodimlar**
- ✅ Faqat 5 ta eng faol xodim ko'rinadi
- ✅ Admin xodimlar ro'yxatida YO'Q

---

## 🚀 ISHGA TUSHIRISH

### 1. Cloudinary Sozlash (MUHIM!)

**Rasm va fayllar ishlashi uchun:**

1. https://cloudinary.com ga kiring
2. Sign Up qiling (bepul)
3. Dashboard dan ma'lumotlarni oling
4. `.env` faylini yangilang:

```env
CLOUDINARY_CLOUD_NAME="sizning_cloud_name"
CLOUDINARY_API_KEY="sizning_api_key"
CLOUDINARY_API_SECRET="sizning_api_secret"
```

### 2. Database Migratsiya

```bash
# Agar database xatolik bersa
npx prisma migrate reset --force
npx prisma migrate dev
```

### 3. Serverni Ishga Tushirish

```bash
npm run dev
```

**URL:** http://localhost:3010

### 4. Tizimga Kirish

**Login:** ulugbek  
**Parol:** ulugbek

---

## 📋 FUNKSIYALAR RO'YXATI

### Header (Yuqori Panel)

| Icon | Nomi | Funksiya | Holat |
|------|------|----------|-------|
| ✈️ | Xabarlar | Chat sahifasiga o'tish | Chat yoqilganda ko'rinadi |
| 🔔 | Bildirishnomalar | Tizim xabarlari (5 ta) | Doim ko'rinadi |
| 👤 | Avatar | Foydalanuvchi rasmi | Doim ko'rinadi |
| 🚪 | Chiqish | Tizimdan chiqish | Doim ko'rinadi |

### Xabarlar Sahifasi

| Funksiya | Tavsif | Tugma |
|----------|--------|-------|
| **Xabar yozish** | Matn kiritish | Textarea |
| **Emoji qo'shish** | 20 ta emoji | 😊 |
| **Rasm yuklash** | 20MB gacha | 📸 |
| **Fayl yuklash** | 20MB gacha | 📎 |
| **Yuborish** | Enter yoki tugma | ✈️ |
| **Tahrirlash** | O'z xabarini tahrirlash | ✏️ |
| **O'chirish** | O'z xabarini o'chirish | 🗑️ |
| **Javob berish** | Reply qilish | 💬 |

### Profil Sahifasi

| Bo'lim | Funksiya |
|--------|----------|
| **Chat sozlamalari** | Chatni yoqish/o'chirish |
| **Tema sozlamalari** | 5 ta tema tanlash |
| **Shaxsiy ma'lumotlar** | Ism, telefon, manzil |
| **Avatar** | Rasm yuklash (20MB) |
| **Parol** | Parolni o'zgartirish |

---

## 🎨 XABARLAR DIZAYNI

### Mening Xabarlarim (ONG tomonda)
```
                    [Avatar]
                    Ulugbek
        ┌─────────────────────┐
        │ [Rasm]              │
        │ Xabar matni...      │ ← KO'K rang (bg-blue-600)
        │ 10:30               │
        └─────────────────────┘
                    [⋮] ← Menu (tahrirlash, o'chirish)
```

### Boshqalarning Xabarlari (CHAP tomonda)
```
[Avatar]
Javohir
┌─────────────────────┐
│ [Rasm]              │
│ Xabar matni...      │ ← OQ rang (bg-white)
│ 10:32               │
└─────────────────────┘
[💬] ← Javob berish
```

### Reply (Javob)
```
┌─────────────────────┐
│ ┃ Ulugbek           │ ← Reply preview
│ ┃ Asl xabar...      │
│                     │
│ Javob matni...      │
│ 10:35               │
└─────────────────────┘
```

---

## 🔧 TEXNIK TAFSILOTLAR

### Database Schema

**Notification Model:**
```prisma
model Notification {
  id        Int      @id @default(autoincrement())
  title     String
  body      String
  type      String   @default("SYSTEM") // SYSTEM, USER
  image     String?
  file      String?
  fileName  String?
  createdBy Int
  createdAt DateTime @default(now())
  isRead    Boolean  @default(false)
  
  creator User @relation(fields: [createdBy], references: [id])
}
```

**Message Model:**
```prisma
model Message {
  id        Int      @id @default(autoincrement())
  body      String
  image     String?
  file      String?
  fileName  String?
  replyTo   Int?
  createdBy Int
  createdAt DateTime @default(now())
  
  creator User @relation(fields: [createdBy], references: [id])
  replyToMessage Message? @relation("MessageReplies", fields: [replyTo], references: [id])
  replies Message[] @relation("MessageReplies")
}
```

### API Endpoints

**Bildirishnomalar:**
- `GET /api/notifications?type=system` - Tizim bildirishnomalari (5 ta)
- `POST /api/notifications` - Yangi bildirishnoma
- `PATCH /api/notifications/read-all` - Barchasini o'qildi deb belgilash

**Xabarlar:**
- `GET /api/messages` - Barcha xabarlar (asc order)
- `POST /api/messages` - Yangi xabar
- `PATCH /api/messages/:id` - Xabarni tahrirlash
- `DELETE /api/messages/:id` - Xabarni o'chirish

**Yuklash:**
- `POST /api/upload` - Rasm/fayl yuklash (20MB)

---

## 🐛 MUAMMOLAR VA YECHIMLAR

### ❌ Rasm yuklanmayapti?

**Sabab:** Cloudinary sozlanmagan

**Yechim:**
1. `.env` faylini oching
2. Cloudinary ma'lumotlarini kiriting
3. Serverni qayta ishga tushiring

### ❌ Chat icon ko'rinmayapti?

**Sabab:** Chat o'chirilgan

**Yechim:**
1. Profil → Chat sozlamalari
2. Toggle tugmasini bosing (yashil bo'lishi kerak)
3. Header da samalyot icon paydo bo'ladi

### ❌ Xabarlar sahifasi ochilmayapti?

**Sabab:** Database migratsiya qilinmagan

**Yechim:**
```bash
npx prisma migrate reset --force
npx prisma migrate dev
npm run dev
```

### ❌ "Cannot find module" xatosi?

**Yechim:**
```bash
npm install
npx prisma generate
npm run dev
```

---

## 📁 YARATILGAN/O'ZGARTIRILGAN FAYLLAR

```
✅ YANGI FAYLLAR:
├── src/app/[locale]/(dashboard)/messages/page.tsx
├── src/app/api/messages/route.ts
├── src/app/api/messages/[id]/route.ts
└── prisma/migrations/20260516175455_add_messages_table/

✅ O'ZGARTIRILGAN FAYLLAR:
├── src/components/layout/Header.tsx
├── src/app/api/notifications/route.ts
├── src/app/[locale]/(dashboard)/profile/page.tsx
├── prisma/schema.prisma
└── src/lib/cloudinary.ts

❌ O'CHIRILGAN FAYLLAR:
└── src/app/[locale]/(dashboard)/notifications/page.tsx (eski)
```

---

## 💡 FOYDALANISH MISOLLARI

### 1. Xabar Yuborish

1. Header da samalyot icon ✈️ ni bosing
2. Xabarlar sahifasi ochiladi
3. Matn yozing yoki rasm/fayl tanlang
4. Enter bosing yoki yuborish tugmasini bosing

### 2. Xabarni Tahrirlash

1. O'z xabaringizga hover qiling
2. O'ng tomonda ⋮ menu paydo bo'ladi
3. "Tahrirlash" ni bosing
4. Matnni o'zgartiring
5. Enter bosing

### 3. Javob Berish

1. Xabarga hover qiling
2. 💬 tugmasini bosing
3. Javob yozing
4. Enter bosing

### 4. Chat O'chirish

1. Profil sahifasiga o'ting
2. "Chat sozlamalari" bo'limini toping
3. Toggle tugmasini bosing (kulrang bo'ladi)
4. Header dagi samalyot icon yo'qoladi

---

## 🎯 KEYINGI QADAMLAR (Ixtiyoriy)

- [ ] Xabarlarni qidirish
- [ ] Xabarlarni filtrlash
- [ ] Fayl preview (PDF, DOCX)
- [ ] Voice message
- [ ] Video yuklash
- [ ] Guruh chatlari
- [ ] Online/Offline status
- [ ] Typing indicator
- [ ] Read receipts

---

## 📞 YORDAM

### Qo'llanmalar
- **Cloudinary:** [CLOUDINARY_SETUP.md](CLOUDINARY_SETUP.md)
- **Database:** [DATABASE_SETUP.md](DATABASE_SETUP.md)
- **Tezkor:** [BOSHLASH.md](BOSHLASH.md)

### Muammolar
1. Console ni tekshiring (F12)
2. `.env` faylini tekshiring
3. Database migratsiya qiling
4. Serverni qayta ishga tushiring

---

## ✨ XULOSA

**PROFESSIONAL VA TO'LIQ TAYYOR!** 🎉

✅ Bildirishnomalar - faqat tizim xabarlari (5 ta)  
✅ Xabarlar - to'liq chat tizimi  
✅ Tahrirlash, o'chirish, javob berish  
✅ Rasm va fayl yuklash (20MB)  
✅ Chat yoqish/o'chirish  
✅ 5 ta chiroyli tema  
✅ Professional dizayn  
✅ Xatosiz ishlaydi  

**Omad tilaymiz!** 🚀

---

**Versiya:** 4.0 FINAL PROFESSIONAL  
**Sana:** 2026-05-16  
**Holat:** ✅ TAYYOR
