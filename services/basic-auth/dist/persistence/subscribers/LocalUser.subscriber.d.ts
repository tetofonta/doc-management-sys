import { DataSource, EntitySubscriberInterface, InsertEvent, UpdateEvent } from 'typeorm';
import { LocalUserEntity } from '../entities/LocalUser.entity';
import { DMSAuthConfig } from '../../config/AuthConfig';
export declare class LocalUserSubscriber implements EntitySubscriberInterface<LocalUserEntity> {
    private readonly config;
    constructor(config: DMSAuthConfig, dataSource: DataSource);
    listenTo(): typeof LocalUserEntity;
    beforeInsert(event: InsertEvent<LocalUserEntity>): Promise<void>;
    beforeUpdate(event: UpdateEvent<LocalUserEntity>): Promise<void>;
    private updatePassword;
}
