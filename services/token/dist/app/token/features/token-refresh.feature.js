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
exports.TokenRefreshFeature = void 0;
const feature_decorator_1 = require("@dms/auth/lib/decorators/feature.decorator");
const auth_module_1 = require("@dms/auth/lib/auth.module");
const authorizer_service_1 = require("@dms/auth/lib/authorizer.service");
let TokenRefreshFeature = class TokenRefreshFeature {
    constructor(auth) {
        this.auth = auth;
    }
    async refresh(req, res) {
        return await this.auth.refreshToken(req, res);
    }
};
exports.TokenRefreshFeature = TokenRefreshFeature;
exports.TokenRefreshFeature = TokenRefreshFeature = __decorate([
    (0, feature_decorator_1.Feature)('token:refresh', { imports: [auth_module_1.AuthModule.forAuthorizer()] }),
    __metadata("design:paramtypes", [authorizer_service_1.AuthorizerService])
], TokenRefreshFeature);
//# sourceMappingURL=token-refresh.feature.js.map