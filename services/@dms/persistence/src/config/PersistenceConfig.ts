import {
    IsBoolean,
    IsIn,
    IsInt,
    IsNotEmpty,
    IsOptional,
    IsString,
    Max,
    Min,
    ValidateIf,
    ValidateNested,
} from 'class-validator';
import { Exclude, Type } from 'class-transformer';
import { PersistenceCacheConfig } from './PersistenceCacheConfig';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import { TlsOptions } from 'tls';
import { EntitySchema } from 'typeorm';

export class PersistenceConfig implements PostgresConnectionOptions {
    public readonly applicationName: string = 'DMS';
    public readonly type = 'postgres' as const;

    @IsNotEmpty()
    @ValidateNested()
    @ValidateIf((o) => !!o.cache)
    @Type(() => PersistenceCacheConfig)
    public readonly cache: PersistenceCacheConfig | boolean = false;

    @IsOptional()
    @IsInt()
    public readonly connectTimeoutMS: number;

    @IsString()
    @IsNotEmpty()
    @ValidateIf((o) => !o.url)
    public readonly database: string;

    @IsBoolean()
    public readonly dropSchema: boolean = false;

    @IsString()
    @IsNotEmpty()
    public readonly host: string;

    @IsBoolean()
    @IsNotEmpty()
    public readonly logging: boolean = false;

    @IsString()
    @IsNotEmpty()
    @ValidateIf((o) => !o.url)
    public readonly password: string | (() => string) | (() => Promise<string>);

    @IsInt()
    @Min(0)
    @Max(65535)
    @IsNotEmpty()
    public readonly port: number;

    @IsIn(['join', 'query'])
    @IsOptional()
    public readonly relationLoadStrategy: 'join' | 'query';

    @IsOptional()
    public readonly ssl: boolean | TlsOptions;

    @IsBoolean()
    @IsNotEmpty()
    public readonly synchronize: boolean = false;

    @IsString()
    @IsNotEmpty()
    @ValidateIf((o) => !o.username || !o.password || !o.database)
    public readonly url: string;

    @IsBoolean()
    public readonly useUTC: boolean = true;

    @IsString()
    @IsNotEmpty()
    @ValidateIf((o) => !o.url)
    public readonly username: string;

    @IsIn(['pgcrypto', 'uuid-ossp'])
    @IsOptional()
    public readonly uuidExtension: 'pgcrypto' | 'uuid-ossp';

    @Exclude()
    public readonly entities: EntitySchema[] = [];

    public setEntities(e: EntitySchema[]): PersistenceConfig {
        this.entities.push(...e);
        return this;
    }
}
