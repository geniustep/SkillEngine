import { UserRole, UserStatus } from '@prisma/client';
import { PaginationQueryDto } from '../../../common/dto/pagination.dto';
export declare class UserQueryDto extends PaginationQueryDto {
    role?: UserRole;
    status?: UserStatus;
}
