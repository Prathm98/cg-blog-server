import { getConnection } from "typeorm";
import { Blog } from "../database/entities/blog.entity";
import { Comment } from "../database/entities/comments.entity";
import { Like } from "../database/entities/likes.entity";
import { User } from "../database/entities/user.entity";
import { BlogRepository } from "../repository/blog.repository";
import { CommentsRepository } from "../repository/comments.repository";
import { LikesRepository } from "../repository/likes.repository";

/**
 * Blog service class for all blogs related operations
 */
export class BlogService {
    private blogRepo: BlogRepository;
    private likesRepo: LikesRepository;
    private commentsRepo: CommentsRepository;

    /**
     * Represents a Blog service
     * @constructor
     * @param {none} NA
     * @description Initializes required repositories
     */
    constructor(){
        this.blogRepo =  getConnection('blog').getCustomRepository(BlogRepository);
        this.likesRepo =  getConnection('blog').getCustomRepository(LikesRepository);
        this.commentsRepo =  getConnection('blog').getCustomRepository(CommentsRepository);
    }

    /**
     * Method to get all blogs
     * @param {Number} userId - optional parameter if passed then return like status for user 
     * @returns {Blog[]} Array of blogs
     */
    public getBlogs = async (userId = 0) => {
        try {
            const blogs = await getConnection('blog').manager.query(`
                select r.*, count(l.id) as likes FROM 
                    (SELECT b.*, count(c.id) as comments, 
                        (SELECT COUNT(*) FROM cg_blog.likes where userId=${userId} AND blogId=b.id) as isLiked
                        FROM cg_blog.blogs as b LEFT JOIN cg_blog.comments as c on b.id = c.blogId
                    group by b.id) as r
                    LEFT JOIN cg_blog.likes as l on r.id = l.blogId
                    group by (r.id);`);

            // const blogs = await this.blogRepo.find({
            //     relations: ['user', 'comments', 'likes'],
            //     select: ['user', 'title']
            // });

            return blogs;
        } catch (error) {
            console.error(error)
            return null;
        }      
    }

    /**
     * Method to get all blogs for particular user
     * @param {Number} userId - User id for which wants to retieve blogs 
     * @returns {Blog[]} Array of blogs for the user
     */
    public getBlogsByUserId = async (userId: Number) => {
        try {
            const blogs = await getConnection('blog').manager.query(`
                select r.*, count(l.id) as likes FROM 
                    (SELECT b.*, count(c.id) as comments, 
                        (SELECT COUNT(*) FROM cg_blog.likes where userId=${userId} AND blogId=b.id) as isLiked
                        FROM cg_blog.blogs as b LEFT JOIN cg_blog.comments as c on b.id = c.blogId
                        WHERE b.userId=${userId}
                    group by b.id) as r
                    LEFT JOIN cg_blog.likes as l on r.id = l.blogId
                    group by (r.id);`);

            return blogs;
        } catch (error) {
            console.error(error)
            return null;
        }      
    }

    /**
     * Method to get single blog by ID
     * @param {Number} blog_id - Blog ID 
     * @returns {Blog} Object of blog
     */
    public getBlogById = async (blog_id: number) => {
        try {
            const blog = await this.blogRepo.findOne({id: blog_id});
            return blog;
        } catch (error) {
            console.error(error)
            return null;
        }      
    }

    /**
     * Method to create new blog
     * @param {Blog} blog - Blog object 
     * @returns {Blog} Object of newly created blog
     */
    public createBlog = async (blog: Blog) => {
        try {
            const res = await this.blogRepo.save(blog);
            return res;
        } catch (error) {
            console.error(error)
            return null;
        }
    }
    
    /**
     * Method to add like to blog
     * @param {Blog} blog - Blog Object 
     * @param {User} user - User Object 
     * @returns {Like} Object of newly created Like
     */
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

    /**
     * Method to remove like from blog
     * @param {Blog} blog - Blog Object 
     * @param {User} user - User Object 
     * @returns {Object} Object of delete operation result
     */
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

    /**
     * Method to add comment to blog
     * @param {Blog} blog - Blog Object 
     * @param {User} user - User Object 
     * @param {String} comment - Comment string 
     * @returns {Comment} Object of newly created comment
     */
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