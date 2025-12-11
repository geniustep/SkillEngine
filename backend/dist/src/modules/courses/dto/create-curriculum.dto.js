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
exports.CreateCurriculumDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const client_1 = require("@prisma/client");
class CurriculumContentDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { videoUrl: { required: false, type: () => String }, documentUrl: { required: false, type: () => String }, textContent: { required: false, type: () => String }, quizData: { required: false, type: () => Object } };
    }
}
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'رابط الفيديو' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CurriculumContentDto.prototype, "videoUrl", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'رابط المستند' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CurriculumContentDto.prototype, "documentUrl", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'المحتوى النصي' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CurriculumContentDto.prototype, "textContent", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'بيانات الاختبار' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], CurriculumContentDto.prototype, "quizData", void 0);
class CreateCurriculumDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { title: { required: true, type: () => String }, description: { required: false, type: () => String }, type: { required: true, type: () => Object }, parentId: { required: false, type: () => String }, order: { required: false, type: () => Number, minimum: 0 }, duration: { required: false, type: () => Number, minimum: 0 }, content: { required: false, type: () => CurriculumContentDto }, isFree: { required: false, type: () => Boolean }, isPublished: { required: false, type: () => Boolean } };
    }
}
exports.CreateCurriculumDto = CreateCurriculumDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'عنوان العنصر',
        example: 'مقدمة في البرمجة',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'العنوان مطلوب' }),
    __metadata("design:type", String)
], CreateCurriculumDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'وصف العنصر',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateCurriculumDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'نوع العنصر',
        enum: client_1.CurriculumType,
        example: 'lesson',
    }),
    (0, class_validator_1.IsEnum)(client_1.CurriculumType, { message: 'النوع غير صالح' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'النوع مطلوب' }),
    __metadata("design:type", String)
], CreateCurriculumDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'معرف العنصر الأب (للعناصر الفرعية)',
        format: 'uuid',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)('4', { message: 'معرف العنصر الأب غير صالح' }),
    __metadata("design:type", String)
], CreateCurriculumDto.prototype, "parentId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'ترتيب العنصر',
        minimum: 0,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateCurriculumDto.prototype, "order", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'المدة بالدقائق',
        minimum: 0,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateCurriculumDto.prototype, "duration", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'محتوى العنصر',
        type: CurriculumContentDto,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", CurriculumContentDto)
], CreateCurriculumDto.prototype, "content", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'متاح مجاناً',
        default: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateCurriculumDto.prototype, "isFree", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'منشور',
        default: true,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateCurriculumDto.prototype, "isPublished", void 0);
//# sourceMappingURL=create-curriculum.dto.js.map