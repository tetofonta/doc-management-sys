import { Feature } from '@dms/auth/lib/decorators/feature.decorator';
import { LocalUserEntity } from '../../../persistence/entities/LocalUser.entity';
import { InjectRepository, TypeOrmModule } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateFeature } from '@dms/crud';
import { LocalGroupEntity } from '../../../persistence/entities/LocalGroup.entity';
import { DeepPartial } from '@dms/auth/lib/proto_types/token/auth-token';

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
}
