import { Router, Request, Response } from "express";
import { BlogService } from "../services/blog.service";
import { AppResponse } from "../utils/AppResponse";
import { body, validationResult } from 'express-validator';
import { Blog } from "../database/entities/blog.entity";
import { UserService } from "../services/user.service";
import { User } from "../database/entities/user.entity";
import { auth } from "../middleware/authMiddleware";
import { decodeToken } from "../utils/helpers";

export class BlogController{
    public router: Router;
    private blogService: BlogService;
    private userService: UserService;

    constructor(){
        this.router = Router()
        this.routes()
        this.blogService = new BlogService();
        this.userService = new UserService();
    }

    /**
    	* @apiType GET
    	* @apiPath /api/blog
    	* @apiBody NA
    	* @apiKey Get Blog
    	* @apiDescription Returns all blogs
    	* @apiResponse Array of Blog objects
    	*/
    public index = async (req: Request, res: Response) => {
        try {
            let token = req.headers.authorization;
            let userId = 0;

            if(token) {
                let user = decodeToken(token);
                userId = user.id;
            }
            
            let blogs = await this.blogService.getBlogs(userId);
            res.send(AppResponse(blogs));
        } catch (error) {
            return res.send(AppResponse('Server Error', 500, {}))
        }
    }

    /**
    	* @apiType GET
    	* @apiPath /api/blog/:blog_id
    	* @apiBody NA
    	* @apiKey Get Blog by id
    	* @apiDescription Returns blog for id
    	* @apiResponse Blog object
    	*/
        public getBlog = async (req: Request, res: Response) => {
            try {
                let blog_id = req.params.blog_id;
               
                let blog = await this.blogService.getBlogById(+blog_id);
                let likes = await this.blogService.getLikesByBlogId(+blog_id);
                let comments = await this.blogService.getCommentsByBlogId(+blog_id);
                res.send(AppResponse({blog, likes, comments}));
            } catch (error) {
                return res.send(AppResponse('Server Error', 500, {}))
            }
        }

    /**
    	* @apiType GET
    	* @apiPath /api/blog/:user_id
    	* @apiBody NA
    	* @apiKey Get Blog by user id
    	* @apiDescription Return blogs for user id
    	* @apiResponse Array of Blog objects
    	*/
        public getBlogByUsername = async (req: Request, res: Response) => {
            try {
                let username = req.params.username;
                let user = await this.userService.getUser(username);
                
                if(user){
                    let blogs = await this.blogService.getBlogsByUserId(user.id);
                    res.send(AppResponse({blogs, user}));
                }else
                    res.send(AppResponse("Username not found!", 401, {}));
            } catch (error) {
                return res.send(AppResponse('Server Error', 500, {}))
            }
        }

    /**
    	* @apiType POST
    	* @apiPath /api/blog
    	* @apiBody {"title": "String", "description":"String"}
    	* @apiKey Create Blog
    	* @apiDescription Inserts new blog
    	* @apiResponse Returns Blog object
    	*/
    public create = async (req: Request, res: Response) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.send(AppResponse(null, 400, errors.array()));
            }

            const {id} = req.user;

            let blogObj = new Blog();
            blogObj.title = req.body.title;
            blogObj.description = req.body.description;

            let user = await this.userService.getUserById(id);

            blogObj.user = user as User;

            let blog = await this.blogService.createBlog(blogObj)
            res.send(AppResponse(blog));
        } catch (error) {
            return res.send(AppResponse('Server Error', 500, {}))
        }
    }

    /**
    	* @apiType POST
    	* @apiPath /api/blog/:blog_id/like
    	* @apiBody {"doLike": "Boolean"}
    	* @apiKey Likes/dislikes Blog
    	* @apiDescription Like/dislike blog
    	* @apiResponse Returns boolean result
    	*/
    public blogLike = async (req: Request, res: Response) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.send(AppResponse(null, 400, errors.array()));
            }

            const blog_id = +req.params.blog_id;
            const {id} = req.user;
            const doLike = req.body.doLike;

            let blog = await this.blogService.getBlogById(blog_id);
            let user = await this.userService.getUserById(id);

            if(!blog){
                return res.send(AppResponse('Blog does not exist!', 400, {}))
            }

            if(!user){
                return res.send(AppResponse('Unauthorize request', 400, {}))
            }

            let result;
            if(doLike){
                result = await this.blogService.createLike(blog, user);
            }else{
                result = await this.blogService.removeLike(blog, user);
            }
            // console.log(doLike, result);
            
            res.send(AppResponse("Successful"));
        } catch (error) {
            return res.send(AppResponse('Server Error', 500, {}))
        }
    }

    /**
    	* @apiType POST
    	* @apiPath /api/blog/:blog_id/comment
    	* @apiBody {"message": "String"}
    	* @apiKey Comment Blog
    	* @apiDescription Add comment on the blog
    	* @apiResponse Returns boolean result
    	*/
    public blogComment = async (req: Request, res: Response) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.send(AppResponse(null, 400, errors.array()));
            }

            const blog_id = +req.params.blog_id;
            const {id} = req.user;
            const comment = req.body.message;

            let blog = await this.blogService.getBlogById(blog_id);
            let user = await this.userService.getUserById(id);

            if(!blog){
                return res.send(AppResponse('Blog does not exist!', 400, {}))
            }

            if(!user){
                return res.send(AppResponse('Unauthorize request', 400, {}))
            }

            let result = await this.blogService.createComment(blog, user, comment);
        
            res.send(AppResponse("Successful"));
        } catch (error) {
            return res.send(AppResponse('Server Error', 500, {}))
        }
    }

    public routes(){
        this.router.get('/', this.index);
        this.router.get('/:blog_id', this.getBlog);
        this.router.get('/user/:username', this.getBlogByUsername);
        this.router.post('/', auth, [
            body('title').exists().withMessage("Title is required!"),
            body('description').exists().withMessage("Description is required!")
        ], this.create);
        this.router.post('/:blog_id/like', auth, [
            body('doLike').exists().withMessage("doLike is required!")
        ], this.blogLike);
        this.router.post('/:blog_id/comment', auth, [
            body('message').exists().withMessage("Message is required!")
        ], this.blogComment);
    }


}