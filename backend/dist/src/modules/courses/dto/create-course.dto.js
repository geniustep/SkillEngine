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
exports.CreateCourseDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const client_1 = require("@prisma/client");
class CourseMetadataDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { prerequisites: { required: false, type: () => [String] }, learningOutcomes: { required: false, type: () => [String] }, targetAudience: { required: false, type: () => String }, requirements: { required: false, type: () => [String] } };
    }
}
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'المتطلبات السابقة', type: [String] }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], CourseMetadataDto.prototype, "prerequisites", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'مخرجات التعلم', type: [String] }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], CourseMetadataDto.prototype, "learningOutcomes", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'الجمهور المستهدف' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CourseMetadataDto.prototype, "targetAudience", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'المتطلبات التقنية', type: [String] }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], CourseMetadataDto.prototype, "requirements", void 0);
class CreateCourseDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { title: { required: true, type: () => String, maxLength: 200 }, description: { required: true, type: () => String }, shortDescription: { required: false, type: () => String, maxLength: 200 }, instructorId: { required: true, type: () => String }, level: { required: false, type: () => Object }, price: { required: false, type: () => Number, minimum: 0 }, discountPrice: { required: false, type: () => Number, minimum: 0 }, duration: { required: false, type: () => Number, minimum: 0 }, category: { required: false, type: () => String }, language: { required: false, type: () => String }, featured: { required: false, type: () => Boolean }, thumbnail: { required: false, type: () => String }, coverImage: { required: false, type: () => String }, metadata: { required: false, type: () => CourseMetadataDto } };
    }
}
exports.CreateCourseDto = CreateCourseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'عنوان الدورة',
        example: 'أساسيات البرمجة بلغة Python',
        maxLength: 200,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'عنوان الدورة مطلوب' }),
    (0, class_validator_1.MaxLength)(200, { message: 'العنوان يجب ألا يتجاوز 200 حرف' }),
    __metadata("design:type", String)
], CreateCourseDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'وصف الدورة',
        example: 'تعلم أساسيات البرمجة من الصفر باستخدام لغة Python',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'وصف الدورة مطلوب' }),
    __metadata("design:type", String)
], CreateCourseDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'وصف مختصر',
        example: 'دورة شاملة لتعلم Python',
        maxLength: 200,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(200, { message: 'الوصف المختصر يجب ألا يتجاوز 200 حرف' }),
    __metadata("design:type", String)
], CreateCourseDto.prototype, "shortDescription", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'معرف المدرب',
        format: 'uuid',
    }),
    (0, class_validator_1.IsUUID)('4', { message: 'معرف المدرب غير صالح' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'معرف المدرب مطلوب' }),
    __metadata("design:type", String)
], CreateCourseDto.prototype, "instructorId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'مستوى الدورة',
        enum: client_1.CourseLevel,
        default: 'beginner',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(client_1.CourseLevel, { message: 'المستوى غير صالح' }),
    __metadata("design:type", String)
], CreateCourseDto.prototype, "level", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'سعر الدورة',
        example: 199.99,
        minimum: 0,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)({}, { message: 'السعر يجب أن يكون رقماً' }),
    (0, class_validator_1.Min)(0, { message: 'السعر لا يمكن أن يكون سالباً' }),
    __metadata("design:type", Number)
], CreateCourseDto.prototype, "price", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'السعر بعد الخصم',
        example: 149.99,
        minimum: 0,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)({}, { message: 'السعر يجب أن يكون رقماً' }),
    (0, class_validator_1.Min)(0, { message: 'السعر لا يمكن أن يكون سالباً' }),
    __metadata("design:type", Number)
], CreateCourseDto.prototype, "discountPrice", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'مدة الدورة بالدقائق',
        example: 600,
        minimum: 0,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)({}, { message: 'المدة يجب أن تكون رقماً' }),
    (0, class_validator_1.Min)(0, { message: 'المدة لا يمكن أن تكون سالبة' }),
    __metadata("design:type", Number)
], CreateCourseDto.prototype, "duration", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'التصنيف',
        example: 'programming',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateCourseDto.prototype, "category", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'اللغة',
        example: 'ar',
        default: 'ar',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateCourseDto.prototype, "language", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'دورة مميزة',
        default: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateCourseDto.prototype, "featured", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'رابط الصورة المصغرة',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateCourseDto.prototype, "thumbnail", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'رابط صورة الغلاف',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateCourseDto.prototype, "coverImage", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'بيانات إضافية',
        type: CourseMetadataDto,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", CourseMetadataDto)
], CreateCourseDto.prototype, "metadata", void 0);
//# sourceMappingURL=create-course.dto.js.map