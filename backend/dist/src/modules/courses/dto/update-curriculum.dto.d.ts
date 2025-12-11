import { CurriculumType } from '@prisma/client';
declare class CurriculumContentDto {
    videoUrl?: string;
    documentUrl?: string;
    textContent?: string;
    quizData?: Record<string, unknown>;
}
export declare class UpdateCurriculumDto {
    title?: string;
    description?: string;
    type?: CurriculumType;
    parentId?: string;
    order?: number;
    duration?: number;
    content?: CurriculumContentDto;
    isFree?: boolean;
    isPublished?: boolean;
}
export {};
