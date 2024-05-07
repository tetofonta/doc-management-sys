import { Feature } from '@dms/auth/lib/decorators/feature.decorator';
import { LocalUserEntity } from '../../../persistence/entities/LocalUser.entity';
import { InjectRepository, TypeOrmModule } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateFeature } from '@dms/crud';
import { LocalGroupEntity } from '../../../persistence/entities/LocalGroup.entity';
import { DeepPartial } from 'typeorm';

@Feature('localuser:admin:create', {
    imports: [TypeOrmModule.forFeature([LocalUserEntity, LocalGroupEntity])],
})
export class LocalUserCreateFeature extends CreateFeature<LocalUserEntity> {
    constructor(
        @InjectRepository(LocalUserEntity) private readonly userRepository: Repository<LocalUserEntity>,
        @InjectRepository(LocalGroupEntity) private readonly groupRepository: Repository<LocalGroupEntity>
    ) {
        super(userRepository);
    }

    protected async makeObject(body: DeepPartial<LocalUserEntity>): Promise<LocalUserEntity> {
        if (!body.password) body.password = Math.random().toString(26).substring(2);

        if (body.groups) {
            body.groups = await this.groupRepository.find({
                where: body.groups
                    .map((e: LocalGroupEntity) => ({
                        id: e.id,
                    }))
                    .filter((e) => !!e.id),
            });
        }
        return this.userRepository.create(body);
    }
}
