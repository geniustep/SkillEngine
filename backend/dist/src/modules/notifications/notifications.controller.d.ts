import { NotificationsService } from './notifications.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { NotificationQueryDto } from './dto/notification-query.dto';
import { CurrentUserData } from '../../common/decorators/current-user.decorator';
import { IdParamDto } from '../../common/dto/id-param.dto';
export declare class NotificationsController {
    private readonly notificationsService;
    constructor(notificationsService: NotificationsService);
    findAll(query: NotificationQueryDto, tenantId: string, currentUser: CurrentUserData): Promise<import("../../common/dto/pagination.dto").PaginatedResponseDto<{
        type: import(".prisma/client").$Enums.NotificationType;
        title: string;
        message: string;
        id: string;
        tenantId: string;
        createdAt: Date;
        updatedAt: Date;
        data: import("@prisma/client/runtime/library").JsonValue;
        userId: string;
        priority: import(".prisma/client").$Enums.NotificationPriority;
        isRead: boolean;
        readAt: Date | null;
    }>>;
    create(createNotificationDto: CreateNotificationDto, tenantId: string, currentUser: CurrentUserData): Promise<{
        type: import(".prisma/client").$Enums.NotificationType;
        title: string;
        message: string;
        id: string;
        tenantId: string;
        createdAt: Date;
        updatedAt: Date;
        data: import("@prisma/client/runtime/library").JsonValue;
        userId: string;
        priority: import(".prisma/client").$Enums.NotificationPriority;
        isRead: boolean;
        readAt: Date | null;
    }>;
    markAsRead(params: IdParamDto, tenantId: string, currentUser: CurrentUserData): Promise<{
        type: import(".prisma/client").$Enums.NotificationType;
        title: string;
        message: string;
        id: string;
        tenantId: string;
        createdAt: Date;
        updatedAt: Date;
        data: import("@prisma/client/runtime/library").JsonValue;
        userId: string;
        priority: import(".prisma/client").$Enums.NotificationPriority;
        isRead: boolean;
        readAt: Date | null;
    }>;
    markAllAsRead(tenantId: string, currentUser: CurrentUserData): Promise<{
        message: string;
    }>;
    remove(params: IdParamDto, tenantId: string, currentUser: CurrentUserData): Promise<{
        message: string;
    }>;
    getUnreadCount(tenantId: string, currentUser: CurrentUserData): Promise<{
        count: number;
    }>;
}
