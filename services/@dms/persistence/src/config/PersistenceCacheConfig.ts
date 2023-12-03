import { IsIn, IsInt, IsNotEmpty, IsOptional, IsString, ValidateIf } from 'class-validator';

export class PersistenceCacheConfig {
    @IsIn(['database', 'redis', 'ioredis', 'ioredis/cluster'])
    @IsNotEmpty()
    readonly type?: 'database' | 'redis' | 'ioredis' | 'ioredis/cluster';

    @IsString()
    @IsOptional()
    @ValidateIf((o) => o.type === 'database')
    readonly tableName?: string;

    @IsOptional()
    readonly options?: unknown;

    @IsOptional()
    readonly alwaysEnabled?: boolean;

    @IsOptional()
    @IsInt()
    readonly duration?: number;
}
