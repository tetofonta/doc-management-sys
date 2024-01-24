import { IsDefined, IsNotEmpty, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class GetUserDetailParams {
    @IsString()
    @Type(() => String)
    @IsDefined()
    @IsNotEmpty()
    public readonly id: string;
}
