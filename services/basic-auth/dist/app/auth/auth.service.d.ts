import { AuthorizerService } from '@dms/auth/lib/authorizer.service';
import { Response } from 'express';
export declare class AuthService {
    private readonly auth;
    constructor(auth: AuthorizerService);
    authenticate(username: string, password: string, res: Response): Promise<void>;
}
