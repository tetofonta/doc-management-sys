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
exports.PasswordSettings = void 0;
const class_validator_1 = require("class-validator");
class PasswordSettings {
    constructor() {
        this.hashLength = 32;
        this.memoryCost = 1024;
        this.parallelism = 8;
        this.saltLength = 16;
        this.timeCost = 20;
        this.createUser = true;
        this.createGroup = true;
        this.userGroupName = 'user';
        this.adminUserName = 'admin';
        this.defaultGroupFeatures = ['auth:self', 'token:info'];
    }
}
exports.PasswordSettings = PasswordSettings;
__decorate([
    (0, class_validator_1.IsDefined)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], PasswordSettings.prototype, "hashLength", void 0);
__decorate([
    (0, class_validator_1.IsDefined)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], PasswordSettings.prototype, "memoryCost", void 0);
__decorate([
    (0, class_validator_1.IsDefined)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], PasswordSettings.prototype, "parallelism", void 0);
__decorate([
    (0, class_validator_1.IsDefined)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], PasswordSettings.prototype, "saltLength", void 0);
__decorate([
    (0, class_validator_1.IsDefined)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], PasswordSettings.prototype, "timeCost", void 0);
__decorate([
    (0, class_validator_1.IsDefined)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], PasswordSettings.prototype, "createUser", void 0);
__decorate([
    (0, class_validator_1.IsDefined)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], PasswordSettings.prototype, "createGroup", void 0);
__decorate([
    (0, class_validator_1.IsDefined)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PasswordSettings.prototype, "userGroupName", void 0);
__decorate([
    (0, class_validator_1.IsDefined)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PasswordSettings.prototype, "adminUserName", void 0);
__decorate([
    (0, class_validator_1.IsDefined)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], PasswordSettings.prototype, "defaultGroupFeatures", void 0);
//# sourceMappingURL=PasswordSettings.js.map