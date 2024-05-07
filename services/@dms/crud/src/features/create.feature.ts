import { BaseEntity } from '@dms/persistence';
import { DeepPartial, Repository } from 'typeorm';
import { CreateResponse } from '../types/CreateResponse';

export class CreateFeature<
    Entity extends BaseEntity,
    SuppliedData = DeepPartial<Entity>,
    ReturnType = DeepPartial<Entity>,
    Data = any,
> {
    constructor(private readonly _repository: Repository<Entity>) {}

    public async createMany(body: SuppliedData[], data?: Data): Promise<CreateResponse<ReturnType>> {
        const entities = await Promise.all(
            body.map(async (b) => {
                const entity = await this.makeObject(b, data);
                return await entity.save();
            })
        );

        const ret = await Promise.all(entities.map((e, i) => this.hydrate(e, i, entities, data)));
        return { created: ret.length, result: ret };
    }

    public async create(body: SuppliedData, data?: Data): Promise<CreateResponse<ReturnType>> {
        const entity = await this.makeObject(body, data);
        await entity.save();
        return { created: 1, result: await this.hydrate(entity) };
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    protected async makeObject(body: SuppliedData, _data?: Data): Promise<Entity> {
        return this._repository.create(body as unknown as Entity);
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    protected async hydrate(value: Entity, _index?: number, _list?: Entity[], _data?: Data): Promise<ReturnType> {
        return value as unknown as ReturnType;
    }
}
