# Asansör Takip Sistemi - API Endpoints

Base URL: `http://localhost:5000`

## Authentication

### POST /api/auth/register
Yeni kullanıcı kaydı

**Request Body:**
```json
{
  "email": "teknisyen@example.com",
  "password": "SecurePassword123",
  "firstName": "Ahmet",
  "lastName": "Yılmaz",
  "phone": "+905551234567",
  "role": "TECHNICIAN"
}
```

**Response:**
```json
{
  "message": "Kullanıcı başarıyla oluşturuldu",
  "user": { ... },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### POST /api/auth/login
Kullanıcı girişi

**Request Body:**
```json
{
  "email": "teknisyen@example.com",
  "password": "SecurePassword123"
}
```

**Response:**
```json
{
  "message": "Giriş başarılı",
  "user": { ... },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### GET /api/auth/profile
Kullanıcı profili (requires authentication)

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "id": "clx...",
  "email": "teknisyen@example.com",
  "firstName": "Ahmet",
  "lastName": "Yılmaz",
  "role": "TECHNICIAN"
}
```

## Elevators

### GET /api/elevators
Tüm asansörleri listele (requires authentication)

**Query Parameters:**
- `status`: ACTIVE | INACTIVE | MAINTENANCE | FAULTY
- `type`: PASSENGER | FREIGHT | HYBRID
- `buildingId`: Building ID

**Response:**
```json
[
  {
    "id": "clx...",
    "serialNumber": "ASN-2024-001",
    "type": "PASSENGER",
    "brand": "KONE",
    "model": "MonoSpace 500",
    "capacity": 630,
    "personCapacity": 8,
    "floors": 10,
    "status": "ACTIVE",
    "qrCode": "data:image/png;base64,...",
    "building": { ... }
  }
]
```

### GET /api/elevators/:id
Asansör detayı (requires authentication)

### POST /api/elevators
Yeni asansör oluştur (requires ADMIN/MANAGER role)

**Request Body:**
```json
{
  "serialNumber": "ASN-2024-001",
  "type": "PASSENGER",
  "brand": "KONE",
  "model": "MonoSpace 500",
  "capacity": 630,
  "personCapacity": 8,
  "floors": 10,
  "ceNumber": "CE-12345",
  "buildingId": "clx..."
}
```

### PUT /api/elevators/:id
Asansör güncelle (requires ADMIN/MANAGER role)

### DELETE /api/elevators/:id
Asansör sil (requires ADMIN role)

### POST /api/elevators/:id/qrcode
QR kod yeniden oluştur (requires ADMIN/MANAGER role)

## Maintenances

### GET /api/maintenances
Tüm bakımları listele (requires authentication)

**Query Parameters:**
- `status`: SCHEDULED | IN_PROGRESS | COMPLETED | CANCELLED
- `elevatorId`: Elevator ID
- `technicianId`: Technician user ID
- `startDate`: ISO date string
- `endDate`: ISO date string

### GET /api/maintenances/:id
Bakım detayı (requires authentication)

### POST /api/maintenances
Yeni bakım oluştur (requires ADMIN/MANAGER/TECHNICIAN role)

**Request Body:**
```json
{
  "elevatorId": "clx...",
  "scheduledDate": "2024-02-20T10:00:00Z",
  "technicianId": "clx...",
  "notes": "Rutin bakım",
  "checklistItems": [
    {
      "category": "Kabin",
      "itemNumber": 1,
      "description": "Kabin aydınlatması",
      "isCompliant": true
    }
  ]
}
```

### PUT /api/maintenances/:id
Bakım güncelle (requires ADMIN/MANAGER/TECHNICIAN role)

### POST /api/maintenances/:id/complete
Bakımı tamamla (requires ADMIN/MANAGER/TECHNICIAN role)

**Request Body:**
```json
{
  "technicianSignature": "data:image/png;base64,...",
  "customerSignature": "data:image/png;base64,...",
  "customerName": "Ahmet Yılmaz",
  "duration": 120
}
```

### PUT /api/maintenances/checklist/:id
Kontrol maddesi güncelle (requires ADMIN/MANAGER/TECHNICIAN role)

**Request Body:**
```json
{
  "isCompliant": true,
  "notes": "Kontrol edildi, sorun yok",
  "photoUrl": "https://..."
}
```

### POST /api/maintenances/:maintenanceId/materials
Kullanılan malzeme ekle (requires ADMIN/MANAGER/TECHNICIAN role)

**Request Body:**
```json
{
  "name": "Fren Pabucu",
  "quantity": 2,
  "unit": "adet",
  "notes": "Orijinal parça"
}
```

### GET /api/maintenances/:id/pdf
Bakım raporunu PDF olarak indir (requires authentication)

**Response:** PDF file

### GET /api/maintenances/:id/excel
Bakım raporunu Excel olarak indir (requires authentication)

**Response:** Excel file

## Error Responses

All endpoints may return the following error responses:

**401 Unauthorized:**
```json
{
  "error": "Token bulunamadı"
}
```

**403 Forbidden:**
```json
{
  "error": "Bu işlem için yetkiniz yok"
}
```

**404 Not Found:**
```json
{
  "error": "Kayıt bulunamadı"
}
```

**500 Internal Server Error:**
```json
{
  "error": "Sunucu hatası"
}
```
