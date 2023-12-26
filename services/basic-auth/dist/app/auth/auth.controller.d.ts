import { AuthService } from './auth.service';
import { Response, Request } from 'express';
import { AuthLoginPostBody } from '../../types/auth/auth-login.post';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(res: Response, req: Request, body: AuthLoginPostBody): Promise<void>;
}
