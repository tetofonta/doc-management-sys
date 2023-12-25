import { Module } from '@nestjs/common';
import { AuthModule } from '@dms/auth/lib/auth.module';
import { TokenInfoFeature } from './features/token-info.feature';
import { TokenController } from './token.controller';
import { TokenRefreshFeature } from './features/token-refresh.feature';

@Module({
    imports: [AuthModule.forFeatures(TokenInfoFeature, TokenRefreshFeature)],
    controllers: [TokenController],
})
export class TokenModule {}
