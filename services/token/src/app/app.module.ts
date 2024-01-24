import { Module } from '@nestjs/common';
import { ConfigLoaderModule } from '@dms/config/lib/config-loader.module';
import { appConfigSettings } from '../config/AppConfigSettings';
import { DMSAuthConfig } from '../config/AuthConfig';
import { getConfigKey } from '@dms/config';
import { AuthModule } from '@dms/auth/lib/auth.module';
import { AuthConfig } from '@dms/auth/lib/config/AuthConfig';
import { TokenModule } from './token/token.module';
import { WellKnownController } from './well-known.controller';
import { WebModule } from '@dms/http-base';
import { AppWebConfig } from '../config/WebConfig';
import { OpenTelemetryModule } from '@dms/telemetry';
import { DMSTelemetryConfig } from '../config/TelemetryConfig';

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
        OpenTelemetryModule.forRootAsync({
            imports: [ConfigLoaderModule.forFeatures(DMSTelemetryConfig)],
            inject: [getConfigKey(DMSTelemetryConfig)],
            useFactory: (conf: DMSTelemetryConfig) => conf.make(),
        }),
        TokenModule,
    ],
    controllers: [WellKnownController],
})
export class AppModule {}
