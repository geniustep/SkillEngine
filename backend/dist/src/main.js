"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const config_1 = require("@nestjs/config");
const helmet_1 = __importDefault(require("helmet"));
const app_module_1 = require("./app.module");
const http_exception_filter_1 = require("./common/filters/http-exception.filter");
const transform_interceptor_1 = require("./common/interceptors/transform.interceptor");
const logging_interceptor_1 = require("./common/interceptors/logging.interceptor");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const configService = app.get(config_1.ConfigService);
    app.use((0, helmet_1.default)());
    const corsOrigins = configService.get('CORS_ORIGINS')?.split(',') || ['http://localhost:3000'];
    app.enableCors({
        origin: corsOrigins,
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'X-Tenant-ID', 'Accept'],
        credentials: true,
    });
    app.enableVersioning({
        type: common_1.VersioningType.URI,
        defaultVersion: '1',
        prefix: 'api/v',
    });
    app.setGlobalPrefix('api/v1', {
        exclude: ['health', 'health/ready', 'health/live', 'health/db', 'health/redis'],
    });
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
        transformOptions: {
            enableImplicitConversion: true,
        },
    }));
    app.useGlobalFilters(new http_exception_filter_1.HttpExceptionFilter());
    app.useGlobalInterceptors(new transform_interceptor_1.TransformInterceptor(), new logging_interceptor_1.LoggingInterceptor());
    const config = new swagger_1.DocumentBuilder()
        .setTitle('SkillEngine API')
        .setDescription(`
## نظام إدارة التعلم - SkillEngine API
## Domain: skill.geniura.com

### المصادقة
يستخدم النظام Keycloak للمصادقة. يجب إرسال JWT token في header:
\`\`\`
Authorization: Bearer {access_token}
X-Tenant-ID: {tenant_uuid}
\`\`\`

### الأخطاء
جميع الأخطاء تُرجع بالتنسيق التالي:
\`\`\`json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "رسالة الخطأ"
  }
}
\`\`\`

### الترقيم الصفحي
\`\`\`
?page=1&limit=20&sortBy=createdAt&sortOrder=desc
\`\`\`
      `)
        .setVersion('1.0')
        .addBearerAuth({
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
    }, 'JWT-auth')
        .addApiKey({
        type: 'apiKey',
        name: 'X-Tenant-ID',
        in: 'header',
        description: 'Tenant UUID',
    }, 'tenant-id')
        .addTag('Auth', 'المصادقة والصلاحيات')
        .addTag('Users', 'إدارة المستخدمين')
        .addTag('Courses', 'إدارة الدورات')
        .addTag('Sessions', 'الجلسات المباشرة')
        .addTag('Instructors', 'إدارة المدربين')
        .addTag('Enrollments', 'التسجيلات')
        .addTag('Analytics', 'التحليلات')
        .addTag('Notifications', 'الإشعارات')
        .addTag('Tenants', 'إدارة المؤسسات')
        .addTag('Upload', 'رفع الملفات')
        .addTag('Health', 'فحص صحة النظام')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('docs', app, document, {
        swaggerOptions: {
            persistAuthorization: true,
            docExpansion: 'none',
            filter: true,
            tagsSorter: 'alpha',
        },
        customSiteTitle: 'SkillEngine API Documentation',
    });
    const port = configService.get('PORT') || 8000;
    await app.listen(port);
    console.log(`
╔══════════════════════════════════════════════════════════════╗
║                    SkillEngine API                           ║
║                  skill.geniura.com                           ║
╠══════════════════════════════════════════════════════════════╣
║  🚀 Server running on: http://localhost:${port}                 ║
║  📚 API Documentation: http://localhost:${port}/docs            ║
║  🏥 Health Check: http://localhost:${port}/health               ║
║  🌐 Production: https://skill.geniura.com/api/v1             ║
╚══════════════════════════════════════════════════════════════╝
  `);
}
bootstrap();
//# sourceMappingURL=main.js.map