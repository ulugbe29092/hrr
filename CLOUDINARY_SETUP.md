# Cloudinary Sozlash (Rasm va Fayl Yuklash)

## Nima uchun Cloudinary kerak?

Cloudinary - bu rasmlar va fayllarni saqlash uchun bulutli xizmat. Sizning tizimingizda:
- Mahsulot rasmlari
- Foydalanuvchi avatarlari
- Xabarlardagi rasmlar va fayllar

Cloudinary orqali saqlanadi.

## Sozlash Qadamlari

### 1. Cloudinary Hisobini Yaratish

1. Brauzerda ochilsin: https://cloudinary.com
2. **Sign Up** tugmasini bosing
3. Email, parol kiriting va ro'yxatdan o'ting
4. Emailingizni tasdiqlang

### 2. API Ma'lumotlarini Olish

1. Cloudinary hisobingizga kiring
2. **Dashboard** sahifasiga o'ting
3. Quyidagi ma'lumotlarni ko'chirib oling:
   - **Cloud Name** (masalan: `dxyz123abc`)
   - **API Key** (masalan: `123456789012345`)
   - **API Secret** (masalan: `abcdefghijklmnopqrstuvwxyz`)

### 3. .env Faylini Yangilash

1. Loyihaning ildiz papkasida `.env` faylini oching
2. Quyidagi qatorlarni o'z ma'lumotlaringiz bilan almashtiring:

```env
CLOUDINARY_CLOUD_NAME="sizning_cloud_name"
CLOUDINARY_API_KEY="sizning_api_key"
CLOUDINARY_API_SECRET="sizning_api_secret"
```

**Misol:**
```env
CLOUDINARY_CLOUD_NAME="dxyz123abc"
CLOUDINARY_API_KEY="123456789012345"
CLOUDINARY_API_SECRET="abcdefghijklmnopqrstuvwxyz"
```

### 4. Serverni Qayta Ishga Tushirish

1. Terminalni oching
2. Serverni to'xtating (Ctrl+C)
3. Qayta ishga tushiring:
```bash
npm run dev
```

## Tekshirish

1. Tizimga kiring (ulugbek / ulugbek)
2. **Mahsulotlar** sahifasiga o'ting
3. Yangi mahsulot qo'shing va rasm yuklang
4. Agar rasm yuklansa - hammasi to'g'ri ishlayapti! ✅

## Muammolar

### Rasm yuklanmayapti?

1. `.env` faylidagi ma'lumotlarni tekshiring
2. Cloudinary hisobingiz faolligini tekshiring
3. Internetga ulanganligingizni tekshiring
4. Serverni qayta ishga tushiring

### "Invalid credentials" xatosi?

- API Key va API Secret to'g'ri kiritilganligini tekshiring
- Cloudinary Dashboard dan qayta ko'chirib oling

## Bepul Rejadagi Limitlar

Cloudinary bepul rejasida:
- **25 GB** saqlash
- **25 GB** oylik bandwidth
- **Cheksiz** transformatsiyalar

Bu kichik va o'rta bizneslar uchun yetarli!

## Xavfsizlik

⚠️ **MUHIM:** `.env` faylini hech qachon GitHub ga yuklamang!

`.gitignore` faylida `.env` borligini tekshiring:
```
.env
.env.local
.env.production
```

---

**Savol yoki muammo bo'lsa, Cloudinary qo'llanmasiga qarang:**
https://cloudinary.com/documentation
