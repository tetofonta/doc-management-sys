import { LocalUserEntity } from '../../persistence/entities/LocalUser.entity';
import { Repository } from 'typeorm';
import { LocalGroupEntity } from '../../persistence/entities/LocalGroup.entity';
import { DMSAuthConfig } from '../../config/AuthConfig';
export declare class UserService {
    private readonly userRepository;
    private readonly groupRepository;
    private readonly config;
    private readonly logger;
    constructor(userRepository: Repository<LocalUserEntity>, groupRepository: Repository<LocalGroupEntity>, config: DMSAuthConfig);
    private init;
}
