import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AccountDto } from './dto';

@Injectable()
export class AccountService {
    constructor(private prisma: PrismaService) {}

    async getAll(userId: number) {
        const accounts = await this.prisma.account.findMany({
            where: { userId },
        });
        return accounts;
    }

    async create(userId: number, dto: AccountDto) {
        const newAccount = await this.prisma.account.create({
            data: {
                name: dto.name,
                balance: 0,
                userId,
            },
        });
        return newAccount;
    }

    async getOne(userId: number, id: number) {
        return this.updateBalance(userId, id);
    }

    async update(userId: number, id: number, dto: AccountDto) {
        const account = await this.prisma.account.update({
            where: { id, userId },
            data: {
                name: dto.name,
            },
        });
        return account;
    }

    async delete(userId: number, id: number) {
        const account = await this.prisma.account.delete({ where: { id, userId } });
        return account;
    }

    async updateBalance(userId: number, id: number) {
        const transactions = await this.prisma.transaction.findMany({
            where: { accountId: id },
        });

        let balance = 0;
        for (const transaction of transactions) {
            balance += transaction.amount;
        }

        const account = await this.prisma.account.update({
            where: { userId, id },
            data: {
                balance,
            },
        });

        return account;
    }
}
