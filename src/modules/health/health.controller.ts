import { Controller, Get, Head } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { HealthService } from './health.service';
import { Public } from '../../common/decorators/public.decorator';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get()
  @Head()
  @Public()
  @ApiOperation({ summary: 'فحص صحة النظام الأساسي' })
  @ApiResponse({ status: 200, description: 'النظام يعمل بشكل صحيح' })
  async health() {
    return this.healthService.getHealth();
  }

  @Get('ready')
  @Public()
  @ApiOperation({ summary: 'فحص جاهزية النظام' })
  @ApiResponse({ status: 200, description: 'النظام جاهز لاستقبال الطلبات' })
  async ready() {
    return this.healthService.getReadiness();
  }

  @Get('live')
  @Public()
  @ApiOperation({ summary: 'فحص حيوية النظام' })
  @ApiResponse({ status: 200, description: 'النظام حي' })
  async live() {
    return this.healthService.getLiveness();
  }

  @Get('db')
  @Public()
  @ApiOperation({ summary: 'فحص اتصال قاعدة البيانات' })
  @ApiResponse({ status: 200, description: 'قاعدة البيانات متصلة' })
  async db() {
    return this.healthService.getDatabaseHealth();
  }

  @Get('redis')
  @Public()
  @ApiOperation({ summary: 'فحص اتصال Redis' })
  @ApiResponse({ status: 200, description: 'Redis متصل' })
  async redis() {
    return this.healthService.getRedisHealth();
  }
}

