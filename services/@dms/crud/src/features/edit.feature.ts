import { BaseEntity } from '@dms/persistence';
import { DeepPartial, FindOptionsWhere, Repository } from 'typeorm';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { UpdateResponse } from '../types/UpdateResponse';
import { FilterQuery } from '../types/FilterQuery';

export class EditFeature<
    Entity extends BaseEntity,
    ReturnType = DeepPartial<Entity>,
    SuppliedType = DeepPartial<Entity>,
    IdType = any,
> {
    constructor(
        private readonly _repository: Repository<Entity>,
        private readonly relations: string[] = [],
        private readonly id_key: string = 'id'
    ) {}

    public async updateMany(query: FilterQuery<Entity>, body: SuppliedType): Promise<UpdateResponse<ReturnType>> {
        const element = await this._repository.find({
            where: query.whereObject(),
            relations: this.relations,
        });
        const res = await Promise.all(
            element.map(async (e) => {
                const entity = await this.updateElement(e, body);
                return await entity.save();
            })
        );

        return { updated: res.length, result: await Promise.all(res.map((e, i) => this.hydrate(e, i, res))) };
    }

    public async update(id: IdType, body: SuppliedType): Promise<UpdateResponse<ReturnType>> {
        if (!id) throw new BadRequestException('invalid or undefined id');
        const element = await this._repository.findOne({
            where: { [this.id_key]: id } as FindOptionsWhere<Entity>,
            relations: this.relations,
        });
        if (!element) throw new NotFoundException('No element has been found');
        const entity = await this.updateElement(element, body);
        await entity.save();
        return { updated: 1, result: await this.hydrate(element) };
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    protected async hydrate(element: Entity, _index?: number, _list?: Entity[]): Promise<ReturnType> {
        return element as unknown as ReturnType;
    }

    protected async updateElement(
        entity: Entity,
        body: SuppliedType,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        _index?: number,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        _list?: Entity[]
    ): Promise<Entity> {
        return this._repository.merge(entity, body as DeepPartial<Entity>);
    }
}
