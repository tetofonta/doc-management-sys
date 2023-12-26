"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DMSPersistenceModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@dms/config");
const persistence_module_1 = require("@dms/persistence/lib/persistence.module");
const typeorm_1 = require("@nestjs/typeorm");
const PersistenceSettings_1 = require("../config/PersistenceSettings");
const LocalGroup_entity_1 = require("./entities/LocalGroup.entity");
const LocalUser_entity_1 = require("./entities/LocalUser.entity");
const AuthConfig_1 = require("../config/AuthConfig");
const LocalUser_subscriber_1 = require("./subscribers/LocalUser.subscriber");
let DMSPersistenceModule = class DMSPersistenceModule {
};
exports.DMSPersistenceModule = DMSPersistenceModule;
exports.DMSPersistenceModule = DMSPersistenceModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forRootAsync(persistence_module_1.PersistenceModule.typeormConfigs({
                imports: [config_1.ConfigLoaderModule.forFeatures(PersistenceSettings_1.DMSPersistenceSettings)],
                inject: [(0, config_1.getConfigKey)(PersistenceSettings_1.DMSPersistenceSettings)],
                useFactory: (conf) => {
                    return conf.setEntities([LocalGroup_entity_1.LocalGroupEntity, LocalUser_entity_1.LocalUserEntity]);
                },
            })),
            config_1.ConfigLoaderModule.forFeatures(AuthConfig_1.DMSAuthConfig),
        ],
        providers: [LocalUser_subscriber_1.LocalUserSubscriber],
    })
], DMSPersistenceModule);
//# sourceMappingURL=persistence.module.js.map