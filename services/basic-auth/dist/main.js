"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app/app.module");
const loglevel_1 = require("./loglevel");
const WebConfig_1 = require("./config/WebConfig");
const path = require("path");
const common_1 = require("@nestjs/common");
const config_1 = require("@dms/config");
(async function () {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, {
        logger: (0, loglevel_1.getLogLevels)(process.env['DMS_LOG_LEVEL'] || 'INFO'),
    });
    const generalConfigs = app.get((0, config_1.getConfigKey)(WebConfig_1.WebConfig));
    app.setGlobalPrefix(path.join(generalConfigs.basePath, 'api'));
    app.useGlobalPipes(new common_1.ValidationPipe({ transform: true }));
    app.useGlobalInterceptors(new common_1.ClassSerializerInterceptor(app.get(core_1.Reflector)));
    await app.listen(generalConfigs.port, '0.0.0.0');
})();
//# sourceMappingURL=main.js.map