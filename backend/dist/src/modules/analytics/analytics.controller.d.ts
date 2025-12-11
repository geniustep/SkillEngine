import { AnalyticsService } from './analytics.service';
import { AnalyticsQueryDto } from './dto/analytics-query.dto';
export declare class AnalyticsController {
    private readonly analyticsService;
    constructor(analyticsService: AnalyticsService);
    getDashboard(tenantId: string): Promise<{
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
    getEnrollments(query: AnalyticsQueryDto, tenantId: string): Promise<{
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
    getRevenue(query: AnalyticsQueryDto, tenantId: string): Promise<{
        totalRevenue: number;
        enrollmentsCount: number;
        averageOrderValue: number;
    }>;
    getCourses(tenantId: string): Promise<{
        id: string;
        title: string;
        status: import(".prisma/client").$Enums.CourseStatus;
        enrollments: number;
        completions: number;
        completionRate: number;
        rating: import("@prisma/client/runtime/library").Decimal | null;
        reviewCount: number;
    }[]>;
    getInstructors(tenantId: string): Promise<{
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
    getStudents(tenantId: string): Promise<{
        activeStudents: number;
        newStudents: number;
        recentCompletions: number;
        averageProgress: number;
    }>;
}
