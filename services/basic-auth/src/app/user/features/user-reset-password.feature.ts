import { Feature } from '@dms/auth/lib/decorators/feature.decorator';
import { LocalUserEntity } from '../../../persistence/entities/LocalUser.entity';
import { InjectRepository, TypeOrmModule } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateFeature, EditFeature } from '@dms/crud';
import { LocalGroupEntity } from '../../../persistence/entities/LocalGroup.entity';
import { DeepPartial } from '@dms/auth/lib/proto_types/token/auth-token';
import { BadRequestException, NotFoundException } from '@nestjs/common';

@Feature('localuser:admin:reset', {
    imports: [TypeOrmModule.forFeature([LocalUserEntity])],
})
export class LocalUserResetFeature {
    constructor(@InjectRepository(LocalUserEntity) private readonly userRepository: Repository<LocalUserEntity>) {}

    public async resetPassword(id: string) {
        if (!id) throw new BadRequestException('No id specified');
        const user = await this.userRepository.findOneBy({ id });
        if (!user) throw new NotFoundException('user not found');

        const new_password = Math.random().toString(26).substring(2) + Math.random().toString(26).substring(2);
        user.password = new_password;
        user.forceChange = true;
        user.lastPasswordChange = new Date();
        // await user.save();
        return { psw: new_password };
    }
}
