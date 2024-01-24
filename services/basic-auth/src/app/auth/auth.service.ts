import { ForbiddenException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { AuthorizerService } from '@dms/auth/lib/authorizer.service';
import { Response, Request } from 'express';
import { InjectRepository } from '@nestjs/typeorm';
import { LocalUserEntity } from '../../persistence/entities/LocalUser.entity';
import { Repository } from 'typeorm';
import { TokenPayload } from '../../proto_types/token/auth-token';

@Injectable()
export class AuthService {
    private readonly logger = new Logger('AuthService');

    constructor(
        private readonly auth: AuthorizerService,
        @InjectRepository(LocalUserEntity) private readonly userRepository: Repository<LocalUserEntity>
    ) {}

    public async authenticate(username: string, password: string, res: Response, req: Request) {
        const user = await this.userRepository.findOne({ where: { id: username }, relations: { groups: true } });
        if (!user) throw new NotFoundException(`User ${username} does not exist in the local user database`);
        if (!user.enabled) throw new ForbiddenException(`User ${username} is not enabled`);
        if (!(await user.verify(password))) throw new ForbiddenException('Wrong password');

        this.logger.log(`User ${username} logged in from ${req.ip}`);
        user.lastLogin = new Date();
        await user.save();

        const raw_features = [...new Set(user.groups.map((e) => e.associated_features).flat())].sort(
            (a, b) => a.length - b.length
        );

        const features = [];
        raw_features.forEach((e) => {
            if (!features.some((f) => e.startsWith(f))) features.push(e);
        });

        if (user.superuser) features.push('__superuser__');

        const payload: TokenPayload = {
            user_id: user.id,
            superuser: user.superuser,
            features: [...features],
            groups: user.groups.map((e) => e.name),
            source: 'basic',
        };

        const refresh_payload: TokenPayload = {
            user_id: user.id,
            superuser: false,
            features: ['token:refresh', 'token:info'],
            groups: [],
            source: 'basic',
        };

        return await this.auth.issueToken(payload, refresh_payload, res);
    }
}
