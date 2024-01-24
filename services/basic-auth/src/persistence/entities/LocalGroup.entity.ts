import { BaseEntity } from '@dms/persistence/lib/overload/BaseEntity';
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { LocalUserEntity } from './LocalUser.entity';
import { Exclude, Transform, TransformFnParams } from 'class-transformer';
import { CRUD_CREATE, CRUD_EDIT, CRUD_LIST, CRUD_SELECT, DefinedIf, ExposeIf } from '@dms/crud';
import { IsArray, IsDefined, IsNotEmpty, IsString, IsUUID, ValidateNested } from 'class-validator';

@Entity()
@Exclude()
export class LocalGroupEntity extends BaseEntity {
    public static readonly LIST = CRUD_LIST(LocalGroupEntity);
    public static readonly SELECT = CRUD_SELECT(LocalGroupEntity);
    public static readonly CREATE = CRUD_CREATE(LocalGroupEntity);
    public static readonly EDIT = CRUD_EDIT(LocalGroupEntity);

    @PrimaryGeneratedColumn('uuid')
    @ExposeIf(
        LocalGroupEntity.SELECT,
        LocalGroupEntity.LIST,
        LocalUserEntity.LIST,
        LocalUserEntity.EDIT,
        LocalUserEntity.CREATE,
        LocalUserEntity.SELECT
    )
    @IsUUID(4, { always: true })
    @DefinedIf(LocalUserEntity.EDIT, LocalUserEntity.CREATE)
    public readonly id: string;

    @Column({ unique: true })
    @ExposeIf(
        LocalGroupEntity.SELECT,
        LocalGroupEntity.LIST,
        LocalGroupEntity.CREATE,
        LocalGroupEntity.EDIT,
        LocalUserEntity.LIST,
        LocalUserEntity.SELECT
    )
    @IsDefined({ always: true })
    @IsNotEmpty({ always: true })
    @DefinedIf(LocalGroupEntity.CREATE)
    public name: string;

    @Column({ array: true, type: 'text', default: [] })
    @ExposeIf(LocalGroupEntity.SELECT, LocalGroupEntity.CREATE, LocalGroupEntity.EDIT)
    @IsString({ each: true, always: true })
    @IsArray({ always: true })
    public associated_features: string[];

    @ManyToMany(() => LocalUserEntity, (u) => u.groups)
    @ExposeIf(LocalGroupEntity.CREATE, LocalGroupEntity.EDIT, LocalGroupEntity.SELECT)
    @Transform(({ value }: TransformFnParams) => ({ id: value }), {
        groups: [LocalGroupEntity.CREATE, LocalGroupEntity.EDIT],
    })
    @IsArray({ always: true })
    @ValidateNested({ each: true, always: true })
    public users: LocalUserEntity[];

    @ExposeIf(LocalGroupEntity.LIST)
    public get userCount(): number {
        return this.users.length;
    }
}
