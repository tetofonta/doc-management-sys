import { ConfigLoaderSettings } from '@dms/config/lib/config/ConfigLoaderSettings';
import { WebConfig } from './WebConfig';

export const appConfigSettings = ConfigLoaderSettings.fromObject({
    global_namespace_load: [WebConfig],
    env_var_prefix: 'DMS_BASIC_AUTH_',
});
