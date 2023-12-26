import { DataSource, EntitySubscriberInterface, EventSubscriber, InsertEvent, UpdateEvent } from 'typeorm';
import * as argon2 from 'argon2';
import { LocalUserEntity } from '../entities/LocalUser.entity';
import { DMSAuthConfig } from '../../config/AuthConfig';
import { InjectConfig } from '@dms/config/lib/decorators/inject-config.decorator';

@EventSubscriber()
export class LocalUserSubscriber implements EntitySubscriberInterface<LocalUserEntity> {
    constructor(
        @InjectConfig(DMSAuthConfig) private readonly config: DMSAuthConfig,
        dataSource: DataSource
    ) {
        dataSource.subscribers.push(this);
    }

    listenTo() {
        return LocalUserEntity;
    }

    async beforeInsert(event: InsertEvent<LocalUserEntity>): Promise<void> {
        await this.updatePassword(event.entity);
    }

    async beforeUpdate(event: UpdateEvent<LocalUserEntity>): Promise<void> {
        if (event.updatedColumns.some((e) => e.propertyName === 'password'))
            await this.updatePassword(event.entity as LocalUserEntity);
    }

    private async updatePassword(entity: LocalUserEntity) {
        entity.password = await argon2.hash(entity.password, {
            hashLength: this.config.passwords.hashLength,
            memoryCost: this.config.passwords.memoryCost,
            parallelism: this.config.passwords.parallelism,
            saltLength: this.config.passwords.saltLength,
            timeCost: this.config.passwords.timeCost,
            type: argon2.argon2id,
        });
        entity.lastPasswordChange = new Date();
        return entity;
    }
}
