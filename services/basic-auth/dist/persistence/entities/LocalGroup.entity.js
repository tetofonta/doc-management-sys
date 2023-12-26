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
exports.LocalGroupEntity = void 0;
const BaseEntity_1 = require("@dms/persistence/lib/overload/BaseEntity");
const typeorm_1 = require("typeorm");
const LocalUser_entity_1 = require("./LocalUser.entity");
const class_transformer_1 = require("class-transformer");
let LocalGroupEntity = class LocalGroupEntity extends BaseEntity_1.BaseEntity {
    get userCount() {
        return this.users.length;
    }
};
exports.LocalGroupEntity = LocalGroupEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], LocalGroupEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true }),
    __metadata("design:type", String)
], LocalGroupEntity.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ array: true, type: 'text' }),
    __metadata("design:type", Array)
], LocalGroupEntity.prototype, "associated_features", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => LocalUser_entity_1.LocalUserEntity, (u) => u.groups),
    __metadata("design:type", Array)
], LocalGroupEntity.prototype, "users", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Number),
    __metadata("design:paramtypes", [])
], LocalGroupEntity.prototype, "userCount", null);
exports.LocalGroupEntity = LocalGroupEntity = __decorate([
    (0, typeorm_1.Entity)()
], LocalGroupEntity);
//# sourceMappingURL=LocalGroup.entity.js.map