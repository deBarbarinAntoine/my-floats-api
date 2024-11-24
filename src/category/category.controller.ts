import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { CategoryService } from './category.service';
import { User } from '@prisma/client';
import { GetUser } from '../auth/decorator';
import { JwtGuard } from '../auth/guard';
import { CategoryDto } from './dto';

@UseGuards(JwtGuard)
@Controller('categories')
export class CategoryController {
    constructor(private readonly categoryService: CategoryService) {}

    @Get()
    async getAll(@GetUser() user: User) {
        const categories = await this.categoryService.getAll(user.id);

        return {
            data: categories,
        };
    }

    @Post()
    async create(@GetUser() user: User, @Body() dto: CategoryDto) {
        const category = await this.categoryService.create(user.id, dto);

        return {
            data: category,
        };
    }

    @Get(':id')
    async getOne(@GetUser() user: User, @Param('id', ParseIntPipe) id: number) {
        const category = await this.categoryService.getOne(user.id, id);

        return {
            data: category,
        };
    }

    @Patch(':id')
    async update(@GetUser() user: User, @Param('id', ParseIntPipe) id: number, @Body() dto: CategoryDto) {
        const category = await this.categoryService.update(user.id, id, dto);

        return {
            data: category,
        };
    }

    @Delete(':id')
    async delete(@GetUser() user: User, @Param('id', ParseIntPipe) id: number) {
        const category = await this.categoryService.delete(user.id, id);

        return {
            data: {
                message: `category ${category.name} (id: ${category.id}) deleted successfully!`,
            },
        };
    }
}
