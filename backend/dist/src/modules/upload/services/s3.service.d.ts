import { ConfigService } from '@nestjs/config';
export declare class S3Service {
    private readonly configService;
    private readonly logger;
    private readonly s3Client;
    private readonly bucket;
    private readonly cdnUrl;
    constructor(configService: ConfigService);
    uploadFile(buffer: Buffer, key: string, contentType: string): Promise<string>;
    deleteFile(key: string): Promise<void>;
    getSignedUrl(key: string, expiresIn?: number): Promise<string>;
    fileExists(key: string): Promise<boolean>;
}
