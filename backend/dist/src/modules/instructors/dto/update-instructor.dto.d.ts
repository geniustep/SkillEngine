export declare class UpdateInstructorDto {
    title?: string;
    biography?: string;
    specialization?: string[];
    expertise?: string[];
    certifications?: Record<string, unknown>[];
    socialLinks?: Record<string, string>;
    hourlyRate?: number;
    availability?: Record<string, unknown>;
}
