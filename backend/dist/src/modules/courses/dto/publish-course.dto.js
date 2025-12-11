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
exports.PublishCourseDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const client_1 = require("@prisma/client");
class PublishCourseDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { status: { required: true, type: () => Object } };
    }
}
exports.PublishCourseDto = PublishCourseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'حالة الدورة',
        enum: client_1.CourseStatus,
        example: 'published',
    }),
    (0, class_validator_1.IsEnum)(client_1.CourseStatus, { message: 'الحالة غير صالحة' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'الحالة مطلوبة' }),
    __metadata("design:type", String)
], PublishCourseDto.prototype, "status", void 0);
//# sourceMappingURL=publish-course.dto.js.map