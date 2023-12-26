import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthModule } from '@dms/auth/lib/auth.module';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LocalUserEntity } from '../../persistence/entities/LocalUser.entity';

@Module({
    imports: [AuthModule.forAuthorizer(), TypeOrmModule.forFeature([LocalUserEntity])],
    controllers: [AuthController],
    providers: [AuthService],
})
export class DMSAuthModule {}
