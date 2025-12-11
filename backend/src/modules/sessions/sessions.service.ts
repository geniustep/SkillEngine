import {
  Injectable,
  NotFoundException,
  Logger,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { DailyService } from './services/daily.service';
import { CreateSessionDto } from './dto/create-session.dto';
import { UpdateSessionDto } from './dto/update-session.dto';
import { SessionQueryDto } from './dto/session-query.dto';
import { createPaginatedResponse } from '../../common/dto/pagination.dto';
import { SessionStatus, AttendanceStatus, Prisma } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class SessionsService {
  private readonly logger = new Logger(SessionsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly dailyService: DailyService,
  ) {}

  async findAll(tenantId: string, query: SessionQueryDto) {
    const {
      page = 1,
      limit = 20,
      sortBy = 'scheduledStart',
      sortOrder = 'asc',
      search,
      status,
      instructorId,
      courseId,
      startDate,
      endDate,
    } = query;

    const skip = (page - 1) * limit;

    const where: Prisma.SessionWhereInput = {
      tenantId,
      deletedAt: null,
      ...(status && { status }),
      ...(instructorId && { instructorId }),
      ...(courseId && { courseId }),
      ...(startDate && { scheduledStart: { gte: new Date(startDate) } }),
      ...(endDate && { scheduledEnd: { lte: new Date(endDate) } }),
      ...(search && {
        OR: [
          { title: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
        ],
      }),
    };

    const [sessions, total] = await Promise.all([
      this.prisma.session.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        include: {
          instructor: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              avatar: true,
            },
          },
          course: {
            select: {
              id: true,
              title: true,
              slug: true,
            },
          },
          _count: {
            select: {
              attendances: true,
            },
          },
        },
      }),
      this.prisma.session.count({ where }),
    ]);

    const formattedSessions = sessions.map((session) => ({
      ...session,
      participantsCount: session._count.attendances,
      _count: undefined,
    }));

    return createPaginatedResponse(formattedSessions, total, page, limit);
  }

  async findOne(id: string, tenantId: string) {
    const session = await this.prisma.session.findFirst({
      where: {
        id,
        tenantId,
        deletedAt: null,
      },
      include: {
        instructor: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true,
            email: true,
          },
        },
        course: {
          select: {
            id: true,
            title: true,
            slug: true,
            thumbnail: true,
          },
        },
        _count: {
          select: {
            attendances: true,
          },
        },
      },
    });

    if (!session) {
      throw new NotFoundException('الجلسة غير موجودة');
    }

    return {
      ...session,
      participantsCount: session._count.attendances,
      _count: undefined,
    };
  }

  async create(createSessionDto: CreateSessionDto, tenantId: string, createdBy: string) {
    // Verify instructor exists
    const instructor = await this.prisma.user.findFirst({
      where: {
        id: createSessionDto.instructorId,
        tenantId,
        deletedAt: null,
      },
    });

    if (!instructor) {
      throw new BadRequestException('المدرب غير موجود');
    }

    // Verify course exists if provided
    if (createSessionDto.courseId) {
      const course = await this.prisma.course.findFirst({
        where: {
          id: createSessionDto.courseId,
          tenantId,
          deletedAt: null,
        },
      });

      if (!course) {
        throw new BadRequestException('الدورة غير موجودة');
      }
    }

    // Create room in Daily.co
    let meetingUrl: string | undefined;
    let meetingId: string | undefined;

    if (createSessionDto.platform === 'daily') {
      try {
        const room = await this.dailyService.createRoom({
          name: `session-${uuidv4().slice(0, 8)}`,
          expiresAt: createSessionDto.scheduledEnd,
          maxParticipants: createSessionDto.maxParticipants,
        });
        meetingUrl = room.url;
        meetingId = room.name;
      } catch (error) {
        this.logger.error(`Failed to create Daily room: ${error}`);
        // Continue without room - can be created later
      }
    }

    const session = await this.prisma.session.create({
      data: {
        id: uuidv4(),
        ...createSessionDto,
        meetingUrl,
        meetingId,
        tenantId,
        metadata: (createSessionDto.metadata || {}) as any,
      },
      include: {
        instructor: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true,
          },
        },
        course: {
          select: {
            id: true,
            title: true,
            slug: true,
          },
        },
      },
    });

    // Log audit
    await this.logAudit(tenantId, createdBy, 'create', 'sessions', session.id, null, session);

    return session;
  }

  async update(id: string, updateSessionDto: UpdateSessionDto, tenantId: string, updatedBy: string) {
    const existingSession = await this.findOne(id, tenantId);

    if (existingSession.status === 'completed' || existingSession.status === 'cancelled') {
      throw new BadRequestException('لا يمكن تعديل جلسة منتهية أو ملغاة');
    }

    const { metadata, ...restDto } = updateSessionDto;
    const session = await this.prisma.session.update({
      where: { id },
      data: {
        ...restDto,
        ...(metadata && { metadata: metadata as any }),
      },
      include: {
        instructor: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true,
          },
        },
        course: {
          select: {
            id: true,
            title: true,
            slug: true,
          },
        },
      },
    });

    // Log audit
    await this.logAudit(tenantId, updatedBy, 'update', 'sessions', id, existingSession, session);

    return session;
  }

  async startSession(id: string, tenantId: string, startedBy: string) {
    const session = await this.findOne(id, tenantId);

    if (session.status !== 'scheduled') {
      throw new BadRequestException('لا يمكن بدء هذه الجلسة');
    }

    // Create room if not exists
    if (!session.meetingUrl && session.platform === 'daily') {
      try {
        const room = await this.dailyService.createRoom({
          name: `session-${id.slice(0, 8)}`,
          expiresAt: session.scheduledEnd,
          maxParticipants: session.maxParticipants || undefined,
        });
        session.meetingUrl = room.url;
        session.meetingId = room.name;
      } catch (error) {
        this.logger.error(`Failed to create Daily room: ${error}`);
        throw new BadRequestException('فشل في إنشاء غرفة الاجتماع');
      }
    }

    const updatedSession = await this.prisma.session.update({
      where: { id },
      data: {
        status: 'live',
        actualStart: new Date(),
        meetingUrl: session.meetingUrl,
        meetingId: session.meetingId,
      },
      include: {
        instructor: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true,
          },
        },
      },
    });

    // Log audit
    await this.logAudit(tenantId, startedBy, 'start', 'sessions', id, { status: 'scheduled' }, { status: 'live' });

    return updatedSession;
  }

  async endSession(id: string, tenantId: string, endedBy: string) {
    const session = await this.findOne(id, tenantId);

    if (session.status !== 'live') {
      throw new BadRequestException('الجلسة ليست قيد البث');
    }

    const updatedSession = await this.prisma.session.update({
      where: { id },
      data: {
        status: 'completed',
        actualEnd: new Date(),
      },
      include: {
        instructor: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true,
          },
        },
      },
    });

    // Delete Daily room
    if (session.meetingId && session.platform === 'daily') {
      try {
        await this.dailyService.deleteRoom(session.meetingId);
      } catch (error) {
        this.logger.error(`Failed to delete Daily room: ${error}`);
      }
    }

    // Log audit
    await this.logAudit(tenantId, endedBy, 'end', 'sessions', id, { status: 'live' }, { status: 'completed' });

    return updatedSession;
  }

  async cancelSession(id: string, tenantId: string, cancelledBy: string) {
    const session = await this.findOne(id, tenantId);

    if (session.status === 'completed' || session.status === 'cancelled') {
      throw new BadRequestException('لا يمكن إلغاء هذه الجلسة');
    }

    await this.prisma.session.update({
      where: { id },
      data: {
        status: 'cancelled',
        deletedAt: new Date(),
      },
    });

    // Delete Daily room if exists
    if (session.meetingId && session.platform === 'daily') {
      try {
        await this.dailyService.deleteRoom(session.meetingId);
      } catch (error) {
        this.logger.error(`Failed to delete Daily room: ${error}`);
      }
    }

    // Log audit
    await this.logAudit(tenantId, cancelledBy, 'cancel', 'sessions', id, session, null);
  }

  async getParticipants(sessionId: string, tenantId: string) {
    await this.findOne(sessionId, tenantId);

    const attendances = await this.prisma.sessionAttendance.findMany({
      where: { sessionId },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            avatar: true,
          },
        },
      },
      orderBy: { joinedAt: 'asc' },
    });

    return attendances.map((a) => ({
      ...a.user,
      attendanceId: a.id,
      status: a.status,
      joinedAt: a.joinedAt,
      leftAt: a.leftAt,
      duration: a.duration,
    }));
  }

  async joinSession(sessionId: string, tenantId: string, userId: string) {
    const session = await this.findOne(sessionId, tenantId);

    if (session.status !== 'live' && session.status !== 'scheduled') {
      throw new BadRequestException('الجلسة غير متاحة للانضمام');
    }

    // Check max participants
    if (session.maxParticipants) {
      const currentCount = await this.prisma.sessionAttendance.count({
        where: { sessionId, status: 'present' },
      });

      if (currentCount >= session.maxParticipants) {
        throw new BadRequestException('الجلسة ممتلئة');
      }
    }

    // Create or update attendance record
    await this.prisma.sessionAttendance.upsert({
      where: {
        sessionId_userId: { sessionId, userId },
      },
      create: {
        id: uuidv4(),
        sessionId,
        userId,
        status: 'present',
        joinedAt: new Date(),
      },
      update: {
        status: 'present',
        joinedAt: new Date(),
      },
    });

    // Update current participants count
    await this.prisma.session.update({
      where: { id: sessionId },
      data: { currentParticipants: { increment: 1 } },
    });

    return {
      meetingUrl: session.meetingUrl,
      meetingId: session.meetingId,
      sessionTitle: session.title,
      instructor: session.instructor,
    };
  }

  async getAttendance(sessionId: string, tenantId: string) {
    await this.findOne(sessionId, tenantId);

    return this.prisma.sessionAttendance.findMany({
      where: { sessionId },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            avatar: true,
          },
        },
      },
      orderBy: { createdAt: 'asc' },
    });
  }

  async updateAttendance(
    sessionId: string,
    userId: string,
    status: string,
    tenantId: string,
    updatedBy: string,
  ) {
    await this.findOne(sessionId, tenantId);

    const attendance = await this.prisma.sessionAttendance.upsert({
      where: {
        sessionId_userId: { sessionId, userId },
      },
      create: {
        id: uuidv4(),
        sessionId,
        userId,
        status: status as AttendanceStatus,
      },
      update: {
        status: status as AttendanceStatus,
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    // Log audit
    await this.logAudit(tenantId, updatedBy, 'update_attendance', 'sessions', sessionId, null, {
      userId,
      status,
    });

    return attendance;
  }

  private async logAudit(
    tenantId: string,
    userId: string,
    action: string,
    resource: string,
    resourceId?: string,
    oldData?: unknown,
    newData?: unknown,
  ) {
    try {
      await this.prisma.auditLog.create({
        data: {
          id: uuidv4(),
          tenantId,
          userId,
          action,
          resource,
          resourceId,
          oldData: oldData ? JSON.parse(JSON.stringify(oldData)) : null,
          newData: newData ? JSON.parse(JSON.stringify(newData)) : null,
        },
      });
    } catch (error) {
      this.logger.error(`Failed to log audit: ${error}`);
    }
  }
}

