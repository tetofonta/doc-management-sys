import { Controller, Get, HttpCode, Patch, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { TokenPayload } from '@dms/auth/lib/proto_types/token/auth-token';
import { InjectFeature } from '@dms/auth/lib/decorators/feature-inject.decorator';
import { TokenInfoFeature } from './features/token-info.feature';
import { JwtAuthGuard } from '@dms/auth/lib/guards/jwt.guard';
import { RequireFeatures } from '@dms/auth/lib/decorators/feature-require.decorator';
import { FeatureGuard } from '@dms/auth/lib/guards/features.guard';
import { TokenRefreshFeature } from './features/token-refresh.feature';

@Controller('/token')
export class TokenController {
    @Get('/')
    @UseGuards(JwtAuthGuard, FeatureGuard)
    @RequireFeatures(TokenInfoFeature)
    public async getTokenInfo(
        @Req() req: Request,
        @InjectFeature(TokenInfoFeature) t_info: TokenInfoFeature
    ): Promise<TokenPayload> {
        return await t_info.tokenInfo(req);
    }

    @Patch('/')
    @UseGuards(JwtAuthGuard, FeatureGuard)
    @RequireFeatures(TokenRefreshFeature)
    @HttpCode(204)
    public async refreshToken(
        @Req() req: Request,
        @Res({ passthrough: true }) res: Response,
        @InjectFeature(TokenRefreshFeature) t_info: TokenRefreshFeature
    ): Promise<void> {
        return await t_info.refresh(req, res);
    }
}
