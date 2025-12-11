import { EnrollmentStatus } from '@prisma/client';
import { PaginationQueryDto } from '../../../common/dto/pagination.dto';
export declare class EnrollmentQueryDto extends PaginationQueryDto {
    studentId?: string;
    courseId?: string;
    status?: EnrollmentStatus;
}
