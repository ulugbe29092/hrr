# Do'kon Tizimi - Professional Inventory Management System

Professional do'kon boshqaruv tizimi Next.js 14, TypeScript, PostgreSQL va Prisma bilan qurilgan.

## 🚀 Texnologiyalar

- **Frontend:** Next.js 14 (App Router) + TypeScript
- **Styling:** Tailwind CSS
- **Animatsiyalar:** Framer Motion
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Auth:** NextAuth.js (JWT)
- **Rasm saqlash:** Cloudinary
- **PDF:** jsPDF + jsPDF-AutoTable
- **Excel:** SheetJS (xlsx)
- **Til:** next-intl (O'zbekcha, Inglizcha, Ruscha)

## 📋 Xususiyatlar

### Rollar
- **Admin:** To'liq tizim boshqaruvi
- **Boshliq:** Xodimlar va mahsulotlarni boshqarish
- **Sotuvchi:** Mahsulot chiqimi
- **Omborchi:** Mahsulot kirimi

### Asosiy funksiyalar
- ✅ Foydalanuvchilar boshqaruvi
- ✅ Mahsulotlar boshqaruvi (kirim/chiqim)
- ✅ Xodimlar davomati
- ✅ Hisobotlar (PDF, Excel)
- ✅ Bildirishnomalar tizimi
- ✅ Ko'p tillilik (uz, en, ru)
- ✅ Responsive dizayn
- ✅ Real-time yangilanishlar

## 🛠️ O'rnatish

### 1. Loyihani klonlash

```bash
cd dokon-tizimi
```

### 2. Paketlarni o'rnatish

```bash
npm install
```

### 3. Database sozlash

PostgreSQL o'rnatilgan bo'lishi kerak. Keyin `.env` faylini yarating:

```bash
cp .env.example .env
```

`.env` faylida database URL ni o'zgartiring:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/dokon_db?schema=public"
```

### 4. Prisma migratsiyasi

```bash
npx prisma migrate dev --name init
npx prisma generate
```

### 5. Seed ma'lumotlarni yuklash

```bash
npx prisma db seed
```

Bu admin foydalanuvchi yaratadi:
- **Login:** admin
- **Parol:** admin123

### 6. Loyihani ishga tushirish

```bash
npm run dev
```

Brauzerda ochish: [http://localhost:3001](http://localhost:3001)

## 📁 Loyiha Strukturasi

```
dokon-tizimi/
├── prisma/
│   ├── schema.prisma      # Database schema
│   └── seed.ts            # Seed ma'lumotlar
├── src/
│   ├── app/
│   │   ├── [locale]/      # Til asosida routing
│   │   │   ├── (auth)/    # Auth sahifalari
│   │   │   └── (dashboard)/ # Dashboard sahifalari
│   │   └── api/           # API routes
│   ├── components/
│   │   ├── ui/            # UI komponentlar
│   │   └── layout/        # Layout komponentlar
│   ├── lib/
│   │   ├── prisma.ts      # Prisma client
│   │   ├── auth.ts        # NextAuth config
│   │   ├── utils.ts       # Utility funksiyalar
│   │   ├── pdf.ts         # PDF generator
│   │   └── excel.ts       # Excel generator
│   └── types/             # TypeScript types
├── messages/              # Tarjima fayllari
│   ├── uz.json
│   ├── en.json
│   └── ru.json
└── public/                # Static fayllar
```

## 🔐 Xavfsizlik

- Parollar bcrypt bilan shifrlangan
- JWT token bilan sessiya boshqaruvi
- Role-based access control (RBAC)
- SQL injection himoyasi (Prisma ORM)

## 📊 Database Schema

### Asosiy jadvallar:
- `users` - Foydalanuvchilar
- `sessions` - Login sessiyalari
- `attendance` - Davomat
- `products` - Mahsulotlar
- `transactions` - Kirim/Chiqim
- `notifications` - Bildirishnomalar

## 🌐 Ko'p tillilik

Til o'zgartirish uchun header da bayroq belgisini bosing:
- 🇺🇿 O'zbekcha
- 🇬🇧 English
- 🇷🇺 Русский

## 📱 Responsive Dizayn

Tizim barcha qurilmalarda ishlaydi:
- 💻 Desktop
- 📱 Tablet
- 📱 Mobile

## 🚀 Production Deploy

### Vercel

```bash
npm run build
vercel --prod
```

### Docker

```bash
docker build -t dokon-tizimi .
docker run -p 3000:3000 dokon-tizimi
```

## 📝 Litsenziya

MIT License

## 👨‍💻 Muallif

Professional Do'kon Tizimi

---

**Demo Login:**
- Login: `admin`
- Parol: `admin123`
