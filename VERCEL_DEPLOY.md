# Vercel'ga Deploy Qilish Qo'llanmasi

## 1-Qadam: Vercel'ga Kirish

1. [Vercel](https://vercel.com) saytiga kiring
2. GitHub akkauntingiz bilan login qiling

## 2-Qadam: Loyihani Import Qilish

1. Vercel dashboard'da "Add New Project" tugmasini bosing
2. GitHub'dan `hruz` repositoriyasini tanlang
3. "Import" tugmasini bosing

## 3-Qadam: Environment Variables Qo'shish

Vercel'da quyidagi environment variables'larni qo'shing:

### Database (PostgreSQL)
```
DATABASE_URL=postgresql://user:password@host:5432/database?schema=public
```

**Tavsiya:** Vercel Postgres yoki Neon.tech ishlatishingiz mumkin:
- [Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres)
- [Neon.tech](https://neon.tech) - Bepul PostgreSQL

### NextAuth
```
NEXTAUTH_SECRET=your-production-secret-key-change-this
NEXTAUTH_URL=https://your-app.vercel.app
```

**Muhim:** `NEXTAUTH_SECRET` ni quyidagi buyruq bilan generate qiling:
```bash
openssl rand -base64 32
```

### Cloudinary (Rasm yuklash uchun)
```
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

[Cloudinary](https://cloudinary.com) da bepul akkaunt oching va API keys'ni oling.

### Socket.io (Ixtiyoriy)
```
SOCKET_SERVER_URL=https://your-socket-server.com
```

## 4-Qadam: Build Settings

Vercel avtomatik ravishda Next.js loyihani aniqlaydi:

- **Framework Preset:** Next.js
- **Build Command:** `npm run build`
- **Output Directory:** `.next`
- **Install Command:** `npm install`

## 5-Qadam: Deploy

1. "Deploy" tugmasini bosing
2. Build jarayoni 2-5 daqiqa davom etadi
3. Deploy tugagach, sizga URL beriladi

## 6-Qadam: Database Migration

Deploy tugagach, database migration qilish kerak:

1. Vercel dashboard'da loyihangizni oching
2. "Settings" > "Functions" > "Serverless Functions"
3. Yoki local'dan migration qiling:

```bash
# .env faylida production DATABASE_URL ni qo'ying
npx prisma migrate deploy
npx prisma db seed
```

## 7-Qadam: NEXTAUTH_URL Yangilash

1. Vercel sizga URL beradi (masalan: `https://hruz.vercel.app`)
2. Environment Variables'ga qaytib, `NEXTAUTH_URL` ni yangilang
3. Loyihani qayta deploy qiling

## Tez Deploy (CLI orqali)

```bash
# Vercel CLI o'rnatish
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Production'ga deploy
vercel --prod
```

## Muammolarni Hal Qilish

### Build Error
- Environment variables to'g'ri kiritilganini tekshiring
- `package.json` da barcha dependencies mavjudligini tekshiring

### Database Connection Error
- `DATABASE_URL` to'g'ri formatda ekanligini tekshiring
- Database server'ga Vercel'dan kirish mumkinligini tekshiring

### NextAuth Error
- `NEXTAUTH_SECRET` va `NEXTAUTH_URL` to'g'ri kiritilganini tekshiring
- `NEXTAUTH_URL` https:// bilan boshlanishi kerak

## Foydali Linklar

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres)
- [Neon.tech](https://neon.tech) - Bepul PostgreSQL

## Demo Login

Deploy tugagach, quyidagi login ma'lumotlari bilan kirishingiz mumkin:

- **Username:** admin
- **Password:** admin123

**Muhim:** Production'da admin parolini o'zgartiring!
