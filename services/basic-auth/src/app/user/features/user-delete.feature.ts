import { Feature } from '@dms/auth/lib/decorators/feature.decorator';
import { LocalUserEntity } from '../../../persistence/entities/LocalUser.entity';
import { InjectRepository, TypeOrmModule } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DeleteFeature } from '@dms/crud';

@Feature('localuser:admin:delete', {
    imports: [TypeOrmModule.forFeature([LocalUserEntity])],
})
export class LocalUserDeleteFeature extends DeleteFeature<LocalUserEntity> {
    constructor(@InjectRepository(LocalUserEntity) private readonly userRepository: Repository<LocalUserEntity>) {
        super(userRepository);
    }
}
