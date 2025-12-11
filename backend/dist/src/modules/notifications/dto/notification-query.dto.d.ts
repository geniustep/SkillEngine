import { NotificationType } from '@prisma/client';
import { PaginationQueryDto } from '../../../common/dto/pagination.dto';
export declare class NotificationQueryDto extends PaginationQueryDto {
    isRead?: boolean;
    type?: NotificationType;
}
