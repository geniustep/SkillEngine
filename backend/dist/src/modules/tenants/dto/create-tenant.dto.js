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
exports.CreateTenantDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const client_1 = require("@prisma/client");
class CreateTenantDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { name: { required: true, type: () => String }, domain: { required: false, type: () => String }, logo: { required: false, type: () => String }, ownerId: { required: true, type: () => String }, subscriptionPlan: { required: false, type: () => Object }, settings: { required: false, type: () => Object } };
    }
}
exports.CreateTenantDto = CreateTenantDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'اسم المؤسسة',
        example: 'أكاديمية التعليم',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'اسم المؤسسة مطلوب' }),
    __metadata("design:type", String)
], CreateTenantDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'النطاق المخصص',
        example: 'academy.example.com',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateTenantDto.prototype, "domain", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'رابط الشعار',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUrl)({}, { message: 'رابط الشعار غير صالح' }),
    __metadata("design:type", String)
], CreateTenantDto.prototype, "logo", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'معرف مالك المؤسسة',
        format: 'uuid',
    }),
    (0, class_validator_1.IsUUID)('4', { message: 'معرف المالك غير صالح' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'معرف المالك مطلوب' }),
    __metadata("design:type", String)
], CreateTenantDto.prototype, "ownerId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'خطة الاشتراك',
        enum: client_1.SubscriptionPlan,
        default: 'free',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(client_1.SubscriptionPlan, { message: 'خطة الاشتراك غير صالحة' }),
    __metadata("design:type", String)
], CreateTenantDto.prototype, "subscriptionPlan", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'إعدادات المؤسسة',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], CreateTenantDto.prototype, "settings", void 0);
//# sourceMappingURL=create-tenant.dto.js.map