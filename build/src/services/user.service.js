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
/**
 * User service class for user related operations like authentication, login, register
 */
class UserService {
    /**
     * Represents a User service
     * @constructor
     * @param {none} NA
     * @description Initializes required repositories
     */
    constructor() {
        /**
         * Method to retieve user
         * @param {String} username - Username of the user
         * @returns {User} Object of the user
         */
        this.login = (username) => __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield this.userRepo.findOne({
                    where: {
                        username,
                    },
                });
                return user;
            }
            catch (e) {
                return null;
            }
        });
        /**
         * Method to retieve user by username
         * @param {String} username - Username of the user
         * @returns {User} Object of the user with username and email only
         */
        this.getUser = (username) => __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield this.userRepo.findOne({
                    where: {
                        username,
                    },
                    select: ['username', 'email']
                });
                return user;
            }
            catch (e) {
                return null;
            }
        });
        /**
         * Method to retieve user by id
         * @param {Number} id - ID of the user
         * @returns {User} Object of the user
         */
        this.getUserById = (id) => __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield this.userRepo.findOne({
                    id
                });
                return user;
            }
            catch (e) {
                return null;
            }
        });
        /**
         * Method to create a new user
         * @param {User} user - User object
         * @returns {User} Object of newly created user
         */
        this.register = (user) => __awaiter(this, void 0, void 0, function* () {
            try {
                let usrObj = yield this.userRepo.findOne({
                    where: {
                        username: user.username
                    },
                });
                if (usrObj)
                    return usrObj;
                let res = yield this.userRepo.save({
                    username: user.username,
                    password: user.password,
                    name: user.name,
                    email: user.email
                });
                return res;
            }
            catch (e) {
                return null;
            }
        });
        this.userRepo = (0, typeorm_1.getConnection)('blog').getCustomRepository(user_repository_1.UserRepository);
    }
}
exports.UserService = UserService;
