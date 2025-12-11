import { CourseLevel } from '@prisma/client';
declare class CourseMetadataDto {
    prerequisites?: string[];
    learningOutcomes?: string[];
    targetAudience?: string;
    requirements?: string[];
}
export declare class CreateCourseDto {
    title: string;
    description: string;
    shortDescription?: string;
    instructorId: string;
    level?: CourseLevel;
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
