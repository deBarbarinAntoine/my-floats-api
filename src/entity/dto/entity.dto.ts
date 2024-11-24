import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class EntityDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsOptional()
    description: string;
}
