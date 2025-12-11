import { CourseStatus, CourseLevel } from '@prisma/client';
declare class InstructorInfo {
    id: string;
    firstName: string;
    lastName: string;
    avatar?: string;
}
export declare class CourseResponseDto {
    id: string;
    title: string;
    slug: string;
    shortDescription?: string;
    description: string;
    thumbnail?: string;
    coverImage?: string;
    category?: string;
    level: CourseLevel;
    language: string;
    price: number;
    discountPrice?: number;
    duration: number;
    status: CourseStatus;
    featured: boolean;
    instructor: InstructorInfo;
    enrollmentsCount?: number;
    rating?: number;
    reviewCount?: number;
    publishedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}
export {};
