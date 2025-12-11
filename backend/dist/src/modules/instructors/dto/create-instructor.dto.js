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
exports.CreateInstructorDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
class CreateInstructorDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { userId: { required: true, type: () => String }, title: { required: false, type: () => String }, biography: { required: true, type: () => String }, specialization: { required: false, type: () => [String] }, expertise: { required: false, type: () => [String] }, certifications: { required: false, type: () => [Object] }, socialLinks: { required: false, type: () => Object }, hourlyRate: { required: false, type: () => Number, minimum: 0 }, availability: { required: false, type: () => Object } };
    }
}
exports.CreateInstructorDto = CreateInstructorDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'معرف المستخدم',
        format: 'uuid',
    }),
    (0, class_validator_1.IsUUID)('4', { message: 'معرف المستخدم غير صالح' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'معرف المستخدم مطلوب' }),
    __metadata("design:type", String)
], CreateInstructorDto.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'اللقب (دكتور، مهندس، ...)',
        example: 'دكتور',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateInstructorDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'السيرة الذاتية',
        example: 'خبير في تطوير البرمجيات مع 10 سنوات من الخبرة',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'السيرة الذاتية مطلوبة' }),
    __metadata("design:type", String)
], CreateInstructorDto.prototype, "biography", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'التخصصات',
        type: [String],
        example: ['برمجة', 'تطوير ويب'],
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], CreateInstructorDto.prototype, "specialization", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'الخبرات',
        type: [String],
        example: ['JavaScript', 'Python', 'React'],
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], CreateInstructorDto.prototype, "expertise", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'الشهادات',
        type: 'array',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], CreateInstructorDto.prototype, "certifications", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'روابط التواصل الاجتماعي',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], CreateInstructorDto.prototype, "socialLinks", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'السعر بالساعة',
        minimum: 0,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateInstructorDto.prototype, "hourlyRate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'أوقات التوفر',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], CreateInstructorDto.prototype, "availability", void 0);
//# sourceMappingURL=create-instructor.dto.js.map