import { ConfigLoaderSettings } from './config/ConfigLoaderSettings';
import { DynamicModule } from '@nestjs/common';
import { ConfigLoaderService } from './config-loader.service';
import { FactoryProvider } from '@nestjs/common/interfaces/modules/provider.interface';
import { Configurable } from './config/Config';
import { DMS_CONFIG_METADATA_KEY } from './constants';

export class ConfigLoaderModule {
    public static forFeatures(...configs: Configurable[]): DynamicModule {
        const config_descriptors: FactoryProvider[] = configs.map(
            (e): FactoryProvider => ({
                provide: Reflect.getMetadata(DMS_CONFIG_METADATA_KEY, e).namespace,
                useFactory: async (service: ConfigLoaderService) => {
                    return await service.load(Reflect.getMetadata(DMS_CONFIG_METADATA_KEY, e));
                },
                inject: [ConfigLoaderService],
            })
        );

        return {
            module: ConfigLoaderModule,
            imports: [],
            providers: [...config_descriptors],
            exports: [...config_descriptors],
        };
    }

    public static forRoot(config: ConfigLoaderSettings): DynamicModule {
        const global_config_descriptors: FactoryProvider[] = config.global_namespace_load.map(
            (e): FactoryProvider => ({
                provide: Reflect.getMetadata(DMS_CONFIG_METADATA_KEY, e).namespace,
                useFactory: async (service: ConfigLoaderService) =>
                    await service.load(Reflect.getMetadata(DMS_CONFIG_METADATA_KEY, e)),
                inject: [ConfigLoaderService],
            })
        );

        return {
            module: ConfigLoaderModule,
            global: true,
            providers: [{ provide: 'CONFIG', useValue: config }, ConfigLoaderService, ...global_config_descriptors],
            exports: [ConfigLoaderService, ...global_config_descriptors],
        };
    }
}
