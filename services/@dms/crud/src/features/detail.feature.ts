/*eslint-disable @typescript-eslint/no-unused-vars*/
import { BaseEntity } from '@dms/persistence';
import { DeepPartial, FindOptionsWhere, Repository } from 'typeorm';
import { BadRequestException, NotFoundException } from '@nestjs/common';

export class DetailFeature<Entity extends BaseEntity, ReturnType = DeepPartial<Entity>, IdType = any, X = any> {
    constructor(
        private readonly _repository: Repository<Entity>,
        private readonly relations?: string[],
        private readonly id_key: string = 'id'
    ) {}

    public async get(id: IdType, additional_data?: X): Promise<ReturnType> {
        if (!id) throw new BadRequestException('invalid or undefined id');
        const element = await this._repository.findOne({
            where: { [this.id_key]: id } as FindOptionsWhere<Entity>,
            relations: this.relations,
        });

        if (!element) throw new NotFoundException('No element has been found');
        return await this.hydrate(element, additional_data);
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    protected async hydrate(element: Entity, _additional_data?: X): Promise<ReturnType> {
        return element as unknown as ReturnType;
    }
}
