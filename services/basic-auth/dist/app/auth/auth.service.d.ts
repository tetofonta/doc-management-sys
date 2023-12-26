import { AuthorizerService } from '@dms/auth/lib/authorizer.service';
import { Response, Request } from 'express';
import { LocalUserEntity } from '../../persistence/entities/LocalUser.entity';
import { Repository } from 'typeorm';
export declare class AuthService {
    private readonly auth;
    private readonly userRepository;
    private readonly logger;
    constructor(auth: AuthorizerService, userRepository: Repository<LocalUserEntity>);
    authenticate(username: string, password: string, res: Response, req: Request): Promise<void>;
}
