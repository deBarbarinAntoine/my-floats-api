import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { JwtGuard } from '../auth/guard';
import { AccountService } from './account.service';
import { AccountDto } from './dto';
import { GetUser } from '../auth/decorator';
import { User } from '@prisma/client';

@UseGuards(JwtGuard)
@Controller('accounts')
export class AccountController {
    constructor(private readonly accountService: AccountService) {}

    @Get()
    async getAll(@GetUser() user: User) {
        const accounts = await this.accountService.getAll(user.id);
        return {
            data: accounts,
        };
    }

    @Post()
    async create(@GetUser() user: User, @Body() account: AccountDto) {
        const newAccount = await this.accountService.create(user.id, account);
        return {
            data: newAccount,
        };
    }

    @Get(':id')
    async getOne(@GetUser() user: User, @Param('id', ParseIntPipe) id: number) {
        const account = await this.accountService.getOne(user.id, id);
        return {
            data: account,
        };
    }

    @Patch(':id')
    async update(@GetUser() user: User, @Param('id', ParseIntPipe) id: number, @Body() dto: AccountDto) {
        const account = await this.accountService.update(user.id, id, dto);
        return {
            data: account,
        };
    }

    @Delete(':id')
    async delete(@GetUser() user: User, @Param('id', ParseIntPipe) id: number) {
        const account = await this.accountService.delete(user.id, id);
        return {
            data: account,
        };
    }
}
