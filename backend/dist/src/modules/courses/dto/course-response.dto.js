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
exports.CourseResponseDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
class InstructorInfo {
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, firstName: { required: true, type: () => String }, lastName: { required: true, type: () => String }, avatar: { required: false, type: () => String } };
    }
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], InstructorInfo.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], InstructorInfo.prototype, "firstName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], InstructorInfo.prototype, "lastName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], InstructorInfo.prototype, "avatar", void 0);
class CourseResponseDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, title: { required: true, type: () => String }, slug: { required: true, type: () => String }, shortDescription: { required: false, type: () => String }, description: { required: true, type: () => String }, thumbnail: { required: false, type: () => String }, coverImage: { required: false, type: () => String }, category: { required: false, type: () => String }, level: { required: true, type: () => Object }, language: { required: true, type: () => String }, price: { required: true, type: () => Number }, discountPrice: { required: false, type: () => Number }, duration: { required: true, type: () => Number }, status: { required: true, type: () => Object }, featured: { required: true, type: () => Boolean }, instructor: { required: true, type: () => InstructorInfo }, enrollmentsCount: { required: false, type: () => Number }, rating: { required: false, type: () => Number }, reviewCount: { required: false, type: () => Number }, publishedAt: { required: false, type: () => Date }, createdAt: { required: true, type: () => Date }, updatedAt: { required: true, type: () => Date } };
    }
}
exports.CourseResponseDto = CourseResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'معرف الدورة' }),
    __metadata("design:type", String)
], CourseResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'عنوان الدورة' }),
    __metadata("design:type", String)
], CourseResponseDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'الرابط المختصر' }),
    __metadata("design:type", String)
], CourseResponseDto.prototype, "slug", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'وصف مختصر' }),
    __metadata("design:type", String)
], CourseResponseDto.prototype, "shortDescription", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'وصف الدورة' }),
    __metadata("design:type", String)
], CourseResponseDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'الصورة المصغرة' }),
    __metadata("design:type", String)
], CourseResponseDto.prototype, "thumbnail", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'صورة الغلاف' }),
    __metadata("design:type", String)
], CourseResponseDto.prototype, "coverImage", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'التصنيف' }),
    __metadata("design:type", String)
], CourseResponseDto.prototype, "category", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'المستوى', enum: client_1.CourseLevel }),
    __metadata("design:type", String)
], CourseResponseDto.prototype, "level", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'اللغة' }),
    __metadata("design:type", String)
], CourseResponseDto.prototype, "language", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'السعر' }),
    __metadata("design:type", Number)
], CourseResponseDto.prototype, "price", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'السعر بعد الخصم' }),
    __metadata("design:type", Number)
], CourseResponseDto.prototype, "discountPrice", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'المدة بالدقائق' }),
    __metadata("design:type", Number)
], CourseResponseDto.prototype, "duration", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'الحالة', enum: client_1.CourseStatus }),
    __metadata("design:type", String)
], CourseResponseDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'دورة مميزة' }),
    __metadata("design:type", Boolean)
], CourseResponseDto.prototype, "featured", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'بيانات المدرب', type: InstructorInfo }),
    __metadata("design:type", InstructorInfo)
], CourseResponseDto.prototype, "instructor", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'عدد المسجلين' }),
    __metadata("design:type", Number)
], CourseResponseDto.prototype, "enrollmentsCount", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'التقييم' }),
    __metadata("design:type", Number)
], CourseResponseDto.prototype, "rating", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'عدد التقييمات' }),
    __metadata("design:type", Number)
], CourseResponseDto.prototype, "reviewCount", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'تاريخ النشر' }),
    __metadata("design:type", Date)
], CourseResponseDto.prototype, "publishedAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'تاريخ الإنشاء' }),
    __metadata("design:type", Date)
], CourseResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'تاريخ آخر تحديث' }),
    __metadata("design:type", Date)
], CourseResponseDto.prototype, "updatedAt", void 0);
//# sourceMappingURL=course-response.dto.js.map