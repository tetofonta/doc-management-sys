import { Module } from '@nestjs/common';
import { ConfigLoaderModule, getConfigKey } from '@dms/config';
import { PersistenceModule } from '@dms/persistence/lib/persistence.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DMSPersistenceSettings } from '../config/PersistenceSettings';
import { LocalGroupEntity } from './entities/LocalGroup.entity';
import { LocalUserEntity } from './entities/LocalUser.entity';
import { DMSAuthConfig } from '../config/AuthConfig';
import { LocalUserSubscriber } from './subscribers/LocalUser.subscriber';

@Module({
    imports: [
        TypeOrmModule.forRootAsync(
            PersistenceModule.typeormConfigs({
                imports: [ConfigLoaderModule.forFeatures(DMSPersistenceSettings)],
                inject: [getConfigKey(DMSPersistenceSettings)],
                useFactory: (conf: DMSPersistenceSettings) => {
                    return conf.setEntities([LocalGroupEntity, LocalUserEntity]);
                },
            })
        ),
        ConfigLoaderModule.forFeatures(DMSAuthConfig),
    ],
    providers: [LocalUserSubscriber],
})
export class DMSPersistenceModule {}
