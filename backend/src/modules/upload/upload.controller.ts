import {
  Controller,
  Post,
  Delete,
  Param,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiConsumes,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';
import { UploadService } from './upload.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { TenantId } from '../../common/decorators/tenant.decorator';
import { CurrentUser, CurrentUserData } from '../../common/decorators/current-user.decorator';

@ApiTags('Upload')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('image')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'رفع صورة' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'تم رفع الصورة بنجاح' })
  async uploadImage(
    @UploadedFile() file: Express.Multer.File,
    @TenantId() tenantId: string,
    @CurrentUser() currentUser: CurrentUserData,
  ) {
    if (!file) {
      throw new BadRequestException('الملف مطلوب');
    }

    return this.uploadService.uploadImage(file, tenantId, currentUser.id);
  }

  @Post('video')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'رفع فيديو' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'تم رفع الفيديو بنجاح' })
  async uploadVideo(
    @UploadedFile() file: Express.Multer.File,
    @TenantId() tenantId: string,
    @CurrentUser() currentUser: CurrentUserData,
  ) {
    if (!file) {
      throw new BadRequestException('الملف مطلوب');
    }

    return this.uploadService.uploadVideo(file, tenantId, currentUser.id);
  }

  @Post('document')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'رفع مستند' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'تم رفع المستند بنجاح' })
  async uploadDocument(
    @UploadedFile() file: Express.Multer.File,
    @TenantId() tenantId: string,
    @CurrentUser() currentUser: CurrentUserData,
  ) {
    if (!file) {
      throw new BadRequestException('الملف مطلوب');
    }

    return this.uploadService.uploadDocument(file, tenantId, currentUser.id);
  }

  @Delete(':filename')
  @ApiOperation({ summary: 'حذف ملف' })
  @ApiParam({ name: 'filename', description: 'اسم الملف' })
  @ApiResponse({ status: 200, description: 'تم حذف الملف بنجاح' })
  async deleteFile(
    @Param('filename') filename: string,
    @TenantId() tenantId: string,
  ) {
    await this.uploadService.deleteFile(filename, tenantId);
    return { message: 'تم حذف الملف بنجاح' };
  }
}

