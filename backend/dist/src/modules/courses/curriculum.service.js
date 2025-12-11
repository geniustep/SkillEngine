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
var CurriculumService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CurriculumService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../database/prisma.service");
const uuid_1 = require("uuid");
let CurriculumService = CurriculumService_1 = class CurriculumService {
    constructor(prisma) {
        this.prisma = prisma;
        this.logger = new common_1.Logger(CurriculumService_1.name);
    }
    async getCurriculum(courseId, tenantId) {
        const course = await this.prisma.course.findFirst({
            where: { id: courseId, tenantId, deletedAt: null },
        });
        if (!course) {
            throw new common_1.NotFoundException('الدورة غير موجودة');
        }
        const items = await this.prisma.courseCurriculum.findMany({
            where: {
                courseId,
                deletedAt: null,
            },
            orderBy: { order: 'asc' },
            select: {
                id: true,
                title: true,
                description: true,
                type: true,
                parentId: true,
                order: true,
                duration: true,
                content: true,
                isFree: true,
                isPublished: true,
                createdAt: true,
                updatedAt: true,
            },
        });
        return this.buildHierarchy(items);
    }
    async addItem(courseId, createDto, tenantId, createdBy) {
        const course = await this.prisma.course.findFirst({
            where: { id: courseId, tenantId, deletedAt: null },
        });
        if (!course) {
            throw new common_1.NotFoundException('الدورة غير موجودة');
        }
        const lastItem = await this.prisma.courseCurriculum.findFirst({
            where: {
                courseId,
                parentId: createDto.parentId || null,
                deletedAt: null,
            },
            orderBy: { order: 'desc' },
        });
        const order = createDto.order ?? (lastItem ? lastItem.order + 1 : 0);
        const item = await this.prisma.courseCurriculum.create({
            data: {
                id: (0, uuid_1.v4)(),
                courseId,
                ...createDto,
                order,
                content: createDto.content || {},
            },
            select: {
                id: true,
                title: true,
                description: true,
                type: true,
                parentId: true,
                order: true,
                duration: true,
                content: true,
                isFree: true,
                isPublished: true,
                createdAt: true,
            },
        });
        await this.logAudit(tenantId, createdBy, 'create', 'curriculum', item.id, null, item);
        return item;
    }
    async updateItem(courseId, itemId, updateDto, tenantId, updatedBy) {
        const existingItem = await this.prisma.courseCurriculum.findFirst({
            where: {
                id: itemId,
                courseId,
                deletedAt: null,
            },
            include: {
                course: {
                    select: { tenantId: true },
                },
            },
        });
        if (!existingItem || existingItem.course.tenantId !== tenantId) {
            throw new common_1.NotFoundException('العنصر غير موجود');
        }
        const item = await this.prisma.courseCurriculum.update({
            where: { id: itemId },
            data: {
                ...updateDto,
                content: updateDto.content
                    ? { ...existingItem.content, ...updateDto.content }
                    : undefined,
            },
            select: {
                id: true,
                title: true,
                description: true,
                type: true,
                parentId: true,
                order: true,
                duration: true,
                content: true,
                isFree: true,
                isPublished: true,
                updatedAt: true,
            },
        });
        await this.logAudit(tenantId, updatedBy, 'update', 'curriculum', itemId, existingItem, item);
        return item;
    }
    async deleteItem(courseId, itemId, tenantId, deletedBy) {
        const item = await this.prisma.courseCurriculum.findFirst({
            where: {
                id: itemId,
                courseId,
                deletedAt: null,
            },
            include: {
                course: {
                    select: { tenantId: true },
                },
                children: true,
            },
        });
        if (!item || item.course.tenantId !== tenantId) {
            throw new common_1.NotFoundException('العنصر غير موجود');
        }
        await this.prisma.courseCurriculum.updateMany({
            where: {
                OR: [{ id: itemId }, { parentId: itemId }],
            },
            data: { deletedAt: new Date() },
        });
        await this.logAudit(tenantId, deletedBy, 'delete', 'curriculum', itemId, item, null);
    }
    async reorderItems(courseId, items, tenantId, updatedBy) {
        const course = await this.prisma.course.findFirst({
            where: { id: courseId, tenantId, deletedAt: null },
        });
        if (!course) {
            throw new common_1.NotFoundException('الدورة غير موجودة');
        }
        await Promise.all(items.map((item) => this.prisma.courseCurriculum.update({
            where: { id: item.id },
            data: { order: item.order },
        })));
        await this.logAudit(tenantId, updatedBy, 'reorder', 'curriculum', courseId, null, { items });
        return this.getCurriculum(courseId, tenantId);
    }
    buildHierarchy(items) {
        const itemMap = new Map();
        const roots = [];
        items.forEach((item) => {
            itemMap.set(item.id, { ...item, children: [] });
        });
        items.forEach((item) => {
            const mappedItem = itemMap.get(item.id);
            if (item.parentId && itemMap.has(item.parentId)) {
                itemMap.get(item.parentId).children.push(mappedItem);
            }
            else {
                roots.push(mappedItem);
            }
        });
        return roots;
    }
    async logAudit(tenantId, userId, action, resource, resourceId, oldData, newData) {
        try {
            await this.prisma.auditLog.create({
                data: {
                    id: (0, uuid_1.v4)(),
                    tenantId,
                    userId,
                    action,
                    resource,
                    resourceId,
                    oldData: oldData ? JSON.parse(JSON.stringify(oldData)) : null,
                    newData: newData ? JSON.parse(JSON.stringify(newData)) : null,
                },
            });
        }
        catch (error) {
            this.logger.error(`Failed to log audit: ${error}`);
        }
    }
};
exports.CurriculumService = CurriculumService;
exports.CurriculumService = CurriculumService = CurriculumService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CurriculumService);
//# sourceMappingURL=curriculum.service.js.map