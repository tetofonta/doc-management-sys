import { BadRequestException, Inject, Injectable, NotAcceptableException, NotFoundException } from '@nestjs/common';
import { AuthConfig } from '../config/AuthConfig';
import {
    DMS_AUTH_CONFIG_INJECT_KEY,
    DMS_AUTH_DECODE_TOKEN_FUNCTION,
} from '../constants';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor(
        @Inject(DMS_AUTH_CONFIG_INJECT_KEY) private readonly configs: AuthConfig,
        @Inject(DMS_AUTH_DECODE_TOKEN_FUNCTION) private readonly decode: (token: any) => any
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                (req: Request) => {
                    const auth_value = req.headers[configs.authorization_header.toLowerCase()];
                    if (!auth_value) throw new NotFoundException('Token not found');

                    if (Array.isArray(auth_value)) throw new BadRequestException('Multiple authorization headers');
                    if (auth_value.trim().substring(0, 7).toLowerCase() != 'bearer ')
                        throw new NotAcceptableException('Malformed bearer token');

                    return auth_value.trim().substring(7);
                },
            ]),
            ...configs.jwt.verifyOptions,
            secretOrKey: configs.jwt.publicKey,
        });
    }

    async validate(payload: any): Promise<any> {
        const pay = this.decode(payload);
        return pay;
    }
}
