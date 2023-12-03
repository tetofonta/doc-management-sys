import { BaseEntity as TypeOrmBaseEntity } from 'typeorm';
import { SaveOptions } from 'typeorm/repository/SaveOptions';
import { RemoveOptions } from 'typeorm/repository/RemoveOptions';
import { CacheManager } from '../CacheManager';

export class BaseEntity extends TypeOrmBaseEntity {
    static async clearCache() {
        // @ts-expect-error as typeorm does it.
        if (this.dataSource.queryResultCache) {
            // @ts-expect-error as typeorm does it.
            const metadata = this.dataSource.getMetadata(this);
            const cacheManager = CacheManager.getInstance(metadata.tableName);
            // @ts-expect-error as typeorm does it.
            await this.dataSource.queryResultCache.remove(cacheManager.getSubCaches());
            cacheManager.clearSubCaches();
        }
    }

    async loadRelation<T>(relationKey: string, shouldLoadMany?: boolean): Promise<T> {
        if (relationKey.trim().length === 0) {
            throw new Error('Cannot load empty relation.');
        }
        if (typeof this[relationKey] !== 'undefined') return this[relationKey];

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const staticAccessor = this.constructor as any;
        const relationQuery = staticAccessor.createQueryBuilder().relation(staticAccessor, relationKey).of(this);

        const relationValue: T = shouldLoadMany ? await relationQuery.loadMany() : await relationQuery.loadOne();

        this[relationKey] = relationValue;

        return relationValue;
    }

    async clearCache() {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const staticAccessor = this.constructor as any;
        staticAccessor.clearCache();
    }

    async save(options?: SaveOptions): Promise<this> {
        const ret = await super.save(options);
        await this.clearCache();
        await ret.reload();
        return ret;
    }

    async remove(options?: RemoveOptions): Promise<this> {
        const ret = await super.remove(options);
        await this.clearCache();
        return ret;
    }

    async softRemove(options?: SaveOptions): Promise<this> {
        const ret = await super.softRemove(options);
        await this.clearCache();
        return ret;
    }

    async recover(options?: SaveOptions): Promise<this> {
        const ret = await super.recover(options);
        await this.clearCache();
        return ret;
    }

    async reload(): Promise<void> {
        await this.clearCache();
        try {
            await super.reload();
        } catch (e) {}
    }
}
