"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_loader_module_1 = require("@dms/config/lib/config-loader.module");
const AppConfigSettings_1 = require("../config/AppConfigSettings");
const AuthConfig_1 = require("../config/AuthConfig");
const config_1 = require("@dms/config");
const auth_module_1 = require("@dms/auth/lib/auth.module");
const token_module_1 = require("./token/token.module");
const well_known_controller_1 = require("./well-known.controller");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_loader_module_1.ConfigLoaderModule.forRoot(AppConfigSettings_1.appConfigSettings),
            auth_module_1.AuthModule.forRootAsync({
                imports: [config_loader_module_1.ConfigLoaderModule.forFeatures(AuthConfig_1.DMSAuthConfig)],
                inject: [(0, config_1.getConfigKey)(AuthConfig_1.DMSAuthConfig)],
                useFactory: (conf) => conf,
            }),
            token_module_1.TokenModule,
        ],
        controllers: [well_known_controller_1.WellKnownController],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map