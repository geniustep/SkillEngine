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
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenResponseDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
class UserInfo {
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, email: { required: true, type: () => String }, firstName: { required: true, type: () => String }, lastName: { required: true, type: () => String }, role: { required: true, type: () => String }, avatar: { required: true, type: () => String, nullable: true }, tenantId: { required: true, type: () => String } };
    }
}
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'معرف المستخدم' }),
    __metadata("design:type", String)
], UserInfo.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'البريد الإلكتروني' }),
    __metadata("design:type", String)
], UserInfo.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'الاسم الأول' }),
    __metadata("design:type", String)
], UserInfo.prototype, "firstName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'الاسم الأخير' }),
    __metadata("design:type", String)
], UserInfo.prototype, "lastName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'الدور', enum: ['student', 'instructor', 'admin', 'super_admin'] }),
    __metadata("design:type", String)
], UserInfo.prototype, "role", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'صورة الملف الشخصي', nullable: true }),
    __metadata("design:type", Object)
], UserInfo.prototype, "avatar", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'معرف المؤسسة' }),
    __metadata("design:type", String)
], UserInfo.prototype, "tenantId", void 0);
class TokenResponseDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { accessToken: { required: true, type: () => String }, refreshToken: { required: true, type: () => String }, expiresIn: { required: true, type: () => Number }, tokenType: { required: true, type: () => String }, user: { required: true, type: () => UserInfo } };
    }
}
exports.TokenResponseDto = TokenResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'رمز الوصول',
        example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    }),
    __metadata("design:type", String)
], TokenResponseDto.prototype, "accessToken", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'رمز التجديد',
        example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    }),
    __metadata("design:type", String)
], TokenResponseDto.prototype, "refreshToken", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'مدة صلاحية الرمز بالثواني',
        example: 900,
    }),
    __metadata("design:type", Number)
], TokenResponseDto.prototype, "expiresIn", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'نوع الرمز',
        example: 'Bearer',
    }),
    __metadata("design:type", String)
], TokenResponseDto.prototype, "tokenType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'بيانات المستخدم',
        type: UserInfo,
    }),
    __metadata("design:type", UserInfo)
], TokenResponseDto.prototype, "user", void 0);
//# sourceMappingURL=token-response.dto.js.map