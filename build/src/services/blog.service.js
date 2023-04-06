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
const blog_repository_1 = require("../repository/blog.repository");
class BlogService {
    constructor() {
        this.getBlogs = () => __awaiter(this, void 0, void 0, function* () {
            try {
                const blogs = yield this.blogRepo.find({
                    relations: ['user'],
                    select: ['user', 'title']
                });
                return blogs;
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
        this.blogRepo = (0, typeorm_1.getConnection)('blog').getCustomRepository(blog_repository_1.BlogRepository);
    }
}
exports.BlogService = BlogService;
