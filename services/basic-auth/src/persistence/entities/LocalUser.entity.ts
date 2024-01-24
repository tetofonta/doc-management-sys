import { BaseEntity } from '@dms/persistence/lib/overload/BaseEntity';
import { Column, Entity, JoinTable, ManyToMany, PrimaryColumn } from 'typeorm';
import { LocalGroupEntity } from './LocalGroup.entity';
import { Exclude } from 'class-transformer';
import * as argon2 from 'argon2';
import { CRUD_CREATE, CRUD_EDIT, CRUD_LIST, CRUD_SELECT, DefinedIf, ExposeIf } from '@dms/crud';
import {
    IsArray,
    IsBoolean,
    IsNotEmpty,
    IsOptional,
    IsString,
    IsStrongPassword,
    ValidateNested,
} from 'class-validator';

@Entity()
@Exclude()
export class LocalUserEntity extends BaseEntity {
    public static readonly LIST = CRUD_LIST(LocalUserEntity);
    public static readonly SELECT = CRUD_SELECT(LocalUserEntity);
    public static readonly CREATE = CRUD_CREATE(LocalUserEntity);
    public static readonly EDIT = CRUD_EDIT(LocalUserEntity);

    @PrimaryColumn()
    @ExposeIf(LocalUserEntity.SELECT, LocalUserEntity.LIST, LocalUserEntity.CREATE, CRUD_SELECT('LocalGroupEntity'))
    @IsString({ always: true })
    @IsNotEmpty({ always: true })
    @DefinedIf(LocalUserEntity.CREATE)
    public id: string;

    @Column()
    @ExposeIf(LocalUserEntity.CREATE)
    @IsStrongPassword(undefined, { always: true })
    @IsNotEmpty({ always: true })
    @DefinedIf(LocalUserEntity.CREATE)
    public password: string;

    @Column({ default: false })
    @ExposeIf(LocalUserEntity.SELECT, LocalUserEntity.LIST, LocalUserEntity.CREATE, LocalUserEntity.EDIT)
    @IsBoolean({ always: true })
    @IsOptional({ always: true })
    public superuser: boolean;

    @Column({ default: true })
    @ExposeIf(LocalUserEntity.SELECT, LocalUserEntity.LIST, LocalUserEntity.CREATE, LocalUserEntity.EDIT)
    @IsBoolean({ always: true })
    @IsOptional({ always: true })
    public enabled: boolean;

    @ManyToMany(() => LocalGroupEntity, (g) => g.users)
    @JoinTable()
    @ExposeIf(LocalUserEntity.LIST, LocalUserEntity.SELECT, LocalUserEntity.CREATE, LocalUserEntity.EDIT)
    @IsArray({ always: true })
    @ValidateNested({ each: true, groups: [LocalUserEntity.CREATE, LocalUserEntity.EDIT] })
    @IsOptional({ always: true })
    public groups: LocalGroupEntity[];

    @Column({ type: 'timestamp', nullable: true })
    @ExposeIf(LocalUserEntity.SELECT)
    public lastLogin?: Date;

    @Column({ type: 'timestamp', nullable: true })
    @ExposeIf(LocalUserEntity.SELECT)
    public lastPasswordChange?: Date;

    @Column({ default: false })
    public forceChange: boolean;

    public async verify(password: string) {
        if (!this.enabled) return false;
        try {
            return await argon2.verify(this.password, password);
        } catch (e) {
            return false;
        }
    }
}
