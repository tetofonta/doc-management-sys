import { Feature } from '@dms/auth/lib/decorators/feature.decorator';
import { Request, Response } from 'express';
import { AuthModule } from '@dms/auth/lib/auth.module';
import { AuthorizerService } from '@dms/auth/lib/authorizer.service';

@Feature('token:refresh', { imports: [AuthModule.forAuthorizer()] })
export class TokenRefreshFeature {
    constructor(private readonly auth: AuthorizerService) {}

    public async refresh(req: Request, res: Response): Promise<void> {
        return await this.auth.refreshToken(req, res);
    }
}
