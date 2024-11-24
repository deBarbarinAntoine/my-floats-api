import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TransactionDto } from './dto/transaction.dto';

@Injectable()
export class TransactionService {
    constructor(private prisma: PrismaService) {}

    async getAll(accountId: number) {
        const transactions = await this.prisma.transaction.findMany({
            where: { accountId },
        });

        return transactions;
    }

    async create(userId: number, accountId: number, dto: TransactionDto) {
        if (!this.isEntity(userId, dto.entityId) || !this.isCategory(userId, dto.categoryId)) {
            throw new UnprocessableEntityException('Invalid entity or category!');
        }
        const newData = {
            accountId,
            ...dto,
        };

        if (newData.isExpense) newData.amount *= -1;

        const transaction = await this.prisma.transaction.create({
            data: newData,
        });

        const account = await this.prisma.account.findUnique({ where: { userId, id: accountId } });

        this.prisma.account.update({
            where: { userId, id: accountId },
            data: {
                balance: (account.balance += transaction.amount),
            },
        });

        return transaction;
    }

    async getOne(accountId: number, id: number) {
        const transaction = await this.prisma.transaction.findUnique({
            where: { id, accountId },
        });

        return transaction;
    }

    async update(userId: number, accountId: number, id: number, dto: TransactionDto) {
        if (!this.isEntity(userId, dto.entityId) || !this.isCategory(userId, dto.categoryId)) {
            throw new UnprocessableEntityException('Invalid entity or category!');
        }

        const previousTransaction = await this.prisma.transaction.findUnique({ where: { accountId, id } });

        const newData = {
            accountId,
            ...dto,
        };

        if (newData.isExpense) newData.amount *= -1;

        const transaction = await this.prisma.transaction.update({
            where: { accountId, id },
            data: newData,
        });

        const account = await this.prisma.account.findUnique({ where: { userId, id: accountId } });

        const newBalance = account.balance - previousTransaction.amount + transaction.amount;

        this.prisma.account.update({
            where: { userId, id: accountId },
            data: {
                balance: newBalance,
            },
        });

        return transaction;
    }

    async delete(userId: number, accountId: number, id: number) {
        const transaction = await this.prisma.transaction.delete({
            where: { accountId, id },
        });

        const account = await this.prisma.account.findUnique({ where: { userId, id: accountId } });

        this.prisma.account.update({
            where: { userId, id: accountId },
            data: {
                balance: (account.balance -= transaction.amount),
            },
        });

        return transaction;
    }

    async isCategory(userId: number, id: number) {
        return (await this.prisma.category.findUnique({ where: { userId, id } })) !== undefined;
    }

    async isEntity(userId: number, id: number) {
        return (await this.prisma.entity.findUnique({ where: { userId, id } })) !== undefined;
    }

    async isAccount(userId: number, id: number) {
        return (await this.prisma.account.findUnique({ where: { userId, id } })) !== undefined;
    }
}
