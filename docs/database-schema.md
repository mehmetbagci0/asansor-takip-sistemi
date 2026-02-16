# Veritabanı Şeması Dokümantasyonu

## 📊 Genel Bakış

Asansör Takip Sistemi, PostgreSQL veritabanı ve Prisma ORM kullanmaktadır. Sistem, asansörlerin, bakımların, arızaların ve ilgili tüm verilerin yönetimini sağlar.

## 🗃️ Tablolar ve İlişkiler

### User (Kullanıcılar)
Sistem kullanıcılarını saklar.

**Alanlar:**
- `id`: String (CUID) - Primary key
- `email`: String (Unique) - E-posta adresi
- `password`: String - Hashlenmiş şifre
- `firstName`: String - Ad
- `lastName`: String - Soyad
- `phone`: String? - Telefon numarası (opsiyonel)
- `role`: UserRole - Kullanıcı rolü (ADMIN, TECHNICIAN, CUSTOMER, MANAGER)
- `isActive`: Boolean - Aktif mi? (default: true)
- `companyId`: String? - Bağlı olduğu firma ID'si
- `createdAt`: DateTime - Oluşturma tarihi
- `updatedAt`: DateTime - Güncellenme tarihi

**İlişkiler:**
- Company (Many-to-One)
- Maintenance[] (One-to-Many) - Yaptığı bakımlar
- Fault[] (One-to-Many) - Atandığı arızalar

### Company (Firmalar)
Asansör bakım firmalarını saklar.

**Alanlar:**
- `id`: String (CUID)
- `name`: String - Firma adı
- `taxNumber`: String? (Unique) - Vergi numarası
- `address`: String? - Adres
- `phone`: String? - Telefon
- `email`: String? - E-posta
- `website`: String? - Web sitesi
- `createdAt`: DateTime
- `updatedAt`: DateTime

**İlişkiler:**
- User[] (One-to-Many) - Çalışanlar
- Building[] (One-to-Many) - Sorumlu olduğu binalar
- Contract[] (One-to-Many) - Sözleşmeler

### Building (Binalar)
Asansörlerin bulunduğu binaları saklar.

**Alanlar:**
- `id`: String (CUID)
- `name`: String - Bina adı
- `address`: String - Adres
- `city`: String? - Şehir
- `district`: String? - İlçe
- `postalCode`: String? - Posta kodu
- `latitude`: Float? - Enlem (harita için)
- `longitude`: Float? - Boylam (harita için)
- `contactName`: String? - İletişim kişisi
- `contactPhone`: String? - İletişim telefonu
- `contactEmail`: String? - İletişim e-posta
- `companyId`: String? - Bağlı olduğu firma
- `createdAt`: DateTime
- `updatedAt`: DateTime

**İlişkiler:**
- Company (Many-to-One)
- Elevator[] (One-to-Many) - Binadaki asansörler

### Elevator (Asansörler)
Asansör bilgilerini saklar.

**Alanlar:**
- `id`: String (CUID)
- `serialNumber`: String (Unique) - Seri numarası
- `type`: ElevatorType - Tip (PASSENGER, FREIGHT, HYBRID)
- `brand`: String? - Marka
- `model`: String? - Model
- `capacity`: Int? - Kapasite (kg)
- `personCapacity`: Int? - Kişi kapasitesi
- `floors`: Int? - Kat sayısı
- `yearInstalled`: Int? - Kurulum yılı
- `ceNumber`: String? - CE numarası
- `status`: ElevatorStatus - Durum (ACTIVE, INACTIVE, MAINTENANCE, FAULTY)
- `qrCode`: String? (Unique) - QR kod (Base64 image)
- `notes`: String? - Notlar
- `buildingId`: String - Bulunduğu bina
- `createdAt`: DateTime
- `updatedAt`: DateTime

**İlişkiler:**
- Building (Many-to-One)
- Maintenance[] (One-to-Many) - Bakım kayıtları
- Fault[] (One-to-Many) - Arıza kayıtları
- Document[] (One-to-Many) - Dökümanlar
- Inspection[] (One-to-Many) - Fenni muayeneler

### Maintenance (Bakım Kayıtları)
Asansör bakım işlemlerini saklar.

**Alanlar:**
- `id`: String (CUID)
- `scheduledDate`: DateTime - Planlanan tarih
- `completedDate`: DateTime? - Tamamlanma tarihi
- `status`: MaintenanceStatus - Durum (SCHEDULED, IN_PROGRESS, COMPLETED, CANCELLED)
- `duration`: Int? - Süre (dakika)
- `notes`: String? - Notlar
- `elevatorId`: String - Asansör ID
- `technicianId`: String? - Teknisyen ID
- `technicianSignature`: String? - Teknisyen imzası (Base64)
- `customerSignature`: String? - Müşteri imzası (Base64)
- `customerName`: String? - Müşteri adı
- `createdAt`: DateTime
- `updatedAt`: DateTime

**İlişkiler:**
- Elevator (Many-to-One)
- User/Technician (Many-to-One)
- MaintenanceChecklistItem[] (One-to-Many) - Kontrol maddeleri
- UsedMaterial[] (One-to-Many) - Kullanılan malzemeler
- Document[] (One-to-Many) - Dökümanlar

### ChecklistTemplate (Kontrol Listesi Şablonu)
46 maddelik kontrol listesi şablonunu saklar.

**Alanlar:**
- `id`: String (CUID)
- `category`: String - Kategori (örn: "Kabin", "Makine Dairesi")
- `itemNumber`: Int - Madde numarası (1-46)
- `description`: String - Açıklama
- `isActive`: Boolean - Aktif mi?
- `order`: Int - Sıra numarası
- `createdAt`: DateTime

**Kullanım:**
Bu şablondan yeni bakım kaydı oluşturulurken MaintenanceChecklistItem'lar oluşturulur.

### MaintenanceChecklistItem (Bakım Kontrol Maddeleri)
Bakım sırasında kontrol edilen maddeler.

**Alanlar:**
- `id`: String (CUID)
- `category`: String - Kategori
- `itemNumber`: Int - Madde numarası
- `description`: String - Açıklama
- `isCompliant`: Boolean? - Uygun mu? (true/false/null)
- `notes`: String? - Notlar
- `photoUrl`: String? - Fotoğraf URL'si
- `maintenanceId`: String - Bağlı olduğu bakım

**İlişkiler:**
- Maintenance (Many-to-One) - Cascade delete

### UsedMaterial (Kullanılan Malzemeler)
Bakımda kullanılan malzemeleri saklar.

**Alanlar:**
- `id`: String (CUID)
- `name`: String - Malzeme adı
- `quantity`: Int - Miktar
- `unit`: String? - Birim (adet, kg, m vs.)
- `notes`: String? - Notlar
- `maintenanceId`: String - Bağlı olduğu bakım

**İlişkiler:**
- Maintenance (Many-to-One) - Cascade delete

### Fault (Arızalar)
Asansör arızalarını saklar.

**Alanlar:**
- `id`: String (CUID)
- `title`: String - Arıza başlığı
- `description`: String - Detaylı açıklama
- `status`: FaultStatus - Durum (OPEN, IN_PROGRESS, RESOLVED, CLOSED)
- `priority`: String? - Öncelik (Low, Medium, High)
- `reportedDate`: DateTime - Bildirim tarihi (default: now)
- `resolvedDate`: DateTime? - Çözüm tarihi
- `resolution`: String? - Çözüm açıklaması
- `elevatorId`: String - Asansör ID
- `assignedToId`: String? - Atanan teknisyen ID
- `createdAt`: DateTime
- `updatedAt`: DateTime

**İlişkiler:**
- Elevator (Many-to-One)
- User/AssignedTo (Many-to-One)
- Document[] (One-to-Many)

### Inspection (Fenni Muayeneler)
Periyodik fenni muayene kayıtlarını saklar.

**Alanlar:**
- `id`: String (CUID)
- `inspectionDate`: DateTime - Muayene tarihi
- `expiryDate`: DateTime - Son geçerlilik tarihi
- `result`: String? - Sonuç
- `inspectorName`: String? - Muayene eden kişi
- `certificateNo`: String? - Sertifika numarası
- `notes`: String? - Notlar
- `documentUrl`: String? - Belge URL'si
- `elevatorId`: String - Asansör ID
- `createdAt`: DateTime
- `updatedAt`: DateTime

**İlişkiler:**
- Elevator (Many-to-One)

### Contract (Sözleşmeler)
Bakım sözleşmelerini saklar.

**Alanlar:**
- `id`: String (CUID)
- `contractNo`: String (Unique) - Sözleşme numarası
- `startDate`: DateTime - Başlangıç tarihi
- `endDate`: DateTime - Bitiş tarihi
- `amount`: Float? - Tutar
- `paymentPeriod`: String? - Ödeme periyodu
- `notes`: String? - Notlar
- `documentUrl`: String? - Sözleşme belgesi URL'si
- `companyId`: String - Firma ID
- `createdAt`: DateTime
- `updatedAt`: DateTime

**İlişkiler:**
- Company (Many-to-One)

### Document (Dökümanlar)
Çeşitli belgeleri saklar.

**Alanlar:**
- `id`: String (CUID)
- `fileName`: String - Dosya adı
- `fileUrl`: String - Dosya URL'si
- `fileType`: String - Dosya tipi (MIME type)
- `fileSize`: Int? - Dosya boyutu (bytes)
- `description`: String? - Açıklama
- `elevatorId`: String? - İlişkili asansör
- `maintenanceId`: String? - İlişkili bakım
- `faultId`: String? - İlişkili arıza
- `createdAt`: DateTime

**İlişkiler:**
- Elevator (Many-to-One)
- Maintenance (Many-to-One)
- Fault (Many-to-One)

## 🔄 İlişki Diyagramı

```
Company
  ├── User[]
  ├── Building[]
  │   └── Elevator[]
  │       ├── Maintenance[]
  │       │   ├── MaintenanceChecklistItem[]
  │       │   ├── UsedMaterial[]
  │       │   └── Document[]
  │       ├── Fault[]
  │       │   └── Document[]
  │       ├── Inspection[]
  │       └── Document[]
  └── Contract[]
```

## 📝 Enum Değerleri

### UserRole
- `ADMIN` - Sistem yöneticisi
- `TECHNICIAN` - Teknisyen/Bakım görevlisi
- `CUSTOMER` - Müşteri
- `MANAGER` - Firma yöneticisi

### ElevatorType
- `PASSENGER` - Yolcu asansörü
- `FREIGHT` - Yük asansörü
- `HYBRID` - Karma tip

### ElevatorStatus
- `ACTIVE` - Aktif/Çalışıyor
- `INACTIVE` - Devre dışı
- `MAINTENANCE` - Bakımda
- `FAULTY` - Arızalı

### MaintenanceStatus
- `SCHEDULED` - Planlandı
- `IN_PROGRESS` - Devam ediyor
- `COMPLETED` - Tamamlandı
- `CANCELLED` - İptal edildi

### FaultStatus
- `OPEN` - Açık
- `IN_PROGRESS` - Çözüm aşamasında
- `RESOLVED` - Çözüldü
- `CLOSED` - Kapatıldı

## 🔍 Sık Kullanılan Sorgular

### Aktif asansörleri getir
```typescript
const elevators = await prisma.elevator.findMany({
  where: { status: 'ACTIVE' },
  include: { building: true }
});
```

### Bekleyen bakımları getir
```typescript
const maintenances = await prisma.maintenance.findMany({
  where: { 
    status: 'SCHEDULED',
    scheduledDate: { lte: new Date() }
  },
  include: { elevator: true, technician: true }
});
```

### Teknisyen bazlı istatistikler
```typescript
const stats = await prisma.maintenance.groupBy({
  by: ['technicianId'],
  _count: { id: true },
  where: { status: 'COMPLETED' }
});
```

## 🔐 Güvenlik Notları

1. **Şifreler**: bcrypt ile hashlenmiş (cost: 10)
2. **Cascade Delete**: MaintenanceChecklistItem ve UsedMaterial silindiğinde otomatik temizlenir
3. **Unique Constraints**: Email, serialNumber, taxNumber, contractNo
4. **Soft Delete**: isActive flag ile soft delete desteklenir

## 📊 Index Stratejisi

Prisma otomatik olarak şu index'leri oluşturur:
- Primary keys (id)
- Unique constraints (email, serialNumber, etc.)
- Foreign keys (Relations)

Performans için ek index'ler eklenebilir:
```prisma
@@index([scheduledDate])
@@index([status])
@@index([createdAt])
```

## 🔄 Migration

```bash
# Yeni migration oluştur
npx prisma migrate dev --name add_new_field

# Production'a uygula
npx prisma migrate deploy

# Migration'ları sıfırla (DEV ONLY!)
npx prisma migrate reset
```
