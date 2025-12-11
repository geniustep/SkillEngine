import { SessionsService } from './sessions.service';
import { CreateSessionDto } from './dto/create-session.dto';
import { UpdateSessionDto } from './dto/update-session.dto';
import { SessionQueryDto } from './dto/session-query.dto';
import { CurrentUserData } from '../../common/decorators/current-user.decorator';
import { IdParamDto } from '../../common/dto/id-param.dto';
export declare class SessionsController {
    private readonly sessionsService;
    constructor(sessionsService: SessionsService);
    findAll(query: SessionQueryDto, tenantId: string): Promise<import("../../common/dto/pagination.dto").PaginatedResponseDto<{
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
        metadata: import("@prisma/client/runtime/library").JsonValue;
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
    findOne(params: IdParamDto, tenantId: string): Promise<{
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
        metadata: import("@prisma/client/runtime/library").JsonValue;
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
    create(createSessionDto: CreateSessionDto, tenantId: string, currentUser: CurrentUserData): Promise<{
        status: import(".prisma/client").$Enums.SessionStatus;
        description: string | null;
        title: string;
        id: string;
        tenantId: string;
        metadata: import("@prisma/client/runtime/library").JsonValue;
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
    update(params: IdParamDto, updateSessionDto: UpdateSessionDto, tenantId: string, currentUser: CurrentUserData): Promise<{
        status: import(".prisma/client").$Enums.SessionStatus;
        description: string | null;
        title: string;
        id: string;
        tenantId: string;
        metadata: import("@prisma/client/runtime/library").JsonValue;
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
    startSession(params: IdParamDto, tenantId: string, currentUser: CurrentUserData): Promise<{
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
        metadata: import("@prisma/client/runtime/library").JsonValue;
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
    endSession(params: IdParamDto, tenantId: string, currentUser: CurrentUserData): Promise<{
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
        metadata: import("@prisma/client/runtime/library").JsonValue;
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
    remove(params: IdParamDto, tenantId: string, currentUser: CurrentUserData): Promise<{
        message: string;
    }>;
    getParticipants(params: IdParamDto, tenantId: string): Promise<{
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
    joinSession(params: IdParamDto, tenantId: string, currentUser: CurrentUserData): Promise<{
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
    getAttendance(params: IdParamDto, tenantId: string): Promise<({
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
    updateAttendance(sessionId: string, userId: string, status: string, tenantId: string, currentUser: CurrentUserData): Promise<{
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
}
