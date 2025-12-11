"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var UploadService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const s3_service_1 = require("./services/s3.service");
const uuid_1 = require("uuid");
const path = __importStar(require("path"));
let UploadService = UploadService_1 = class UploadService {
    constructor(configService, s3Service) {
        this.configService = configService;
        this.s3Service = s3Service;
        this.logger = new common_1.Logger(UploadService_1.name);
        this.maxImageSize = this.configService.get('MAX_FILE_SIZE_IMAGE', 5242880);
        this.maxVideoSize = this.configService.get('MAX_FILE_SIZE_VIDEO', 524288000);
        this.maxDocumentSize = this.configService.get('MAX_FILE_SIZE_DOCUMENT', 10485760);
        this.allowedImageTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
        this.allowedVideoTypes = ['video/mp4', 'video/webm'];
        this.allowedDocumentTypes = [
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/vnd.ms-powerpoint',
            'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        ];
    }
    async uploadImage(file, tenantId, _userId) {
        if (!this.allowedImageTypes.includes(file.mimetype)) {
            throw new common_1.BadRequestException(`نوع الملف غير مدعوم. الأنواع المدعومة: ${this.allowedImageTypes.join(', ')}`);
        }
        if (file.size > this.maxImageSize) {
            throw new common_1.BadRequestException(`حجم الملف يتجاوز الحد المسموح (${this.maxImageSize / 1024 / 1024}MB)`);
        }
        const key = this.generateKey(tenantId, 'images', file.originalname);
        const url = await this.s3Service.uploadFile(file.buffer, key, file.mimetype);
        return {
            url,
            key,
            filename: file.originalname,
            size: file.size,
            mimeType: file.mimetype,
        };
    }
    async uploadVideo(file, tenantId, _userId) {
        if (!this.allowedVideoTypes.includes(file.mimetype)) {
            throw new common_1.BadRequestException(`نوع الملف غير مدعوم. الأنواع المدعومة: ${this.allowedVideoTypes.join(', ')}`);
        }
        if (file.size > this.maxVideoSize) {
            throw new common_1.BadRequestException(`حجم الملف يتجاوز الحد المسموح (${this.maxVideoSize / 1024 / 1024}MB)`);
        }
        const key = this.generateKey(tenantId, 'videos', file.originalname);
        const url = await this.s3Service.uploadFile(file.buffer, key, file.mimetype);
        return {
            url,
            key,
            filename: file.originalname,
            size: file.size,
            mimeType: file.mimetype,
        };
    }
    async uploadDocument(file, tenantId, _userId) {
        if (!this.allowedDocumentTypes.includes(file.mimetype)) {
            throw new common_1.BadRequestException(`نوع الملف غير مدعوم. الأنواع المدعومة: PDF, DOCX, PPTX`);
        }
        if (file.size > this.maxDocumentSize) {
            throw new common_1.BadRequestException(`حجم الملف يتجاوز الحد المسموح (${this.maxDocumentSize / 1024 / 1024}MB)`);
        }
        const key = this.generateKey(tenantId, 'documents', file.originalname);
        const url = await this.s3Service.uploadFile(file.buffer, key, file.mimetype);
        return {
            url,
            key,
            filename: file.originalname,
            size: file.size,
            mimeType: file.mimetype,
        };
    }
    async deleteFile(filename, tenantId) {
        await this.s3Service.deleteFile(filename);
    }
    async getSignedUrl(key, expiresIn = 3600) {
        return this.s3Service.getSignedUrl(key, expiresIn);
    }
    generateKey(tenantId, folder, originalName) {
        const ext = path.extname(originalName);
        const uniqueId = (0, uuid_1.v4)();
        return `${tenantId}/${folder}/${uniqueId}${ext}`;
    }
};
exports.UploadService = UploadService;
exports.UploadService = UploadService = UploadService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        s3_service_1.S3Service])
], UploadService);
//# sourceMappingURL=upload.service.js.map