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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenController = void 0;
const common_1 = require("@nestjs/common");
const feature_inject_decorator_1 = require("@dms/auth/lib/decorators/feature-inject.decorator");
const token_info_feature_1 = require("./features/token-info.feature");
const jwt_guard_1 = require("@dms/auth/lib/guards/jwt.guard");
const feature_require_decorator_1 = require("@dms/auth/lib/decorators/feature-require.decorator");
const features_guard_1 = require("@dms/auth/lib/guards/features.guard");
const token_refresh_feature_1 = require("./features/token-refresh.feature");
let TokenController = class TokenController {
    async getTokenInfo(req, t_info) {
        return await t_info.tokenInfo(req);
    }
    async refreshToken(req, res, t_info) {
        return await t_info.refresh(req, res);
    }
};
exports.TokenController = TokenController;
__decorate([
    (0, common_1.Get)('/'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard, features_guard_1.FeatureGuard),
    (0, feature_require_decorator_1.RequireFeatures)(token_info_feature_1.TokenInfoFeature),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, feature_inject_decorator_1.InjectFeature)(token_info_feature_1.TokenInfoFeature)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, token_info_feature_1.TokenInfoFeature]),
    __metadata("design:returntype", Promise)
], TokenController.prototype, "getTokenInfo", null);
__decorate([
    (0, common_1.Patch)('/'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard, features_guard_1.FeatureGuard),
    (0, feature_require_decorator_1.RequireFeatures)(token_refresh_feature_1.TokenRefreshFeature),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)({ passthrough: true })),
    __param(2, (0, feature_inject_decorator_1.InjectFeature)(token_refresh_feature_1.TokenRefreshFeature)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, token_refresh_feature_1.TokenRefreshFeature]),
    __metadata("design:returntype", Promise)
], TokenController.prototype, "refreshToken", null);
exports.TokenController = TokenController = __decorate([
    (0, common_1.Controller)('/token')
], TokenController);
//# sourceMappingURL=token.controller.js.map