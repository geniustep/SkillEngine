import { PaginationQueryDto } from '../../../common/dto/pagination.dto';
export declare class InstructorQueryDto extends PaginationQueryDto {
    isVerified?: boolean;
    specialization?: string;
}
