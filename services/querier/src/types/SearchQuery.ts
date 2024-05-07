import { IsDefined, IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class SearchQuery {
    @IsString()
    @IsNotEmpty()
    @IsDefined()
    public readonly q: string = '*';

    @IsNumber()
    @IsDefined()
    @Min(0)
    @Type(() => Number)
    public readonly offset: number = 0;

    public get page(): number {
        return this.offset / this.take + 1;
    }

    @IsNumber()
    @IsDefined()
    @Min(1)
    @Max(100)
    @Type(() => Number)
    public readonly take: number = 10;

    //Future work: implement sorting with custom queries

    @IsString()
    @IsOptional()
    @IsNotEmpty()
    public readonly filter_string?: string;
}
