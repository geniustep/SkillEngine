import { SessionStatus } from '@prisma/client';
export declare class UpdateSessionDto {
    title?: string;
    description?: string;
    scheduledStart?: Date;
    scheduledEnd?: Date;
    status?: SessionStatus;
    maxParticipants?: number;
    metadata?: Record<string, unknown>;
}
