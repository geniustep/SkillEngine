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
exports.CreateSessionDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const client_1 = require("@prisma/client");
class CreateSessionDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { title: { required: true, type: () => String }, description: { required: false, type: () => String }, courseId: { required: false, type: () => String }, instructorId: { required: true, type: () => String }, scheduledStart: { required: true, type: () => Date }, scheduledEnd: { required: true, type: () => Date }, platform: { required: false, type: () => Object }, maxParticipants: { required: false, type: () => Number, minimum: 1 }, metadata: { required: false, type: () => Object } };
    }
}
exports.CreateSessionDto = CreateSessionDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'عنوان الجلسة',
        example: 'مقدمة في البرمجة - الجلسة الأولى',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'عنوان الجلسة مطلوب' }),
    __metadata("design:type", String)
], CreateSessionDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'وصف الجلسة',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateSessionDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'معرف الدورة',
        format: 'uuid',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)('4', { message: 'معرف الدورة غير صالح' }),
    __metadata("design:type", String)
], CreateSessionDto.prototype, "courseId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'معرف المدرب',
        format: 'uuid',
    }),
    (0, class_validator_1.IsUUID)('4', { message: 'معرف المدرب غير صالح' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'معرف المدرب مطلوب' }),
    __metadata("design:type", String)
], CreateSessionDto.prototype, "instructorId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'وقت البدء المجدول',
        example: '2025-12-15T10:00:00Z',
    }),
    (0, class_validator_1.IsDateString)({}, { message: 'تاريخ البدء غير صالح' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'وقت البدء مطلوب' }),
    __metadata("design:type", Date)
], CreateSessionDto.prototype, "scheduledStart", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'وقت الانتهاء المجدول',
        example: '2025-12-15T12:00:00Z',
    }),
    (0, class_validator_1.IsDateString)({}, { message: 'تاريخ الانتهاء غير صالح' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'وقت الانتهاء مطلوب' }),
    __metadata("design:type", Date)
], CreateSessionDto.prototype, "scheduledEnd", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'منصة البث',
        enum: client_1.LivePlatform,
        default: 'daily',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(client_1.LivePlatform, { message: 'المنصة غير صالحة' }),
    __metadata("design:type", String)
], CreateSessionDto.prototype, "platform", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'الحد الأقصى للمشاركين',
        minimum: 1,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1, { message: 'الحد الأقصى يجب أن يكون 1 على الأقل' }),
    __metadata("design:type", Number)
], CreateSessionDto.prototype, "maxParticipants", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'بيانات إضافية',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], CreateSessionDto.prototype, "metadata", void 0);
//# sourceMappingURL=create-session.dto.js.map