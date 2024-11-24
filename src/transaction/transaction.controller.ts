import {
    Body,
    Controller,
    Delete,
    Get,
    NotFoundException,
    Param,
    ParseIntPipe,
    Patch,
    Post,
    UnprocessableEntityException,
    UseGuards,
} from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { User } from '@prisma/client';
import { GetUser } from '../auth/decorator';
import { TransactionDto } from './dto/transaction.dto';
import { TransactionGuard } from './guard/transaction.guard';

@UseGuards(TransactionGuard)
@Controller('transactions/:accountId')
export class TransactionController {
    constructor(private readonly transactionService: TransactionService) {}

    @Get()
    async getAll(@GetUser() user: User, @Param('accountId', ParseIntPipe) accountId: number) {
        if (!this.transactionService.isAccount(user.id, accountId)) {
            throw new NotFoundException('Account not found.');
        }
        const transactions = await this.transactionService.getAll(accountId);

        return {
            data: transactions,
        };
    }

    @Post()
    async create(
        @GetUser() user: User,
        @Param('accountId', ParseIntPipe) accountId: number,
        @Body() transactionDto: TransactionDto,
    ) {
        if (!this.transactionService.isAccount(user.id, accountId)) {
            throw new UnprocessableEntityException('Invalid account!');
        }
        const transaction = await this.transactionService.create(user.id, accountId, transactionDto);

        return {
            data: transaction,
        };
    }

    @Get(':transactionId')
    async getOne(
        @GetUser() user: User,
        @Param('accountId', ParseIntPipe) accountId: number,
        @Param('transactionId', ParseIntPipe) id: number,
    ) {
        if (!this.transactionService.isAccount(user.id, accountId)) {
            throw new NotFoundException('Account not found.');
        }
        const transaction = await this.transactionService.getOne(accountId, id);

        return {
            data: transaction,
        };
    }

    @Patch(':transactionId')
    async update(
        @GetUser() user: User,
        @Param('accountId', ParseIntPipe) accountId: number,
        @Param('transactionId', ParseIntPipe) id: number,
        @Body() dto: TransactionDto,
    ) {
        if (!this.transactionService.isAccount(user.id, accountId)) {
            throw new UnprocessableEntityException('Invalid account!');
        }
        const transaction = await this.transactionService.update(user.id, accountId, id, dto);

        return {
            data: transaction,
        };
    }

    @Delete(':transactionId')
    async delete(
        @GetUser() user: User,
        @Param('accountId', ParseIntPipe) accountId: number,
        @Param('transactionId', ParseIntPipe) id: number,
    ) {
        if (!this.transactionService.isAccount(user.id, accountId)) {
            throw new UnprocessableEntityException('Invalid account!');
        }
        const transaction = await this.transactionService.delete(user.id, accountId, id);

        return {
            data: {
                message: `transaction ${transaction.id} has been deleted successfully!`,
            },
        };
    }
}
