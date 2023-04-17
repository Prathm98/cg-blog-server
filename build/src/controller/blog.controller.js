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
const helpers_1 = require("../utils/helpers");
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
                let token = req.headers.authorization;
                let userId = 0;
                if (token) {
                    let user = (0, helpers_1.decodeToken)(token);
                    userId = user.id;
                }
                let blogs = yield this.blogService.getBlogs(userId);
                res.send((0, AppResponse_1.AppResponse)(blogs));
            }
            catch (error) {
                return res.send((0, AppResponse_1.AppResponse)('Server Error', 500, {}));
            }
        });
        /**
            * @apiType GET
            * @apiPath /api/blog/:blog_id
            * @apiBody NA
            * @apiKey Get Blog by id
            * @apiDescription Returns blog for id
            * @apiResponse Blog object
            */
        this.getBlog = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                let blog_id = req.params.blog_id;
                let blog = yield this.blogService.getBlogById(+blog_id);
                let likes = yield this.blogService.getLikesByBlogId(+blog_id);
                let comments = yield this.blogService.getCommentsByBlogId(+blog_id);
                res.send((0, AppResponse_1.AppResponse)({ blog, likes, comments }));
            }
            catch (error) {
                return res.send((0, AppResponse_1.AppResponse)('Server Error', 500, {}));
            }
        });
        /**
            * @apiType GET
            * @apiPath /api/blog/:user_id
            * @apiBody NA
            * @apiKey Get Blog by user id
            * @apiDescription Return blogs for user id
            * @apiResponse Array of Blog objects
            */
        this.getBlogByUsername = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                let username = req.params.username;
                let user = yield this.userService.getUser(username);
                // Check if user logged in
                let token = req.headers.authorization;
                let userId = 0;
                if (token) {
                    let user = (0, helpers_1.decodeToken)(token);
                    userId = user.id;
                }
                if (user) {
                    let blogs = yield this.blogService.getBlogsByUserId(user.id, userId);
                    res.send((0, AppResponse_1.AppResponse)({ blogs, user }));
                }
                else
                    res.send((0, AppResponse_1.AppResponse)("Username not found!", 401, {}));
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
        /**
            * @apiType POST
            * @apiPath /api/blog/:blog_id/like
            * @apiBody {"doLike": "Boolean"}
            * @apiKey Likes/dislikes Blog
            * @apiDescription Like/dislike blog
            * @apiResponse Returns boolean result
            */
        this.blogLike = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    return res.send((0, AppResponse_1.AppResponse)(null, 400, errors.array()));
                }
                const blog_id = +req.params.blog_id;
                const { id } = req.user;
                const doLike = req.body.doLike;
                let blog = yield this.blogService.getBlogById(blog_id);
                let user = yield this.userService.getUserById(id);
                if (!blog) {
                    return res.send((0, AppResponse_1.AppResponse)('Blog does not exist!', 400, {}));
                }
                if (!user) {
                    return res.send((0, AppResponse_1.AppResponse)('Unauthorize request', 400, {}));
                }
                let result;
                if (doLike) {
                    result = yield this.blogService.createLike(blog, user);
                }
                else {
                    result = yield this.blogService.removeLike(blog, user);
                }
                // console.log(doLike, result);
                res.send((0, AppResponse_1.AppResponse)("Successful"));
            }
            catch (error) {
                return res.send((0, AppResponse_1.AppResponse)('Server Error', 500, {}));
            }
        });
        /**
            * @apiType POST
            * @apiPath /api/blog/:blog_id/comment
            * @apiBody {"message": "String"}
            * @apiKey Comment Blog
            * @apiDescription Add comment on the blog
            * @apiResponse Returns boolean result
            */
        this.blogComment = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    return res.send((0, AppResponse_1.AppResponse)(null, 400, errors.array()));
                }
                const blog_id = +req.params.blog_id;
                const { id } = req.user;
                const comment = req.body.message;
                let blog = yield this.blogService.getBlogById(blog_id);
                let user = yield this.userService.getUserById(id);
                if (!blog) {
                    return res.send((0, AppResponse_1.AppResponse)('Blog does not exist!', 400, {}));
                }
                if (!user) {
                    return res.send((0, AppResponse_1.AppResponse)('Unauthorize request', 400, {}));
                }
                let result = yield this.blogService.createComment(blog, user, comment);
                res.send((0, AppResponse_1.AppResponse)("Successful"));
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
        this.router.get('/:blog_id', this.getBlog);
        this.router.get('/user/:username', this.getBlogByUsername);
        this.router.post('/', authMiddleware_1.auth, [
            (0, express_validator_1.body)('title').exists().withMessage("Title is required!"),
            (0, express_validator_1.body)('description').exists().withMessage("Description is required!")
        ], this.create);
        this.router.post('/:blog_id/like', authMiddleware_1.auth, [
            (0, express_validator_1.body)('doLike').exists().withMessage("doLike is required!")
        ], this.blogLike);
        this.router.post('/:blog_id/comment', authMiddleware_1.auth, [
            (0, express_validator_1.body)('message').exists().withMessage("Message is required!")
        ], this.blogComment);
    }
}
exports.BlogController = BlogController;
