"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var AnalyticsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../database/prisma.service");
const date_fns_1 = require("date-fns");
let AnalyticsService = AnalyticsService_1 = class AnalyticsService {
    constructor(prisma) {
        this.prisma = prisma;
        this.logger = new common_1.Logger(AnalyticsService_1.name);
    }
    async getDashboardKPIs(tenantId) {
        const now = new Date();
        const thirtyDaysAgo = (0, date_fns_1.subDays)(now, 30);
        const [totalStudents, totalCourses, totalEnrollments, activeEnrollments, completedEnrollments, totalSessions, totalInstructors, recentEnrollments,] = await Promise.all([
            this.prisma.user.count({
                where: { tenantId, role: 'student', deletedAt: null },
            }),
            this.prisma.course.count({
                where: { tenantId, deletedAt: null },
            }),
            this.prisma.enrollment.count({
                where: { tenantId, deletedAt: null },
            }),
            this.prisma.enrollment.count({
                where: { tenantId, status: 'active', deletedAt: null },
            }),
            this.prisma.enrollment.count({
                where: { tenantId, status: 'completed', deletedAt: null },
            }),
            this.prisma.session.count({
                where: { tenantId, deletedAt: null },
            }),
            this.prisma.instructor.count({
                where: {
                    deletedAt: null,
                    user: { tenantId, deletedAt: null },
                },
            }),
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
    async getEnrollmentTrends(tenantId, query) {
        const { startDate, endDate, granularity = 'day' } = query;
        const start = startDate ? new Date(startDate) : (0, date_fns_1.subDays)(new Date(), 30);
        const end = endDate ? new Date(endDate) : new Date();
        const enrollments = await this.prisma.enrollment.findMany({
            where: {
                tenantId,
                enrolledAt: {
                    gte: (0, date_fns_1.startOfDay)(start),
                    lte: (0, date_fns_1.endOfDay)(end),
                },
                deletedAt: null,
            },
            select: {
                enrolledAt: true,
                status: true,
            },
        });
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
    async getRevenueTrends(tenantId, query) {
        const { startDate, endDate } = query;
        const start = startDate ? new Date(startDate) : (0, date_fns_1.subDays)(new Date(), 30);
        const end = endDate ? new Date(endDate) : new Date();
        const enrollments = await this.prisma.enrollment.findMany({
            where: {
                tenantId,
                enrolledAt: {
                    gte: (0, date_fns_1.startOfDay)(start),
                    lte: (0, date_fns_1.endOfDay)(end),
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
    async getCoursePerformance(tenantId) {
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
    async getInstructorPerformance(tenantId) {
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
    async getStudentEngagement(tenantId) {
        const thirtyDaysAgo = (0, date_fns_1.subDays)(new Date(), 30);
        const [activeStudents, newStudents, completions] = await Promise.all([
            this.prisma.enrollment.groupBy({
                by: ['studentId'],
                where: {
                    tenantId,
                    lastAccessedAt: { gte: thirtyDaysAgo },
                    deletedAt: null,
                },
            }),
            this.prisma.enrollment.groupBy({
                by: ['studentId'],
                where: {
                    tenantId,
                    enrolledAt: { gte: thirtyDaysAgo },
                    deletedAt: null,
                },
            }),
            this.prisma.enrollment.count({
                where: {
                    tenantId,
                    status: 'completed',
                    completedAt: { gte: thirtyDaysAgo },
                    deletedAt: null,
                },
            }),
        ]);
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
    async calculateGrowthRate(tenantId) {
        const now = new Date();
        const thirtyDaysAgo = (0, date_fns_1.subDays)(now, 30);
        const sixtyDaysAgo = (0, date_fns_1.subDays)(now, 60);
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
        if (previousPeriod === 0)
            return currentPeriod > 0 ? 100 : 0;
        return Math.round(((currentPeriod - previousPeriod) / previousPeriod) * 100);
    }
    groupByDate(data, dateField, granularity) {
        const grouped = {};
        data.forEach((item) => {
            const date = item[dateField];
            let key;
            switch (granularity) {
                case 'month':
                    key = (0, date_fns_1.format)(date, 'yyyy-MM');
                    break;
                case 'week':
                    key = (0, date_fns_1.format)(date, 'yyyy-ww');
                    break;
                default:
                    key = (0, date_fns_1.format)(date, 'yyyy-MM-dd');
            }
            grouped[key] = (grouped[key] || 0) + 1;
        });
        return Object.entries(grouped).map(([date, count]) => ({ date, count }));
    }
};
exports.AnalyticsService = AnalyticsService;
exports.AnalyticsService = AnalyticsService = AnalyticsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AnalyticsService);
//# sourceMappingURL=analytics.service.js.map