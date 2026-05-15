# Do'kon Tizimi - Deployment Qo'llanmasi

## 🚀 Production Deploy

### Vercel (Tavsiya etiladi)

Vercel Next.js uchun eng yaxshi hosting platformasi.

#### 1. Vercel akkaunt yarating

[vercel.com](https://vercel.com) da ro'yxatdan o'ting.

#### 2. GitHub repository ulang

Loyihani GitHub ga push qiling va Vercel da import qiling.

#### 3. Environment o'zgaruvchilarini qo'shing

Vercel dashboard da:

```env
DATABASE_URL=your-production-database-url
NEXTAUTH_SECRET=your-production-secret
NEXTAUTH_URL=https://your-domain.vercel.app
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

#### 4. Deploy qiling

```bash
npm install -g vercel
vercel --prod
```

### Railway

Railway ham yaxshi variant.

#### 1. Railway akkaunt yarating

[railway.app](https://railway.app) da ro'yxatdan o'ting.

#### 2. PostgreSQL qo'shing

Railway dashboard da PostgreSQL service qo'shing.

#### 3. Next.js app deploy qiling

```bash
npm install -g @railway/cli
railway login
railway init
railway up
```

### Docker

#### 1. Docker image yarating

```bash
docker build -t dokon-tizimi .
```

#### 2. Docker Compose bilan ishga tushiring

```bash
docker-compose up -d
```

#### 3. Migratsiyani ishga tushiring

```bash
docker-compose exec app npx prisma migrate deploy
docker-compose exec app npx prisma db seed
```

### VPS (Ubuntu)

#### 1. Server tayyorlash

```bash
# Node.js o'rnatish
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# PostgreSQL o'rnatish
sudo apt-get install postgresql postgresql-contrib

# Nginx o'rnatish
sudo apt-get install nginx
```

#### 2. Loyihani clone qilish

```bash
git clone https://github.com/your-username/dokon-tizimi.git
cd dokon-tizimi
npm install
```

#### 3. Environment sozlash

```bash
cp .env.example .env
nano .env
```

#### 4. Database sozlash

```bash
sudo -u postgres psql
CREATE DATABASE dokon_db;
\q

npx prisma migrate deploy
npx prisma db seed
```

#### 5. Build qilish

```bash
npm run build
```

#### 6. PM2 bilan ishga tushirish

```bash
npm install -g pm2
pm2 start npm --name "dokon-tizimi" -- start
pm2 save
pm2 startup
```

#### 7. Nginx sozlash

```bash
sudo nano /etc/nginx/sites-available/dokon-tizimi
```

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/dokon-tizimi /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

#### 8. SSL (Let's Encrypt)

```bash
sudo apt-get install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

## 🔒 Xavfsizlik

### Production uchun muhim:

1. **NEXTAUTH_SECRET** ni o'zgartiring:
   ```bash
   openssl rand -base64 32
   ```

2. **Database parolini** kuchli qiling

3. **CORS** sozlang

4. **Rate limiting** qo'shing

5. **Firewall** sozlang

## 📊 Monitoring

### Vercel Analytics

Vercel da avtomatik analytics mavjud.

### Custom Monitoring

- **Sentry** - Error tracking
- **LogRocket** - Session replay
- **Google Analytics** - User analytics

## 🔄 CI/CD

### GitHub Actions

`.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - run: npm run test
```

## 📝 Backup

### Database Backup

```bash
# Backup
pg_dump -U postgres dokon_db > backup.sql

# Restore
psql -U postgres dokon_db < backup.sql
```

### Automated Backup

Cron job qo'shing:

```bash
crontab -e
```

```
0 2 * * * pg_dump -U postgres dokon_db > /backups/dokon_$(date +\%Y\%m\%d).sql
```

## 🆘 Troubleshooting

### Build xatosi

```bash
rm -rf .next node_modules
npm install
npm run build
```

### Database ulanish xatosi

`.env` faylidagi `DATABASE_URL` ni tekshiring.

### Memory xatosi

Node.js memory limitini oshiring:

```bash
NODE_OPTIONS="--max-old-space-size=4096" npm run build
```

---

**Muvaffaqiyatli deploy!** 🎉
