import { IsIn, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Type } from '@prisma/client';

export class CategoryDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsOptional()
    description: string;

    @IsNotEmpty()
    @IsIn([
        Type.HOUSING,
        Type.TRANSPORTATION,
        Type.FOOD,
        Type.HEALTHCARE,
        Type.ENTERTAINMENT,
        Type.CHILDREN,
        Type.GIFT,
        Type.SUBSCRIPTION,
        Type.INSURANCE,
        Type.TAX,
        Type.BANK,
        Type.OTHER,
    ])
    type: Type;
}
