import { Injectable } from '@nestjs/common';
import { AuthorizerService } from '@dms/auth/lib/authorizer.service';
import { Response } from 'express';

@Injectable()
export class AuthService {
    constructor(private readonly auth: AuthorizerService) {}

    public async authenticate(username: string, password: string, res: Response) {
        return await this.auth.issueToken(username, false, ['token'], ['ciao'], res);
    }
}
