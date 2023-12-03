import { ConfigLoaderSettings } from './config/ConfigLoaderSettings';
import { DynamicModule } from '@nestjs/common';
import { ConfigLoaderService } from './config-loader.service';
import { FactoryProvider } from '@nestjs/common/interfaces/modules/provider.interface';
import { ConfigurableType } from './decorators/load-config.decorator';
import { Configurable } from './config/Config';

export class ConfigLoaderModule {
    public static forFeatures(...configs: Configurable[]): DynamicModule {
        const config_descriptors: FactoryProvider[] = configs.map(
            (e): FactoryProvider => ({
                provide: (e as ConfigurableType).configDescriptor.namespace,
                useFactory: async (service: ConfigLoaderService) => {
                    return await service.load((e as ConfigurableType).configDescriptor);
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
                provide: (e as ConfigurableType).configDescriptor.namespace,
                useFactory: async (service: ConfigLoaderService) =>
                    await service.load((e as ConfigurableType).configDescriptor),
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
