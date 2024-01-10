import { BaseEntity } from '@dms/persistence';
import { FindOptionsWhere, Repository } from 'typeorm';
import { Response } from 'express';
import { DeleteResponse } from '../types/DeleteResponse';
import { FilterQuery } from '../types/FilterQuery';
import { BadRequestException, UnprocessableEntityException } from '@nestjs/common';

export class DeleteFeature<Entity extends BaseEntity, IdType = any> {
    constructor(
        private readonly _repository: Repository<Entity>,
        private readonly id_key: string = 'id'
    ) {}

    public async deleteMany(res: Response, query: FilterQuery<Entity>): Promise<DeleteResponse> {
        let delete_round = query.whereObject();
        if (!Array.isArray(delete_round)) delete_round = [delete_round];
        const data = await Promise.all(delete_round.map((e) => this._repository.delete(e)));
        return { deleted: data.map((e) => e.affected || 0).reduce((a, b) => a + b, 0) };
    }

    public async delete(id: IdType): Promise<DeleteResponse> {
        if (!id) throw new BadRequestException('invalid id');
        const ret = await this._repository.delete({ [this.id_key]: id } as FindOptionsWhere<Entity>);

        if ((ret.affected || 0) == 0) throw new UnprocessableEntityException('Item does not exists');

        return { deleted: ret.affected || 0 };
    }
}
