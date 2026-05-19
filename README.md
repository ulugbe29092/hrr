# 🏪 Do'kon Tizimi - Professional Shop Management System

Professional do'kon boshqaruv tizimi - Next.js 14, TypeScript, Prisma, SQLite

## ✨ Asosiy Funksiyalar

- ✅ **Autentifikatsiya** - NextAuth.js bilan xavfsiz kirish
- ✅ **Mahsulotlar** - CRUD operatsiyalar, rasm yuklash (20MB)
- ✅ **Tranzaksiyalar** - Kirim/Chiqim boshqaruvi
- ✅ **Xodimlar** - Davomat va statistika (kirim/chiqim tracking)
- ✅ **Xabarlar** - Real-time chat tizimi
- ✅ **Hisobotlar** - PDF/Excel export (Statistika va Xodimlar)
- ✅ **Statistika** - Kunlik/Haftalik/Oylik/Yillik
- ✅ **Tema** - 20 ta chiroyli tema
- ✅ **Ko'p til** - O'zbek, Rus, Ingliz
- ✅ **Turbopack** - Tezkor development (3-4 soniya compilation)

## 🚀 Tezkor Boshlash

### 1. Cloudinary Sozlash (2 daqiqa)
```bash
# 1. https://cloudinary.com ga kiring va ro'yxatdan o'ting (bepul)
# 2. Dashboard dan ma'lumotlarni oling:
#    - Cloud Name
#    - API Key
#    - API Secret
# 3. .env faylini yangilang
```

**`.env` fayliga qo'shing:**
```env
CLOUDINARY_CLOUD_NAME="sizning_cloud_name"
CLOUDINARY_API_KEY="sizning_api_key"
CLOUDINARY_API_SECRET="sizning_api_secret"
```

### 2. Serverni Ishga Tushirish (1 daqiqa)
```bash
npm install
npm run dev
```

### 3. Tizimga Kirish (1 daqiqa)
- **URL:** http://localhost:3010
- **Login:** ulugbek
- **Parol:** ulugbek

## 📖 Qo'llanmalar

- **[BOSHLASH.md](BOSHLASH.md)** - 3 qadam, 5 daqiqa ⚡
- **[OXIRGI_QOLLANMA.md](OXIRGI_QOLLANMA.md)** - To'liq qo'llanma 📚
- **[CLOUDINARY_SETUP.md](CLOUDINARY_SETUP.md)** - Rasm yuklash sozlamalari 📸
- **[YANGILANISHLAR.md](YANGILANISHLAR.md)** - Barcha o'zgarishlar 🔄

## 🛠️ Texnologiyalar

- **Frontend:** Next.js 14 (App Router), TypeScript, Tailwind CSS
- **Backend:** Next.js API Routes
- **Database:** SQLite + Prisma ORM
- **Auth:** NextAuth.js (JWT)
- **Upload:** Cloudinary (20MB limit)
- **Export:** jsPDF, xlsx
- **Icons:** Lucide React

## 📋 Rollar va Huquqlar

| Rol | Mahsulotlar | Tranzaksiyalar | Xodimlar | Hisobotlar | Sozlamalar |
|-----|-------------|----------------|----------|------------|------------|
| **ADMIN** | ✅ | ✅ | ✅ | ✅ | ✅ |
| **BOSHLIQ** | ✅ | ✅ | ✅ | ✅ | ❌ |
| **SOTUVCHI** | ✅ | ✅ | ❌ | ❌ | ❌ |
| **OMBORCHI** | ✅ | ✅ | ❌ | ❌ | ❌ |

## 🎨 Yangi Funksiyalar (v4.0)

### 1. Xodimlar Statistikasi (Dashboard)
**Qayerda:** Bosh sahifa → Xodimlar statistikasi

Har bir xodim uchun:
- ↑ Kirim tranzaksiyalari soni (yashil)
- ↓ Chiqim tranzaksiyalari soni (qizil)
- Σ Jami tranzaksiyalar (ko'k)
- Avatar yoki bosh harf
- Chiroyli gradient dizayn

### 2. PDF/Excel Export
**Statistika sahifasi:**
- Excel (CSV) tugmasi - barcha statistika
- PDF tugmasi - chiroyli hisobot

**Xodimlar sahifasi:**
- Excel (CSV) tugmasi - xodimlar ro'yxati
- PDF tugmasi - xodimlar hisoboti

### 3. Turbopack (Tezkor Development)
- 3-4 soniya compilation
- Tezkor hot reload
- Optimallashtirilgan build

### 4. Performance Optimizations
- Xabarlar: Auto-refresh o'chirildi (faqat action'lardan keyin)
- Dashboard: Parallel API calls
- API: Try-catch error handling
- React Strict Mode o'chirildi (ikki marta render yo'q)

### 5. Tema O'zgartirish (20 ta tema)
**Qayerda:** Profil → Tema sozlamalari

20 ta chiroyli tema:
- 🌞 Yorug', 🔵 Moviy, 🟢 Yashil, 🟣 Binafsha, 🌙 Qorong'u
- 🔴 Qizil, 🟠 To'q sariq, 🟡 Sariq, 🟢 Yashil limon, 🔵 Ko'k
- 🔵 Osmon, 🟣 Indigo, 🟣 Binafsha, 🌸 Pushti, 🌹 Atirgul
- ⚫ Slate, ⚫ Kulrang, ⚫ Rux, 🟤 Tosh

### 6. Chat Yoqish/O'chirish
**Qayerda:** Profil → Chat sozlamalari

Toggle tugmasi bilan chatni butunlay yoqish/o'chirish
### 7. Rasm va Fayl Yuklash
- 20MB gacha rasm (JPG, PNG, GIF)
- 20MB gacha fayllar (PDF, DOCX, XLSX, va boshqalar)
- Cloudinary orqali xavfsiz saqlash

### 8. Xabarlar Sahifasi
- Yangi xabarlar pastda
- Eski xabarlar tepada
- Mening xabarlarim: ong tomonda, ko'k rang
- Boshqalarning xabarlari: chap tomonda, oq rang
- Enter = yuborish, Shift+Enter = yangi qator
- Emoji picker (20 ta emoji)

## 🐛 Muammolar va Yechimlar

### Rasm yuklanmayapti?
**Yechim:** Cloudinary sozlanmagan. `CLOUDINARY_SETUP.md` ni o'qing.

### Port 3010 band?
```bash
# Windows
netstat -ano | findstr :3010
taskkill /PID <PID_RAQAMI> /F
```

### Tema o'zgarishlar ko'rinmayapti?
**Yechim:** Sahifani yangilang (F5) yoki browser cache ni tozalang.

## 📁 Loyiha Strukturasi

```
dokon-tizimi/
├── src/
│   ├── app/
│   │   ├── [locale]/
│   │   │   ├── (auth)/          # Login sahifasi
│   │   │   └── (dashboard)/     # Asosiy sahifalar
│   │   └── api/                 # API routes
│   ├── components/
│   │   ├── layout/              # Header, Sidebar
│   │   └── ui/                  # Button, Input, Modal
│   ├── lib/                     # Utilities
│   └── hooks/                   # Custom hooks
├── prisma/
│   ├── schema.prisma            # Database schema
│   └── dev.db                   # SQLite database
├── messages/                    # Translations
└── public/                      # Static files
```

## 🔒 Xavfsizlik

- ✅ NextAuth.js JWT autentifikatsiya
- ✅ Parollar bcrypt bilan shifrlangan
- ✅ API routes himoyalangan
- ✅ Role-based access control (RBAC)
- ✅ `.env` faylida maxfiy ma'lumotlar

## 📊 Statistika

Tizim quyidagi statistikalarni ko'rsatadi:
- Kunlik/Haftalik/Oylik/Yillik sotuvlar
- Foiz o'zgarishlar (oldingi davr bilan taqqoslash)
- Xodimlar statistikasi (kirim/chiqim soni)
- Mahsulotlar qoldig'i
- Avtomatik bildirishnomalar (0, 5, 10 ta qolganda)

## 🌐 Ko'p Til

3 ta til qo'llab-quvvatlanadi:
- 🇺🇿 O'zbek (standart)
- 🇷🇺 Rus
- 🇬🇧 Ingliz

Til o'zgartirish: Header → Til tanlash

## 📞 Yordam va Qo'llab-quvvatlash

### Qo'llanmalar
- **Cloudinary:** [CLOUDINARY_SETUP.md](CLOUDINARY_SETUP.md)
- **Database:** [DATABASE_SETUP.md](DATABASE_SETUP.md)
- **Umumiy:** [OXIRGI_QOLLANMA.md](OXIRGI_QOLLANMA.md)

### Muammolar
1. Console ni tekshiring (F12 → Console)
2. `.env` faylini tekshiring
3. Serverni qayta ishga tushiring
4. Qo'llanmalarni o'qing

## 💡 Maslahatlar

1. **Cloudinary bepul rejasi yetarli** - 25GB saqlash va bandwidth
2. **Backup oling** - Muhim ma'lumotlarni saqlab turing
3. **`.env` faylini GitHub ga yuklamang** - Xavfsizlik uchun
4. **Testdan o'tkazing** - Har bir funksiyani sinab ko'ring

## 🎯 Keyingi Qadamlar (Ixtiyoriy)

- [ ] Xabarni o'chirish/tahrirlash
- [ ] Ko'p rasmli mahsulotlar
- [ ] Mahsulot kategoriyalari
- [ ] Grafik va diagrammalar
- [ ] Mobile app (React Native)

## 📄 Litsenziya

MIT License - bepul foydalanish va o'zgartirish

## 🙏 Minnatdorchilik

- Next.js jamoasi
- Prisma jamoasi
- Cloudinary
- Tailwind CSS
- Lucide Icons

---

**Versiya:** 4.0 PROFESSIONAL  
**Holat:** ✅ PRODUCTION READY  
**Port:** 3010  
**Sana:** 2026-05-19  
**GitHub:** https://github.com/ulugbe29092/hrr

**Omad tilaymiz!** 🚀🎉
