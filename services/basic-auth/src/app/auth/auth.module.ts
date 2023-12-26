import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthModule } from '@dms/auth/lib/auth.module';
import { AuthService } from './auth.service';

@Module({
    imports: [AuthModule.forAuthorizer()],
    controllers: [AuthController],
    providers: [AuthService],
})
export class DMSAuthModule {}
