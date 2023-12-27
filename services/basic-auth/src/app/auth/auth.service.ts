import { ForbiddenException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { AuthorizerService } from '@dms/auth/lib/authorizer.service';
import { Response, Request } from 'express';
import { InjectRepository } from '@nestjs/typeorm';
import { LocalUserEntity } from '../../persistence/entities/LocalUser.entity';
import { Repository } from 'typeorm';
import { NotFoundError } from 'rxjs';

@Injectable()
export class AuthService {
    private readonly logger = new Logger('AuthService');

    constructor(
        private readonly auth: AuthorizerService,
        @InjectRepository(LocalUserEntity) private readonly userRepository: Repository<LocalUserEntity>
    ) {}

    public async authenticate(username: string, password: string, res: Response, req: Request) {
        const user = await this.userRepository.findOne({ where: { username }, relations: { groups: true } });
        if (!user) throw new NotFoundException(`User ${username} does not exist in the local user database`);
        if (!user.enabled) throw new ForbiddenException(`User ${username} is not enabled`);
        if (!(await user.verify(password))) throw new ForbiddenException('Wrong password');

        this.logger.log(`User ${username} logged in from ${req.ip}`);
        user.lastLogin = new Date();
        await user.save();

        const raw_features: string[] = user.groups.map((e) => e.associated_features).flat();
        const features = new Set(raw_features);
        // const features = raw_features.map((f) => {
        //     return raw_features
        //         .filter((e) => e.startsWith(f) || f.startsWith(e))
        //         .sort((a, b) => a.length - b.length)[0];
        // });

        return this.auth.issueToken(
            user.id,
            user.username,
            user.superuser,
            [...features],
            user.groups.map((e) => e.name),
            res
        );
    }
}
