import { Injectable, Logger } from '@nestjs/common';
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

@Injectable()
export class DailyService {
  private readonly logger = new Logger(DailyService.name);
  private readonly apiKey: string;
  private readonly domain: string;
  private readonly apiUrl: string;

  constructor(private readonly configService: ConfigService) {
    this.apiKey = this.configService.get<string>('DAILY_API_KEY', '');
    this.domain = this.configService.get<string>('DAILY_DOMAIN', '');
    this.apiUrl = this.configService.get<string>('DAILY_API_URL', 'https://api.daily.co/v1');
  }

  async createRoom(options: CreateRoomOptions): Promise<DailyRoom> {
    if (!this.apiKey) {
      this.logger.warn('Daily.co API key not configured, returning mock room');
      return this.mockCreateRoom(options);
    }

    const properties: Record<string, unknown> = {
      enable_chat: true,
      enable_screenshare: true,
      enable_knocking: false,
      start_video_off: false,
      start_audio_off: false,
    };

    if (options.expiresAt) {
      properties.exp = Math.floor(options.expiresAt.getTime() / 1000);
    }

    if (options.maxParticipants) {
      properties.max_participants = options.maxParticipants;
    }

    if (options.enableRecording) {
      properties.enable_recording = 'cloud';
    }

    try {
      const response = await fetch(`${this.apiUrl}/rooms`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          name: options.name,
          properties,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        this.logger.error(`Daily.co create room failed: ${JSON.stringify(error)}`);
        throw new Error('Failed to create Daily.co room');
      }

      return response.json();
    } catch (error) {
      this.logger.error(`Daily.co error: ${error}`);
      throw error;
    }
  }

  async getRoom(roomName: string): Promise<DailyRoom | null> {
    if (!this.apiKey) {
      return null;
    }

    try {
      const response = await fetch(`${this.apiUrl}/rooms/${roomName}`, {
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        throw new Error('Failed to get Daily.co room');
      }

      return response.json();
    } catch (error) {
      this.logger.error(`Daily.co get room error: ${error}`);
      return null;
    }
  }

  async deleteRoom(roomName: string): Promise<void> {
    if (!this.apiKey) {
      return;
    }

    try {
      const response = await fetch(`${this.apiUrl}/rooms/${roomName}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
        },
      });

      if (!response.ok && response.status !== 404) {
        this.logger.error(`Failed to delete Daily.co room: ${roomName}`);
      }
    } catch (error) {
      this.logger.error(`Daily.co delete room error: ${error}`);
    }
  }

  async createMeetingToken(
    roomName: string,
    options: {
      userId?: string;
      userName?: string;
      isOwner?: boolean;
      expiresIn?: number;
    } = {},
  ): Promise<string> {
    if (!this.apiKey) {
      return 'mock_token_' + Date.now();
    }

    const properties: Record<string, unknown> = {
      room_name: roomName,
    };

    if (options.userId) {
      properties.user_id = options.userId;
    }

    if (options.userName) {
      properties.user_name = options.userName;
    }

    if (options.isOwner) {
      properties.is_owner = true;
    }

    if (options.expiresIn) {
      properties.exp = Math.floor(Date.now() / 1000) + options.expiresIn;
    }

    try {
      const response = await fetch(`${this.apiUrl}/meeting-tokens`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({ properties }),
      });

      if (!response.ok) {
        throw new Error('Failed to create meeting token');
      }

      const data = await response.json();
      return data.token;
    } catch (error) {
      this.logger.error(`Daily.co meeting token error: ${error}`);
      throw error;
    }
  }

  async getRoomParticipants(roomName: string): Promise<unknown[]> {
    if (!this.apiKey) {
      return [];
    }

    try {
      const response = await fetch(`${this.apiUrl}/rooms/${roomName}/presence`, {
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
        },
      });

      if (!response.ok) {
        return [];
      }

      const data = await response.json();
      return data.data || [];
    } catch (error) {
      this.logger.error(`Daily.co participants error: ${error}`);
      return [];
    }
  }

  private mockCreateRoom(options: CreateRoomOptions): DailyRoom {
    const name = options.name || `room-${Date.now()}`;
    return {
      id: `mock-${Date.now()}`,
      name,
      url: `https://${this.domain || 'mock.daily.co'}/${name}`,
      created_at: new Date().toISOString(),
      config: {},
    };
  }
}

