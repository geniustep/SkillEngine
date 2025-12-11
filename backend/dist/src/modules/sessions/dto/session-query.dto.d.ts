import { SessionStatus } from '@prisma/client';
import { PaginationQueryDto } from '../../../common/dto/pagination.dto';
export declare class SessionQueryDto extends PaginationQueryDto {
    status?: SessionStatus;
    instructorId?: string;
    courseId?: string;
    startDate?: string;
    endDate?: string;
}
