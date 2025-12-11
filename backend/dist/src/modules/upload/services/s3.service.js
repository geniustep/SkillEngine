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
var S3Service_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.S3Service = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const client_s3_1 = require("@aws-sdk/client-s3");
const s3_request_presigner_1 = require("@aws-sdk/s3-request-presigner");
let S3Service = S3Service_1 = class S3Service {
    constructor(configService) {
        this.configService = configService;
        this.logger = new common_1.Logger(S3Service_1.name);
        const region = this.configService.get('AWS_REGION', 'us-east-1');
        const endpoint = this.configService.get('S3_ENDPOINT');
        const accessKeyId = this.configService.get('AWS_ACCESS_KEY_ID', '');
        const secretAccessKey = this.configService.get('AWS_SECRET_ACCESS_KEY', '');
        const forcePathStyle = this.configService.get('S3_FORCE_PATH_STYLE') === 'true';
        this.bucket = this.configService.get('S3_BUCKET_NAME', 'academy-lms');
        this.cdnUrl = this.configService.get('S3_CDN_URL', '');
        this.s3Client = new client_s3_1.S3Client({
            region,
            ...(endpoint && { endpoint }),
            forcePathStyle,
            credentials: {
                accessKeyId,
                secretAccessKey,
            },
        });
        this.logger.log(`S3 Service initialized with bucket: ${this.bucket}`);
    }
    async uploadFile(buffer, key, contentType) {
        try {
            await this.s3Client.send(new client_s3_1.PutObjectCommand({
                Bucket: this.bucket,
                Key: key,
                Body: buffer,
                ContentType: contentType,
                ACL: 'public-read',
            }));
            if (this.cdnUrl) {
                return `${this.cdnUrl}/${key}`;
            }
            const endpoint = this.configService.get('S3_ENDPOINT');
            if (endpoint) {
                return `${endpoint}/${this.bucket}/${key}`;
            }
            return `https://${this.bucket}.s3.amazonaws.com/${key}`;
        }
        catch (error) {
            this.logger.error(`Failed to upload file: ${error}`);
            throw error;
        }
    }
    async deleteFile(key) {
        try {
            await this.s3Client.send(new client_s3_1.DeleteObjectCommand({
                Bucket: this.bucket,
                Key: key,
            }));
        }
        catch (error) {
            this.logger.error(`Failed to delete file: ${error}`);
            throw error;
        }
    }
    async getSignedUrl(key, expiresIn = 3600) {
        try {
            const command = new client_s3_1.GetObjectCommand({
                Bucket: this.bucket,
                Key: key,
            });
            return (0, s3_request_presigner_1.getSignedUrl)(this.s3Client, command, { expiresIn });
        }
        catch (error) {
            this.logger.error(`Failed to generate signed URL: ${error}`);
            throw error;
        }
    }
    async fileExists(key) {
        try {
            await this.s3Client.send(new client_s3_1.GetObjectCommand({
                Bucket: this.bucket,
                Key: key,
            }));
            return true;
        }
        catch {
            return false;
        }
    }
};
exports.S3Service = S3Service;
exports.S3Service = S3Service = S3Service_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], S3Service);
//# sourceMappingURL=s3.service.js.map