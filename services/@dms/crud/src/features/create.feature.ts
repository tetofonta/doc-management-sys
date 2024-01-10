import { BaseEntity } from '@dms/persistence';
import { DeepPartial, Repository } from 'typeorm';
import { CreateResponse } from '../types/CreateResponse';

export class CreateFeature<
    Entity extends BaseEntity,
    SuppliedData = DeepPartial<Entity>,
    ReturnType = DeepPartial<Entity>,
> {
    constructor(private readonly _repository: Repository<Entity>) {}

    public async createMany(body: SuppliedData[]): Promise<CreateResponse<ReturnType>> {
        const entities = await Promise.all(
            body.map(async (b) => {
                const obj = await this.makeObject(b);
                const entity = this._repository.create(obj);
                return await entity.save();
            })
        );

        const ret = await Promise.all(entities.map((e, i) => this.hydrate(e, i, entities)));
        return { created: ret.length, result: ret };
    }

    public async create(body: SuppliedData): Promise<CreateResponse<ReturnType>> {
        const obj = await this.makeObject(body);
        const entity = this._repository.create(obj);
        await entity.save();
        return { created: 1, result: await this.hydrate(entity) };
    }

    protected async makeObject(body: SuppliedData): Promise<DeepPartial<Entity>> {
        return body as unknown as Entity;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    protected async hydrate(value: Entity, _index?: number, _list?: Entity[]): Promise<ReturnType> {
        return value as unknown as ReturnType;
    }
}
