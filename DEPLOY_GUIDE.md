# 🚀 Deploy Qilish Qo'llanmasi

Bu qo'llanma HR tizimini production muhitiga deploy qilish uchun kerakli barcha ma'lumotlarni o'z ichiga oladi.

## 📋 Kerakli Environment Variables

Deploy qilishdan oldin quyidagi environment o'zgaruvchilarini sozlashingiz kerak:

### 1. DATABASE_URL (Majburiy)
Production uchun PostgreSQL database kerak. SQLite production uchun mos emas.

**Variantlar:**

#### A) Vercel Postgres (Tavsiya etiladi - Bepul)
1. Vercel dashboard'ga kiring: https://vercel.com
2. Storage → Create Database → Postgres
3. Database yarating
4. `.env.local` tab'dan `DATABASE_URL` ni ko'chirib oling

```env
DATABASE_URL="postgres://default:xxxxx@xxxxx-pooler.us-east-1.postgres.vercel-storage.com:5432/verceldb?sslmode=require"
```

#### B) Neon.tech (Bepul)
1. https://neon.tech ga kiring
2. Yangi project yarating
3. Connection string'ni oling

```env
DATABASE_URL="postgresql://user:password@ep-xxxxx.us-east-2.aws.neon.tech/neondb?sslmode=require"
```

#### C) Supabase (Bepul)
1. https://supabase.com ga kiring
2. Yangi project yarating
3. Settings → Database → Connection string (Pooling) ni oling

```env
DATABASE_URL="postgresql://postgres.xxxxx:password@aws-0-us-east-1.pooler.supabase.com:6543/postgres"
```

### 2. NEXTAUTH_SECRET (Majburiy)
Xavfsiz random string yarating:

**Yaratish usuli:**
```bash
# Terminal'da ishga tushiring:
openssl rand -base64 32
```

Yoki online generator: https://generate-secret.vercel.app/32

```env
NEXTAUTH_SECRET="your-very-long-random-secret-key-here"
```

### 3. NEXTAUTH_URL (Majburiy)
Production URL manzilingiz:

```env
# Vercel uchun:
NEXTAUTH_URL="https://your-app-name.vercel.app"

# Custom domain uchun:
NEXTAUTH_URL="https://hr.yourcompany.com"
```

### 4. CLOUDINARY (Ixtiyoriy - Rasm yuklash uchun)
Agar rasm yuklash funksiyasini ishlatmoqchi bo'lsangiz:

1. https://cloudinary.com ga kiring
2. Sign up qiling (bepul)
3. Dashboard'dan ma'lumotlarni oling

```env
CLOUDINARY_CLOUD_NAME="your_cloud_name"
CLOUDINARY_API_KEY="123456789012345"
CLOUDINARY_API_SECRET="your_api_secret_here"
```

**Eslatma:** Agar Cloudinary ishlatmasangiz, rasm yuklash o'rniga matn yoki URL ishlatiladi.

### 5. SOCKET_SERVER_URL (Ixtiyoriy)
Real-time xabarlar uchun (hozircha ishlatilmaydi):

```env
SOCKET_SERVER_URL="https://your-socket-server.com"
```

---

## 🌐 Vercel'ga Deploy Qilish (Tavsiya etiladi)

### 1-qadam: Vercel'ga kirish
1. https://vercel.com ga kiring
2. GitHub akkauntingiz bilan login qiling

### 2-qadam: Yangi project yaratish
1. "Add New" → "Project" tugmasini bosing
2. GitHub repository'ni tanlang: `ulugbe29092/hrr`
3. "Import" tugmasini bosing

### 3-qadam: Environment Variables sozlash
"Environment Variables" bo'limida quyidagilarni qo'shing:

```
DATABASE_URL = postgresql://...
NEXTAUTH_SECRET = your-secret-key
NEXTAUTH_URL = https://your-app.vercel.app
CLOUDINARY_CLOUD_NAME = your_cloud_name (ixtiyoriy)
CLOUDINARY_API_KEY = your_api_key (ixtiyoriy)
CLOUDINARY_API_SECRET = your_api_secret (ixtiyoriy)
```

### 4-qadam: Build Settings
- **Framework Preset:** Next.js
- **Build Command:** `pnpm run build` (avtomatik)
- **Output Directory:** `.next` (avtomatik)
- **Install Command:** `pnpm install` (avtomatik)

### 5-qadam: Deploy
1. "Deploy" tugmasini bosing
2. 2-3 daqiqa kuting
3. Deploy tugagach, URL ochiladi

### 6-qadam: Database Migration
Deploy tugagach, Vercel dashboard'da:
1. Settings → Functions → Environment Variables
2. Terminal'ni oching yoki local'da:

```bash
# Database'ni yangilash
npx prisma migrate deploy

# Seed data qo'shish (ixtiyoriy)
npx prisma db seed
```

---

## 🐳 Docker bilan Deploy Qilish

### 1-qadam: .env faylni yaratish
```bash
cp .env.example .env.production
```

`.env.production` faylni tahrirlang va barcha qiymatlarni to'ldiring.

### 2-qadam: Docker image yaratish
```bash
docker build -t hr-system .
```

### 3-qadam: Docker container ishga tushirish
```bash
docker run -p 3010:3010 --env-file .env.production hr-system
```

### 4-qadam: Database migration
```bash
docker exec -it <container-id> npx prisma migrate deploy
```

---

## 🖥️ VPS/Server'ga Deploy Qilish

### 1-qadam: Server'ga ulanish
```bash
ssh user@your-server-ip
```

### 2-qadam: Kerakli dasturlarni o'rnatish
```bash
# Node.js 18+ o'rnatish
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# pnpm o'rnatish
npm install -g pnpm

# PM2 o'rnatish (process manager)
npm install -g pm2
```

### 3-qadam: Repository'ni clone qilish
```bash
git clone https://github.com/ulugbe29092/hrr.git
cd hrr
```

### 4-qadam: Dependencies o'rnatish
```bash
pnpm install
```

### 5-qadam: Environment variables sozlash
```bash
nano .env.production
```

Barcha kerakli o'zgaruvchilarni kiriting va saqlang (Ctrl+X, Y, Enter).

### 6-qadam: Database migration
```bash
npx prisma migrate deploy
npx prisma db seed  # Ixtiyoriy
```

### 7-qadam: Build qilish
```bash
pnpm run build
```

### 8-qadam: PM2 bilan ishga tushirish
```bash
pm2 start npm --name "hr-system" -- start
pm2 save
pm2 startup
```

### 9-qadam: Nginx sozlash (ixtiyoriy)
```bash
sudo nano /etc/nginx/sites-available/hr-system
```

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3010;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/hr-system /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

---

## ✅ Deploy Tekshirish

Deploy tugagach, quyidagilarni tekshiring:

1. **Sayt ochilishi:** `https://your-app.vercel.app`
2. **Login sahifasi:** `/uz/login`
3. **Default admin:**
   - Login: `admin`
   - Parol: `admin123`
4. **Database ulanishi:** Xodimlar ro'yxati ko'rinishi kerak
5. **Rasm yuklash:** Mahsulot qo'shishda rasm yuklash ishlashi kerak (agar Cloudinary sozlangan bo'lsa)

---

## 🔧 Muammolarni Hal Qilish

### Database ulanmayapti
- `DATABASE_URL` to'g'ri ekanligini tekshiring
- SSL mode qo'shilganligini tekshiring: `?sslmode=require`
- Database migration bajarilganligini tekshiring: `npx prisma migrate deploy`

### NextAuth xatolik beradi
- `NEXTAUTH_SECRET` sozlanganligini tekshiring
- `NEXTAUTH_URL` production URL bilan mos kelishini tekshiring
- HTTPS ishlatilayotganligini tekshiring

### Rasm yuklanmayapti
- Cloudinary credentials to'g'ri ekanligini tekshiring
- Yoki Cloudinary o'rniga local storage ishlatishni sozlang

### Build xatolik beradi
- `pnpm install` qayta ishga tushiring
- Node.js versiyasi 18+ ekanligini tekshiring: `node -v`
- `.next` papkasini o'chirib, qayta build qiling

---

## 📞 Yordam

Agar muammo yuzaga kelsa:
1. Vercel logs'ni tekshiring: Dashboard → Deployments → Logs
2. Browser console'ni tekshiring (F12)
3. Server logs'ni tekshiring: `pm2 logs hr-system`

---

## 🎉 Tayyor!

Endi HR tizimingiz production'da ishlayapti! 

**Muhim eslatmalar:**
- Default admin parolini o'zgartiring
- Database backup sozlang
- SSL sertifikat o'rnating (Vercel avtomatik qiladi)
- Environment variables'ni xavfsiz saqlang
