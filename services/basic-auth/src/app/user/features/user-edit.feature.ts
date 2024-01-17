import { Feature } from '@dms/auth/lib/decorators/feature.decorator';
import { LocalUserEntity } from '../../../persistence/entities/LocalUser.entity';
import { InjectRepository, TypeOrmModule } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EditFeature } from '@dms/crud';
import { LocalGroupEntity } from '../../../persistence/entities/LocalGroup.entity';
import { DeepPartial } from '@dms/auth/lib/proto_types/token/auth-token';

@Feature('localuser:admin:edit', {
    imports: [TypeOrmModule.forFeature([LocalUserEntity, LocalGroupEntity])],
})
export class LocalUserEditFeature extends EditFeature<LocalUserEntity> {
    constructor(
        @InjectRepository(LocalUserEntity) private readonly userRepository: Repository<LocalUserEntity>,
        @InjectRepository(LocalGroupEntity) private readonly groupRepository: Repository<LocalGroupEntity>
    ) {
        super(userRepository);
    }

    protected async updateElement(
        entity: LocalUserEntity,
        body: DeepPartial<LocalUserEntity>
    ): Promise<LocalUserEntity> {
        entity = this.userRepository.merge(entity, body);
        if (body.groups) {
            body.groups = await this.groupRepository.find({
                where: body.groups
                    .map((e: DeepPartial<LocalGroupEntity>) => ({
                        id: e.id,
                    }))
                    .filter((e) => !!e.id),
            });
            entity.groups = body.groups as LocalGroupEntity[];
        }
        return entity;
    }
}
