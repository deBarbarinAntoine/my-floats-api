import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CategoryDto } from './dto';
import { Type } from '@prisma/client';

@Injectable()
export class CategoryService {
    constructor(private prisma: PrismaService) {}

    async getAll(userId: number) {
        const categories = await this.prisma.category.findMany({
            where: { userId },
        });
        return categories;
    }

    async create(userId: number, dto: CategoryDto) {
        const newData = {
            name: dto.name,
            description: dto.description || '',
            type: dto.type,
            userId: userId,
        };

        if (!dto.description) delete newData.description;

        const category = await this.prisma.category.create({
            data: {
                ...newData,
            },
        });

        return category;
    }

    async getOne(userId: number, id: number) {
        const category = await this.prisma.category.findUnique({
            where: { userId, id },
        });
        return category;
    }

    async update(userId: number, id: number, dto: CategoryDto) {
        const updates = {
            name: dto.name,
            description: dto.description || '',
            type: dto.type || null,
        };

        if (!dto.name) delete dto.name;
        if (!dto.type) delete dto.type;
        if (!dto.description) delete updates.description;

        const category = await this.prisma.category.update({
            where: { userId, id },
            data: updates,
        });

        return category;
    }

    async delete(userId: number, id: number) {
        const category = await this.prisma.category.delete({
            where: { userId, id },
        });
        return category;
    }
}
