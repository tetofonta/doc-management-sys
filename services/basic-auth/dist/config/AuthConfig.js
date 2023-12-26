"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DMSAuthConfig = void 0;
const config_1 = require("@dms/config");
const AuthConfig_1 = require("@dms/auth/lib/config/AuthConfig");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const PasswordSettings_1 = require("./PasswordSettings");
let DMSAuthConfig = class DMSAuthConfig extends AuthConfig_1.AuthConfig {
};
exports.DMSAuthConfig = DMSAuthConfig;
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => PasswordSettings_1.PasswordSettings),
    __metadata("design:type", PasswordSettings_1.PasswordSettings)
], DMSAuthConfig.prototype, "passwords", void 0);
exports.DMSAuthConfig = DMSAuthConfig = __decorate([
    (0, config_1.LoadConfig)('auth')
], DMSAuthConfig);
//# sourceMappingURL=AuthConfig.js.map