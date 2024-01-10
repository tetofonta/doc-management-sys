import { Feature } from '@dms/auth/lib/decorators/feature.decorator';
import { LocalUserEntity } from '../../../persistence/entities/LocalUser.entity';
import { ListFeature } from '@dms/crud';
import { InjectRepository, TypeOrmModule } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Feature('localuser:list', {
    imports: [TypeOrmModule.forFeature([LocalUserEntity])],
})
export class LocalUserListFeature extends ListFeature<LocalUserEntity, LocalUserEntity> {
    constructor(@InjectRepository(LocalUserEntity) userRepository: Repository<LocalUserEntity>) {
        super(userRepository, ['groups']);
    }
}
