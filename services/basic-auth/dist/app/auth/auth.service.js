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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const authorizer_service_1 = require("@dms/auth/lib/authorizer.service");
const typeorm_1 = require("@nestjs/typeorm");
const LocalUser_entity_1 = require("../../persistence/entities/LocalUser.entity");
const typeorm_2 = require("typeorm");
let AuthService = class AuthService {
    constructor(auth, userRepository) {
        this.auth = auth;
        this.userRepository = userRepository;
        this.logger = new common_1.Logger('AuthService');
    }
    async authenticate(username, password, res, req) {
        const user = await this.userRepository.findOne({ where: { username }, relations: { groups: true } });
        if (!user)
            throw new common_1.NotFoundException(`User ${username} does not exist in the local user database`);
        if (!user.enabled)
            throw new common_1.ForbiddenException(`User ${username} is not enabled`);
        if (!(await user.verify(password)))
            throw new common_1.ForbiddenException('Wrong password');
        this.logger.log(`User ${username} logged in from ${req.ip}`);
        user.lastLogin = new Date();
        await user.save();
        const raw_features = user.groups.map((e) => e.associated_features).flat();
        const features = new Set(raw_features);
        return await this.auth.issueToken(user.id, user.username, user.superuser, [...features], user.groups.map((e) => e.name), res);
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, typeorm_1.InjectRepository)(LocalUser_entity_1.LocalUserEntity)),
    __metadata("design:paramtypes", [authorizer_service_1.AuthorizerService,
        typeorm_2.Repository])
], AuthService);
//# sourceMappingURL=auth.service.js.map