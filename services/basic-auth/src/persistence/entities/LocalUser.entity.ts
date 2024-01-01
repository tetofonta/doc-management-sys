import { BaseEntity } from '@dms/persistence/lib/overload/BaseEntity';
import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { LocalGroupEntity } from './LocalGroup.entity';
import { Exclude, Transform } from 'class-transformer';
import * as argon2 from 'argon2';

@Entity()
export class LocalUserEntity extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    public readonly id: string;

    @Column({ unique: true })
    public username: string;

    @Exclude()
    @Column()
    public password: string;

    @Column({ default: false })
    public superuser: boolean;

    @Column({ default: true })
    public enabled: boolean;

    @ManyToMany(() => LocalGroupEntity, (g) => g.users)
    @JoinTable()
    @Transform((p) => p.value?.map((e: LocalGroupEntity) => ({ id: e.id, name: e.name })))
    public groups: LocalGroupEntity[];

    @Column({ type: 'timestamp', nullable: true })
    public lastLogin?: Date;

    @Column({ type: 'timestamp', nullable: true })
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
