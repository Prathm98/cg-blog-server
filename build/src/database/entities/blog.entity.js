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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Blog = void 0;
const typeorm_1 = require("typeorm");
const comments_entity_1 = require("./comments.entity");
const likes_entity_1 = require("./likes.entity");
const user_entity_1 = require("./user.entity");
let Blog = class Blog {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Blog.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Blog.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Blog.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ nullable: true }),
    __metadata("design:type", Date)
], Blog.prototype, "created", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, (user) => user.blogs),
    __metadata("design:type", user_entity_1.User)
], Blog.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => likes_entity_1.Like, (like) => like.blog),
    __metadata("design:type", Array)
], Blog.prototype, "likes", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => comments_entity_1.Comment, (comment) => comment.blog),
    __metadata("design:type", comments_entity_1.Comment)
], Blog.prototype, "comments", void 0);
Blog = __decorate([
    (0, typeorm_1.Entity)('blogs')
], Blog);
exports.Blog = Blog;
