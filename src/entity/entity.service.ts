import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EntityDto } from './dto';

@Injectable()
export class EntityService {
    constructor(private prisma: PrismaService) {}

    async getAll(userId: number) {
        const entities = await this.prisma.entity.findMany({
            where: { userId },
        });

        return entities;
    }

    async create(userId: number, dto: EntityDto) {
        const newData = {
            userId,
            name: dto.name,
            description: dto.description || '',
        };
        if (!dto.description) delete newData.description;

        const entity = await this.prisma.entity.create({
            data: newData,
        });

        return entity;
    }

    async getOne(userId: number, id: number) {
        const entities = await this.prisma.entity.findUnique({
            where: { userId, id },
        });

        return entities;
    }

    async update(userId: number, id: number, dto: EntityDto) {
        const newData = {
            userId,
            name: dto.name || '',
            description: dto.description || '',
        };

        if (!dto.description) delete newData.description;
        if (!dto.name) delete newData.name;

        const entity = await this.prisma.entity.update({
            where: { userId, id },
            data: newData,
        });

        return entity;
    }

    async delete(userId: number, id: number) {
        const entity = await this.prisma.entity.delete({
            where: { userId, id },
        });

        return entity;
    }
}
