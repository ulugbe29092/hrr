# 🚀 Do'kon Tizimi - Ishga Tushirish

## ✅ Tayyor!

Barcha fayllar yaratildi va paketlar o'rnatildi. Endi loyihani ishga tushirishingiz mumkin.

## 📋 Keyingi Qadamlar

### 1. PostgreSQL Database Sozlash

Agar PostgreSQL o'rnatilmagan bo'lsa, o'rnating:
- **Windows:** https://www.postgresql.org/download/windows/
- **Mac:** `brew install postgresql`
- **Linux:** `sudo apt-get install postgresql`

PostgreSQL ishga tushiring va database yarating:

```sql
CREATE DATABASE dokon_db;
```

### 2. Environment O'zgaruvchilarini Tekshirish

`.env` faylini oching va database URL ni to'g'rilang:

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/dokon_db?schema=public"
```

**Eslatma:** `postgres` va `password` ni o'z PostgreSQL login va parolingizga o'zgartiring.

### 3. Prisma Migratsiyasini Ishga Tushirish

Terminal ochib quyidagi buyruqlarni bajaring:

```bash
# Loyiha papkasiga o'ting
cd "C:\Users\lenovo\Downloads\HR tizim\dokon-tizimi"

# Prisma migratsiyasini ishga tushiring
npx prisma migrate dev --name init

# Seed ma'lumotlarni yuklang (Admin yaratish)
npx prisma db seed
```

Bu buyruqlar:
- Database jadvallarini yaratadi
- Admin foydalanuvchi yaratadi (login: `admin`, parol: `admin123`)
- Demo mahsulotlar qo'shadi

### 4. Loyihani Ishga Tushirish

```bash
npm run dev
```

### 5. Brauzerda Ochish

Brauzer ochib quyidagi manzilga kiring:

**http://localhost:3001**

### 6. Tizimga Kirish

**Login:** `admin`  
**Parol:** `admin123`

---

## 🎯 Asosiy Xususiyatlar

✅ **Foydalanuvchi Boshqaruvi** - Admin, Boshliq, Sotuvchi, Omborchi rollari  
✅ **Mahsulot Boshqaruvi** - Kirim, chiqim, qoldiq hisoblash  
✅ **Davomat Tizimi** - Xodimlar kelish/ketish vaqti  
✅ **Hisobotlar** - Kunlik, haftalik, oylik (PDF, Excel)  
✅ **Bildirishnomalar** - Real-time xabarlar  
✅ **Ko'p Tillilik** - O'zbekcha, Inglizcha, Ruscha  
✅ **Responsive Dizayn** - Mobile, Tablet, Desktop  

---

## 🛠️ Muammolarni Hal Qilish

### Database ulanish xatosi

Agar database ga ulanishda muammo bo'lsa:

1. PostgreSQL ishlab turganini tekshiring
2. `.env` faylidagi `DATABASE_URL` to'g'riligini tekshiring
3. Database yaratilganini tekshiring: `psql -U postgres -l`

### Port band xatosi

Agar 3001 port band bo'lsa, `package.json` da portni o'zgartiring:

```json
"dev": "next dev -p 3002"
```

### Prisma xatosi

Agar Prisma xatosi bo'lsa:

```bash
npx prisma generate
npx prisma migrate reset
```

---

## 📚 Qo'shimcha Hujjatlar

- **README.md** - Asosiy dokumentatsiya
- **SETUP.md** - To'liq o'rnatish qo'llanmasi
- **FEATURES.md** - Barcha xususiyatlar ro'yxati
- **DEPLOYMENT.md** - Production deploy qo'llanmasi
- **QUICK_START.md** - Tez boshlash

---

## 🆘 Yordam

Muammo yuzaga kelsa:
1. Terminal da xatolarni o'qing
2. `.env` faylini tekshiring
3. `npm install` qayta ishga tushiring
4. Database ulanishini tekshiring

---

**Omad! Loyihangiz tayyor!** 🎉

Port: **3001**  
Login: **admin**  
Parol: **admin123**
