import { Module } from '@nestjs/common';
import { ConfigLoaderModule, getConfigKey } from '@dms/config';
import { PersistenceModule } from '@dms/persistence/lib/persistence.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DMSPersistenceSettings } from '../config/PersistenceSettings';

@Module({
    imports: [
        TypeOrmModule.forRootAsync(
            PersistenceModule.typeormConfigs({
                imports: [ConfigLoaderModule.forFeatures(DMSPersistenceSettings)],
                inject: [getConfigKey(DMSPersistenceSettings)],
                useFactory: (conf: DMSPersistenceSettings) => {
                    return conf.setEntities([]);
                },
            })
        ),
    ],
})
export class DMSPersistenceModule {}
