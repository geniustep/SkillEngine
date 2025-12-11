import { SessionStatus, LivePlatform } from '@prisma/client';
declare class InstructorInfo {
    id: string;
    firstName: string;
    lastName: string;
    avatar?: string;
}
declare class CourseInfo {
    id: string;
    title: string;
    slug: string;
}
export declare class SessionResponseDto {
    id: string;
    title: string;
    description?: string;
    courseId?: string;
    course?: CourseInfo;
    instructorId: string;
    instructor: InstructorInfo;
    scheduledStart: Date;
    scheduledEnd: Date;
    actualStart?: Date;
    actualEnd?: Date;
    status: SessionStatus;
    platform: LivePlatform;
    meetingUrl?: string;
    maxParticipants?: number;
    currentParticipants: number;
    recordingUrl?: string;
    createdAt: Date;
    updatedAt: Date;
}
export {};
