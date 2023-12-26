import { AuthConfig } from '@dms/auth/lib/config/AuthConfig';
import { PasswordSettings } from './PasswordSettings';
export declare class DMSAuthConfig extends AuthConfig {
    readonly passwords: PasswordSettings;
}
