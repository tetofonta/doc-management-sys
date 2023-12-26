import { Inject, Injectable, UnprocessableEntityException } from '@nestjs/common';
import { DMS_AUTH_CONFIG_INJECT_KEY } from './constants';
import { AuthConfig } from './config/AuthConfig';
import * as crypto from 'crypto';

export type JKWSKeyDescriptorECType = {
    d: string;
    crv: string;
    x: string;
    y: string;
};

export type JKWSKeyDescriptorRSAType = {
    n: string;
    e: string;
};

export type JKWSKeyDescriptorType = {
    kty: 'RSA' | 'EC';
    use: 'sig' | 'enc' | string;
    alg: string;
    kid: string;
} & (JKWSKeyDescriptorECType | JKWSKeyDescriptorRSAType);

export type JKWSType = {
    keys: JKWSKeyDescriptorType[];
};

@Injectable()
export class AuthService {
    constructor(@Inject(DMS_AUTH_CONFIG_INJECT_KEY) private readonly configs: AuthConfig) {}

    public get_kid() {
        return crypto.createHash('sha384').update(this.configs.jwt.publicKey).digest('base64');
    }

    public json_web_key_set(): any {
        const pub_key_string = this.configs.jwt.publicKey;
        const pub_key = crypto.createPublicKey(pub_key_string).export({ format: 'jwk' });

        return {
            keys: [
                Object.assign(pub_key, {
                    alg: this.configs.jwt.signOptions.algorithm,
                    use: 'sig',
                    kid: this.get_kid(),
                }),
            ],
        };
    }
}
