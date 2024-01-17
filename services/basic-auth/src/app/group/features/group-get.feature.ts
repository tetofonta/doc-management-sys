import { Feature } from '@dms/auth/lib/decorators/feature.decorator';
import { DetailFeature } from '@dms/crud';
import { InjectRepository, TypeOrmModule } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LocalGroupEntity } from '../../../persistence/entities/LocalGroup.entity';

@Feature('localgroup:get', {
    imports: [TypeOrmModule.forFeature([LocalGroupEntity])],
})
export class LocalGroupDetailFeature extends DetailFeature<LocalGroupEntity, LocalGroupEntity> {
    constructor(@InjectRepository(LocalGroupEntity) repository: Repository<LocalGroupEntity>) {
        super(repository, ['users']);
    }
}
