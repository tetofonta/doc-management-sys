import { Feature } from '@dms/auth/lib/decorators/feature.decorator';
import { LocalUserEntity } from '../../../persistence/entities/LocalUser.entity';
import { DetailFeature } from '@dms/crud';
import { InjectRepository, TypeOrmModule } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Feature('localuser:get', {
    imports: [TypeOrmModule.forFeature([LocalUserEntity])],
})
export class LocalUserDetailFeature extends DetailFeature<LocalUserEntity, LocalUserEntity> {
    constructor(@InjectRepository(LocalUserEntity) userRepository: Repository<LocalUserEntity>) {
        super(userRepository, ['groups']);
    }
}
