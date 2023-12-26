import { BaseEntity } from '@dms/persistence/lib/overload/BaseEntity';
import { LocalUserEntity } from './LocalUser.entity';
export declare class LocalGroupEntity extends BaseEntity {
    readonly id: string;
    name: string;
    associated_features: string[];
    users: LocalUserEntity[];
    get userCount(): number;
}
