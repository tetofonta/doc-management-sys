import { BaseEntity } from '@dms/persistence/lib/overload/BaseEntity';
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { LocalUserEntity } from './LocalUser.entity';
import { Expose } from 'class-transformer';

@Entity()
export class LocalGroupEntity extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    public readonly id: string;

    @Column({ unique: true })
    public name: string;

    @Column({ array: true, type: 'text' })
    public associated_features: string[];

    @ManyToMany(() => LocalUserEntity, (u) => u.groups)
    public users: LocalUserEntity[];

    @Expose()
    public get userCount(): number {
        return this.users.length;
    }
}
