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
exports.LocalUserEntity = void 0;
const BaseEntity_1 = require("@dms/persistence/lib/overload/BaseEntity");
const typeorm_1 = require("typeorm");
const LocalGroup_entity_1 = require("./LocalGroup.entity");
const class_transformer_1 = require("class-transformer");
const argon2 = require("argon2");
let LocalUserEntity = class LocalUserEntity extends BaseEntity_1.BaseEntity {
    async verify(password) {
        if (!this.enabled)
            return false;
        try {
            return await argon2.verify(this.password, password);
        }
        catch (e) {
            return false;
        }
    }
};
exports.LocalUserEntity = LocalUserEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], LocalUserEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true }),
    __metadata("design:type", String)
], LocalUserEntity.prototype, "username", void 0);
__decorate([
    (0, class_transformer_1.Exclude)(),
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], LocalUserEntity.prototype, "password", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], LocalUserEntity.prototype, "superuser", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], LocalUserEntity.prototype, "enabled", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => LocalGroup_entity_1.LocalGroupEntity, (g) => g.users),
    (0, typeorm_1.JoinTable)(),
    (0, class_transformer_1.Transform)((p) => p.value?.map((e) => ({ id: e.id, name: e.name }))),
    __metadata("design:type", Array)
], LocalUserEntity.prototype, "groups", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], LocalUserEntity.prototype, "lastLogin", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], LocalUserEntity.prototype, "lastPasswordChange", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], LocalUserEntity.prototype, "forceChange", void 0);
exports.LocalUserEntity = LocalUserEntity = __decorate([
    (0, typeorm_1.Entity)()
], LocalUserEntity);
//# sourceMappingURL=LocalUser.entity.js.map