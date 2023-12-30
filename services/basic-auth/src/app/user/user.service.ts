import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LocalUserEntity } from '../../persistence/entities/LocalUser.entity';
import { Repository } from 'typeorm';
import { LocalGroupEntity } from '../../persistence/entities/LocalGroup.entity';
import { InjectConfig } from '@dms/config/lib/decorators/inject-config.decorator';
import { DMSAuthConfig } from '../../config/AuthConfig';

@Injectable()
export class UserService {
    private readonly logger = new Logger('UserService');

    constructor(
        @InjectRepository(LocalUserEntity) private readonly userRepository: Repository<LocalUserEntity>,
        @InjectRepository(LocalGroupEntity) private readonly groupRepository: Repository<LocalGroupEntity>,
        @InjectConfig(DMSAuthConfig) private readonly config: DMSAuthConfig
    ) {
        console.log(this.config)
        this.init().then();
    }

    private async init() {
        if (!this.config.passwords.createUser) return;

        let group = await this.groupRepository.findOneBy({ name: this.config.passwords.userGroupName });
        if (!group) {
            if (!this.config.passwords.createGroup) this.logger.error('Cannot retrieve default user group.');
            else {
                group = this.groupRepository.create({
                    name: this.config.passwords.userGroupName,
                    associated_features: this.config.passwords.defaultGroupFeatures,
                });
                await group.save();
                await group.reload();
                this.logger.log(`Created group ${group.name} with features ${group.associated_features.join(', ')}`);
            }
        }

        const user = await this.userRepository.findOneBy({ username: this.config.passwords.adminUserName });
        if (!user) {
            const password = Math.random().toString(26).substring(2);
            await this.userRepository
                .create({
                    username: this.config.passwords.adminUserName,
                    password,
                    enabled: true,
                    superuser: true,
                    groups: [group].filter((e) => !!e),
                    forceChange: false,
                })
                .save();
            this.logger.log(`Created user ${this.config.passwords.adminUserName} with password ${password}`);
        }
    }
} // admin:lk8gdfb6cjg
