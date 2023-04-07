import { getConnection } from "typeorm";
import { Blog } from "../database/entities/blog.entity";
import { Comment } from "../database/entities/comments.entity";
import { Like } from "../database/entities/likes.entity";
import { User } from "../database/entities/user.entity";
import { BlogRepository } from "../repository/blog.repository";
import { CommentsRepository } from "../repository/comments.repository";
import { LikesRepository } from "../repository/likes.repository";

export class BlogService {
    private blogRepo: BlogRepository;
    private likesRepo: LikesRepository;
    private commentsRepo: CommentsRepository;

    constructor(){
        this.blogRepo =  getConnection('blog').getCustomRepository(BlogRepository);
        this.likesRepo =  getConnection('blog').getCustomRepository(LikesRepository);
        this.commentsRepo =  getConnection('blog').getCustomRepository(CommentsRepository);
    }

    public getBlogs = async () => {
        try {
            const blogs = await this.blogRepo.find({
                relations: ['user', 'comments', 'likes'],
                select: ['user', 'title']
            });

            return blogs;
        } catch (error) {
            console.error(error)
            return null;
        }      
    }

    public getBlogById = async (blog_id: number) => {
        try {
            const blog = await this.blogRepo.findOne({id: blog_id});
            return blog;
        } catch (error) {
            console.error(error)
            return null;
        }      
    }

    public createBlog = async (blog: Blog) => {
        try {
            const res = await this.blogRepo.save(blog);
            return res;
        } catch (error) {
            console.error(error)
            return null;
        }
    }
    
    public createLike = async (blog: Blog, user: User) => {
        try {
            let like = await this.likesRepo.findOne({
                where:{
                    user: user,
                    blog: blog
                }
            })

            if(like) return like;

            const likeObj = new Like();
            likeObj.user = user;
            likeObj.blog = blog as Blog;

            const res = await this.likesRepo.save(likeObj);
            return res;
        } catch (error) {
            console.error(error)
            return null;
        }
    }

    public removeLike = async (blog: Blog, user: User) => {
        try {
            let like = await this.likesRepo.delete({
                    user: user,
                    blog: blog
                })

            return like;
        } catch (error) {
            console.error(error)
            return null;
        }
    }

    public createComment = async (blog: Blog, user: User, comment: String) => {
        try {
            const commentObj = new Comment();
            commentObj.user = user;
            commentObj.blog = blog as Blog;
            commentObj.comment = comment;

            const res = await this.commentsRepo.save(commentObj);
            return res;
        } catch (error) {
            console.error(error)
            return null;
        }
    }
}