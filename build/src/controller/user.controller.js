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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const express_1 = require("express");
const AppResponse_1 = require("../utils/AppResponse");
const express_validator_1 = require("express-validator");
const user_service_1 = require("../services/user.service");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authMiddleware_1 = require("../middleware/authMiddleware");
class UserController {
    /**
     * @constructor UserController
     * @description Initializes Router and User service
     */
    constructor() {
        /**
            * @apiType POST
            * @apiPath /api/user/login
            * @apiBody {"username": "String", "password":"String"}
            * @apiKey Login
            * @apiDescription Authenticate user
            * @apiResponse Token with validity of 10 days
            */
        this.login = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                return res.send((0, AppResponse_1.AppResponse)(null, 400, errors.array()));
            }
            const { username, password } = req.body;
            try {
                let user = yield this.userService.login(username);
                if (!user) {
                    return res.send((0, AppResponse_1.AppResponse)('Username does not exist!', 400, {}));
                }
                const isMatch = yield bcryptjs_1.default.compare(password, user.password);
                if (!isMatch) {
                    return res.send((0, AppResponse_1.AppResponse)('Invalid Credentials!!!', 400, {}));
                }
                const payload = {
                    user: {
                        id: user.id,
                        username: user.username,
                    },
                };
                let jwt_secret = process.env.JWT_SECRET;
                jsonwebtoken_1.default.sign(payload, jwt_secret, { expiresIn: '10 days' }, (err, token) => {
                    if (err)
                        throw err;
                    return res.send((0, AppResponse_1.AppResponse)({ token }, 200));
                });
            }
            catch (error) {
                console.error(error);
                return res.send((0, AppResponse_1.AppResponse)('Server Error', 500, {}));
            }
        });
        /**
            * @apiType POST
            * @apiPath /api/user/register
            * @apiBody {"username": "String", "password":"String", "email": "String", "name": "String"}
            * @apiKey Register
            * @apiDescription Register a user
            * @apiResponse User object
            */
        this.register = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                return res.send((0, AppResponse_1.AppResponse)(null, 400, errors.array()));
            }
            const { name, email, username, password } = req.body;
            let userObj = {
                name,
                email,
                username,
                password
            };
            try {
                let user = yield this.userService.getUser(username);
                if (user) {
                    return res.send((0, AppResponse_1.AppResponse)('Username already exist!', 401, {}));
                }
                const salt = yield bcryptjs_1.default.genSalt(10);
                userObj.password = yield bcryptjs_1.default.hash(password, salt);
                let resObj = yield this.userService.register(userObj);
                // console.log('resObj', resObj)
                if (!resObj)
                    return res.send((0, AppResponse_1.AppResponse)('Server Error', 500, {}));
                return res.send((0, AppResponse_1.AppResponse)('User registered successfully', 200, {}));
            }
            catch (error) {
                console.error(error);
                return res.send((0, AppResponse_1.AppResponse)('Server Error', 500, {}));
            }
        });
        /**
            * @apiType GET
            * @apiPath /api/user
            * @apiBody NA
            * @apiKey Get User
            * @apiDescription Returns user data for authenticated user
            * @apiResponse User data object
            */
        this.getUser = (req, res) => __awaiter(this, void 0, void 0, function* () {
            if (req.user)
                return res.send((0, AppResponse_1.AppResponse)(req.user, 200, {}));
            return res.send((0, AppResponse_1.AppResponse)(null, 401, {}));
        });
        this.router = (0, express_1.Router)();
        this.routes();
        this.userService = new user_service_1.UserService();
    }
    routes() {
        this.router.post('/login', [
            (0, express_validator_1.body)('username').exists().withMessage('Username is required!'),
            (0, express_validator_1.body)('password').exists().withMessage('Password is required!')
        ], this.login);
        this.router.post('/register', [
            (0, express_validator_1.body)('username').exists().withMessage('Username is required!'),
            (0, express_validator_1.body)('password').exists().withMessage('Password is required!'),
            (0, express_validator_1.body)('name').exists().withMessage('Name is required!'),
            (0, express_validator_1.body)('email').exists().withMessage('Email is required!')
                .isEmail().withMessage('Invalid email, please enter valid email!')
        ], this.register);
        this.router.get('/', authMiddleware_1.auth, this.getUser);
    }
}
exports.UserController = UserController;
