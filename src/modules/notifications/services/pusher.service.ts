import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Pusher from 'pusher';

@Injectable()
export class PusherService {
  private readonly logger = new Logger(PusherService.name);
  private pusher: Pusher | null = null;

  constructor(private readonly configService: ConfigService) {
    const appId = this.configService.get<string>('PUSHER_APP_ID');
    const key = this.configService.get<string>('PUSHER_KEY');
    const secret = this.configService.get<string>('PUSHER_SECRET');
    const cluster = this.configService.get<string>('PUSHER_CLUSTER', 'eu');

    if (appId && key && secret) {
      this.pusher = new Pusher({
        appId,
        key,
        secret,
        cluster,
        useTLS: true,
      });
      this.logger.log('Pusher initialized');
    } else {
      this.logger.warn('Pusher not configured, real-time features disabled');
    }
  }

  async sendToUser(userId: string, event: string, data: unknown): Promise<void> {
    if (!this.pusher) {
      this.logger.debug(`Pusher not configured, skipping event: ${event}`);
      return;
    }

    try {
      await this.pusher.trigger(`private-user-${userId}`, event, data);
    } catch (error) {
      this.logger.error(`Failed to send Pusher event: ${error}`);
      throw error;
    }
  }

  async sendToChannel(channel: string, event: string, data: unknown): Promise<void> {
    if (!this.pusher) {
      this.logger.debug(`Pusher not configured, skipping event: ${event}`);
      return;
    }

    try {
      await this.pusher.trigger(channel, event, data);
    } catch (error) {
      this.logger.error(`Failed to send Pusher event: ${error}`);
      throw error;
    }
  }

  async sendToTenant(tenantId: string, event: string, data: unknown): Promise<void> {
    return this.sendToChannel(`private-tenant-${tenantId}`, event, data);
  }

  async sendToSession(sessionId: string, event: string, data: unknown): Promise<void> {
    return this.sendToChannel(`presence-session-${sessionId}`, event, data);
  }

  authenticateUser(socketId: string, channel: string, userId: string): Pusher.AuthResponse | null {
    if (!this.pusher) {
      return null;
    }

    return this.pusher.authorizeChannel(socketId, channel, {
      user_id: userId,
    });
  }
}

