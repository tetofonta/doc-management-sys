import { ConfigLoaderSettings } from '@dms/config/lib/config/ConfigLoaderSettings';
import { AppWebConfig } from './WebConfig';

export const appConfigSettings = ConfigLoaderSettings.fromObject({
    global_namespace_load: [AppWebConfig],
    env_var_prefix: 'DMS_BASIC_AUTH_',
});
