import { IsDefined, IsNotEmpty, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';

export class GetGroupDetailParams {
    @IsUUID()
    @Type(() => String)
    @IsDefined()
    @IsNotEmpty()
    public readonly id: string;
}
