import { BaseEntity } from '@dms/persistence/lib/overload/BaseEntity';
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { LocalUserEntity } from './LocalUser.entity';
import { Exclude, Expose } from 'class-transformer';
import { CRUD_CREATE, CRUD_EDIT, CRUD_LIST, CRUD_SELECT } from '@dms/crud';
import { IsDefined, IsUUID } from 'class-validator';

@Entity()
@Exclude()
export class LocalGroupEntity extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    @Expose({
        groups: [
            CRUD_SELECT(LocalGroupEntity),
            CRUD_LIST(LocalGroupEntity),
            CRUD_LIST(LocalUserEntity),
            CRUD_SELECT(LocalUserEntity),
        ],
    })
    @IsUUID()
    @IsDefined({ groups: [CRUD_CREATE(LocalUserEntity), CRUD_EDIT(LocalUserEntity)] })
    public readonly id: string;

    @Column({ unique: true })
    @Expose({
        groups: [
            CRUD_SELECT(LocalGroupEntity),
            CRUD_LIST(LocalGroupEntity),
            CRUD_LIST(LocalUserEntity),
            CRUD_SELECT(LocalUserEntity),
        ],
    })
    public name: string;

    @Column({ array: true, type: 'text' })
    @Expose({ groups: [CRUD_SELECT(LocalGroupEntity)] })
    public associated_features: string[];

    @ManyToMany(() => LocalUserEntity, (u) => u.groups)
    @Expose({ groups: [CRUD_SELECT(LocalGroupEntity)] })
    public users: LocalUserEntity[];

    @Expose({ groups: [CRUD_SELECT(LocalGroupEntity), CRUD_LIST(LocalGroupEntity)] })
    public get userCount(): number {
        return this.users.length;
    }
}
