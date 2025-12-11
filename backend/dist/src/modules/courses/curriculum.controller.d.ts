import { CurriculumService } from './curriculum.service';
import { CreateCurriculumDto } from './dto/create-curriculum.dto';
import { UpdateCurriculumDto } from './dto/update-curriculum.dto';
import { CurrentUserData } from '../../common/decorators/current-user.decorator';
export declare class CurriculumController {
    private readonly curriculumService;
    constructor(curriculumService: CurriculumService);
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
    addItem(courseId: string, createDto: CreateCurriculumDto, tenantId: string, currentUser: CurrentUserData): Promise<{
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
    updateItem(courseId: string, itemId: string, updateDto: UpdateCurriculumDto, tenantId: string, currentUser: CurrentUserData): Promise<{
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
    deleteItem(courseId: string, itemId: string, tenantId: string, currentUser: CurrentUserData): Promise<{
        message: string;
    }>;
    reorderItems(courseId: string, items: {
        id: string;
        order: number;
    }[], tenantId: string, currentUser: CurrentUserData): Promise<({
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
}
