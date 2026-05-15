# Do'kon Tizimi - O'rnatish Qo'llanmasi

## 📋 Talablar

Loyihani ishga tushirishdan oldin quyidagilar o'rnatilgan bo'lishi kerak:

- **Node.js** 18.x yoki yuqori
- **PostgreSQL** 14.x yoki yuqori
- **npm** yoki **yarn**

## 🚀 Bosqichma-bosqich O'rnatish

### 1. Loyihani yuklab olish

```bash
cd dokon-tizimi
```

### 2. Paketlarni o'rnatish

```bash
npm install
```

Yoki yarn ishlatilsa:

```bash
yarn install
```

### 3. PostgreSQL Database yaratish

PostgreSQL da yangi database yarating:

```sql
CREATE DATABASE dokon_db;
```

### 4. Environment o'zgaruvchilarini sozlash

`.env.example` faylidan `.env` yarating:

```bash
cp .env.example .env
```

`.env` faylini tahrirlang:

```env
# Database
DATABASE_URL="postgresql://postgres:password@localhost:5432/dokon_db?schema=public"

# NextAuth
NEXTAUTH_SECRET="your-secret-key-here-change-in-production"
NEXTAUTH_URL="http://localhost:3000"

# Cloudinary (ixtiyoriy)
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
```

**Muhim:** `NEXTAUTH_SECRET` ni o'zgartiring. Quyidagi buyruq bilan yaratishingiz mumkin:

```bash
openssl rand -base64 32
```

### 5. Prisma migratsiyasini ishga tushirish

```bash
npx prisma migrate dev --name init
```

Bu buyruq:
- Database jadvallarini yaratadi
- Prisma Client ni generate qiladi

### 6. Seed ma'lumotlarni yuklash

```bash
npx prisma db seed
```

Bu buyruq demo admin foydalanuvchi yaratadi:
- **Login:** admin
- **Parol:** admin123

### 7. Loyihani ishga tushirish

Development rejimida:

```bash
npm run dev
```

Brauzerda ochish: [http://localhost:3001](http://localhost:3001)

## 🔧 Qo'shimcha Buyruqlar

### Prisma Studio (Database GUI)

```bash
npx prisma studio
```

Bu buyruq [http://localhost:5555](http://localhost:5555) da database GUI ni ochadi.

### Production Build

```bash
npm run build
npm run start
```

### Linting

```bash
npm run lint
```

## 🐛 Muammolarni Hal Qilish

### Database ulanish xatosi

Agar database ga ulanishda muammo bo'lsa:

1. PostgreSQL ishlab turganini tekshiring:
   ```bash
   # Windows
   pg_ctl status
   
   # Linux/Mac
   sudo systemctl status postgresql
   ```

2. `.env` faylidagi `DATABASE_URL` to'g'riligini tekshiring

3. Database mavjudligini tekshiring:
   ```bash
   psql -U postgres -l
   ```

### Prisma migratsiya xatosi

Agar migratsiya xatosi bo'lsa, database ni tozalang:

```bash
npx prisma migrate reset
```

**Ogohlantirish:** Bu barcha ma'lumotlarni o'chiradi!

### Port band xatosi

Agar 3000 port band bo'lsa, boshqa portda ishga tushiring:

```bash
PORT=3001 npm run dev
```

## 📚 Keyingi Qadamlar

1. [http://localhost:3000](http://localhost:3000) ga kiring
2. Admin login: `admin` / `admin123`
3. Tizimni o'rganing va sozlang

## 🆘 Yordam

Muammo yuzaga kelsa:
- README.md faylini o'qing
- GitHub Issues ga murojaat qiling
- Dokumentatsiyani tekshiring

---

**Muvaffaqiyatli o'rnatish!** 🎉
