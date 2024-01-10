import { Feature } from '@dms/auth/lib/decorators/feature.decorator';
import { LocalUserEntity } from '../../../persistence/entities/LocalUser.entity';
import { DetailFeature, ListFeature } from '@dms/crud';
import { InjectRepository, TypeOrmModule } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Feature('localuser:admin:create', {
    imports: [TypeOrmModule.forFeature([LocalUserEntity])],
})
export class LocalUserCreateFeature {
    constructor(@InjectRepository(LocalUserEntity) private readonly userRepository: Repository<LocalUserEntity>) {}

    public async create(body: LocalUserEntity) {
        console.log(body);
    }
}
