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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var PusherService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PusherService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const pusher_1 = __importDefault(require("pusher"));
let PusherService = PusherService_1 = class PusherService {
    constructor(configService) {
        this.configService = configService;
        this.logger = new common_1.Logger(PusherService_1.name);
        this.pusher = null;
        const appId = this.configService.get('PUSHER_APP_ID');
        const key = this.configService.get('PUSHER_KEY');
        const secret = this.configService.get('PUSHER_SECRET');
        const cluster = this.configService.get('PUSHER_CLUSTER', 'eu');
        if (appId && key && secret) {
            this.pusher = new pusher_1.default({
                appId,
                key,
                secret,
                cluster,
                useTLS: true,
            });
            this.logger.log('Pusher initialized');
        }
        else {
            this.logger.warn('Pusher not configured, real-time features disabled');
        }
    }
    async sendToUser(userId, event, data) {
        if (!this.pusher) {
            this.logger.debug(`Pusher not configured, skipping event: ${event}`);
            return;
        }
        try {
            await this.pusher.trigger(`private-user-${userId}`, event, data);
        }
        catch (error) {
            this.logger.error(`Failed to send Pusher event: ${error}`);
            throw error;
        }
    }
    async sendToChannel(channel, event, data) {
        if (!this.pusher) {
            this.logger.debug(`Pusher not configured, skipping event: ${event}`);
            return;
        }
        try {
            await this.pusher.trigger(channel, event, data);
        }
        catch (error) {
            this.logger.error(`Failed to send Pusher event: ${error}`);
            throw error;
        }
    }
    async sendToTenant(tenantId, event, data) {
        return this.sendToChannel(`private-tenant-${tenantId}`, event, data);
    }
    async sendToSession(sessionId, event, data) {
        return this.sendToChannel(`presence-session-${sessionId}`, event, data);
    }
    authenticateUser(socketId, channel, userId) {
        if (!this.pusher) {
            return null;
        }
        return this.pusher.authorizeChannel(socketId, channel, {
            user_id: userId,
        });
    }
};
exports.PusherService = PusherService;
exports.PusherService = PusherService = PusherService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], PusherService);
//# sourceMappingURL=pusher.service.js.map