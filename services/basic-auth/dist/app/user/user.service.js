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
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const LocalUser_entity_1 = require("../../persistence/entities/LocalUser.entity");
const typeorm_2 = require("typeorm");
const LocalGroup_entity_1 = require("../../persistence/entities/LocalGroup.entity");
const inject_config_decorator_1 = require("@dms/config/lib/decorators/inject-config.decorator");
const AuthConfig_1 = require("../../config/AuthConfig");
let UserService = class UserService {
    constructor(userRepository, groupRepository, config) {
        this.userRepository = userRepository;
        this.groupRepository = groupRepository;
        this.config = config;
        this.logger = new common_1.Logger('UserService');
        this.init().then();
    }
    async init() {
        if (!this.config.passwords.createUser)
            return;
        let group = await this.groupRepository.findOneBy({ name: this.config.passwords.userGroupName });
        if (!group) {
            if (!this.config.passwords.createGroup)
                this.logger.error('Cannot retrieve default user group.');
            else {
                group = this.groupRepository.create({
                    name: this.config.passwords.userGroupName,
                    associated_features: this.config.passwords.defaultGroupFeatures,
                });
                await group.save();
                await group.reload();
                this.logger.log(`Created group ${group.name} with features ${group.associated_features.join(', ')}`);
            }
        }
        const user = await this.userRepository.findOneBy({ username: this.config.passwords.adminUserName });
        if (!user) {
            const password = Math.random().toString(26).substring(2);
            await this.userRepository
                .create({
                username: this.config.passwords.adminUserName,
                password,
                enabled: true,
                superuser: true,
                groups: [group].filter((e) => !!e),
                forceChange: false,
            })
                .save();
            this.logger.log(`Created user ${this.config.passwords.adminUserName} with password ${password}`);
        }
    }
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(LocalUser_entity_1.LocalUserEntity)),
    __param(1, (0, typeorm_1.InjectRepository)(LocalGroup_entity_1.LocalGroupEntity)),
    __param(2, (0, inject_config_decorator_1.InjectConfig)(AuthConfig_1.DMSAuthConfig)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        AuthConfig_1.DMSAuthConfig])
], UserService);
//# sourceMappingURL=user.service.js.map