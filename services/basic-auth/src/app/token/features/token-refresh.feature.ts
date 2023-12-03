import { Feature } from '@dms/auth/lib/decorators/feature.decorator';
import { Request } from 'express';
import { TokenPayload } from '@dms/auth/lib/proto_types/token/auth-token';

@Feature('token:info')
export class TokenInfoFeature {
    public async tokenInfo(req: Request): Promise<TokenPayload> {
        return req['user'] as TokenPayload;
    }
}
