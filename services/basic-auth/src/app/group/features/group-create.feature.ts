import { Feature } from '@dms/auth/lib/decorators/feature.decorator';
import { LocalUserEntity } from '../../../persistence/entities/LocalUser.entity';
import { InjectRepository, TypeOrmModule } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateFeature, FilterQuery } from '@dms/crud';
import { LocalGroupEntity } from '../../../persistence/entities/LocalGroup.entity';
import { DeepPartial } from 'typeorm';

@Feature('localgroup:create', {
    imports: [TypeOrmModule.forFeature([LocalUserEntity, LocalGroupEntity])],
})
export class LocalGroupCreateFeature extends CreateFeature<LocalGroupEntity> {
    constructor(
        @InjectRepository(LocalUserEntity) private readonly userRepository: Repository<LocalUserEntity>,
        @InjectRepository(LocalGroupEntity) private readonly groupRepository: Repository<LocalGroupEntity>
    ) {
        super(groupRepository);
    }

    public async getFeatures(filter: FilterQuery<{ feature: string }>): Promise<string[]> {
        let query = this.groupRepository
            .createQueryBuilder('group')
            .select(['unnest("associated_features") as feature'])
            .distinct();
        const wo = [filter?.whereObject].flat().filter((e) => !!e);
        wo.forEach((e) => (query = query.where(e)));
        return (await query.getRawMany()).map((e) => e.feature);
    }

    protected async makeObject(body: DeepPartial<LocalGroupEntity>): Promise<DeepPartial<LocalGroupEntity>> {
        if (body.users) {
            body.users = await this.userRepository.find({
                where: body.users
                    .map((e: LocalUserEntity) => ({
                        id: e.id,
                    }))
                    .filter((e) => !!e.id),
            });
        }
        return body;
    }
}
