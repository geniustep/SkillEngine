import {
  Injectable,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateCurriculumDto } from './dto/create-curriculum.dto';
import { UpdateCurriculumDto } from './dto/update-curriculum.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class CurriculumService {
  private readonly logger = new Logger(CurriculumService.name);

  constructor(private readonly prisma: PrismaService) {}

  async getCurriculum(courseId: string, tenantId: string) {
    // Verify course exists
    const course = await this.prisma.course.findFirst({
      where: { id: courseId, tenantId, deletedAt: null },
    });

    if (!course) {
      throw new NotFoundException('الدورة غير موجودة');
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

    // Build hierarchical structure
    return this.buildHierarchy(items);
  }

  async addItem(
    courseId: string,
    createDto: CreateCurriculumDto,
    tenantId: string,
    createdBy: string,
  ) {
    // Verify course exists
    const course = await this.prisma.course.findFirst({
      where: { id: courseId, tenantId, deletedAt: null },
    });

    if (!course) {
      throw new NotFoundException('الدورة غير موجودة');
    }

    // Get next order number
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
        id: uuidv4(),
        courseId,
        ...createDto,
        order,
        content: (createDto.content || {}) as any,
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

    // Log audit
    await this.logAudit(tenantId, createdBy, 'create', 'curriculum', item.id, null, item);

    return item;
  }

  async updateItem(
    courseId: string,
    itemId: string,
    updateDto: UpdateCurriculumDto,
    tenantId: string,
    updatedBy: string,
  ) {
    // Verify item exists
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
      throw new NotFoundException('العنصر غير موجود');
    }

    const { content, ...restDto } = updateDto;
    const item = await this.prisma.courseCurriculum.update({
      where: { id: itemId },
      data: {
        ...restDto,
        ...(content && {
          content: { ...(existingItem.content as object), ...content } as any,
        }),
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

    // Log audit
    await this.logAudit(tenantId, updatedBy, 'update', 'curriculum', itemId, existingItem, item);

    return item;
  }

  async deleteItem(
    courseId: string,
    itemId: string,
    tenantId: string,
    deletedBy: string,
  ) {
    // Verify item exists
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
      throw new NotFoundException('العنصر غير موجود');
    }

    // Soft delete item and its children
    await this.prisma.courseCurriculum.updateMany({
      where: {
        OR: [{ id: itemId }, { parentId: itemId }],
      },
      data: { deletedAt: new Date() },
    });

    // Log audit
    await this.logAudit(tenantId, deletedBy, 'delete', 'curriculum', itemId, item, null);
  }

  async reorderItems(
    courseId: string,
    items: { id: string; order: number }[],
    tenantId: string,
    updatedBy: string,
  ) {
    // Verify course exists
    const course = await this.prisma.course.findFirst({
      where: { id: courseId, tenantId, deletedAt: null },
    });

    if (!course) {
      throw new NotFoundException('الدورة غير موجودة');
    }

    // Update order for each item
    await Promise.all(
      items.map((item) =>
        this.prisma.courseCurriculum.update({
          where: { id: item.id },
          data: { order: item.order },
        }),
      ),
    );

    // Log audit
    await this.logAudit(tenantId, updatedBy, 'reorder', 'curriculum', courseId, null, { items });

    return this.getCurriculum(courseId, tenantId);
  }

  private buildHierarchy(items: Array<{ id: string; parentId: string | null; [key: string]: unknown }>) {
    const itemMap = new Map<string, typeof items[0] & { children: typeof items }>();
    const roots: Array<typeof items[0] & { children: typeof items }> = [];

    // Create map of all items
    items.forEach((item) => {
      itemMap.set(item.id, { ...item, children: [] });
    });

    // Build hierarchy
    items.forEach((item) => {
      const mappedItem = itemMap.get(item.id)!;
      if (item.parentId && itemMap.has(item.parentId)) {
        itemMap.get(item.parentId)!.children.push(mappedItem);
      } else {
        roots.push(mappedItem);
      }
    });

    return roots;
  }

  private async logAudit(
    tenantId: string,
    userId: string,
    action: string,
    resource: string,
    resourceId?: string,
    oldData?: unknown,
    newData?: unknown,
  ) {
    try {
      await this.prisma.auditLog.create({
        data: {
          id: uuidv4(),
          tenantId,
          userId,
          action,
          resource,
          resourceId,
          oldData: oldData ? JSON.parse(JSON.stringify(oldData)) : null,
          newData: newData ? JSON.parse(JSON.stringify(newData)) : null,
        },
      });
    } catch (error) {
      this.logger.error(`Failed to log audit: ${error}`);
    }
  }
}

