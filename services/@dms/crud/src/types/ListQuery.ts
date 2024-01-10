import { BaseEntity } from '@dms/persistence';
import { Type } from 'class-transformer';
import { IsArray, IsDefined, IsInt, IsOptional, IsString } from 'class-validator';
import { FindManyOptions } from 'typeorm';
import { FilterQuery } from './FilterQuery';

export class ListQuery<T extends BaseEntity> extends FilterQuery<T> {
    @IsOptional()
    @IsInt()
    @Type(() => Number)
    public readonly offset?: number;

    @IsDefined()
    @IsInt()
    @Type(() => Number)
    public readonly take?: number = 100;

    @IsString({ each: true })
    @IsArray()
    @IsOptional()
    public readonly sortAsc?: (keyof T)[];

    @IsString({ each: true })
    @IsArray()
    @IsOptional()
    public readonly sortDesc?: (keyof T)[];

    get queryObject(): FindManyOptions<T> {
        const ret: FindManyOptions<T> = {};

        if (this.take) ret.take = this.take;
        if (this.offset) ret.skip = this.offset;

        const sort = Object.assign(
            {},
            ...(this.sortAsc || []).map((e) => ({ [e]: 'ASC' })),
            ...(this.sortDesc || []).map((e) => ({ [e]: 'DESC' }))
        );
        if (Object.keys(sort).length > 0) ret.order = sort;

        if (this.filters) ret.where = this.whereObject();

        return ret;
    }
}
