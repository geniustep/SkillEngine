# Academy LMS Backend API

نظام إدارة التعلم - Backend API

## 🚀 التقنيات المستخدمة

- **Framework**: NestJS 10
- **Database**: PostgreSQL 16 + Prisma ORM
- **Cache**: Redis 7
- **Storage**: AWS S3 / MinIO
- **Authentication**: Keycloak + JWT
- **Real-time**: Pusher
- **Video Conferencing**: Daily.co
- **Documentation**: Swagger/OpenAPI

## 📁 هيكل المشروع

```
backend/
├── src/
│   ├── modules/
│   │   ├── auth/           # المصادقة والصلاحيات
│   │   ├── users/          # إدارة المستخدمين
│   │   ├── courses/        # إدارة الدورات
│   │   ├── sessions/       # الجلسات المباشرة
│   │   ├── instructors/    # المدربين
│   │   ├── enrollments/    # التسجيلات
│   │   ├── analytics/      # التحليلات
│   │   ├── notifications/  # الإشعارات
│   │   ├── tenants/        # Multi-tenancy
│   │   ├── upload/         # رفع الملفات
│   │   └── health/         # Health checks
│   ├── common/
│   │   ├── guards/         # Route guards
│   │   ├── interceptors/   # Request/Response interceptors
│   │   ├── decorators/     # Custom decorators
│   │   ├── filters/        # Exception filters
│   │   └── dto/            # Common DTOs
│   ├── config/             # Configuration
│   └── database/           # Database module
├── prisma/
│   ├── schema.prisma       # Database schema
│   └── seed.ts             # Seed data
└── test/                   # Tests
```

## 🛠️ التثبيت والتشغيل

### المتطلبات

- Node.js 20+
- PostgreSQL 16+
- Redis 7+
- Docker (اختياري)

### التشغيل باستخدام Docker

```bash
# تشغيل جميع الخدمات
docker-compose up -d

# تشغيل migrations
docker-compose exec api npx prisma migrate dev

# تشغيل seed
docker-compose exec api npx prisma db seed
```

### التشغيل محلياً

```bash
# تثبيت المتطلبات
npm install

# إنشاء ملف البيئة
cp env.example .env

# تشغيل migrations
npx prisma migrate dev

# تشغيل seed
npx prisma db seed

# تشغيل الخادم
npm run start:dev
```

## 📚 API Documentation

بعد تشغيل الخادم، يمكنك الوصول إلى:

- **Swagger UI**: http://localhost:8000/docs
- **Health Check**: http://localhost:8000/health

## 🔐 المصادقة

يستخدم النظام JWT للمصادقة. يجب إرسال الرمز في كل طلب:

```
Authorization: Bearer {access_token}
X-Tenant-ID: {tenant_uuid}
```

## 📊 نماذج البيانات الرئيسية

### Users (المستخدمون)
- الأدوار: `student`, `instructor`, `admin`, `super_admin`, `content_manager`, `pedagogic_manager`

### Courses (الدورات)
- الحالات: `draft`, `published`, `archived`
- المستويات: `beginner`, `intermediate`, `advanced`

### Sessions (الجلسات)
- الحالات: `scheduled`, `live`, `completed`, `cancelled`
- المنصات: `daily`, `bbb`, `zoom`, `teams`

### Enrollments (التسجيلات)
- الحالات: `active`, `completed`, `dropped`, `expired`

## 🧪 الاختبارات

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Coverage
npm run test:cov
```

## 📝 الأوامر المفيدة

```bash
# Prisma Studio
npm run db:studio

# Generate Prisma client
npm run db:generate

# Reset database
npm run db:reset

# Lint
npm run lint

# Format
npm run format
```

## 🌐 Environment Variables

راجع ملف `env.example` للاطلاع على جميع المتغيرات المطلوبة.

## 📞 الدعم

للأسئلة والدعم، يرجى التواصل مع فريق التطوير.

---

تم تطوير هذا المشروع لنظام إدارة التعلم Academy LMS.

