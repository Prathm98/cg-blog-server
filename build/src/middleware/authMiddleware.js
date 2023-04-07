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
exports.auth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const AppResponse_1 = require("../utils/AppResponse");
const auth = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let token;
    if (req.headers.authorization) {
        try {
            token = req.headers.authorization;
            let jwt_secret = process.env.JWT_SECRET;
            const decoded = jsonwebtoken_1.default.verify(token, jwt_secret);
            req.user = Object.assign({}, decoded.user);
            next();
        }
        catch (error) {
            console.error(error);
            res.status(401);
            //   throw new Error('Not authorized, token failed')
            return res.send((0, AppResponse_1.AppResponse)('Not authorized, token failed', 400, {}));
        }
    }
    else {
        if (!token) {
            res.status(401);
            //   throw new Error('Not authorized, no token')
            return res.send((0, AppResponse_1.AppResponse)('Not authorized, no token', 401, {}));
        }
        next();
    }
});
exports.auth = auth;
