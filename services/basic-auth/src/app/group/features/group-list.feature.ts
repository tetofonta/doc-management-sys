import { Feature } from '@dms/auth/lib/decorators/feature.decorator';
import { ListFeature } from '@dms/crud';
import { InjectRepository, TypeOrmModule } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LocalGroupEntity } from '../../../persistence/entities/LocalGroup.entity';

@Feature('localgroup:list', {
    imports: [TypeOrmModule.forFeature([LocalGroupEntity])],
})
export class LocalGroupListFeature extends ListFeature<LocalGroupEntity, LocalGroupEntity> {
    constructor(@InjectRepository(LocalGroupEntity) repository: Repository<LocalGroupEntity>) {
        super(repository, ['users']);
    }
}
