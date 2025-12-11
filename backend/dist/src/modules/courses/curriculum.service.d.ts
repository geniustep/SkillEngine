import { PrismaService } from '../../database/prisma.service';
import { CreateCurriculumDto } from './dto/create-curriculum.dto';
import { UpdateCurriculumDto } from './dto/update-curriculum.dto';
export declare class CurriculumService {
    private readonly prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    getCurriculum(courseId: string, tenantId: string): Promise<({
        [key: string]: unknown;
        id: string;
        parentId: string | null;
    } & {
        children: {
            [key: string]: unknown;
            id: string;
            parentId: string | null;
        }[];
    })[]>;
    addItem(courseId: string, createDto: CreateCurriculumDto, tenantId: string, createdBy: string): Promise<{
        description: string | null;
        content: import("@prisma/client/runtime/library").JsonValue;
        type: import(".prisma/client").$Enums.CurriculumType;
        title: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        courseId: string;
        duration: number | null;
        order: number;
        parentId: string | null;
        isFree: boolean;
        isPublished: boolean;
    }>;
    updateItem(courseId: string, itemId: string, updateDto: UpdateCurriculumDto, tenantId: string, updatedBy: string): Promise<{
        description: string | null;
        content: import("@prisma/client/runtime/library").JsonValue;
        type: import(".prisma/client").$Enums.CurriculumType;
        title: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        courseId: string;
        duration: number | null;
        order: number;
        parentId: string | null;
        isFree: boolean;
        isPublished: boolean;
    }>;
    deleteItem(courseId: string, itemId: string, tenantId: string, deletedBy: string): Promise<void>;
    reorderItems(courseId: string, items: {
        id: string;
        order: number;
    }[], tenantId: string, updatedBy: string): Promise<({
        [key: string]: unknown;
        id: string;
        parentId: string | null;
    } & {
        children: {
            [key: string]: unknown;
            id: string;
            parentId: string | null;
        }[];
    })[]>;
    private buildHierarchy;
    private logAudit;
}
