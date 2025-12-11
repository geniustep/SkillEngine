import { CourseLevel, CourseStatus } from '@prisma/client';
declare class CourseMetadataDto {
    prerequisites?: string[];
    learningOutcomes?: string[];
    targetAudience?: string;
    requirements?: string[];
}
export declare class UpdateCourseDto {
    title?: string;
    description?: string;
    shortDescription?: string;
    level?: CourseLevel;
    status?: CourseStatus;
    price?: number;
    discountPrice?: number;
    duration?: number;
    category?: string;
    language?: string;
    featured?: boolean;
    thumbnail?: string;
    coverImage?: string;
    metadata?: CourseMetadataDto;
}
export {};
