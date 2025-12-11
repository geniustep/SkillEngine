import { PrismaService } from '../../database/prisma.service';
import { DailyService } from './services/daily.service';
import { CreateSessionDto } from './dto/create-session.dto';
import { UpdateSessionDto } from './dto/update-session.dto';
import { SessionQueryDto } from './dto/session-query.dto';
import { Prisma } from '@prisma/client';
export declare class SessionsService {
    private readonly prisma;
    private readonly dailyService;
    private readonly logger;
    constructor(prisma: PrismaService, dailyService: DailyService);
    findAll(tenantId: string, query: SessionQueryDto): Promise<import("../../common/dto/pagination.dto").PaginatedResponseDto<{
        participantsCount: number;
        _count: undefined;
        instructor: {
            id: string;
            firstName: string;
            lastName: string;
            avatar: string | null;
        };
        course: {
            title: string;
            id: string;
            slug: string;
        } | null;
        status: import(".prisma/client").$Enums.SessionStatus;
        description: string | null;
        title: string;
        id: string;
        tenantId: string;
        metadata: Prisma.JsonValue;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        courseId: string | null;
        instructorId: string;
        scheduledStart: Date;
        scheduledEnd: Date;
        platform: import(".prisma/client").$Enums.LivePlatform;
        maxParticipants: number | null;
        actualStart: Date | null;
        actualEnd: Date | null;
        meetingUrl: string | null;
        meetingId: string | null;
        currentParticipants: number;
        recordingUrl: string | null;
    }>>;
    findOne(id: string, tenantId: string): Promise<{
        participantsCount: number;
        _count: undefined;
        instructor: {
            email: string;
            id: string;
            firstName: string;
            lastName: string;
            avatar: string | null;
        };
        course: {
            title: string;
            id: string;
            slug: string;
            thumbnail: string | null;
        } | null;
        status: import(".prisma/client").$Enums.SessionStatus;
        description: string | null;
        title: string;
        id: string;
        tenantId: string;
        metadata: Prisma.JsonValue;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        courseId: string | null;
        instructorId: string;
        scheduledStart: Date;
        scheduledEnd: Date;
        platform: import(".prisma/client").$Enums.LivePlatform;
        maxParticipants: number | null;
        actualStart: Date | null;
        actualEnd: Date | null;
        meetingUrl: string | null;
        meetingId: string | null;
        currentParticipants: number;
        recordingUrl: string | null;
    }>;
    create(createSessionDto: CreateSessionDto, tenantId: string, createdBy: string): Promise<{
        status: import(".prisma/client").$Enums.SessionStatus;
        description: string | null;
        title: string;
        id: string;
        tenantId: string;
        metadata: Prisma.JsonValue;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        courseId: string | null;
        instructorId: string;
        scheduledStart: Date;
        scheduledEnd: Date;
        platform: import(".prisma/client").$Enums.LivePlatform;
        maxParticipants: number | null;
        actualStart: Date | null;
        actualEnd: Date | null;
        meetingUrl: string | null;
        meetingId: string | null;
        currentParticipants: number;
        recordingUrl: string | null;
    }>;
    update(id: string, updateSessionDto: UpdateSessionDto, tenantId: string, updatedBy: string): Promise<{
        status: import(".prisma/client").$Enums.SessionStatus;
        description: string | null;
        title: string;
        id: string;
        tenantId: string;
        metadata: Prisma.JsonValue;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        courseId: string | null;
        instructorId: string;
        scheduledStart: Date;
        scheduledEnd: Date;
        platform: import(".prisma/client").$Enums.LivePlatform;
        maxParticipants: number | null;
        actualStart: Date | null;
        actualEnd: Date | null;
        meetingUrl: string | null;
        meetingId: string | null;
        currentParticipants: number;
        recordingUrl: string | null;
    }>;
    startSession(id: string, tenantId: string, startedBy: string): Promise<{
        instructor: {
            id: string;
            firstName: string;
            lastName: string;
            avatar: string | null;
        };
    } & {
        status: import(".prisma/client").$Enums.SessionStatus;
        description: string | null;
        title: string;
        id: string;
        tenantId: string;
        metadata: Prisma.JsonValue;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        courseId: string | null;
        instructorId: string;
        scheduledStart: Date;
        scheduledEnd: Date;
        platform: import(".prisma/client").$Enums.LivePlatform;
        maxParticipants: number | null;
        actualStart: Date | null;
        actualEnd: Date | null;
        meetingUrl: string | null;
        meetingId: string | null;
        currentParticipants: number;
        recordingUrl: string | null;
    }>;
    endSession(id: string, tenantId: string, endedBy: string): Promise<{
        instructor: {
            id: string;
            firstName: string;
            lastName: string;
            avatar: string | null;
        };
    } & {
        status: import(".prisma/client").$Enums.SessionStatus;
        description: string | null;
        title: string;
        id: string;
        tenantId: string;
        metadata: Prisma.JsonValue;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        courseId: string | null;
        instructorId: string;
        scheduledStart: Date;
        scheduledEnd: Date;
        platform: import(".prisma/client").$Enums.LivePlatform;
        maxParticipants: number | null;
        actualStart: Date | null;
        actualEnd: Date | null;
        meetingUrl: string | null;
        meetingId: string | null;
        currentParticipants: number;
        recordingUrl: string | null;
    }>;
    cancelSession(id: string, tenantId: string, cancelledBy: string): Promise<void>;
    getParticipants(sessionId: string, tenantId: string): Promise<{
        attendanceId: string;
        status: import(".prisma/client").$Enums.AttendanceStatus;
        joinedAt: Date | null;
        leftAt: Date | null;
        duration: number | null;
        email: string;
        id: string;
        firstName: string;
        lastName: string;
        avatar: string | null;
    }[]>;
    joinSession(sessionId: string, tenantId: string, userId: string): Promise<{
        meetingUrl: string | null;
        meetingId: string | null;
        sessionTitle: string;
        instructor: {
            email: string;
            id: string;
            firstName: string;
            lastName: string;
            avatar: string | null;
        };
    }>;
    getAttendance(sessionId: string, tenantId: string): Promise<({
        user: {
            email: string;
            id: string;
            firstName: string;
            lastName: string;
            avatar: string | null;
        };
    } & {
        status: import(".prisma/client").$Enums.AttendanceStatus;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        duration: number | null;
        sessionId: string;
        joinedAt: Date | null;
        leftAt: Date | null;
        notes: string | null;
    })[]>;
    updateAttendance(sessionId: string, userId: string, status: string, tenantId: string, updatedBy: string): Promise<{
        user: {
            id: string;
            firstName: string;
            lastName: string;
        };
    } & {
        status: import(".prisma/client").$Enums.AttendanceStatus;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        duration: number | null;
        sessionId: string;
        joinedAt: Date | null;
        leftAt: Date | null;
        notes: string | null;
    }>;
    private logAudit;
}
