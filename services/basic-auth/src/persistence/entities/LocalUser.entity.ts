import { BaseEntity } from '@dms/persistence/lib/overload/BaseEntity';
import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { LocalGroupEntity } from './LocalGroup.entity';
import { Exclude, Expose, Transform } from 'class-transformer';
import * as argon2 from 'argon2';
import { CRUD_CREATE, CRUD_EDIT, CRUD_LIST, CRUD_SELECT, DefinedIf, ExposeIf } from '@dms/crud';
import {
    IsArray,
    IsBoolean,
    IsDefined,
    IsNotEmpty,
    IsOptional,
    IsString,
    IsStrongPassword,
    ValidateNested,
} from 'class-validator';

@Entity()
@Exclude()
export class LocalUserEntity extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    @ExposeIf(CRUD_SELECT(LocalUserEntity), CRUD_LIST(LocalUserEntity))
    public readonly id: string;

    @Column({ unique: true })
    @ExposeIf(CRUD_SELECT(LocalUserEntity), CRUD_LIST(LocalUserEntity))
    @IsString()
    @IsNotEmpty()
    @DefinedIf(CRUD_CREATE(LocalUserEntity))
    public username: string;

    @Exclude()
    @Column()
    @IsStrongPassword()
    @IsNotEmpty()
    @DefinedIf(CRUD_CREATE(LocalUserEntity))
    public password: string;

    @Column({ default: false })
    @ExposeIf(CRUD_SELECT(LocalUserEntity), CRUD_LIST(LocalUserEntity))
    @IsBoolean()
    @IsOptional()
    public superuser: boolean;

    @Column({ default: true })
    @ExposeIf(CRUD_SELECT(LocalUserEntity), CRUD_LIST(LocalUserEntity))
    @IsBoolean()
    @IsOptional()
    public enabled: boolean;

    @ManyToMany(() => LocalGroupEntity, (g) => g.users)
    @JoinTable()
    @Transform((p) => p.value?.map((e: LocalGroupEntity) => ({ id: e.id, name: e.name })))
    @ExposeIf(CRUD_LIST(LocalUserEntity))
    @IsArray()
    @ValidateNested()
    @IsOptional()
    public groups: LocalGroupEntity[];

    @Column({ type: 'timestamp', nullable: true })
    @ExposeIf(CRUD_SELECT(LocalUserEntity))
    public lastLogin?: Date;

    @Column({ type: 'timestamp', nullable: true })
    @ExposeIf(CRUD_SELECT(LocalUserEntity))
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
