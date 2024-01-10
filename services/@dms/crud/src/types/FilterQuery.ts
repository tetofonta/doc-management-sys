import { BaseEntity } from '@dms/persistence';
import { Transform, TransformFnParams } from 'class-transformer';
import { IsOptional } from 'class-validator';
import {
    FindOperator,
    FindOptionsWhere,
    LessThan,
    LessThanOrEqual,
    Like,
    MoreThan,
    MoreThanOrEqual,
    Not,
    And,
    Or,
} from 'typeorm';
import { BadRequestException, Logger } from '@nestjs/common';

export type PrimitiveOperation = 'like' | 'gt' | 'lt' | 'gte' | 'lte' | 'eq';
export type BinaryOperations = 'and' | 'or';
export type UnaryOperations = 'not';
export type SerializeQueryValuePrimitive<T> =
    | string
    | number
    | boolean
    | { [k in PrimitiveOperation]: SerializeQueryValuePrimitive<T> };
export type SerializeQueryValue<T> =
    | SerializeQueryValuePrimitive<T>
    | { [k in UnaryOperations]: SerializeQueryValue<T> }
    | { [k in BinaryOperations]: SerializeQueryValue<T>[] };
export type SerializeQueryItem<T> = { [k in keyof T]: SerializeQueryValue<T> };
export type SerializeQuery<T> = SerializeQueryItem<T> | SerializeQueryItem<T>[];

export class FilterQuery<T extends BaseEntity> {
    @IsOptional()
    @Transform(({ value }: TransformFnParams) => {
        try {
            if (Array.isArray(value)) return value.map((e) => JSON.parse(e));
            return JSON.parse(value);
        } catch (e) {
            Logger.warn('Invalid filter for list request');
            return undefined;
        }
    })
    public readonly filters?: SerializeQuery<T>;

    public whereObject(filter: SerializeQuery<T> = this.filters): FindOptionsWhere<T> | FindOptionsWhere<T>[] {
        if (Array.isArray(filter))
            return filter.map((f) => this.whereObject(f) as FindOptionsWhere<T>).filter((e) => !!e);
        const ret: FindOptionsWhere<T> = {};
        Object.keys(filter).forEach((k) => {
            Object.assign(ret, this.nestedEval(k, this.buildCondition(filter[k])));
        });
        if (Object.keys(ret).length == 0) return undefined;
        return ret;
    }

    private buildCondition(
        value: SerializeQueryValue<T>
    ): FindOperator<string | number | boolean> | (string | number | boolean) {
        if (Array.isArray(value)) return undefined;
        if (typeof value == 'object') {
            const op = Object.keys(value)[0] as PrimitiveOperation | BinaryOperations | UnaryOperations;
            switch (op) {
                case 'not':
                    return Not(this.buildCondition(value[op]));
                case 'eq':
                    return value[op];
                case 'gt':
                    return MoreThan(value[op]);
                case 'lt':
                    return LessThan(value[op]);
                case 'gte':
                    return MoreThanOrEqual(value[op]);
                case 'lte':
                    return LessThanOrEqual(value[op]);
                case 'like':
                    return Like(value[op]);
                case 'and':
                    return Array.isArray(value[op])
                        ? And(...value[op].map((e: SerializeQueryValue<T>) => this.buildCondition(e)))
                        : this.buildCondition(value[op]);
                case 'or':
                    return Array.isArray(value[op])
                        ? Or(...value[op].map((e: SerializeQueryValue<T>) => this.buildCondition(e)))
                        : this.buildCondition(value[op]);
            }
            throw new BadRequestException(`Invalid operator ${op}`);
        }
        return value;
    }

    private nestedEval(
        k: string,
        value: FindOperator<string | number | boolean> | (string | number | boolean)
    ): FindOptionsWhere<T> {
        const key_sequence = k.split('.');
        const base = { [key_sequence.pop()]: value } as FindOptionsWhere<T>;
        return key_sequence.reverse().reduce((a, b) => ({ [b]: a }) as FindOptionsWhere<T>, base);
    }
}
