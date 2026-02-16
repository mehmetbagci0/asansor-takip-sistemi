# 🏢 Asansör Takip Sistemi

Modern, QR kod tabanlı asansör bakım, arıza takip ve yönetim platformu.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-18+-green.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue.svg)

## 📋 Proje Hakkında

Asansör Takip Sistemi, asansör bakım firmalarının bakım süreçlerini dijitalleştirmek, takip etmek ve raporlamak için geliştirilmiş kapsamlı bir full-stack uygulamadır.

### 🎯 Temel Özellikler

- ✅ **QR Kod Sistemi**: Her asansör için unique QR kod oluşturma ve okuma
- ✅ **Bakım Yönetimi**: 46 maddelik detaylı kontrol listesi
- ✅ **Arıza Takibi**: Arızaları kaydetme, atama ve çözüm sürecini takip
- ✅ **Rapor Oluşturma**: PDF ve Excel formatında profesyonel raporlar
- ✅ **Mobil Destek**: React Native ile iOS ve Android desteği
- ✅ **İmza Sistemi**: Dijital imza alma ve saklama
- ✅ **Fotoğraf Yükleme**: Bakım fotoğrafları yükleme ve saklama
- ✅ **Fenni Muayene**: Periyodik muayene kayıtları ve takibi
- ✅ **Çoklu Kullanıcı**: Admin, Yönetici, Teknisyen ve Müşteri rolleri

## 🏗️ Teknoloji Stack

### Backend
- **Node.js** + **TypeScript** + **Express.js**
- **PostgreSQL** veritabanı
- **Prisma ORM** - Type-safe veritabanı erişimi
- **JWT** - Kimlik doğrulama
- **ExcelJS** - Excel import/export
- **PDFKit** - PDF rapor oluşturma
- **QRCode** - QR kod üretimi
- **Multer** - Dosya yükleme

### Frontend
- **Next.js 14** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first CSS
- **Shadcn/ui** - UI component library
- **Axios** - HTTP client
- **Recharts** - Grafikler
- **React Hook Form** - Form yönetimi

### Mobile
- **React Native** + **Expo**
- **TypeScript**
- **Expo Camera** - QR kod okuma
- **Expo Image Picker** - Fotoğraf yükleme
- **React Native Signature Canvas** - İmza alma

## 📁 Proje Yapısı

```
asansor-takip-sistemi/
├── backend/              # Node.js + Express + Prisma
│   ├── src/
│   │   ├── controllers/  # API controllers
│   │   ├── routes/       # API routes
│   │   ├── services/     # Business logic
│   │   ├── middleware/   # Auth, validation
│   │   └── utils/        # Helper functions
│   ├── prisma/
│   │   └── schema.prisma # Database schema
│   └── package.json
├── frontend/             # Next.js 14
│   ├── src/
│   │   ├── app/          # App router pages
│   │   ├── components/   # React components
│   │   ├── lib/          # Utilities
│   │   └── types/        # TypeScript types
│   └── package.json
├── mobile/               # React Native + Expo
│   ├── src/
│   │   ├── screens/      # App screens
│   │   ├── components/   # React Native components
│   │   └── navigation/   # Navigation setup
│   └── package.json
├── docs/                 # Documentation
│   ├── api-endpoints.md
│   └── setup-guide.md
└── README.md
```

## 🚀 Hızlı Başlangıç

### Gereksinimler

- Node.js 18+
- PostgreSQL 14+
- npm veya yarn

### Backend Kurulumu

```bash
# Backend dizinine git
cd backend

# Bağımlılıkları yükle
npm install

# .env dosyası oluştur
cp .env.example .env

# Prisma client oluştur ve migration yap
npm run prisma:generate
npm run prisma:migrate

# Sunucuyu başlat
npm run dev
```

Backend http://localhost:5000 adresinde çalışacak.

### Frontend Kurulumu

```bash
# Frontend dizinine git
cd frontend

# Bağımlılıkları yükle
npm install

# .env.local dosyası oluştur
cp .env.local.example .env.local

# Development server'ı başlat
npm run dev
```

Frontend http://localhost:3000 adresinde çalışacak.

### Mobile Kurulumu

```bash
# Mobile dizinine git
cd mobile

# Bağımlılıkları yükle
npm install

# Expo'yu başlat
npm start
```

Detaylı kurulum için [Setup Guide](./docs/setup-guide.md) dosyasına bakın.

## 📊 Veritabanı Şeması

Veritabanı şeması Prisma ile yönetilmektedir. Temel modeller:

- **User** - Kullanıcılar (Admin, Teknisyen, Müşteri, Yönetici)
- **Company** - Firmalar
- **Building** - Binalar
- **Elevator** - Asansörler
- **Maintenance** - Bakım kayıtları
- **MaintenanceChecklistItem** - Bakım kontrol maddeleri (46 madde)
- **UsedMaterial** - Kullanılan malzemeler
- **Fault** - Arızalar
- **Inspection** - Fenni muayeneler
- **Contract** - Sözleşmeler
- **Document** - Dökümanlar

Detaylı şema için [backend/prisma/schema.prisma](./backend/prisma/schema.prisma) dosyasına bakın.

## 🔌 API Endpoints

API dokümantasyonu için [API Endpoints](./docs/api-endpoints.md) dosyasına bakın.

Temel endpoint'ler:
- `POST /api/auth/login` - Kullanıcı girişi
- `GET /api/elevators` - Asansör listesi
- `POST /api/elevators` - Yeni asansör
- `GET /api/maintenances` - Bakım kayıtları
- `POST /api/maintenances` - Yeni bakım
- `GET /api/maintenances/:id/pdf` - PDF rapor

## 📱 Mobil Uygulama

Mobil uygulama özellikleri:
- QR kod okuyucu
- Bakım formu doldurma
- Fotoğraf çekme ve yükleme
- Dijital imza alma
- Offline çalışma desteği (yakında)

## 🔐 Güvenlik

- JWT tabanlı kimlik doğrulama
- Bcrypt ile şifre hashleme
- Role-based access control (RBAC)
- Input validation
- SQL injection koruması (Prisma ORM)

## 🧪 Test

```bash
# Backend testleri
cd backend
npm test

# Frontend testleri
cd frontend
npm test
```

## 📈 Roadmap

### Phase 1 (Tamamlandı) ✅
- [x] Backend API
- [x] Frontend temel yapı
- [x] Mobile temel yapı
- [x] QR kod sistemi
- [x] Bakım yönetimi
- [x] PDF/Excel export

### Phase 2 (Planlanan)
- [ ] Dashboard istatistikleri
- [ ] Bildirim sistemi
- [ ] Email entegrasyonu
- [ ] Detaylı raporlama
- [ ] Offline mode (mobile)
- [ ] Multi-language support

### Phase 3 (Gelecek)
- [ ] IoT sensör entegrasyonu
- [ ] Makine öğrenmesi ile arıza tahmini
- [ ] Mobil push notifications
- [ ] Gelişmiş analitik

## 🤝 Katkıda Bulunma

Katkılarınızı bekliyoruz! Lütfen:

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit yapın (`git commit -m 'feat: Add amazing feature'`)
4. Branch'i push edin (`git push origin feature/amazing-feature`)
5. Pull Request açın

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır. Detaylar için [LICENSE](LICENSE) dosyasına bakın.

## 👥 İletişim

Proje Sahibi - [@mehmetbagci0](https://github.com/mehmetbagci0)

Proje Link: [https://github.com/mehmetbagci0/asansor-takip-sistemi](https://github.com/mehmetbagci0/asansor-takip-sistemi)

## 🙏 Teşekkürler

- [Next.js](https://nextjs.org/)
- [Prisma](https://www.prisma.io/)
- [Shadcn/ui](https://ui.shadcn.com/)
- [Expo](https://expo.dev/)
- Tüm açık kaynak katkıda bulunanlara

---

⭐ Projeyi beğendiyseniz yıldız vermeyi unutmayın!