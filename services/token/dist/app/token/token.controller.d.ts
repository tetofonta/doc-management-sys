import { Request, Response } from 'express';
import { TokenPayload } from '@dms/auth/lib/proto_types/token/auth-token';
import { TokenInfoFeature } from './features/token-info.feature';
import { TokenRefreshFeature } from './features/token-refresh.feature';
export declare class TokenController {
    getTokenInfo(req: Request, t_info: TokenInfoFeature): Promise<TokenPayload>;
    refreshToken(req: Request, res: Response, t_info: TokenRefreshFeature): Promise<void>;
}
