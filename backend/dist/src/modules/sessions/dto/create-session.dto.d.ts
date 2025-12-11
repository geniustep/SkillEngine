import { LivePlatform } from '@prisma/client';
export declare class CreateSessionDto {
    title: string;
    description?: string;
    courseId?: string;
    instructorId: string;
    scheduledStart: Date;
    scheduledEnd: Date;
    platform?: LivePlatform;
    maxParticipants?: number;
    metadata?: Record<string, unknown>;
}
