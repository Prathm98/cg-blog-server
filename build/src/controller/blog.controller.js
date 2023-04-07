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
exports.BlogController = void 0;
const express_1 = require("express");
const blog_service_1 = require("../services/blog.service");
const AppResponse_1 = require("../utils/AppResponse");
const express_validator_1 = require("express-validator");
const blog_entity_1 = require("../database/entities/blog.entity");
const user_service_1 = require("../services/user.service");
const authMiddleware_1 = require("../middleware/authMiddleware");
class BlogController {
    constructor() {
        /**
            * @apiType GET
            * @apiPath /api/blog
            * @apiBody NA
            * @apiKey Get Blog
            * @apiDescription Returns all blogs
            * @apiResponse Array of Blog objects
            */
        this.index = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                let blogs = yield this.blogService.getBlogs();
                res.send((0, AppResponse_1.AppResponse)(blogs));
            }
            catch (error) {
                return res.send((0, AppResponse_1.AppResponse)('Server Error', 500, {}));
            }
        });
        /**
            * @apiType POST
            * @apiPath /api/blog
            * @apiBody {"title": "String", "description":"String"}
            * @apiKey Create Blog
            * @apiDescription Inserts new blog
            * @apiResponse Returns Blog object
            */
        this.create = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    return res.send((0, AppResponse_1.AppResponse)(null, 400, errors.array()));
                }
                const { id } = req.user;
                let blogObj = new blog_entity_1.Blog();
                blogObj.title = req.body.title;
                blogObj.description = req.body.description;
                let user = yield this.userService.getUserById(id);
                blogObj.user = user;
                let blog = yield this.blogService.createBlog(blogObj);
                res.send((0, AppResponse_1.AppResponse)(blog));
            }
            catch (error) {
                return res.send((0, AppResponse_1.AppResponse)('Server Error', 500, {}));
            }
        });
        this.router = (0, express_1.Router)();
        this.routes();
        this.blogService = new blog_service_1.BlogService();
        this.userService = new user_service_1.UserService();
    }
    routes() {
        this.router.get('/', this.index);
        this.router.post('/', authMiddleware_1.auth, [
            (0, express_validator_1.body)('title').exists().withMessage("Title is required!"),
            (0, express_validator_1.body)('description').exists().withMessage("Description is required!")
        ], this.create);
    }
}
exports.BlogController = BlogController;
