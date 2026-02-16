# Asansör Takip Sistemi - Kurulum Rehberi

## 📋 Gereksinimler

### Backend
- Node.js 18+ 
- PostgreSQL 14+
- npm veya yarn

### Frontend
- Node.js 18+
- npm veya yarn

### Mobile
- Node.js 18+
- Expo CLI
- iOS: Xcode (Mac için)
- Android: Android Studio

## 🚀 Backend Kurulumu

### 1. PostgreSQL Kurulumu

```bash
# Ubuntu/Debian
sudo apt update
sudo apt install postgresql postgresql-contrib

# macOS (Homebrew)
brew install postgresql@14
brew services start postgresql@14

# Windows
# PostgreSQL'i postgresql.org'dan indirin
```

### 2. Veritabanı Oluşturma

```bash
# PostgreSQL'e bağlan
psql -U postgres

# Veritabanı oluştur
CREATE DATABASE asansor_takip;

# Kullanıcı oluştur (opsiyonel)
CREATE USER asansor_user WITH PASSWORD 'secure_password';
GRANT ALL PRIVILEGES ON DATABASE asansor_takip TO asansor_user;

# Çıkış
\q
```

### 3. Backend Projesini Kurma

```bash
cd backend

# Bağımlılıkları yükle
npm install

# .env dosyası oluştur
cp .env.example .env

# .env dosyasını düzenle
nano .env
```

**.env dosyası:**
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/asansor_takip?schema=public"
JWT_SECRET="your-super-secret-jwt-key-change-this"
JWT_EXPIRES_IN="7d"
PORT=5000
NODE_ENV=development
CORS_ORIGIN="http://localhost:3000"
```

### 4. Prisma Migration

```bash
# Prisma client oluştur
npm run prisma:generate

# Migration çalıştır
npm run prisma:migrate

# (Opsiyonel) Prisma Studio'yu aç
npm run prisma:studio
```

### 5. Backend'i Başlatma

```bash
# Development mode
npm run dev

# Production build
npm run build
npm start
```

Backend şimdi http://localhost:5000 adresinde çalışıyor!

Test için: http://localhost:5000/health

## 🎨 Frontend Kurulumu

### 1. Frontend Projesini Kurma

```bash
cd frontend

# Bağımlılıkları yükle
npm install

# .env.local dosyası oluştur
cp .env.local.example .env.local

# .env.local dosyasını düzenle
nano .env.local
```

**.env.local dosyası:**
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

### 2. Frontend'i Başlatma

```bash
# Development mode
npm run dev

# Production build
npm run build
npm start
```

Frontend şimdi http://localhost:3000 adresinde çalışıyor!

## 📱 Mobile Kurulumu

### 1. Expo CLI Kurulumu

```bash
npm install -g expo-cli
```

### 2. Mobile Projesini Kurma

```bash
cd mobile

# Bağımlılıkları yükle
npm install
```

### 3. Expo Uygulamasını Başlatma

```bash
# Metro bundler'ı başlat
npm start

# iOS simulator (Mac)
npm run ios

# Android emulator
npm run android

# Fiziksel cihazda test
# Expo Go uygulamasını yükleyin ve QR kodu tarayın
```

## 🔧 Excel Kontrol Listesi Import

Projede `UfukBakım.xlsx` dosyası bulunmaktadır. Bu dosyayı içe aktarmak için:

```bash
cd backend

# Seed script oluştur
node -e "
const { PrismaClient } = require('@prisma/client');
const ExcelJS = require('exceljs');
const prisma = new PrismaClient();

async function importChecklist() {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile('../UfukBakım.xlsx');
  const worksheet = workbook.worksheets[0];
  
  const items = [];
  worksheet.eachRow((row, rowNumber) => {
    if (rowNumber > 1) {
      items.push({
        category: row.getCell(1).value?.toString() || '',
        itemNumber: parseInt(row.getCell(2).value?.toString() || '0'),
        description: row.getCell(3).value?.toString() || '',
        isActive: true,
        order: rowNumber - 1,
      });
    }
  });
  
  await prisma.checklistTemplate.createMany({ data: items });
  console.log('✓ Kontrol listesi import edildi:', items.length, 'madde');
  await prisma.\$disconnect();
}

importChecklist();
"
```

## 📊 İlk Kullanıcı Oluşturma

```bash
# API ile admin kullanıcı oluştur
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "Admin123!",
    "firstName": "Admin",
    "lastName": "User",
    "role": "ADMIN"
  }'
```

## 🐳 Docker ile Kurulum (Opsiyonel)

```bash
# PostgreSQL Docker container
docker run --name asansor-postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=asansor_takip \
  -p 5432:5432 \
  -d postgres:14

# Backend ve Frontend için Dockerfile'lar oluşturulabilir
```

## ✅ Kurulum Testi

### Backend Test
```bash
curl http://localhost:5000/health
```

### Frontend Test
Tarayıcıda: http://localhost:3000

### Mobile Test
Expo Go uygulamasından QR kodu tarayın

## 🔐 Güvenlik Notları

1. **Production'da mutlaka:**
   - JWT_SECRET'i güçlü ve unique yapın
   - PostgreSQL şifresini değiştirin
   - CORS ayarlarını sıkılaştırın
   - HTTPS kullanın
   - Environment değişkenlerini güvenli saklayın

2. **Önerilen:**
   - Rate limiting ekleyin
   - Input validation güçlendirin
   - Security headers ekleyin
   - Regular security audit yapın

## 🆘 Sorun Giderme

### PostgreSQL bağlantı hatası
```bash
# PostgreSQL servisini kontrol et
sudo systemctl status postgresql

# PostgreSQL'i başlat
sudo systemctl start postgresql
```

### Port zaten kullanımda
```bash
# Kullanılan portu bul ve kapat
lsof -i :5000
kill -9 <PID>
```

### Prisma migration hatası
```bash
# Migration'ları sıfırla
npx prisma migrate reset

# Yeniden migrate et
npx prisma migrate dev
```

## 📝 Notlar

- Backend port: 5000
- Frontend port: 3000
- PostgreSQL port: 5432
- Tüm şifreler bcrypt ile hashlenmiş
- JWT token 7 gün geçerli
- Dosya upload limiti: 5MB

## 🎯 Sonraki Adımlar

1. İlk admin kullanıcısını oluşturun
2. Test verileri ekleyin
3. Excel'den kontrol listesini import edin
4. İlk bina ve asansörü ekleyin
5. Mobil uygulamadan QR kod okutun
6. İlk bakım kaydını oluşturun

Başarılar! 🚀
