# 🏗️ Asansör Takip Sistemi - Sistem Mimarisi

## 📐 Genel Mimari

```
┌─────────────────────────────────────────────────────────────┐
│                    Client Layer (Presentation)               │
├────────────────┬──────────────────┬─────────────────────────┤
│   Web Client   │  Mobile Client   │   Admin Dashboard       │
│   (Next.js)    │  (React Native)  │   (Next.js)            │
│   Port: 3000   │   (Expo)         │                         │
└────────┬───────┴────────┬─────────┴──────────┬──────────────┘
         │                │                    │
         │ HTTP/REST      │ HTTP/REST          │ HTTP/REST
         │ + JWT          │ + JWT              │ + JWT
         │                │                    │
┌────────▼────────────────▼────────────────────▼──────────────┐
│                  API Gateway / Backend                       │
│              (Express.js + TypeScript)                       │
│                   Port: 5000                                 │
├──────────────────────────────────────────────────────────────┤
│  Controllers  │  Routes  │  Middleware  │  Services          │
│  - Auth       │  - Auth  │  - JWT Auth  │  - QR Code        │
│  - Elevator   │  - Elev. │  - RBAC      │  - PDF Gen.       │
│  - Mainten.   │  - Main. │  - Validation│  - Excel I/E      │
└────────┬───────────────────────────────────────┬─────────────┘
         │                                       │
         │ Prisma ORM                           │ File Storage
         │                                       │
┌────────▼──────────────────────┐    ┌──────────▼──────────────┐
│   PostgreSQL Database         │    │   File System           │
│   Port: 5432                  │    │   - QR Codes            │
│                               │    │   - PDF Reports         │
│  Tables:                      │    │   - Excel Files         │
│  - User                       │    │   - Documents           │
│  - Company                    │    │   - Photos              │
│  - Building                   │    │   - Signatures          │
│  - Elevator                   │    └─────────────────────────┘
│  - Maintenance                │
│  - ChecklistTemplate          │
│  - MaintenanceChecklistItem   │
│  - UsedMaterial               │
│  - Fault                      │
│  - Inspection                 │
│  - Contract                   │
│  - Document                   │
└───────────────────────────────┘
```

## 🔄 Data Flow

### 1. Authentication Flow
```
User → Frontend → POST /api/auth/login → Backend
                                       ↓
                              [Validate Credentials]
                                       ↓
                              [Generate JWT Token]
                                       ↓
Frontend ← {token, user} ← Backend
    ↓
[Store token in localStorage]
    ↓
[Include in all subsequent requests]
```

### 2. Elevator Management Flow
```
Admin → Create Elevator → POST /api/elevators
                              ↓
                      [Validate Input]
                              ↓
                      [Save to Database]
                              ↓
                      [Generate QR Code]
                              ↓
                      [Save QR Code]
                              ↓
        Elevator Created ← Response
```

### 3. Maintenance Flow
```
Technician → Scan QR Code (Mobile)
                 ↓
         [Parse QR Data]
                 ↓
         GET /api/elevators/:id
                 ↓
         [Display Elevator Info]
                 ↓
    POST /api/maintenances (Create)
                 ↓
         [Fill 46-item Checklist]
                 ↓
         [Add Photos]
                 ↓
         [Add Used Materials]
                 ↓
         [Get Signatures]
                 ↓
    POST /api/maintenances/:id/complete
                 ↓
    GET /api/maintenances/:id/pdf
                 ↓
         [Generate PDF Report]
```

## 🔐 Security Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Security Layers                       │
├─────────────────────────────────────────────────────────┤
│  1. Transport Layer (HTTPS in production)               │
├─────────────────────────────────────────────────────────┤
│  2. Authentication Layer (JWT)                          │
│     - Token in Authorization header                     │
│     - Expiry: 7 days                                    │
│     - Secret: Environment variable                      │
├─────────────────────────────────────────────────────────┤
│  3. Authorization Layer (RBAC)                          │
│     - Admin: Full access                                │
│     - Manager: Company-level access                     │
│     - Technician: Maintenance operations                │
│     - Customer: Read-only access                        │
├─────────────────────────────────────────────────────────┤
│  4. Data Layer                                          │
│     - Passwords: Bcrypt hashing                         │
│     - SQL Injection: Prisma ORM protection              │
│     - XSS: React automatic escaping                     │
├─────────────────────────────────────────────────────────┤
│  5. Validation Layer                                    │
│     - Input validation                                  │
│     - Type checking (TypeScript)                        │
│     - Sanitization                                      │
└─────────────────────────────────────────────────────────┘
```

## 📱 Mobile Architecture

```
┌─────────────────────────────────────────────────────────┐
│              React Native App (Expo)                     │
├──────────────────┬──────────────────────────────────────┤
│   Screens        │   Components      │   Services       │
├──────────────────┼──────────────────────────────────────┤
│ - QRScanner      │ - Button          │ - API Client     │
│ - MaintenanceForm│ - Card            │ - Auth Service   │
│ - Login          │ - Input           │ - Storage        │
│ - Dashboard      │ - Camera          │                  │
│                  │ - SignaturePad    │                  │
└──────────────────┴──────────────────────────────────────┘
         │                    │
         │ Expo APIs          │ REST API
         ↓                    ↓
┌─────────────────┐  ┌──────────────────────┐
│ Native Modules  │  │   Backend API        │
│ - Camera        │  │   (Express)          │
│ - Image Picker  │  │                      │
│ - File System   │  │                      │
└─────────────────┘  └──────────────────────┘
```

## 🗄️ Database Schema (Simplified)

```
Company
  ├─ id (PK)
  ├─ name
  └─ taxNumber (Unique)
      │
      ├───┐
      │   └── User (FK: companyId)
      │         ├─ id (PK)
      │         ├─ email (Unique)
      │         ├─ password (Hashed)
      │         └─ role (Enum)
      │
      └───┐
          └── Building (FK: companyId)
                ├─ id (PK)
                ├─ name
                └─ address
                    │
                    └───┐
                        └── Elevator (FK: buildingId)
                              ├─ id (PK)
                              ├─ serialNumber (Unique)
                              ├─ qrCode (Unique)
                              └─ status (Enum)
                                  │
                                  ├───┐
                                  │   └── Maintenance (FK: elevatorId)
                                  │         ├─ id (PK)
                                  │         ├─ status (Enum)
                                  │         └─ technicianId (FK)
                                  │             │
                                  │             ├── ChecklistItem[]
                                  │             └── UsedMaterial[]
                                  │
                                  ├───┐
                                  │   └── Fault (FK: elevatorId)
                                  │         ├─ id (PK)
                                  │         └─ status (Enum)
                                  │
                                  └───┐
                                      └── Inspection (FK: elevatorId)
                                            ├─ id (PK)
                                            └─ expiryDate
```

## 🔌 API Architecture

### REST API Design

```
/api
├── /auth
│   ├── POST   /register     (Public)
│   ├── POST   /login        (Public)
│   └── GET    /profile      (Protected)
│
├── /elevators
│   ├── GET    /             (Protected)
│   ├── GET    /:id          (Protected)
│   ├── POST   /             (Admin/Manager)
│   ├── PUT    /:id          (Admin/Manager)
│   ├── DELETE /:id          (Admin)
│   └── POST   /:id/qrcode   (Admin/Manager)
│
├── /maintenances
│   ├── GET    /                    (Protected)
│   ├── GET    /:id                 (Protected)
│   ├── POST   /                    (Tech+)
│   ├── PUT    /:id                 (Tech+)
│   ├── POST   /:id/complete        (Tech+)
│   ├── PUT    /checklist/:id       (Tech+)
│   ├── POST   /:id/materials       (Tech+)
│   ├── GET    /:id/pdf             (Protected)
│   └── GET    /:id/excel           (Protected)
│
└── /faults (Future)
    └── ...
```

## 🎨 Frontend Architecture (Next.js 14)

```
frontend/
├── src/
│   ├── app/                    (App Router)
│   │   ├── layout.tsx          (Root layout)
│   │   ├── page.tsx            (Homepage)
│   │   ├── globals.css         (Global styles)
│   │   ├── login/
│   │   │   └── page.tsx
│   │   └── dashboard/
│   │       ├── page.tsx
│   │       ├── elevators/
│   │       ├── maintenances/
│   │       └── faults/
│   │
│   ├── components/             (Reusable components)
│   │   ├── ui/                 (Shadcn components)
│   │   ├── layout/
│   │   └── features/
│   │
│   ├── lib/                    (Utilities)
│   │   ├── api.ts              (API client)
│   │   └── utils.ts            (Helpers)
│   │
│   └── types/                  (TypeScript types)
│       └── index.ts
│
└── public/
    └── assets/
```

## 🚀 Deployment Architecture (Future)

```
┌─────────────────────────────────────────────────────────┐
│                     Load Balancer                        │
│                    (NGINX/CloudFlare)                    │
└────────────┬────────────────────────────┬────────────────┘
             │                            │
    ┌────────▼────────┐          ┌───────▼────────┐
    │  Frontend       │          │  Frontend      │
    │  (Next.js)      │          │  (Next.js)     │
    │  Vercel/Docker  │          │  Vercel/Docker │
    └─────────────────┘          └────────────────┘
             │                            │
             └──────────┬─────────────────┘
                        │
             ┌──────────▼──────────┐
             │   Backend Cluster   │
             │   (PM2/Docker)      │
             │   Node.js Instances │
             └──────────┬──────────┘
                        │
        ┌───────────────┼───────────────┐
        │               │               │
┌───────▼──────┐ ┌─────▼─────┐ ┌──────▼──────┐
│ PostgreSQL   │ │   Redis   │ │  File Store │
│ (RDS/Cloud)  │ │  (Cache)  │ │  (S3/Cloud) │
└──────────────┘ └───────────┘ └─────────────┘
```

## 📊 Performance Considerations

### Database Optimization
- Indexes on foreign keys
- Unique constraints
- Proper data types
- Connection pooling (Prisma)

### API Optimization
- Response pagination
- Query filtering
- Field selection
- Caching (Future: Redis)

### Frontend Optimization
- Next.js SSR/SSG
- Image optimization
- Code splitting
- Lazy loading

### Mobile Optimization
- Offline support (Future)
- Local caching
- Optimistic updates
- Background sync

---

✨ **Sistem mimarisi modüler, ölçeklenebilir ve güvenli bir şekilde tasarlanmıştır.**
