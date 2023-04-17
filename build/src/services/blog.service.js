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
/**
 * Blog service class for all blogs related operations
 */
class BlogService {
    /**
     * Represents a Blog service
     * @constructor
     * @param {none} NA
     * @description Initializes required repositories
     */
    constructor() {
        /**
         * Method to get all blogs
         * @param {Number} userId - optional parameter if passed then return like status for user
         * @returns {Blog[]} Array of blogs
         */
        this.getBlogs = (userId = 0) => __awaiter(this, void 0, void 0, function* () {
            try {
                const blogs = yield (0, typeorm_1.getConnection)('blog').manager.query(`
                select r.*, u.username, count(l.id) as likes FROM 
                    (SELECT b.*, count(c.id) as comments, 
                        (SELECT COUNT(*) FROM cg_blog.likes where userId=${userId} AND blogId=b.id) as isLiked
                        FROM cg_blog.blogs as b LEFT JOIN cg_blog.comments as c on b.id = c.blogId
                    group by b.id) as r
                    LEFT JOIN cg_blog.likes as l on r.id = l.blogId
                    LEFT JOIN cg_blog.users as u on r.userId = u.id
                    group by (r.id) order by r.created desc;`);
                // const blogs = await this.blogRepo.find({
                //     relations: ['user', 'comments', 'likes'],
                //     select: ['user', 'title']
                // });
                return blogs;
            }
            catch (error) {
                console.error(error);
                return null;
            }
        });
        /**
         * Method to get all blogs for particular user
         * @param {Number} userId - User id for which wants to retieve blogs
         * @returns {Blog[]} Array of blogs for the user
         */
        this.getBlogsByUserId = (userId, currentUser) => __awaiter(this, void 0, void 0, function* () {
            try {
                const blogs = yield (0, typeorm_1.getConnection)('blog').manager.query(`
                select r.*, count(l.id) as likes FROM 
                    (SELECT b.*, count(c.id) as comments, 
                        (SELECT COUNT(*) FROM cg_blog.likes where userId=${currentUser} AND blogId=b.id) as isLiked
                        FROM cg_blog.blogs as b LEFT JOIN cg_blog.comments as c on b.id = c.blogId
                        WHERE b.userId=${userId}
                    group by b.id) as r
                    LEFT JOIN cg_blog.likes as l on r.id = l.blogId
                    group by (r.id) order by r.created desc;`);
                return blogs;
            }
            catch (error) {
                console.error(error);
                return null;
            }
        });
        /**
         * Method to get single blog by ID
         * @param {Number} blog_id - Blog ID
         * @returns {Blog} Object of blog
         */
        this.getBlogById = (blog_id) => __awaiter(this, void 0, void 0, function* () {
            try {
                const blog = yield this.blogRepo.findOne({
                    where: { id: blog_id },
                    relations: ['user']
                });
                return blog;
            }
            catch (error) {
                console.error(error);
                return null;
            }
        });
        /**
         * Method to get Likes by blog ID
         * @param {Number} blog_id - Blog ID
         * @returns {Like[]} Array of like objects
         */
        this.getLikesByBlogId = (blog_id) => __awaiter(this, void 0, void 0, function* () {
            try {
                const blog = yield (0, typeorm_1.getConnection)('blog').manager.query(`SELECT
                    l.created, u.username
                FROM likes l LEFT JOIN users u on u.id = l.userId
                where l.blogId=${blog_id}`);
                return blog;
            }
            catch (error) {
                console.error(error);
                return null;
            }
        });
        /**
         * Method to get comments by blog ID
         * @param {Number} blog_id - Blog ID
         * @returns {Comment[]} Array of comment objects
         */
        this.getCommentsByBlogId = (blog_id) => __awaiter(this, void 0, void 0, function* () {
            try {
                const blog = yield (0, typeorm_1.getConnection)('blog').manager.query(`SELECT
                    c.created, u.username, c.comment
                FROM comments c LEFT JOIN users u on u.id = c.userId
                where c.blogId=${blog_id}  order by c.created desc`);
                return blog;
            }
            catch (error) {
                console.error(error);
                return null;
            }
        });
        /**
         * Method to create new blog
         * @param {Blog} blog - Blog object
         * @returns {Blog} Object of newly created blog
         */
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
        /**
         * Method to add like to blog
         * @param {Blog} blog - Blog Object
         * @param {User} user - User Object
         * @returns {Like} Object of newly created Like
         */
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
        /**
         * Method to remove like from blog
         * @param {Blog} blog - Blog Object
         * @param {User} user - User Object
         * @returns {Object} Object of delete operation result
         */
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
        /**
         * Method to add comment to blog
         * @param {Blog} blog - Blog Object
         * @param {User} user - User Object
         * @param {String} comment - Comment string
         * @returns {Comment} Object of newly created comment
         */
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
