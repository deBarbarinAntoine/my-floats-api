import { IsBoolean, IsDate, IsInt, IsNotEmpty, IsNumber } from 'class-validator';
import { Frequency } from '@prisma/client';
import { Optional } from '@nestjs/common';
import { Transform } from 'class-transformer';

export class TransactionDto {
    // date DateTime
    @IsNotEmpty()
    @IsDate()
    date: Date;

    // amount Float
    @IsNotEmpty()
    @IsNumber()
    @Transform((value) => Math.abs(Number(value)))
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
