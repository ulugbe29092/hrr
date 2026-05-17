# Database Setup Qo'llanmasi

## PostgreSQL O'rnatish

### Windows uchun:

1. PostgreSQL yuklab oling: https://www.postgresql.org/download/windows/
2. O'rnatish jarayonida:
   - Port: `5432` (default)
   - Password: o'zingiz xohlagan parol (eslab qoling!)
   - Database: `postgres` (default)

### Yoki Docker orqali:

```bash
docker run --name dokon-postgres -e POSTGRES_PASSWORD=yourpassword -e POSTGRES_DB=dokon_db -p 5432:5432 -d postgres
```

## Database Yaratish

### 1. PostgreSQL'ga kirish:

```bash
psql -U postgres
```

### 2. Database yaratish:

```sql
CREATE DATABASE dokon_db;
\q
```

## .env Faylini Sozlash

`.env` faylida `DATABASE_URL` ni o'zgartiring:

```env
DATABASE_URL="postgresql://postgres:yourpassword@localhost:5432/dokon_db?schema=public"
```

**Eslatma:** `yourpassword` ni o'zingizning PostgreSQL parolingizga o'zgartiring!

## Migration va Seed

### 1. Prisma Client yaratish:

```bash
npx prisma generate
```

### 2. Database migration:

```bash
npx prisma migrate dev --name init
```

### 3. Seed data (admin user yaratish):

```bash
npx prisma db seed
```

## Admin Login Ma'lumotlari

Migration va seed tugagach, quyidagi ma'lumotlar bilan kirish mumkin:

- **Login:** ulugbek
- **Parol:** ulugbek

## Muammolarni Hal Qilish

### PostgreSQL ishlamayapti:

**Windows:**
```bash
# PostgreSQL service'ni ishga tushirish
net start postgresql-x64-14
```

**Linux/Mac:**
```bash
sudo service postgresql start
```

### Connection Error:

1. PostgreSQL ishlab turganini tekshiring
2. `.env` faylidagi `DATABASE_URL` to'g'riligini tekshiring
3. Port `5432` ochiq ekanligini tekshiring

### Seed Error:

Agar seed xato bersa, avval eski ma'lumotlarni o'chiring:

```bash
npx prisma migrate reset
```

Keyin qaytadan seed qiling:

```bash
npx prisma db seed
```

## Qo'shimcha Buyruqlar

### Database'ni ko'rish (Prisma Studio):

```bash
npx prisma studio
```

Bu brauzerda database'ni ko'rish va tahrirlash uchun GUI ochadi.

### Migration'larni ko'rish:

```bash
npx prisma migrate status
```

### Database'ni tozalash:

```bash
npx prisma migrate reset
```

**Ogohlantirish:** Bu barcha ma'lumotlarni o'chiradi!
