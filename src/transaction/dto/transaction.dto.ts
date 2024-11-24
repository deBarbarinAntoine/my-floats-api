import { IsBoolean, IsDateString, IsInt, IsNotEmpty, IsNumber } from 'class-validator';
import { Frequency } from '@prisma/client';
import { Optional } from '@nestjs/common';

export class TransactionDto {
    // date DateTime
    @IsNotEmpty()
    @IsDateString()
    date: Date;

    // amount Float
    @IsNotEmpty()
    @IsNumber()
    amount: number;

    // frequency Frequency @default(ONCE)
    @Optional()
    frequency: Frequency;

    // isExpense Boolean @default(true)
    @IsNotEmpty()
    @IsBoolean()
    isExpense: boolean;

    // entityId Int
    @IsNotEmpty()
    @IsInt()
    entityId: number;

    // categoryId Int
    @IsNotEmpty()
    @IsInt()
    categoryId: number;
}
