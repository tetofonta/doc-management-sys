import { Request, Response } from 'express';
import { AuthorizerService } from '@dms/auth/lib/authorizer.service';
export declare class TokenRefreshFeature {
    private readonly auth;
    constructor(auth: AuthorizerService);
    refresh(req: Request, res: Response): Promise<void>;
}
