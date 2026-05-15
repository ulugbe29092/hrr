# Do'kon Tizimi - Tez Boshlash

## ⚡ 5 Daqiqada Ishga Tushirish

### 1. Talablar

- Node.js 18+ o'rnatilgan bo'lishi kerak
- PostgreSQL 14+ o'rnatilgan bo'lishi kerak

### 2. Loyihani yuklab olish

```bash
cd dokon-tizimi
```

### 3. Paketlarni o'rnatish

```bash
npm install
```

### 4. Database yaratish

PostgreSQL da:

```sql
CREATE DATABASE dokon_db;
```

### 5. Environment sozlash

```bash
cp .env.example .env
```

`.env` faylini tahrirlang:

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/dokon_db"
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"
```

### 6. Database migratsiyasi

```bash
npx prisma migrate dev
npx prisma db seed
```

### 7. Ishga tushirish

```bash
npm run dev
```

### 8. Brauzerda ochish

[http://localhost:3001](http://localhost:3001)

**Login:**
- Username: `admin`
- Password: `admin123`

## 🎉 Tayyor!

Endi tizimdan foydalanishingiz mumkin.

## 📚 Keyingi Qadamlar

1. **Xodimlar qo'shish** - Admin panel → Users → Add User
2. **Mahsulotlar qo'shish** - Products → Add Product
3. **Kirim kiritish** - Transactions → Add Income
4. **Chiqim kiritish** - Transactions → Add Expense
5. **Hisobotlarni ko'rish** - Reports

## 🆘 Muammo?

- [SETUP.md](./SETUP.md) - To'liq o'rnatish qo'llanmasi
- [README.md](./README.md) - Asosiy dokumentatsiya
- [FEATURES.md](./FEATURES.md) - Barcha xususiyatlar

---

**Omad!** 🚀
