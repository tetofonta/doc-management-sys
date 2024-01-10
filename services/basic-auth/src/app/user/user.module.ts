import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { LocalUserEntity } from '../../persistence/entities/LocalUser.entity';
import { LocalGroupEntity } from '../../persistence/entities/LocalGroup.entity';
import { ConfigLoaderModule } from '@dms/config';
import { DMSAuthConfig } from '../../config/AuthConfig';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '@dms/auth/lib/auth.module';
import { LocalUserListFeature } from './features/user-list.feature';
import { LocalUserDetailFeature } from './features/user-get.feature';
import { LocalUserCreateFeature } from './features/user-create.feature';

@Module({
    imports: [
        TypeOrmModule.forFeature([LocalUserEntity, LocalGroupEntity]),
        ConfigLoaderModule.forFeatures(DMSAuthConfig),
        AuthModule.forFeatures(LocalUserListFeature, LocalUserDetailFeature, LocalUserCreateFeature),
    ],
    controllers: [UserController],
    providers: [UserService],
})
export class UserModule {}
