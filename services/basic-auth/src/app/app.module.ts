import { Module } from '@nestjs/common';
import { ConfigLoaderModule } from '@dms/config/lib/config-loader.module';
import { appConfigSettings } from '../config/AppConfigSettings';
import { DMSPersistenceModule } from '../persistence/persistence.module';
import { DMSAuthConfig } from '../config/AuthConfig';
import { getConfigKey } from '@dms/config';
import { DMSAuthModule } from './auth/auth.module';
import { AuthModule } from '@dms/auth/lib/auth.module';
import { AuthConfig } from '@dms/auth/lib/config/AuthConfig';
import { UserModule } from './user/user.module';
import { GroupModule } from './group/group.module';
import { WebModule } from '@dms/http-base';
import { AppWebConfig } from '../config/WebConfig';

@Module({
    imports: [
        ConfigLoaderModule.forRoot(appConfigSettings),
        AuthModule.forRootAsync({
            imports: [ConfigLoaderModule.forFeatures(DMSAuthConfig)],
            inject: [getConfigKey(DMSAuthConfig)],
            useFactory: (conf: AuthConfig) => conf,
        }),
        WebModule.forRootAsync({
            imports: [ConfigLoaderModule.forFeatures(AppWebConfig)],
            inject: [getConfigKey(AppWebConfig)],
            useFactory: (conf: AppWebConfig) => conf,
        }),
        DMSPersistenceModule,
        DMSAuthModule,
        UserModule,
        GroupModule,
    ],
})
export class AppModule {}
