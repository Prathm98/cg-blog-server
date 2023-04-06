"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const typeorm_1 = require("typeorm");
const user_repository_1 = require("../repository/user.repository");
class UserService {
    constructor() {
        this.getUsers = () => __awaiter(this, void 0, void 0, function* () {
            try {
                const users = yield this.userRepo.find();
                return users;
            }
            catch (error) {
                console.error(error);
                return null;
            }
        });
        this.getUserById = (id) => __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield this.userRepo.findOne(id);
                return user;
            }
            catch (error) {
                console.error(error);
                return null;
            }
        });
        this.createBlog = (user) => __awaiter(this, void 0, void 0, function* () {
            try {
                const res = yield this.userRepo.save(user);
                return res;
            }
            catch (error) {
                console.error(error);
                return null;
            }
        });
        this.userRepo = (0, typeorm_1.getConnection)('blog').getCustomRepository(user_repository_1.UserRepository);
    }
}
exports.UserService = UserService;
