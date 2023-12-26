import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { LocalUserEntity } from '../../persistence/entities/LocalUser.entity';
import { LocalGroupEntity } from '../../persistence/entities/LocalGroup.entity';
import { ConfigLoaderModule } from '@dms/config';
import { DMSAuthConfig } from '../../config/AuthConfig';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    imports: [
        TypeOrmModule.forFeature([LocalUserEntity, LocalGroupEntity]),
        ConfigLoaderModule.forFeatures(DMSAuthConfig),
    ],
    controllers: [UserController],
    providers: [UserService],
})
export class UserModule {}
