import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { TokenResponseDto } from './dto/token-response.dto';
import { SetupDto } from './dto/setup.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser, CurrentUserData } from '../../common/decorators/current-user.decorator';
import { Public } from '../../common/decorators/public.decorator';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('setup')
  @Public()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'إنشاء المستخدم الأول (Super Admin)' })
  @ApiBody({ type: SetupDto })
  @ApiResponse({
    status: 201,
    description: 'تم إنشاء المستخدم الأول بنجاح',
    type: TokenResponseDto,
  })
  @ApiResponse({ status: 400, description: 'النظام مُعد مسبقاً' })
  async setup(@Body() setupDto: SetupDto): Promise<TokenResponseDto> {
    return this.authService.setup(setupDto);
  }

  @Get('setup/status')
  @Public()
  @ApiOperation({ summary: 'التحقق من حالة إعداد النظام' })
  @ApiResponse({ status: 200, description: 'حالة الإعداد' })
  async setupStatus(): Promise<{ isSetup: boolean }> {
    return this.authService.getSetupStatus();
  }

  @Post('login')
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'تسجيل الدخول' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({
    status: 200,
    description: 'تم تسجيل الدخول بنجاح',
    type: TokenResponseDto,
  })
  @ApiResponse({ status: 401, description: 'بيانات الاعتماد غير صحيحة' })
  async login(@Body() loginDto: LoginDto): Promise<TokenResponseDto> {
    return this.authService.login(loginDto);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'تسجيل الخروج' })
  @ApiResponse({ status: 200, description: 'تم تسجيل الخروج بنجاح' })
  async logout(@CurrentUser() user: CurrentUserData): Promise<{ message: string }> {
    await this.authService.logout(user.id);
    return { message: 'تم تسجيل الخروج بنجاح' };
  }

  @Post('refresh')
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'تجديد رمز الوصول' })
  @ApiBody({ type: RefreshTokenDto })
  @ApiResponse({
    status: 200,
    description: 'تم تجديد الرمز بنجاح',
    type: TokenResponseDto,
  })
  @ApiResponse({ status: 401, description: 'رمز التجديد غير صالح' })
  async refresh(@Body() refreshDto: RefreshTokenDto): Promise<TokenResponseDto> {
    return this.authService.refreshToken(refreshDto.refreshToken);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'الحصول على بيانات المستخدم الحالي' })
  @ApiResponse({ status: 200, description: 'بيانات المستخدم' })
  @ApiResponse({ status: 401, description: 'غير مصرح' })
  async me(@CurrentUser() user: CurrentUserData) {
    return this.authService.getCurrentUser(user.id);
  }

  @Post('verify-token')
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'التحقق من صلاحية الرمز' })
  @ApiResponse({ status: 200, description: 'الرمز صالح' })
  @ApiResponse({ status: 401, description: 'الرمز غير صالح' })
  async verifyToken(@Body('token') token: string): Promise<{ valid: boolean }> {
    const valid = await this.authService.verifyToken(token);
    return { valid };
  }
}

