import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { AuthConfig } from './config/AuthConfig';
import { TokenPayload } from '../lib/proto_types/token/auth-token';

@Injectable()
export class AuthorizerService {
    constructor(
        private readonly jwtService: JwtService,
        @Inject('configs') private readonly configs: AuthConfig
    ) {}

    public async issueToken(
        user_id: string,
        superuser: boolean,
        features: string[] | null,
        groups: string[],
        res: Response
    ): Promise<void> {
        const payload: TokenPayload = {
            userId: user_id,
            superuser,
            features,
            groups,
        };

        const token = this.jwtService.sign(payload, { expiresIn: `${this.configs.jwt.token_expiration_seconds}s` });
        const refresh_token = this.jwtService.sign(
            {
                ...payload,
                superuser: false,
                features: ['token:info', 'token:refresh'],
            },
            {
                expiresIn: `${
                    this.configs.jwt.token_expiration_seconds + this.configs.jwt.refresh_token_extension_seconds
                }s`,
            }
        );

        res.header(this.configs.token_header, token);
        res.header(this.configs.refresh_token_header, refresh_token);
    }
}
