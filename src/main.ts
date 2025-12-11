import { NestFactory } from '@nestjs/core';
import { ValidationPipe, RequestMethod } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import * as compression from 'compression';
import { Request, Response } from 'express';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { SanitizePipe } from './common/pipes/sanitize.pipe';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // Security
  app.use(helmet());

  // Response Compression
  app.use(compression({
    filter: (req: Request, res: Response) => {
      if (req.headers['x-no-compression']) {
        return false;
      }
      return compression.filter(req, res);
    },
    level: 6, // Compression level (0-9)
  }));

  // CORS
  const corsOrigins = configService.get<string>('CORS_ORIGINS')?.split(',') || ['http://localhost:3000'];
  app.enableCors({
    origin: corsOrigins,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Tenant-ID', 'Accept'],
    credentials: true,
  });

  // Global prefix (single prefix for all routes)
  app.setGlobalPrefix('api/v1', {
    exclude: [
      { path: 'health', method: RequestMethod.ALL },
      { path: 'health/ready', method: RequestMethod.ALL },
      { path: 'health/live', method: RequestMethod.ALL },
      { path: 'health/db', method: RequestMethod.ALL },
      { path: 'health/redis', method: RequestMethod.ALL },
    ],
  });

  // Validation & Sanitization
  app.useGlobalPipes(
    new SanitizePipe(),
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Global filters and interceptors
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new TransformInterceptor(), new LoggingInterceptor());

  // Swagger Documentation
  const config = new DocumentBuilder()
    .setTitle('SkillEngine API')
    .setDescription(
      `
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
      `,
    )
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth',
    )
    .addApiKey(
      {
        type: 'apiKey',
        name: 'X-Tenant-ID',
        in: 'header',
        description: 'Tenant UUID',
      },
      'tenant-id',
    )
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

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      docExpansion: 'none',
      filter: true,
      tagsSorter: 'alpha',
    },
    customSiteTitle: 'SkillEngine API Documentation',
  });

  const port = configService.get<number>('PORT') || 8000;
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

