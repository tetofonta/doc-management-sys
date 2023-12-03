"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DMSPersistenceSettings = void 0;
const config_1 = require("@dms/config");
const PersistenceConfig_1 = require("@dms/persistence/lib/config/PersistenceConfig");
let DMSPersistenceSettings = class DMSPersistenceSettings extends PersistenceConfig_1.PersistenceConfig {
};
exports.DMSPersistenceSettings = DMSPersistenceSettings;
exports.DMSPersistenceSettings = DMSPersistenceSettings = __decorate([
    (0, config_1.LoadConfig)('database')
], DMSPersistenceSettings);
//# sourceMappingURL=PersistenceSettings.js.map