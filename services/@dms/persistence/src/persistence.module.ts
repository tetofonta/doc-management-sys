import { PersistenceConfig } from './config/PersistenceConfig';
import { BaseEntity } from './overload/BaseEntity';
import { DynamicModule, Module, Type } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { DataSource, DataSourceOptions, EntitySchema } from 'typeorm';
import { TypeOrmCoreModule } from '@nestjs/typeorm/dist/typeorm-core.module';
import { createTypeOrmProviders } from '@nestjs/typeorm/dist/typeorm.providers';
import { EntitiesMetadataStorage } from '@nestjs/typeorm/dist/entities-metadata.storage';
import { DEFAULT_DATA_SOURCE_NAME } from '@nestjs/typeorm/dist/typeorm.constants';
import { CacheDataSource } from './overload/DataSource';

@Module({})
export class PersistenceModule {
    public static forRoot(config: PersistenceConfig, entities: Type<BaseEntity>[]): DynamicModule {
        config.setEntities(entities as unknown as EntitySchema[]);
        return {
            module: TypeOrmModule,
            imports: [TypeOrmCoreModule.forRoot(config)],
        };
    }

    public static forFeatures(...entities: Type<BaseEntity>[]): DynamicModule {
        const providers = createTypeOrmProviders(entities, DEFAULT_DATA_SOURCE_NAME);
        EntitiesMetadataStorage.addEntitiesByDataSource(DEFAULT_DATA_SOURCE_NAME, [...entities]);
        return {
            module: TypeOrmModule,
            providers: providers,
            exports: providers,
        };
    }

    static typeormConfigs(options: {
        imports: DynamicModule[];
        useFactory: (conf: PersistenceConfig) => PersistenceConfig;
        inject: string[];
    }): TypeOrmModuleAsyncOptions {
        return {
            dataSourceFactory: async (options?: DataSourceOptions) => {
                if (options.cache) return new CacheDataSource(options);
                else return new DataSource(options);
            },
            ...options,
        };
    }
}
