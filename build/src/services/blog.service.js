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
exports.BlogService = void 0;
const typeorm_1 = require("typeorm");
const comments_entity_1 = require("../database/entities/comments.entity");
const likes_entity_1 = require("../database/entities/likes.entity");
const blog_repository_1 = require("../repository/blog.repository");
const comments_repository_1 = require("../repository/comments.repository");
const likes_repository_1 = require("../repository/likes.repository");
class BlogService {
    constructor() {
        this.getBlogs = () => __awaiter(this, void 0, void 0, function* () {
            try {
                const blogs = yield this.blogRepo.find({
                    relations: ['user', 'comments', 'likes'],
                    select: ['user', 'title']
                });
                return blogs;
            }
            catch (error) {
                console.error(error);
                return null;
            }
        });
        this.getBlogById = (blog_id) => __awaiter(this, void 0, void 0, function* () {
            try {
                const blog = yield this.blogRepo.findOne({ id: blog_id });
                return blog;
            }
            catch (error) {
                console.error(error);
                return null;
            }
        });
        this.createBlog = (blog) => __awaiter(this, void 0, void 0, function* () {
            try {
                const res = yield this.blogRepo.save(blog);
                return res;
            }
            catch (error) {
                console.error(error);
                return null;
            }
        });
        this.createLike = (blog, user) => __awaiter(this, void 0, void 0, function* () {
            try {
                let like = yield this.likesRepo.findOne({
                    where: {
                        user: user,
                        blog: blog
                    }
                });
                if (like)
                    return like;
                const likeObj = new likes_entity_1.Like();
                likeObj.user = user;
                likeObj.blog = blog;
                const res = yield this.likesRepo.save(likeObj);
                return res;
            }
            catch (error) {
                console.error(error);
                return null;
            }
        });
        this.removeLike = (blog, user) => __awaiter(this, void 0, void 0, function* () {
            try {
                let like = yield this.likesRepo.delete({
                    user: user,
                    blog: blog
                });
                return like;
            }
            catch (error) {
                console.error(error);
                return null;
            }
        });
        this.createComment = (blog, user, comment) => __awaiter(this, void 0, void 0, function* () {
            try {
                const commentObj = new comments_entity_1.Comment();
                commentObj.user = user;
                commentObj.blog = blog;
                commentObj.comment = comment;
                const res = yield this.commentsRepo.save(commentObj);
                return res;
            }
            catch (error) {
                console.error(error);
                return null;
            }
        });
        this.blogRepo = (0, typeorm_1.getConnection)('blog').getCustomRepository(blog_repository_1.BlogRepository);
        this.likesRepo = (0, typeorm_1.getConnection)('blog').getCustomRepository(likes_repository_1.LikesRepository);
        this.commentsRepo = (0, typeorm_1.getConnection)('blog').getCustomRepository(comments_repository_1.CommentsRepository);
    }
}
exports.BlogService = BlogService;
