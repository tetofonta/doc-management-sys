import { BaseEntity } from '@dms/persistence';
import { DeepPartial, FindManyOptions, FindOptionsWhere, Repository, SelectQueryBuilder } from 'typeorm';
import { Response } from 'express';
import { ListQuery } from '../types/ListQuery';
import { ListResponse } from '../types/ListResponse';

export class ListFeature<Entity extends BaseEntity, ReturnType = DeepPartial<Entity>, Data = any> {
    constructor(
        private readonly _repository: Repository<Entity>,
        private readonly relations?: string[],
        private readonly fixedQuery: FindOptionsWhere<Entity> = {},
        private readonly synchronous = false
    ) {}

    public async list(res: Response, query: ListQuery<Entity>, data?: Data): Promise<ListResponse<ReturnType>> {
        const qObject = query?.queryObject || {};
        qObject.where = Object.assign(qObject.where || {}, this.fixedQuery);
        return await this.perform_query(res, qObject, undefined, data);
    }

    protected async perform_query(
        res: Response,
        qObject: FindManyOptions<Entity>,
        qb?: SelectQueryBuilder<Entity>,
        d?: Data
    ): Promise<ListResponse<ReturnType>> {
        let data = [],
            count: number;

        if (!qb) [data, count] = await this._repository.findAndCount({ ...qObject, relations: this.relations });
        else {
            [data, count] = await qb.getManyAndCount();
        }

        const unit = this._repository.metadata.tableName;
        const begin = qObject.skip || 0;
        const end = Math.min(begin + (qObject.take || 100), count);
        res.header('Content-Range', `${unit} ${begin}-${end}/${count}`);

        if (this.synchronous) {
            const ret = Array(data.length);
            let i = 0;
            for (const e of data) {
                ret[i] = await this.hydrate(e, i++, data, d);
            }
            const r = ret.filter((e) => !!e);
            return {
                result: r,
                from: begin,
                to: begin + r.length,
                count: count - (data.length - r.length),
            };
        }

        const r = (await Promise.all(data.map((e, i) => this.hydrate(e, i, data, d)))).filter((e) => !!e);
        return {
            result: r,
            from: begin,
            to: begin + r.length,
            count: count - (data.length - r.length),
        };
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    protected async hydrate(element: Entity, _index: number, _list: Entity[], _data: Data): Promise<ReturnType | null> {
        return element as unknown as ReturnType;
    }
}
