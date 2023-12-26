import { ForbiddenException, Inject, Injectable, NotAcceptableException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request, Response } from 'express';
import { AuthConfig } from './config/AuthConfig';
import { TokenPayload } from './proto_types/token/auth-token';
import { DMS_AUTH_CONFIG_INJECT_KEY } from './constants';
import * as crypto from 'crypto';

@Injectable()
export class AuthorizerService {
    constructor(
        private readonly jwtService: JwtService,
        @Inject(DMS_AUTH_CONFIG_INJECT_KEY) private readonly configs: AuthConfig
    ) {}

    public async issueToken(
        user_id: string,
        user_name: string,
        superuser: boolean,
        features: string[] | null,
        groups: string[],
        res: Response
    ): Promise<void> {
        const payload: TokenPayload = {
            userId: user_id,
            userName: user_name,
            superuser,
            features,
            groups,
            siblingHash: undefined,
        };

        const token = this.jwtService.sign(payload, { expiresIn: `${this.configs.jwt.token_expiration_seconds}s` });
        const token_hash = crypto
            .createHmac(this.configs.refresh_token_hmac_algo, this.configs.refresh_token_hmac_secret)
            .update(token)
            .digest('base64');
        const refresh_token = this.jwtService.sign(
            {
                ...payload,
                superuser: false,
                features: ['token:info', 'token:refresh'],
                siblingHash: token_hash,
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

    public async refreshToken(req: Request, res: Response): Promise<void> {
        const old_token = req.headers[this.configs.old_token_header.toLowerCase()];
        const refresh_token = req.headers[this.configs.authorization_header.toLowerCase()];

        if (!old_token || !refresh_token || Array.isArray(old_token) || Array.isArray(refresh_token))
            throw new NotAcceptableException(
                `In order for refresh to work the old and new tokens are needed (one header only) in the headers ${this.configs.old_token_header} ${this.configs.authorization_header}`
            );

        let ref_token: TokenPayload;
        try {
            ref_token = this.jwtService.verify(refresh_token.substring(7)) as TokenPayload;
        } catch (e) {
            throw new ForbiddenException('Refresh token is not valid.');
        }

        if (
            !ref_token.siblingHash ||
            ref_token.siblingHash !=
                crypto
                    .createHmac(this.configs.refresh_token_hmac_algo, this.configs.refresh_token_hmac_secret)
                    .update(old_token)
                    .digest('base64')
        )
            throw new NotAcceptableException('sibling hash is not valid');

        const old_content = this.jwtService.decode(old_token) as TokenPayload;
        await this.issueToken(old_content.userId, old_content.userName, old_content.superuser, old_content.features, old_content.groups, res);
    }
}
