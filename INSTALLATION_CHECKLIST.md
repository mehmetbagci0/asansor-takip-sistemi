# ✅ Asansör Takip Sistemi - Kurulum Kontrol Listesi

## 🎯 Ön Gereksinimler

### Genel
- [ ] Node.js 18+ kurulu
- [ ] npm veya yarn kurulu
- [ ] PostgreSQL 14+ kurulu

### Backend İçin
- [ ] PostgreSQL veritabanı oluşturuldu

---

## 📦 Backend Kurulumu

### Adımlar
1. `cd backend`
2. `npm install`
3. `.env` dosyası oluştur ve düzenle
4. `npm run prisma:generate`
5. `npm run prisma:migrate`
6. `npm run dev`

### Kontroller
- [ ] Server çalışıyor (http://localhost:5000)
- [ ] Health check OK (GET /health)
- [ ] Admin user oluşturuldu

---

## 🎨 Frontend Kurulumu

### Adımlar
1. `cd frontend`
2. `npm install`
3. `.env.local` dosyası oluştur
4. `npm run dev`

### Kontroller
- [ ] Frontend açılıyor (http://localhost:3000)
- [ ] Tailwind CSS aktif
- [ ] API bağlantısı çalışıyor

---

## 📱 Mobile Kurulumu (Opsiyonel)

### Adımlar
1. `cd mobile`
2. `npm install`
3. `npm start`

### Kontroller
- [ ] Expo başlıyor
- [ ] QR kod görünüyor
- [ ] Uygulama açılıyor

---

## 🎉 Kurulum Tamamlandı!

Tüm sistemler çalışır durumda. Geliştirmeye başlayabilirsiniz!
