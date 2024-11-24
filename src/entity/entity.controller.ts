import { Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { GetUser } from '../auth/decorator';
import { User } from '@prisma/client';
import { EntityDto } from './dto';
import { EntityService } from './entity.service';

@Controller('entities')
export class EntityController {
    constructor(private readonly entityService: EntityService) {}

    @Get()
    async getAll(@GetUser() user: User) {
        const entities = await this.entityService.getAll(user.id);

        return {
            data: entities,
        };
    }

    @Post()
    async create(@GetUser() user: User, dto: EntityDto) {
        const entity = await this.entityService.create(user.id, dto);

        return {
            data: entity,
        };
    }

    @Get(':id')
    async getOne(@GetUser() user: User, @Param('id', ParseIntPipe) id: number) {
        const entity = await this.entityService.getOne(user.id, id);

        return {
            data: entity,
        };
    }

    @Patch(':id')
    async update(@GetUser() user: User, @Param('id', ParseIntPipe) id: number, dto: EntityDto) {
        const entity = await this.entityService.update(user.id, id, dto);

        return {
            data: entity,
        };
    }

    @Delete(':id')
    async delete(@GetUser() user: User, @Param('id', ParseIntPipe) id: number) {
        const entity = await this.entityService.delete(user.id, id);

        return {
            data: {
                message: `Entity ${entity.name} (id: ${entity.id}) has been deleted successfully!`,
            },
        };
    }
}
