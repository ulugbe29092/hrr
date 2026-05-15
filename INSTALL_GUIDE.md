# 🚀 Do'kon Tizimi - O'rnatish va Ishga Tushirish

## ⚡ Tez Boshlash

### 1. PostgreSQL Sozlash

```bash
# PostgreSQL da database yarating
CREATE DATABASE dokon_db;
```

### 2. Environment Sozlash

`.env` faylini oching va database URL ni to'g'rilang:

```env
DATABASE_URL="postgresql://postgres:PAROL@localhost:5432/dokon_db?schema=public"
```

**PAROL** ni o'z PostgreSQL parolingizga o'zgartiring!

### 3. Database Migratsiyasi

```bash
npx prisma migrate dev --name init
npx prisma db seed
```

### 4. Ishga Tushirish

```bash
npm run dev
```

### 5. Brauzerda Ochish

**http://localhost:3009**

**Login:** admin  
**Parol:** admin123

---

## ✅ Tayyor!

Loyiha ishga tushdi. Endi tizimdan foydalanishingiz mumkin.

---

## 🔧 Muammolar

### Agar xato bo'lsa:

1. Terminal da `Ctrl+C` bosing
2. `npm run dev` qayta ishga tushiring
3. Brauzerda refresh qiling

### Database xatosi:

- PostgreSQL ishlab turganini tekshiring
- `.env` faylidagi `DATABASE_URL` to'g'riligini tekshiring
- Database yaratilganini tekshiring

---

**Port:** 3009  
**Login:** admin  
**Parol:** admin123
