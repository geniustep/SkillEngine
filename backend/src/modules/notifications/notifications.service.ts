import {
  Injectable,
  NotFoundException,
  Logger,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { PusherService } from './services/pusher.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { NotificationQueryDto } from './dto/notification-query.dto';
import { createPaginatedResponse } from '../../common/dto/pagination.dto';
import { Prisma, NotificationType, NotificationPriority } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly pusherService: PusherService,
  ) {}

  async findAll(userId: string, tenantId: string, query: NotificationQueryDto) {
    const {
      page = 1,
      limit = 20,
      isRead,
      type,
    } = query;

    const skip = (page - 1) * limit;

    const where: Prisma.NotificationWhereInput = {
      userId,
      tenantId,
      ...(isRead !== undefined && { isRead }),
      ...(type && { type }),
    };

    const [notifications, total] = await Promise.all([
      this.prisma.notification.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.notification.count({ where }),
    ]);

    return createPaginatedResponse(notifications, total, page, limit);
  }

  async create(createDto: CreateNotificationDto, tenantId: string, createdBy: string) {
    const { data, ...restDto } = createDto;
    const notification = await this.prisma.notification.create({
      data: {
        id: uuidv4(),
        ...restDto,
        ...(data && { data: data as any }),
        tenantId,
      },
    });

    // Send real-time notification via Pusher
    try {
      await this.pusherService.sendToUser(createDto.userId, 'notification', {
        id: notification.id,
        type: notification.type,
        title: notification.title,
        message: notification.message,
        priority: notification.priority,
        createdAt: notification.createdAt,
      });
    } catch (error) {
      this.logger.error(`Failed to send real-time notification: ${error}`);
    }

    return notification;
  }

  async markAsRead(id: string, userId: string, tenantId: string) {
    const notification = await this.prisma.notification.findFirst({
      where: { id, tenantId },
    });

    if (!notification) {
      throw new NotFoundException('الإشعار غير موجود');
    }

    if (notification.userId !== userId) {
      throw new ForbiddenException('لا يمكنك تعديل هذا الإشعار');
    }

    return this.prisma.notification.update({
      where: { id },
      data: {
        isRead: true,
        readAt: new Date(),
      },
    });
  }

  async markAllAsRead(userId: string, tenantId: string) {
    await this.prisma.notification.updateMany({
      where: {
        userId,
        tenantId,
        isRead: false,
      },
      data: {
        isRead: true,
        readAt: new Date(),
      },
    });
  }

  async remove(id: string, userId: string, tenantId: string) {
    const notification = await this.prisma.notification.findFirst({
      where: { id, tenantId },
    });

    if (!notification) {
      throw new NotFoundException('الإشعار غير موجود');
    }

    if (notification.userId !== userId) {
      throw new ForbiddenException('لا يمكنك حذف هذا الإشعار');
    }

    await this.prisma.notification.delete({
      where: { id },
    });
  }

  async getUnreadCount(userId: string, tenantId: string): Promise<number> {
    return this.prisma.notification.count({
      where: {
        userId,
        tenantId,
        isRead: false,
      },
    });
  }

  // Helper methods for creating specific notification types
  async notifyEnrollment(
    userId: string,
    tenantId: string,
    courseTitle: string,
    courseId: string,
  ) {
    return this.create(
      {
        userId,
        type: NotificationType.enrollment,
        title: 'تم التسجيل بنجاح',
        message: `تم تسجيلك في دورة "${courseTitle}"`,
        priority: NotificationPriority.medium,
        data: { courseId },
      },
      tenantId,
      'system',
    );
  }

  async notifySessionReminder(
    userId: string,
    tenantId: string,
    sessionTitle: string,
    sessionId: string,
    startTime: Date,
  ) {
    return this.create(
      {
        userId,
        type: NotificationType.session,
        title: 'تذكير بجلسة قادمة',
        message: `الجلسة "${sessionTitle}" ستبدأ قريباً`,
        priority: NotificationPriority.high,
        data: { sessionId, startTime: startTime.toISOString() },
      },
      tenantId,
      'system',
    );
  }

  async notifyAnnouncement(
    userIds: string[],
    tenantId: string,
    title: string,
    message: string,
  ) {
    const notifications = userIds.map((userId) => ({
      id: uuidv4(),
      userId,
      tenantId,
      type: NotificationType.announcement,
      title,
      message,
      priority: NotificationPriority.medium,
      isRead: false,
      data: {},
    }));

    await this.prisma.notification.createMany({
      data: notifications,
    });

    // Send real-time notifications
    for (const userId of userIds) {
      try {
        await this.pusherService.sendToUser(userId, 'announcement', {
          title,
          message,
        });
      } catch (error) {
        this.logger.error(`Failed to send announcement to user ${userId}: ${error}`);
      }
    }
  }
}

