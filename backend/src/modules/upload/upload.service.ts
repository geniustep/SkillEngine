import {
  Injectable,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3Service } from './services/s3.service';
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';

export interface UploadResult {
  url: string;
  key: string;
  filename: string;
  size: number;
  mimeType: string;
}

@Injectable()
export class UploadService {
  private readonly logger = new Logger(UploadService.name);
  private readonly maxImageSize: number;
  private readonly maxVideoSize: number;
  private readonly maxDocumentSize: number;
  private readonly allowedImageTypes: string[];
  private readonly allowedVideoTypes: string[];
  private readonly allowedDocumentTypes: string[];

  constructor(
    private readonly configService: ConfigService,
    private readonly s3Service: S3Service,
  ) {
    this.maxImageSize = this.configService.get<number>('MAX_FILE_SIZE_IMAGE', 5242880);
    this.maxVideoSize = this.configService.get<number>('MAX_FILE_SIZE_VIDEO', 524288000);
    this.maxDocumentSize = this.configService.get<number>('MAX_FILE_SIZE_DOCUMENT', 10485760);
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

  async uploadImage(
    file: Express.Multer.File,
    tenantId: string,
    _userId: string,
  ): Promise<UploadResult> {
    // Validate file type
    if (!this.allowedImageTypes.includes(file.mimetype)) {
      throw new BadRequestException(
        `نوع الملف غير مدعوم. الأنواع المدعومة: ${this.allowedImageTypes.join(', ')}`,
      );
    }

    // Validate file size
    if (file.size > this.maxImageSize) {
      throw new BadRequestException(
        `حجم الملف يتجاوز الحد المسموح (${this.maxImageSize / 1024 / 1024}MB)`,
      );
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

  async uploadVideo(
    file: Express.Multer.File,
    tenantId: string,
    _userId: string,
  ): Promise<UploadResult> {
    // Validate file type
    if (!this.allowedVideoTypes.includes(file.mimetype)) {
      throw new BadRequestException(
        `نوع الملف غير مدعوم. الأنواع المدعومة: ${this.allowedVideoTypes.join(', ')}`,
      );
    }

    // Validate file size
    if (file.size > this.maxVideoSize) {
      throw new BadRequestException(
        `حجم الملف يتجاوز الحد المسموح (${this.maxVideoSize / 1024 / 1024}MB)`,
      );
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

  async uploadDocument(
    file: Express.Multer.File,
    tenantId: string,
    _userId: string,
  ): Promise<UploadResult> {
    // Validate file type
    if (!this.allowedDocumentTypes.includes(file.mimetype)) {
      throw new BadRequestException(
        `نوع الملف غير مدعوم. الأنواع المدعومة: PDF, DOCX, PPTX`,
      );
    }

    // Validate file size
    if (file.size > this.maxDocumentSize) {
      throw new BadRequestException(
        `حجم الملف يتجاوز الحد المسموح (${this.maxDocumentSize / 1024 / 1024}MB)`,
      );
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

  async deleteFile(filename: string, tenantId: string): Promise<void> {
    // Construct the key based on tenant
    // In production, you'd want to verify the file belongs to the tenant
    await this.s3Service.deleteFile(filename);
  }

  async getSignedUrl(key: string, expiresIn = 3600): Promise<string> {
    return this.s3Service.getSignedUrl(key, expiresIn);
  }

  private generateKey(tenantId: string, folder: string, originalName: string): string {
    const ext = path.extname(originalName);
    const uniqueId = uuidv4();
    return `${tenantId}/${folder}/${uniqueId}${ext}`;
  }
}

