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
exports.SessionResponseDto = void 0;
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
class CourseInfo {
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, title: { required: true, type: () => String }, slug: { required: true, type: () => String } };
    }
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], CourseInfo.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], CourseInfo.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], CourseInfo.prototype, "slug", void 0);
class SessionResponseDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, title: { required: true, type: () => String }, description: { required: false, type: () => String }, courseId: { required: false, type: () => String }, course: { required: false, type: () => CourseInfo }, instructorId: { required: true, type: () => String }, instructor: { required: true, type: () => InstructorInfo }, scheduledStart: { required: true, type: () => Date }, scheduledEnd: { required: true, type: () => Date }, actualStart: { required: false, type: () => Date }, actualEnd: { required: false, type: () => Date }, status: { required: true, type: () => Object }, platform: { required: true, type: () => Object }, meetingUrl: { required: false, type: () => String }, maxParticipants: { required: false, type: () => Number }, currentParticipants: { required: true, type: () => Number }, recordingUrl: { required: false, type: () => String }, createdAt: { required: true, type: () => Date }, updatedAt: { required: true, type: () => Date } };
    }
}
exports.SessionResponseDto = SessionResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'معرف الجلسة' }),
    __metadata("design:type", String)
], SessionResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'عنوان الجلسة' }),
    __metadata("design:type", String)
], SessionResponseDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'وصف الجلسة' }),
    __metadata("design:type", String)
], SessionResponseDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'معرف الدورة' }),
    __metadata("design:type", String)
], SessionResponseDto.prototype, "courseId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'بيانات الدورة', type: CourseInfo }),
    __metadata("design:type", CourseInfo)
], SessionResponseDto.prototype, "course", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'معرف المدرب' }),
    __metadata("design:type", String)
], SessionResponseDto.prototype, "instructorId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'بيانات المدرب', type: InstructorInfo }),
    __metadata("design:type", InstructorInfo)
], SessionResponseDto.prototype, "instructor", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'وقت البدء المجدول' }),
    __metadata("design:type", Date)
], SessionResponseDto.prototype, "scheduledStart", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'وقت الانتهاء المجدول' }),
    __metadata("design:type", Date)
], SessionResponseDto.prototype, "scheduledEnd", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'وقت البدء الفعلي' }),
    __metadata("design:type", Date)
], SessionResponseDto.prototype, "actualStart", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'وقت الانتهاء الفعلي' }),
    __metadata("design:type", Date)
], SessionResponseDto.prototype, "actualEnd", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'حالة الجلسة', enum: client_1.SessionStatus }),
    __metadata("design:type", String)
], SessionResponseDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'منصة البث', enum: client_1.LivePlatform }),
    __metadata("design:type", String)
], SessionResponseDto.prototype, "platform", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'رابط الاجتماع' }),
    __metadata("design:type", String)
], SessionResponseDto.prototype, "meetingUrl", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'الحد الأقصى للمشاركين' }),
    __metadata("design:type", Number)
], SessionResponseDto.prototype, "maxParticipants", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'عدد المشاركين الحاليين' }),
    __metadata("design:type", Number)
], SessionResponseDto.prototype, "currentParticipants", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'رابط التسجيل' }),
    __metadata("design:type", String)
], SessionResponseDto.prototype, "recordingUrl", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'تاريخ الإنشاء' }),
    __metadata("design:type", Date)
], SessionResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'تاريخ آخر تحديث' }),
    __metadata("design:type", Date)
], SessionResponseDto.prototype, "updatedAt", void 0);
//# sourceMappingURL=session-response.dto.js.map