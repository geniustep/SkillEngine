import { PrismaService } from '../../database/prisma.service';
import { AnalyticsQueryDto } from './dto/analytics-query.dto';
export declare class AnalyticsService {
    private readonly prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    getDashboardKPIs(tenantId: string): Promise<{
        totalStudents: number;
        totalCourses: number;
        totalEnrollments: number;
        activeEnrollments: number;
        completedEnrollments: number;
        completionRate: number;
        totalSessions: number;
        totalInstructors: number;
        recentEnrollments: number;
        growthRate: number;
    }>;
    getEnrollmentTrends(tenantId: string, query: AnalyticsQueryDto): Promise<{
        data: {
            date: string;
            count: number;
        }[];
        summary: {
            total: number;
            active: number;
            completed: number;
        };
    }>;
    getRevenueTrends(tenantId: string, query: AnalyticsQueryDto): Promise<{
        totalRevenue: number;
        enrollmentsCount: number;
        averageOrderValue: number;
    }>;
    getCoursePerformance(tenantId: string): Promise<{
        id: string;
        title: string;
        status: import(".prisma/client").$Enums.CourseStatus;
        enrollments: number;
        completions: number;
        completionRate: number;
        rating: import("@prisma/client/runtime/library").Decimal | null;
        reviewCount: number;
    }[]>;
    getInstructorPerformance(tenantId: string): Promise<{
        id: string;
        userId: string;
        name: string;
        avatar: string | null;
        courses: number;
        sessions: number;
        students: number;
        rating: import("@prisma/client/runtime/library").Decimal | null;
        isVerified: boolean;
    }[]>;
    getStudentEngagement(tenantId: string): Promise<{
        activeStudents: number;
        newStudents: number;
        recentCompletions: number;
        averageProgress: number;
    }>;
    private calculateGrowthRate;
    private groupByDate;
}
