import { CourseStatus, CourseLevel } from '@prisma/client';
import { PaginationQueryDto } from '../../../common/dto/pagination.dto';
export declare class CourseQueryDto extends PaginationQueryDto {
    status?: CourseStatus;
    level?: CourseLevel;
    category?: string;
    instructorId?: string;
    featured?: boolean;
}
