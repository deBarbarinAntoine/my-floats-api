import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Cron } from '@nestjs/schedule';
import { Frequency, Transaction } from '@prisma/client';

@Injectable()
export class ScheduledTransactionService {
    constructor(private prisma: PrismaService) {}

    @Cron('* 30 2 * * *')
    async executeScheduledTransactions() {
        const transactions = await this.prisma.transaction.findMany({});
        const toExecute: Transaction[] = [];
        const now = new Date();

        // Get the transactions that are to be run now according to their frequency
        for (const transaction of transactions) {
            if (transaction.frequency !== Frequency.ONCE) {
                let shouldExecute = false;

                switch (transaction.frequency) {
                    case Frequency.ANNUALLY:
                        shouldExecute =
                            transaction.date.getMonth() === now.getMonth() &&
                            transaction.date.getDate() === now.getDate();
                        break;
                    case Frequency.BIANNUALLY:
                        const monthsApart = (transaction.date.getMonth() - now.getMonth() + 12) % 12;
                        shouldExecute = monthsApart === 0 || monthsApart === 6;
                        break;
                    case Frequency.QUARTERLY:
                        shouldExecute = now.getMonth() % 3 === transaction.date.getMonth() % 3;
                        break;
                    case Frequency.BIMESTRIALLY:
                        const daysSinceFirst = Math.floor(
                            (now.getTime() - transaction.date.getTime()) / (1000 * 60 * 60 * 24),
                        );
                        shouldExecute = daysSinceFirst % 60 === 0;
                        break;
                    case Frequency.MONTHLY:
                        shouldExecute = transaction.date.getDate() === now.getDate();
                        break;
                    case Frequency.WEEKLY:
                        shouldExecute = transaction.date.getDay() === now.getDay();
                        break;
                    case Frequency.DAILY:
                        shouldExecute = true;
                        break;
                }

                if (shouldExecute) {
                    toExecute.push(transaction);
                }
            }
        }

        // Run the transactions that are due today
        for (const transaction of toExecute) {
            // Creating a new transaction (application of the main one) executed now and with no frequency (the frequency is already in the main transaction from which it was created). We can think of it like this new transaction is only an instance of that scheduled transaction set at an earlier time.
            transaction.date = now;
            transaction.frequency = Frequency.ONCE;
            this.prisma.transaction.create({
                data: transaction,
            });
        }
    }
}
