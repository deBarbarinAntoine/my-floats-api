import { Module } from '@nestjs/common';
import { TransactionController } from './transaction.controller';
import { TransactionService } from './transaction.service';
import { ScheduledTransactionService } from './tasks/scheduled-transaction.service';

@Module({
    controllers: [TransactionController],
    providers: [TransactionService, ScheduledTransactionService],
})
export class TransactionModule {}
