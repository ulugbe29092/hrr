# 🚀 Vercel Deploy Settings

## 📦 Build & Development Settings

Vercel dashboard'da project import qilganda quyidagi sozlamalarni kiriting:

### Framework Preset
```
Next.js
```

### Root Directory
```
./
```
(Agar repository root'da bo'lsa, bo'sh qoldiring)

### Build Command
```
pnpm run build
```

### Output Directory
```
.next
```

### Install Command
```
pnpm install
```

### Development Command
```
pnpm run dev
```

---

## 🔐 Environment Variables

Vercel dashboard'da **Settings → Environment Variables** bo'limiga quyidagilarni qo'shing:

### 1. DATABASE_URL (Majburiy) ⚠️

**Vercel Postgres ishlatish (Tavsiya):**

1. Vercel dashboard → Storage → Create Database → Postgres
2. Database yarating
3. `.env.local` tab'dan connection string'ni ko'chirib oling

```
Name: DATABASE_URL
Value: postgres://default:XXXXXXXXXXXXX@XXXXXXXX-pooler.us-east-1.postgres.vercel-storage.com:5432/verceldb?sslmode=require
Environment: Production, Preview, Development
```

**Yoki Neon.tech (Bepul):**
```
Name: DATABASE_URL
Value: postgresql://user:password@ep-xxxxx.us-east-2.aws.neon.tech/neondb?sslmode=require
Environment: Production, Preview, Development
```

---

### 2. NEXTAUTH_SECRET (Majburiy) ⚠️

**Yaratish:**
Terminal'da ishga tushiring:
```bash
openssl rand -base64 32
```

Yoki: https://generate-secret.vercel.app/32

```
Name: NEXTAUTH_SECRET
Value: [32+ belgili random string]
Masalan: J8kF9mN2pQ5rT7vX0yZ3aB6cD8eF1gH4iJ7kL9mN2pQ5
Environment: Production, Preview, Development
```

---

### 3. NEXTAUTH_URL (Majburiy) ⚠️

**Birinchi deploy:**
```
Name: NEXTAUTH_URL
Value: https://your-app-name.vercel.app
Environment: Production
```

**Preview uchun:**
```
Name: NEXTAUTH_URL
Value: https://your-app-name-git-main-username.vercel.app
Environment: Preview
```

**Development uchun:**
```
Name: NEXTAUTH_URL
Value: http://localhost:3010
Environment: Development
```

**Eslatma:** Deploy tugagach, Vercel sizga URL beradi. Shu URL'ni bu yerga kiriting va redeploy qiling.

---

### 4. CLOUDINARY_CLOUD_NAME (Ixtiyoriy)

Rasm yuklash uchun kerak. Agar ishlatmasangiz, skip qiling.

1. https://cloudinary.com ga kiring
2. Sign up qiling (bepul)
3. Dashboard'dan Cloud Name'ni oling

```
Name: CLOUDINARY_CLOUD_NAME
Value: your_cloud_name
Environment: Production, Preview, Development
```

---

### 5. CLOUDINARY_API_KEY (Ixtiyoriy)

```
Name: CLOUDINARY_API_KEY
Value: 123456789012345
Environment: Production, Preview, Development
```

---

### 6. CLOUDINARY_API_SECRET (Ixtiyoriy)

```
Name: CLOUDINARY_API_SECRET
Value: your_api_secret_here
Environment: Production, Preview, Development
```

---

### 7. NODE_ENV (Avtomatik)

Vercel avtomatik sozlaydi, qo'shish shart emas.

```
Name: NODE_ENV
Value: production
Environment: Production
```

---

## 📋 To'liq Environment Variables Ro'yxati

Vercel'ga quyidagi tartibda kiriting:

| Variable Name | Required | Example Value | Environment |
|--------------|----------|---------------|-------------|
| `DATABASE_URL` | ✅ Yes | `postgres://default:xxx@xxx.vercel-storage.com:5432/verceldb?sslmode=require` | All |
| `NEXTAUTH_SECRET` | ✅ Yes | `J8kF9mN2pQ5rT7vX0yZ3aB6cD8eF1gH4iJ7kL9mN2pQ5` | All |
| `NEXTAUTH_URL` | ✅ Yes | `https://your-app.vercel.app` | Production |
| `NEXTAUTH_URL` | ✅ Yes | `https://your-app-git-main.vercel.app` | Preview |
| `NEXTAUTH_URL` | ✅ Yes | `http://localhost:3010` | Development |
| `CLOUDINARY_CLOUD_NAME` | ❌ No | `your_cloud_name` | All |
| `CLOUDINARY_API_KEY` | ❌ No | `123456789012345` | All |
| `CLOUDINARY_API_SECRET` | ❌ No | `your_api_secret` | All |

---

## 🎯 Deploy Qadamlari

### 1-qadam: Vercel'ga kirish
- https://vercel.com ga kiring
- GitHub bilan login qiling

### 2-qadam: Import Project
- "Add New" → "Project"
- Repository tanlang: `ulugbe29092/hrr`
- "Import" bosing

### 3-qadam: Configure Project
```
Project Name: hr-system (yoki o'zingiz xohlagan nom)
Framework Preset: Next.js
Root Directory: ./
```

### 4-qadam: Environment Variables
Yuqoridagi barcha environment variables'ni kiriting:
- DATABASE_URL
- NEXTAUTH_SECRET
- NEXTAUTH_URL (hozircha https://hr-system.vercel.app deb qo'ying)

### 5-qadam: Deploy
- "Deploy" tugmasini bosing
- 2-3 daqiqa kuting

### 6-qadam: URL olish
Deploy tugagach:
- Vercel sizga URL beradi: `https://hr-system-xxxxx.vercel.app`
- Bu URL'ni ko'chirib oling

### 7-qadam: NEXTAUTH_URL yangilash
- Settings → Environment Variables
- `NEXTAUTH_URL` ni topib, yangi URL bilan almashtiring
- "Save" bosing
- Deployments → Latest → "Redeploy" bosing

### 8-qadam: Database Migration
Vercel dashboard'da:
- Settings → Functions → Console
- Yoki local'da:

```bash
# .env faylga production DATABASE_URL ni qo'shing
DATABASE_URL="postgres://..." npx prisma migrate deploy
DATABASE_URL="postgres://..." npx prisma db seed
```

### 9-qadam: Test qilish
- `https://your-app.vercel.app` ochilishi kerak
- `/uz/login` ga kiring
- Login: `admin`
- Parol: `admin123`

---

## ⚡ Quick Copy-Paste Template

Vercel Environment Variables uchun:

```bash
# 1. DATABASE_URL
postgres://default:XXXXX@XXXXX-pooler.us-east-1.postgres.vercel-storage.com:5432/verceldb?sslmode=require

# 2. NEXTAUTH_SECRET (Terminal'da yarating)
openssl rand -base64 32

# 3. NEXTAUTH_URL
https://your-app-name.vercel.app

# 4-6. CLOUDINARY (Ixtiyoriy)
your_cloud_name
123456789012345
your_api_secret
```

---

## 🔧 Muammolarni Hal Qilish

### "Invalid Database URL" xatosi
- `DATABASE_URL` oxirida `?sslmode=require` borligini tekshiring
- PostgreSQL ishlatayotganingizni tekshiring (SQLite production'da ishlamaydi)

### "NEXTAUTH_URL mismatch" xatosi
- `NEXTAUTH_URL` Vercel URL bilan bir xil ekanligini tekshiring
- HTTPS ishlatilayotganligini tekshiring
- Redeploy qiling

### Build xatosi
- `pnpm install` to'g'ri ishlayotganini tekshiring
- Node.js versiyasi 18+ ekanligini tekshiring
- Vercel logs'ni tekshiring

### Database ulanmayapti
- Vercel Postgres yaratilganligini tekshiring
- Connection string to'g'ri ko'chirilganligini tekshiring
- Migration bajarilganligini tekshiring

---

## ✅ Deploy Muvaffaqiyatli!

Agar hammasi to'g'ri bo'lsa:
- ✅ Sayt ochiladi: `https://your-app.vercel.app`
- ✅ Login sahifasi ishlaydi
- ✅ Admin login qiladi
- ✅ Dashboard ko'rinadi
- ✅ Barcha funksiyalar ishlaydi

**Keyingi qadamlar:**
1. Admin parolini o'zgartiring
2. Yangi xodimlar qo'shing
3. Mahsulotlar qo'shing
4. Custom domain ulang (ixtiyoriy)

---

## 📞 Yordam

Muammo bo'lsa:
- Vercel Logs: Dashboard → Deployments → Latest → Logs
- Browser Console: F12 → Console
- GitHub Issues: https://github.com/ulugbe29092/hrr/issues
