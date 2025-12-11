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
exports.CreateUserDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const client_1 = require("@prisma/client");
class CreateUserDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { email: { required: true, type: () => String }, firstName: { required: true, type: () => String, minLength: 2, maxLength: 50 }, lastName: { required: true, type: () => String, minLength: 2, maxLength: 50 }, role: { required: true, type: () => Object }, phone: { required: false, type: () => String }, bio: { required: false, type: () => String, maxLength: 500 } };
    }
}
exports.CreateUserDto = CreateUserDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'البريد الإلكتروني',
        example: 'user@example.com',
    }),
    (0, class_validator_1.IsEmail)({}, { message: 'البريد الإلكتروني غير صالح' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'البريد الإلكتروني مطلوب' }),
    __metadata("design:type", String)
], CreateUserDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'الاسم الأول',
        example: 'أحمد',
        minLength: 2,
        maxLength: 50,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'الاسم الأول مطلوب' }),
    (0, class_validator_1.MinLength)(2, { message: 'الاسم الأول يجب أن يكون حرفين على الأقل' }),
    (0, class_validator_1.MaxLength)(50, { message: 'الاسم الأول يجب ألا يتجاوز 50 حرف' }),
    __metadata("design:type", String)
], CreateUserDto.prototype, "firstName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'الاسم الأخير',
        example: 'محمد',
        minLength: 2,
        maxLength: 50,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'الاسم الأخير مطلوب' }),
    (0, class_validator_1.MinLength)(2, { message: 'الاسم الأخير يجب أن يكون حرفين على الأقل' }),
    (0, class_validator_1.MaxLength)(50, { message: 'الاسم الأخير يجب ألا يتجاوز 50 حرف' }),
    __metadata("design:type", String)
], CreateUserDto.prototype, "lastName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'دور المستخدم',
        enum: client_1.UserRole,
        example: 'student',
    }),
    (0, class_validator_1.IsEnum)(client_1.UserRole, { message: 'الدور غير صالح' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'الدور مطلوب' }),
    __metadata("design:type", String)
], CreateUserDto.prototype, "role", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'رقم الهاتف',
        example: '+966501234567',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateUserDto.prototype, "phone", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'نبذة عن المستخدم',
        example: 'مطور برمجيات متخصص في تطوير الويب',
        maxLength: 500,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(500, { message: 'النبذة يجب ألا تتجاوز 500 حرف' }),
    __metadata("design:type", String)
], CreateUserDto.prototype, "bio", void 0);
//# sourceMappingURL=create-user.dto.js.map