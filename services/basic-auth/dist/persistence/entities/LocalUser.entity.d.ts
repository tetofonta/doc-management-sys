import { BaseEntity } from '@dms/persistence/lib/overload/BaseEntity';
import { LocalGroupEntity } from './LocalGroup.entity';
export declare class LocalUserEntity extends BaseEntity {
    readonly id: string;
    username: string;
    password: string;
    superuser: boolean;
    enabled: boolean;
    groups: LocalGroupEntity[];
    lastLogin?: Date;
    lastPasswordChange?: Date;
    forceChange: boolean;
    verify(password: string): Promise<boolean>;
}
