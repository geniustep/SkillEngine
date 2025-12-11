import { ConfigService } from '@nestjs/config';
import { S3Service } from './services/s3.service';
interface UploadResult {
    url: string;
    key: string;
    filename: string;
    size: number;
    mimeType: string;
}
export declare class UploadService {
    private readonly configService;
    private readonly s3Service;
    private readonly logger;
    private readonly maxImageSize;
    private readonly maxVideoSize;
    private readonly maxDocumentSize;
    private readonly allowedImageTypes;
    private readonly allowedVideoTypes;
    private readonly allowedDocumentTypes;
    constructor(configService: ConfigService, s3Service: S3Service);
    uploadImage(file: Express.Multer.File, tenantId: string, _userId: string): Promise<UploadResult>;
    uploadVideo(file: Express.Multer.File, tenantId: string, _userId: string): Promise<UploadResult>;
    uploadDocument(file: Express.Multer.File, tenantId: string, _userId: string): Promise<UploadResult>;
    deleteFile(filename: string, tenantId: string): Promise<void>;
    getSignedUrl(key: string, expiresIn?: number): Promise<string>;
    private generateKey;
}
export {};
