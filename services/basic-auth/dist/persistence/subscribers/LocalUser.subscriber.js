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
exports.LocalUserSubscriber = void 0;
const typeorm_1 = require("typeorm");
const argon2 = require("argon2");
const LocalUser_entity_1 = require("../entities/LocalUser.entity");
const AuthConfig_1 = require("../../config/AuthConfig");
const inject_config_decorator_1 = require("@dms/config/lib/decorators/inject-config.decorator");
let LocalUserSubscriber = class LocalUserSubscriber {
    constructor(config, dataSource) {
        this.config = config;
        dataSource.subscribers.push(this);
    }
    listenTo() {
        return LocalUser_entity_1.LocalUserEntity;
    }
    async beforeInsert(event) {
        await this.updatePassword(event.entity);
    }
    async beforeUpdate(event) {
        if (event.updatedColumns.some((e) => e.propertyName === 'password'))
            await this.updatePassword(event.entity);
    }
    async updatePassword(entity) {
        entity.password = await argon2.hash(entity.password, {
            hashLength: this.config.passwords.hashLength,
            memoryCost: this.config.passwords.memoryCost,
            parallelism: this.config.passwords.parallelism,
            saltLength: this.config.passwords.saltLength,
            timeCost: this.config.passwords.timeCost,
            type: argon2.argon2id,
        });
        entity.lastPasswordChange = new Date();
        return entity;
    }
};
exports.LocalUserSubscriber = LocalUserSubscriber;
exports.LocalUserSubscriber = LocalUserSubscriber = __decorate([
    (0, typeorm_1.EventSubscriber)(),
    __param(0, (0, inject_config_decorator_1.InjectConfig)(AuthConfig_1.DMSAuthConfig)),
    __metadata("design:paramtypes", [AuthConfig_1.DMSAuthConfig,
        typeorm_1.DataSource])
], LocalUserSubscriber);
//# sourceMappingURL=LocalUser.subscriber.js.map