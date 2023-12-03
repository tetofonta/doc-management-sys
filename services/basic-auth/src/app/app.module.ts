import { Module } from '@nestjs/common';
import { ConfigLoaderModule } from '@dms/config/lib/config-loader.module';
import { appConfigSettings } from '../config/AppConfigSettings';
import { DMSPersistenceModule } from '../persistence/persistence.module';

@Module({
    imports: [ConfigLoaderModule.forRoot(appConfigSettings), DMSPersistenceModule],
})
export class AppModule {}
