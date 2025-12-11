import { ConfigService } from '@nestjs/config';
interface CreateRoomOptions {
    name: string;
    expiresAt?: Date;
    maxParticipants?: number;
    enableRecording?: boolean;
}
interface DailyRoom {
    id: string;
    name: string;
    url: string;
    created_at: string;
    config: Record<string, unknown>;
}
export declare class DailyService {
    private readonly configService;
    private readonly logger;
    private readonly apiKey;
    private readonly domain;
    private readonly apiUrl;
    constructor(configService: ConfigService);
    createRoom(options: CreateRoomOptions): Promise<DailyRoom>;
    getRoom(roomName: string): Promise<DailyRoom | null>;
    deleteRoom(roomName: string): Promise<void>;
    createMeetingToken(roomName: string, options?: {
        userId?: string;
        userName?: string;
        isOwner?: boolean;
        expiresIn?: number;
    }): Promise<string>;
    getRoomParticipants(roomName: string): Promise<unknown[]>;
    private mockCreateRoom;
}
export {};
