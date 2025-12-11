import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { AnalyticsQueryDto } from './dto/analytics-query.dto';
import { subDays, startOfDay, endOfDay, format } from 'date-fns';

@Injectable()
export class AnalyticsService {
  private readonly logger = new Logger(AnalyticsService.name);

  constructor(private readonly prisma: PrismaService) {}

  async getDashboardKPIs(tenantId: string) {
    const now = new Date();
    const thirtyDaysAgo = subDays(now, 30);

    const [
      totalStudents,
      totalCourses,
      totalEnrollments,
      activeEnrollments,
      completedEnrollments,
      totalSessions,
      totalInstructors,
      recentEnrollments,
    ] = await Promise.all([
      // Total students
      this.prisma.user.count({
        where: { tenantId, role: 'student', deletedAt: null },
      }),

      // Total courses
      this.prisma.course.count({
        where: { tenantId, deletedAt: null },
      }),

      // Total enrollments
      this.prisma.enrollment.count({
        where: { tenantId, deletedAt: null },
      }),

      // Active enrollments
      this.prisma.enrollment.count({
        where: { tenantId, status: 'active', deletedAt: null },
      }),

      // Completed enrollments
      this.prisma.enrollment.count({
        where: { tenantId, status: 'completed', deletedAt: null },
      }),

      // Total sessions
      this.prisma.session.count({
        where: { tenantId, deletedAt: null },
      }),

      // Total instructors
      this.prisma.instructor.count({
        where: {
          deletedAt: null,
          user: { tenantId, deletedAt: null },
        },
      }),

      // Recent enrollments (last 30 days)
      this.prisma.enrollment.count({
        where: {
          tenantId,
          enrolledAt: { gte: thirtyDaysAgo },
          deletedAt: null,
        },
      }),
    ]);

    const completionRate = totalEnrollments > 0
      ? Math.round((completedEnrollments / totalEnrollments) * 100)
      : 0;

    return {
      totalStudents,
      totalCourses,
      totalEnrollments,
      activeEnrollments,
      completedEnrollments,
      completionRate,
      totalSessions,
      totalInstructors,
      recentEnrollments,
      growthRate: await this.calculateGrowthRate(tenantId),
    };
  }

  async getEnrollmentTrends(tenantId: string, query: AnalyticsQueryDto) {
    const { startDate, endDate, granularity = 'day' } = query;

    const start = startDate ? new Date(startDate) : subDays(new Date(), 30);
    const end = endDate ? new Date(endDate) : new Date();

    const enrollments = await this.prisma.enrollment.findMany({
      where: {
        tenantId,
        enrolledAt: {
          gte: startOfDay(start),
          lte: endOfDay(end),
        },
        deletedAt: null,
      },
      select: {
        enrolledAt: true,
        status: true,
      },
    });

    // Group by date
    const groupedData = this.groupByDate(enrollments, 'enrolledAt', granularity);

    return {
      data: groupedData,
      summary: {
        total: enrollments.length,
        active: enrollments.filter((e) => e.status === 'active').length,
        completed: enrollments.filter((e) => e.status === 'completed').length,
      },
    };
  }

  async getRevenueTrends(tenantId: string, query: AnalyticsQueryDto) {
    // This would typically integrate with a payment system
    // For now, return mock data based on enrollments and course prices

    const { startDate, endDate } = query;

    const start = startDate ? new Date(startDate) : subDays(new Date(), 30);
    const end = endDate ? new Date(endDate) : new Date();

    const enrollments = await this.prisma.enrollment.findMany({
      where: {
        tenantId,
        enrolledAt: {
          gte: startOfDay(start),
          lte: endOfDay(end),
        },
        deletedAt: null,
      },
      include: {
        course: {
          select: {
            price: true,
            discountPrice: true,
          },
        },
      },
    });

    const totalRevenue = enrollments.reduce((sum, e) => {
      const price = e.course.discountPrice || e.course.price;
      return sum + Number(price);
    }, 0);

    return {
      totalRevenue,
      enrollmentsCount: enrollments.length,
      averageOrderValue: enrollments.length > 0 ? totalRevenue / enrollments.length : 0,
    };
  }

  async getCoursePerformance(tenantId: string) {
    const courses = await this.prisma.course.findMany({
      where: { tenantId, deletedAt: null },
      select: {
        id: true,
        title: true,
        status: true,
        enrollmentCount: true,
        rating: true,
        reviewCount: true,
        _count: {
          select: {
            enrollments: {
              where: { status: 'completed' },
            },
          },
        },
      },
      orderBy: { enrollmentCount: 'desc' },
      take: 10,
    });

    return courses.map((course) => ({
      id: course.id,
      title: course.title,
      status: course.status,
      enrollments: course.enrollmentCount,
      completions: course._count.enrollments,
      completionRate: course.enrollmentCount > 0
        ? Math.round((course._count.enrollments / course.enrollmentCount) * 100)
        : 0,
      rating: course.rating,
      reviewCount: course.reviewCount,
    }));
  }

  async getInstructorPerformance(tenantId: string) {
    const instructors = await this.prisma.instructor.findMany({
      where: {
        deletedAt: null,
        user: { tenantId, deletedAt: null },
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true,
            _count: {
              select: {
                coursesAsInstructor: true,
                sessionsAsInstructor: true,
              },
            },
          },
        },
      },
      orderBy: { totalStudents: 'desc' },
      take: 10,
    });

    return instructors.map((instructor) => ({
      id: instructor.id,
      userId: instructor.userId,
      name: `${instructor.user.firstName} ${instructor.user.lastName}`,
      avatar: instructor.user.avatar,
      courses: instructor.user._count.coursesAsInstructor,
      sessions: instructor.user._count.sessionsAsInstructor,
      students: instructor.totalStudents,
      rating: instructor.rating,
      isVerified: instructor.isVerified,
    }));
  }

  async getStudentEngagement(tenantId: string) {
    const thirtyDaysAgo = subDays(new Date(), 30);

    const [activeStudents, newStudents, completions] = await Promise.all([
      // Active students (accessed in last 30 days)
      this.prisma.enrollment.groupBy({
        by: ['studentId'],
        where: {
          tenantId,
          lastAccessedAt: { gte: thirtyDaysAgo },
          deletedAt: null,
        },
      }),

      // New students (enrolled in last 30 days)
      this.prisma.enrollment.groupBy({
        by: ['studentId'],
        where: {
          tenantId,
          enrolledAt: { gte: thirtyDaysAgo },
          deletedAt: null,
        },
      }),

      // Completions in last 30 days
      this.prisma.enrollment.count({
        where: {
          tenantId,
          status: 'completed',
          completedAt: { gte: thirtyDaysAgo },
          deletedAt: null,
        },
      }),
    ]);

    // Average progress
    const avgProgress = await this.prisma.enrollment.aggregate({
      where: { tenantId, status: 'active', deletedAt: null },
      _avg: { progress: true },
    });

    return {
      activeStudents: activeStudents.length,
      newStudents: newStudents.length,
      recentCompletions: completions,
      averageProgress: Math.round(avgProgress._avg.progress || 0),
    };
  }

  private async calculateGrowthRate(tenantId: string): Promise<number> {
    const now = new Date();
    const thirtyDaysAgo = subDays(now, 30);
    const sixtyDaysAgo = subDays(now, 60);

    const [currentPeriod, previousPeriod] = await Promise.all([
      this.prisma.enrollment.count({
        where: {
          tenantId,
          enrolledAt: { gte: thirtyDaysAgo },
          deletedAt: null,
        },
      }),
      this.prisma.enrollment.count({
        where: {
          tenantId,
          enrolledAt: { gte: sixtyDaysAgo, lt: thirtyDaysAgo },
          deletedAt: null,
        },
      }),
    ]);

    if (previousPeriod === 0) return currentPeriod > 0 ? 100 : 0;

    return Math.round(((currentPeriod - previousPeriod) / previousPeriod) * 100);
  }

  private groupByDate(
    data: Array<{ enrolledAt: Date }>,
    dateField: string,
    granularity: string,
  ) {
    const grouped: Record<string, number> = {};

    data.forEach((item) => {
      const date = item[dateField as keyof typeof item] as Date;
      let key: string;

      switch (granularity) {
        case 'month':
          key = format(date, 'yyyy-MM');
          break;
        case 'week':
          key = format(date, 'yyyy-ww');
          break;
        default:
          key = format(date, 'yyyy-MM-dd');
      }

      grouped[key] = (grouped[key] || 0) + 1;
    });

    return Object.entries(grouped).map(([date, count]) => ({ date, count }));
  }
}

