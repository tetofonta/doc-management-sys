import { ForbiddenException, Inject, Injectable, NotAcceptableException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request, Response } from 'express';
import { AuthConfig } from './config/AuthConfig';
import { DMS_AUTH_CONFIG_INJECT_KEY } from './constants';
import * as crypto from 'crypto';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthorizerService {
    constructor(
        private readonly jwtService: JwtService,
        @Inject(DMS_AUTH_CONFIG_INJECT_KEY) private readonly configs: AuthConfig
    ) {}

    public async issueToken<T extends object | Buffer, V extends object | Buffer>(
        payload: T,
        refresh_payload: V,
        res: Response
    ): Promise<{ token: string; refresh_token: string; payload: T }> {
        const token = this.jwtService.sign(payload, { expiresIn: `${this.configs.jwt.token_expiration_seconds}s` });
        const token_hash = crypto
            .createHmac(this.configs.refresh_token_hmac_algo, this.configs.refresh_token_hmac_secret)
            .update(token)
            .digest('hex');

        const opt = {
            ...this.configs.jwt.signOptions,
            expiresIn: `${
                this.configs.jwt.token_expiration_seconds + this.configs.jwt.refresh_token_extension_seconds
            }s`,
        };
        delete opt.keyid;
        delete opt.algorithm;

        const refresh_token = jwt.sign(refresh_payload, token_hash, opt);

        res.header(this.configs.token_header, token);
        res.header(this.configs.refresh_token_header, refresh_token);
        return { token, refresh_token, payload };
    }

    public async refreshToken(req: Request, res: Response): Promise<void> {
        const old_token = req.headers[this.configs.old_token_header.toLowerCase()];
        const refresh_token = req.headers[this.configs.authorization_header.toLowerCase()];

        if (!old_token || !refresh_token || Array.isArray(old_token) || Array.isArray(refresh_token))
            throw new NotAcceptableException(
                `In order for refresh to work the old and new tokens are needed (one header only) in the headers ${this.configs.old_token_header} ${this.configs.authorization_header}`
            );

        const old_token_hash = crypto
            .createHmac(this.configs.refresh_token_hmac_algo, this.configs.refresh_token_hmac_secret)
            .update(old_token)
            .digest('hex');

        let ref_token_data: any;
        try {
            ref_token_data = jwt.verify(refresh_token.substring(7), old_token_hash);
        } catch (e) {
            throw new ForbiddenException('Refresh token is not valid.');
        }

        const old_content = this.jwtService.decode(old_token);
        await this.issueToken(old_content, ref_token_data, res);
    }
}
