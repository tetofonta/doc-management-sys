import { Module } from '@nestjs/common';
import { GroupController } from './group.controller';
import { LocalGroupEntity } from '../../persistence/entities/LocalGroup.entity';
import { ConfigLoaderModule } from '@dms/config';
import { DMSAuthConfig } from '../../config/AuthConfig';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '@dms/auth/lib/auth.module';
import { LocalGroupListFeature } from './features/group-list.feature';
import { LocalGroupDetailFeature } from './features/group-get.feature';

@Module({
    imports: [
        TypeOrmModule.forFeature([LocalGroupEntity]),
        ConfigLoaderModule.forFeatures(DMSAuthConfig),
        AuthModule.forFeatures(LocalGroupListFeature, LocalGroupDetailFeature),
    ],
    controllers: [GroupController],
})
export class GroupModule {}
