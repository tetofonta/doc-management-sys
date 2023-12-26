import { LoadConfig } from '@dms/config';
import { AuthConfig } from '@dms/auth/lib/config/AuthConfig';
import { IsNotEmpty, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { PasswordSettings } from './PasswordSettings';

@LoadConfig('auth')
export class DMSAuthConfig extends AuthConfig {
    @IsNotEmpty()
    @ValidateNested()
    @Type(() => PasswordSettings)
    readonly passwords: PasswordSettings;
}
