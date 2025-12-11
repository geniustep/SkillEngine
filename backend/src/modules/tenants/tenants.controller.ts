import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { TenantsService } from './tenants.service';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { UpdateTenantDto } from './dto/update-tenant.dto';
import { TenantQueryDto } from './dto/tenant-query.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { RequirePermissions, Permission } from '../../common/decorators/permissions.decorator';
import { CurrentUser, CurrentUserData } from '../../common/decorators/current-user.decorator';
import { IdParamDto } from '../../common/dto/id-param.dto';

@ApiTags('Tenants')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('tenants')
export class TenantsController {
  constructor(private readonly tenantsService: TenantsService) {}

  @Get()
  @RequirePermissions(Permission.TENANTS_VIEW)
  @ApiOperation({ summary: 'الحصول على قائمة المؤسسات (Super Admin فقط)' })
  async findAll(@Query() query: TenantQueryDto) {
    return this.tenantsService.findAll(query);
  }

  @Get(':id')
  @RequirePermissions(Permission.TENANTS_VIEW)
  @ApiOperation({ summary: 'الحصول على مؤسسة محددة' })
  @ApiParam({ name: 'id', description: 'معرف المؤسسة' })
  async findOne(@Param() params: IdParamDto) {
    return this.tenantsService.findOne(params.id);
  }

  @Post()
  @RequirePermissions(Permission.TENANTS_CREATE)
  @ApiOperation({ summary: 'إنشاء مؤسسة جديدة' })
  @ApiResponse({ status: 201, description: 'تم إنشاء المؤسسة بنجاح' })
  async create(
    @Body() createTenantDto: CreateTenantDto,
    @CurrentUser() currentUser: CurrentUserData,
  ) {
    return this.tenantsService.create(createTenantDto, currentUser.id);
  }

  @Put(':id')
  @RequirePermissions(Permission.TENANTS_EDIT)
  @ApiOperation({ summary: 'تحديث مؤسسة' })
  @ApiParam({ name: 'id', description: 'معرف المؤسسة' })
  async update(
    @Param() params: IdParamDto,
    @Body() updateTenantDto: UpdateTenantDto,
    @CurrentUser() currentUser: CurrentUserData,
  ) {
    return this.tenantsService.update(params.id, updateTenantDto, currentUser.id);
  }

  @Patch(':id/status')
  @RequirePermissions(Permission.TENANTS_EDIT)
  @ApiOperation({ summary: 'تحديث حالة مؤسسة' })
  @ApiParam({ name: 'id', description: 'معرف المؤسسة' })
  async updateStatus(
    @Param() params: IdParamDto,
    @Body('status') status: string,
    @CurrentUser() currentUser: CurrentUserData,
  ) {
    return this.tenantsService.updateStatus(params.id, status, currentUser.id);
  }

  @Get(':id/stats')
  @RequirePermissions(Permission.TENANTS_VIEW)
  @ApiOperation({ summary: 'الحصول على إحصائيات المؤسسة' })
  @ApiParam({ name: 'id', description: 'معرف المؤسسة' })
  async getStats(@Param() params: IdParamDto) {
    return this.tenantsService.getTenantStats(params.id);
  }
}

