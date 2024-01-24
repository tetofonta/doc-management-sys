import { Feature } from '@dms/auth/lib/decorators/feature.decorator';
import { LocalUserEntity } from '../../../persistence/entities/LocalUser.entity';
import { InjectRepository, TypeOrmModule } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EditFeature } from '@dms/crud';
import { LocalGroupEntity } from '../../../persistence/entities/LocalGroup.entity';
import { DeepPartial } from '@dms/auth/lib/proto_types/token/auth-token';

@Feature('localgroup:edit', {
    imports: [TypeOrmModule.forFeature([LocalUserEntity, LocalGroupEntity])],
})
export class LocalGroupEditFeature extends EditFeature<LocalGroupEntity> {
    constructor(
        @InjectRepository(LocalUserEntity) private readonly userRepository: Repository<LocalUserEntity>,
        @InjectRepository(LocalGroupEntity) private readonly groupRepository: Repository<LocalGroupEntity>
    ) {
        super(groupRepository);
    }

    protected async updateElement(
        entity: LocalGroupEntity,
        body: DeepPartial<LocalGroupEntity>
    ): Promise<LocalGroupEntity> {
        entity = this.groupRepository.merge(entity, body);
        if (body.users) {
            body.users = await this.userRepository.find({
                where: body.users
                    .map((e: DeepPartial<LocalUserEntity>) => ({
                        id: e.id,
                    }))
                    .filter((e) => !!e.id),
            });
            entity.users = body.users as LocalUserEntity[];
        }
        return entity;
    }
}
