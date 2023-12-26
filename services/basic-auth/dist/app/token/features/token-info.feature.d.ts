import { Request } from 'express';
import { TokenPayload } from '@dms/auth/lib/proto_types/token/auth-token';
export declare class TokenInfoFeature {
    tokenInfo(req: Request): Promise<TokenPayload>;
}
