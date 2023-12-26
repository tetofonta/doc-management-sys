import { LoadConfig } from '@dms/config';
import { AuthConfig } from '@dms/auth/lib/config/AuthConfig';

@LoadConfig('auth')
export class DMSAuthConfig extends AuthConfig {}
