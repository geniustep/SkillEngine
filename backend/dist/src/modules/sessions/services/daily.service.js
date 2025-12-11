"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var DailyService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DailyService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
let DailyService = DailyService_1 = class DailyService {
    constructor(configService) {
        this.configService = configService;
        this.logger = new common_1.Logger(DailyService_1.name);
        this.apiKey = this.configService.get('DAILY_API_KEY', '');
        this.domain = this.configService.get('DAILY_DOMAIN', '');
        this.apiUrl = this.configService.get('DAILY_API_URL', 'https://api.daily.co/v1');
    }
    async createRoom(options) {
        if (!this.apiKey) {
            this.logger.warn('Daily.co API key not configured, returning mock room');
            return this.mockCreateRoom(options);
        }
        const properties = {
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
        }
        catch (error) {
            this.logger.error(`Daily.co error: ${error}`);
            throw error;
        }
    }
    async getRoom(roomName) {
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
        }
        catch (error) {
            this.logger.error(`Daily.co get room error: ${error}`);
            return null;
        }
    }
    async deleteRoom(roomName) {
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
        }
        catch (error) {
            this.logger.error(`Daily.co delete room error: ${error}`);
        }
    }
    async createMeetingToken(roomName, options = {}) {
        if (!this.apiKey) {
            return 'mock_token_' + Date.now();
        }
        const properties = {
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
        }
        catch (error) {
            this.logger.error(`Daily.co meeting token error: ${error}`);
            throw error;
        }
    }
    async getRoomParticipants(roomName) {
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
        }
        catch (error) {
            this.logger.error(`Daily.co participants error: ${error}`);
            return [];
        }
    }
    mockCreateRoom(options) {
        const name = options.name || `room-${Date.now()}`;
        return {
            id: `mock-${Date.now()}`,
            name,
            url: `https://${this.domain || 'mock.daily.co'}/${name}`,
            created_at: new Date().toISOString(),
            config: {},
        };
    }
};
exports.DailyService = DailyService;
exports.DailyService = DailyService = DailyService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], DailyService);
//# sourceMappingURL=daily.service.js.map