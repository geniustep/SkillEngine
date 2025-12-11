import { ConfigService } from '@nestjs/config';
import Pusher from 'pusher';
export declare class PusherService {
    private readonly configService;
    private readonly logger;
    private pusher;
    constructor(configService: ConfigService);
    sendToUser(userId: string, event: string, data: unknown): Promise<void>;
    sendToChannel(channel: string, event: string, data: unknown): Promise<void>;
    sendToTenant(tenantId: string, event: string, data: unknown): Promise<void>;
    sendToSession(sessionId: string, event: string, data: unknown): Promise<void>;
    authenticateUser(socketId: string, channel: string, userId: string): Pusher.AuthResponse | null;
}
