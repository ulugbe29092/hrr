# 🔐 thisvaliyev/hr ga Push Qilish

## ⚠️ Muammo: Permission Denied

`ulugbe29092` akkauntidan `thisvaliyev/hr` ga push qilish mumkin emas.

---

## ✅ Yechim 1: GitHub Personal Access Token (Agar thisvaliyev sizning akkauntingiz bo'lsa)

### 1. Personal Access Token Yaratish

1. **thisvaliyev akkauntiga kiring:**
   - https://github.com/login

2. **Settings ga o'ting:**
   - Profile → Settings

3. **Developer settings:**
   - Settings → Developer settings → Personal access tokens → Tokens (classic)

4. **Generate new token:**
   - "Generate new token (classic)" ni bosing
   - Note: `HR Tizim Deploy`
   - Expiration: `90 days` yoki `No expiration`
   - Scopes: ✅ `repo` (barcha repo huquqlari)
   - "Generate token" ni bosing

5. **Token ni nusxalang:**
   - ⚠️ Faqat bir marta ko'rinadi!
   - Masalan: `ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

### 2. Git Credentials Yangilash

PowerShell'da quyidagi buyruqlarni bajaring:

```powershell
cd "c:\Users\lenovo\Downloads\HR tizim\dokon-tizimi"

# Remote URL ni token bilan yangilash
git remote set-url hr https://YOUR_TOKEN@github.com/thisvaliyev/hr.git

# Push qilish
git push hr main --force
```

**YOUR_TOKEN** ni o'zingizning token bilan almashtiring!

**Misol:**
```powershell
git remote set-url hr https://ghp_abc123xyz789@github.com/thisvaliyev/hr.git
git push hr main --force
```

---

## ✅ Yechim 2: Collaborator Qo'shish

Agar `thisvaliyev` boshqa odam bo'lsa:

### thisvaliyev tomonidan:

1. **Repository Settings:**
   - https://github.com/thisvaliyev/hr/settings

2. **Collaborators:**
   - Settings → Collaborators → "Add people"

3. **ulugbe29092 ni qo'shish:**
   - Username: `ulugbe29092`
   - "Add ulugbe29092 to this repository" ni bosing

### ulugbe29092 tomonidan:

1. **Email ni tekshiring:**
   - GitHub'dan invitation keladi

2. **Accept invitation:**
   - Email'dagi linkni bosing yoki
   - https://github.com/thisvaliyev/hr/invitations

3. **Push qiling:**
   ```powershell
   cd "c:\Users\lenovo\Downloads\HR tizim\dokon-tizimi"
   git push hr main
   ```

---

## ✅ Yechim 3: Fork va Pull Request

Agar yuqoridagilar ishlamasa:

1. **thisvaliyev/hr ni fork qiling:**
   - https://github.com/thisvaliyev/hr
   - "Fork" tugmasini bosing

2. **Fork'ga push qiling:**
   ```powershell
   cd "c:\Users\lenovo\Downloads\HR tizim\dokon-tizimi"
   git remote add fork https://github.com/ulugbe29092/hr.git
   git push fork main
   ```

3. **Pull Request yarating:**
   - https://github.com/ulugbe29092/hr
   - "Contribute" → "Open pull request"
   - Base: `thisvaliyev/hr:main`
   - Compare: `ulugbe29092/hr:main`
   - "Create pull request"

---

## 🎯 Tavsiya

**Eng oson yo'l:** Yechim 1 (Personal Access Token)

Agar `thisvaliyev` sizning akkauntingiz bo'lsa, token yarating va push qiling.

---

## 📝 Hozirgi Holat

✅ **Kod tayyor:** https://github.com/ulugbe29092/hrr
✅ **Barcha o'zgarishlar commit qilindi**
⏳ **thisvaliyev/hr ga push kutilmoqda**

---

## 🆘 Yordam Kerakmi?

Agar muammo bo'lsa:
1. Token to'g'ri yaratilganini tekshiring (repo scope)
2. Token'ni to'g'ri nusxalaganingizni tekshiring
3. URL'da `@` belgisi borligini tekshiring

**Misol URL:**
```
https://ghp_YOUR_TOKEN_HERE@github.com/thisvaliyev/hr.git
```
