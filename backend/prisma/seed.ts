import { PrismaClient, UserRole, CourseStatus, CourseLevel, SessionStatus } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create default tenant
  const tenant = await prisma.tenant.upsert({
    where: { slug: 'default-academy' },
    update: {},
    create: {
      id: uuidv4(),
      name: 'الأكاديمية الافتراضية',
      slug: 'default-academy',
      status: 'active',
      subscriptionPlan: 'premium',
      settings: {
        language: 'ar',
        currency: 'SAR',
        timezone: 'Asia/Riyadh',
        features: {
          realTime: true,
          analytics: true,
          advancedAnalytics: true,
          multiInstructor: true,
        },
      },
      ownerId: '', // Will be updated after creating admin user
    },
  });

  console.log(`✅ Tenant created: ${tenant.name}`);

  // Create admin user
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@academy.com' },
    update: {},
    create: {
      id: uuidv4(),
      email: 'admin@academy.com',
      firstName: 'مدير',
      lastName: 'النظام',
      role: UserRole.super_admin,
      status: 'active',
      keycloakId: `kc_admin_${uuidv4()}`,
      tenantId: tenant.id,
      bio: 'مدير النظام الرئيسي',
    },
  });

  // Update tenant owner
  await prisma.tenant.update({
    where: { id: tenant.id },
    data: { ownerId: adminUser.id },
  });

  console.log(`✅ Admin user created: ${adminUser.email}`);

  // Create instructor user
  const instructorUser = await prisma.user.upsert({
    where: { email: 'instructor@academy.com' },
    update: {},
    create: {
      id: uuidv4(),
      email: 'instructor@academy.com',
      firstName: 'أحمد',
      lastName: 'المحمد',
      role: UserRole.instructor,
      status: 'active',
      keycloakId: `kc_instructor_${uuidv4()}`,
      tenantId: tenant.id,
      bio: 'مدرب متخصص في تطوير البرمجيات',
      phone: '+966501234567',
    },
  });

  console.log(`✅ Instructor user created: ${instructorUser.email}`);

  // Create instructor profile
  const instructor = await prisma.instructor.upsert({
    where: { userId: instructorUser.id },
    update: {},
    create: {
      id: uuidv4(),
      userId: instructorUser.id,
      title: 'مهندس',
      biography: 'مهندس برمجيات بخبرة 10 سنوات في تطوير تطبيقات الويب والموبايل',
      specialization: ['برمجة', 'تطوير ويب', 'الذكاء الاصطناعي'],
      expertise: ['JavaScript', 'Python', 'React', 'Node.js'],
      isVerified: true,
      rating: 4.8,
      reviewCount: 25,
      totalStudents: 150,
      totalCourses: 5,
      socialLinks: {
        linkedin: 'https://linkedin.com/in/ahmed',
        twitter: 'https://twitter.com/ahmed',
      },
    },
  });

  console.log(`✅ Instructor profile created`);

  // Create student users
  const students = [];
  for (let i = 1; i <= 5; i++) {
    const student = await prisma.user.upsert({
      where: { email: `student${i}@academy.com` },
      update: {},
      create: {
        id: uuidv4(),
        email: `student${i}@academy.com`,
        firstName: `طالب`,
        lastName: `${i}`,
        role: UserRole.student,
        status: 'active',
        keycloakId: `kc_student${i}_${uuidv4()}`,
        tenantId: tenant.id,
      },
    });
    students.push(student);
  }

  console.log(`✅ ${students.length} students created`);

  // Create courses
  const courses = [
    {
      title: 'أساسيات البرمجة بلغة Python',
      description: 'تعلم أساسيات البرمجة من الصفر باستخدام لغة Python. هذه الدورة مصممة للمبتدئين وتغطي جميع المفاهيم الأساسية.',
      shortDescription: 'دورة شاملة لتعلم Python للمبتدئين',
      level: CourseLevel.beginner,
      price: 199,
      duration: 600,
      category: 'programming',
    },
    {
      title: 'تطوير تطبيقات الويب باستخدام React',
      description: 'دورة متقدمة في تطوير واجهات المستخدم باستخدام مكتبة React. ستتعلم بناء تطبيقات ويب تفاعلية وحديثة.',
      shortDescription: 'تعلم React وبناء تطبيقات ويب حديثة',
      level: CourseLevel.intermediate,
      price: 299,
      duration: 900,
      category: 'web-development',
    },
    {
      title: 'الذكاء الاصطناعي وتعلم الآلة',
      description: 'دورة متقدمة في الذكاء الاصطناعي وتعلم الآلة. ستتعلم المفاهيم الأساسية والتطبيقات العملية.',
      shortDescription: 'مقدمة في AI و Machine Learning',
      level: CourseLevel.advanced,
      price: 499,
      duration: 1200,
      category: 'ai-ml',
    },
  ];

  const createdCourses = [];
  for (const courseData of courses) {
    const course = await prisma.course.create({
      data: {
        id: uuidv4(),
        ...courseData,
        slug: courseData.title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, ''),
        status: CourseStatus.published,
        publishedAt: new Date(),
        instructorId: instructorUser.id,
        tenantId: tenant.id,
        featured: courseData.level === CourseLevel.beginner,
        language: 'ar',
        metadata: {
          prerequisites: [],
          learningOutcomes: ['فهم المفاهيم الأساسية', 'تطبيق عملي'],
          targetAudience: 'المبتدئين والمهتمين',
        },
      },
    });
    createdCourses.push(course);

    // Create curriculum for each course
    const module = await prisma.courseCurriculum.create({
      data: {
        id: uuidv4(),
        courseId: course.id,
        title: 'الوحدة الأولى: المقدمة',
        description: 'مقدمة شاملة عن الدورة',
        type: 'module',
        order: 0,
        isPublished: true,
      },
    });

    // Create lessons
    for (let i = 1; i <= 3; i++) {
      await prisma.courseCurriculum.create({
        data: {
          id: uuidv4(),
          courseId: course.id,
          parentId: module.id,
          title: `الدرس ${i}`,
          description: `محتوى الدرس ${i}`,
          type: 'lesson',
          order: i,
          duration: 30,
          isFree: i === 1,
          isPublished: true,
          content: {
            videoUrl: 'https://example.com/video.mp4',
          },
        },
      });
    }
  }

  console.log(`✅ ${createdCourses.length} courses created with curriculum`);

  // Create enrollments
  for (const student of students.slice(0, 3)) {
    for (const course of createdCourses.slice(0, 2)) {
      await prisma.enrollment.create({
        data: {
          id: uuidv4(),
          studentId: student.id,
          courseId: course.id,
          tenantId: tenant.id,
          status: 'active',
          progress: Math.floor(Math.random() * 80),
          completedLessons: [],
        },
      });
    }
  }

  console.log(`✅ Enrollments created`);

  // Create sessions
  const now = new Date();
  const sessions = [
    {
      title: 'جلسة مراجعة Python',
      description: 'جلسة مراجعة لمفاهيم Python الأساسية',
      scheduledStart: new Date(now.getTime() + 24 * 60 * 60 * 1000), // Tomorrow
      scheduledEnd: new Date(now.getTime() + 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000), // 2 hours later
      status: SessionStatus.scheduled,
    },
    {
      title: 'ورشة عمل React',
      description: 'ورشة عمل تطبيقية في React',
      scheduledStart: new Date(now.getTime() + 48 * 60 * 60 * 1000), // Day after tomorrow
      scheduledEnd: new Date(now.getTime() + 48 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000), // 3 hours later
      status: SessionStatus.scheduled,
    },
  ];

  for (const sessionData of sessions) {
    await prisma.session.create({
      data: {
        id: uuidv4(),
        ...sessionData,
        instructorId: instructorUser.id,
        courseId: createdCourses[0].id,
        tenantId: tenant.id,
        platform: 'daily',
        maxParticipants: 50,
      },
    });
  }

  console.log(`✅ ${sessions.length} sessions created`);

  // Create notifications
  for (const student of students.slice(0, 2)) {
    await prisma.notification.create({
      data: {
        id: uuidv4(),
        userId: student.id,
        tenantId: tenant.id,
        type: 'enrollment',
        title: 'مرحباً بك في الأكاديمية',
        message: 'تم تسجيلك بنجاح في الأكاديمية. نتمنى لك رحلة تعليمية ممتعة!',
        priority: 'medium',
      },
    });
  }

  console.log(`✅ Notifications created`);

  console.log('');
  console.log('🎉 Database seeding completed successfully!');
  console.log('');
  console.log('📋 Test Accounts:');
  console.log('   Admin: admin@academy.com');
  console.log('   Instructor: instructor@academy.com');
  console.log('   Students: student1@academy.com - student5@academy.com');
  console.log('');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

