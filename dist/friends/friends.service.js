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
exports.FriendsService = void 0;
const common_1 = require("@nestjs/common");
const users_service_1 = require("../users/users.service");
const friend_entity_1 = require("./friend.entity");
const typeorm_1 = require("@nestjs/typeorm");
const relation_repository_1 = require("./relation.repository");
const class_validator_1 = require("class-validator");
let FriendsService = class FriendsService {
    constructor(userService, relationRepo) {
        this.userService = userService;
        this.relationRepo = relationRepo;
    }
    async createFriendRelation(createRelation) {
        const newFriend = new friend_entity_1.Friend();
        newFriend.user = await this.userService.getUserById(createRelation.SecondUser.id);
        console.log(`returned data ${newFriend}`);
        const relationExist = this.relationRepo.findOne({
            where: {},
        });
        if (relationExist)
            return relationExist;
        const errors = await (0, class_validator_1.validate)(relationExist);
        if (errors.length > 0) {
            throw new Error(`Validation failed!`);
        }
    }
    async createFriend(createRelation, user) {
        const newFriend = await this.relationRepo.create(Object.assign(Object.assign({}, createRelation), { user: user }));
        await this.relationRepo.save(newFriend);
        return newFriend;
    }
};
FriendsService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, typeorm_1.InjectRepository)(relation_repository_1.relationRepository)),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        relation_repository_1.relationRepository])
], FriendsService);
exports.FriendsService = FriendsService;
//# sourceMappingURL=friends.service.js.map