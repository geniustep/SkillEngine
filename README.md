# SkillEngine - Backend API

**SkillEngine** هو نظام إدارة تعلّم متكامل (LMS Ecosystem) صُمّم لتقديم تجربة تدريب احترافية وقابلة للتوسع للمراكز الأكاديمية، المدارس الخاصة، وأكاديميات التدريب المهني.

هذا المستودع يحتوي على **Backend API** فقط. للواجهة الأمامية (Frontend)، راجع:
- **Frontend Repository**: [geniustep/SkillEngine-frontend](https://github.com/geniustep/SkillEngine-frontend)

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
skillengine-backend/
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

## 🌐 CORS Configuration

لربط الـ Frontend المستضاف على Vercel مع هذا الـ Backend، تأكد من تكوين CORS بشكل صحيح:

```typescript
// في main.ts
app.enableCors({
  origin: [
    'http://localhost:3000',
    'https://your-app.vercel.app',
    'https://app.skill.geniura.com',
  ],
  credentials: true,
});
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

# Build for production
npm run build

# Start production server
npm run start:prod
```

## 🌐 Environment Variables

راجع ملف `env.example` للاطلاع على جميع المتغيرات المطلوبة.

### متغيرات البيئة الأساسية

```env
# Server
PORT=8000
NODE_ENV=production

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/skillengine

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# JWT
JWT_SECRET=your-jwt-secret
JWT_EXPIRES_IN=7d

# Keycloak
KEYCLOAK_URL=https://auth.geniura.com
KEYCLOAK_REALM=skillengine
KEYCLOAK_CLIENT_ID=skillengine-api
KEYCLOAK_CLIENT_SECRET=your-secret

# Storage (S3/MinIO)
S3_ENDPOINT=https://s3.amazonaws.com
S3_ACCESS_KEY=your-access-key
S3_SECRET_KEY=your-secret-key
S3_BUCKET=skillengine

# Frontend URL (for CORS)
FRONTEND_URL=https://your-app.vercel.app
```

## 🚀 النشر (Deployment)

### Docker Production

```bash
# Build image
docker build -t skillengine-api .

# Run container
docker run -d -p 8000:8000 --env-file .env skillengine-api
```

### PM2 (without Docker)

```bash
# Install PM2
npm install -g pm2

# Build
npm run build

# Start with PM2
pm2 start dist/main.js --name skillengine-api
```

## 📞 الدعم

للأسئلة والدعم، يرجى التواصل مع فريق التطوير.

---

**المستودعات ذات الصلة:**
- [SkillEngine Frontend](https://github.com/geniustep/SkillEngine-frontend) - واجهة المستخدم (Next.js)
