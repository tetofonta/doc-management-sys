import { Feature } from '@dms/auth/lib/decorators/feature.decorator';
import { LocalUserEntity } from '../../../persistence/entities/LocalUser.entity';
import { InjectRepository, TypeOrmModule } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { UserChangePasswordBody } from '../../../types/user/UserChangePassword';

@Feature('localuser:change_password', {
    imports: [TypeOrmModule.forFeature([LocalUserEntity])],
})
export class LocalUserChangeFeature {
    constructor(@InjectRepository(LocalUserEntity) private readonly userRepository: Repository<LocalUserEntity>) {}

    public async change_password(id: string, body: UserChangePasswordBody) {
        if (!id) throw new BadRequestException('No id specified');
        const user = await this.userRepository.findOneBy({ id });
        if (!user) throw new NotFoundException('user not found');

        if (!(await user.verify(body.current_password))) {
            throw new ForbiddenException('Invalid Password');
        }

        user.password = body.new_password;
        user.forceChange = false;
        user.lastPasswordChange = new Date();
        await user.save();
        return { status: true };
    }
}
