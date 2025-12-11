import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiSecurity,
} from '@nestjs/swagger';
import { CurriculumService } from './curriculum.service';
import { CreateCurriculumDto } from './dto/create-curriculum.dto';
import { UpdateCurriculumDto } from './dto/update-curriculum.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { RequirePermissions, Permission } from '../../common/decorators/permissions.decorator';
import { TenantId } from '../../common/decorators/tenant.decorator';
import { CurrentUser, CurrentUserData } from '../../common/decorators/current-user.decorator';

@ApiTags('Courses')
@ApiBearerAuth('JWT-auth')
@ApiSecurity('tenant-id')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('courses/:courseId/curriculum')
export class CurriculumController {
  constructor(private readonly curriculumService: CurriculumService) {}

  @Get()
  @RequirePermissions(Permission.COURSES_VIEW)
  @ApiOperation({ summary: 'الحصول على منهج الدورة' })
  @ApiParam({ name: 'courseId', description: 'معرف الدورة' })
  async getCurriculum(
    @Param('courseId') courseId: string,
    @TenantId() tenantId: string,
  ) {
    return this.curriculumService.getCurriculum(courseId, tenantId);
  }

  @Post()
  @RequirePermissions(Permission.COURSES_EDIT)
  @ApiOperation({ summary: 'إضافة عنصر للمنهج' })
  @ApiParam({ name: 'courseId', description: 'معرف الدورة' })
  @ApiResponse({ status: 201, description: 'تم إضافة العنصر بنجاح' })
  async addItem(
    @Param('courseId') courseId: string,
    @Body() createDto: CreateCurriculumDto,
    @TenantId() tenantId: string,
    @CurrentUser() currentUser: CurrentUserData,
  ) {
    return this.curriculumService.addItem(courseId, createDto, tenantId, currentUser.id);
  }

  @Put(':itemId')
  @RequirePermissions(Permission.COURSES_EDIT)
  @ApiOperation({ summary: 'تحديث عنصر في المنهج' })
  @ApiParam({ name: 'courseId', description: 'معرف الدورة' })
  @ApiParam({ name: 'itemId', description: 'معرف العنصر' })
  async updateItem(
    @Param('courseId') courseId: string,
    @Param('itemId') itemId: string,
    @Body() updateDto: UpdateCurriculumDto,
    @TenantId() tenantId: string,
    @CurrentUser() currentUser: CurrentUserData,
  ) {
    return this.curriculumService.updateItem(courseId, itemId, updateDto, tenantId, currentUser.id);
  }

  @Delete(':itemId')
  @RequirePermissions(Permission.COURSES_EDIT)
  @ApiOperation({ summary: 'حذف عنصر من المنهج' })
  @ApiParam({ name: 'courseId', description: 'معرف الدورة' })
  @ApiParam({ name: 'itemId', description: 'معرف العنصر' })
  async deleteItem(
    @Param('courseId') courseId: string,
    @Param('itemId') itemId: string,
    @TenantId() tenantId: string,
    @CurrentUser() currentUser: CurrentUserData,
  ) {
    await this.curriculumService.deleteItem(courseId, itemId, tenantId, currentUser.id);
    return { message: 'تم حذف العنصر بنجاح' };
  }

  @Post('reorder')
  @RequirePermissions(Permission.COURSES_EDIT)
  @ApiOperation({ summary: 'إعادة ترتيب عناصر المنهج' })
  @ApiParam({ name: 'courseId', description: 'معرف الدورة' })
  async reorderItems(
    @Param('courseId') courseId: string,
    @Body() items: { id: string; order: number }[],
    @TenantId() tenantId: string,
    @CurrentUser() currentUser: CurrentUserData,
  ) {
    return this.curriculumService.reorderItems(courseId, items, tenantId, currentUser.id);
  }
}

