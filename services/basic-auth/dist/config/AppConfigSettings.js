"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.appConfigSettings = void 0;
const ConfigLoaderSettings_1 = require("@dms/config/lib/config/ConfigLoaderSettings");
const WebConfig_1 = require("./WebConfig");
exports.appConfigSettings = ConfigLoaderSettings_1.ConfigLoaderSettings.fromObject({
    global_namespace_load: [WebConfig_1.WebConfig],
    env_var_prefix: 'DMS_BASIC_AUTH_',
});
//# sourceMappingURL=AppConfigSettings.js.map