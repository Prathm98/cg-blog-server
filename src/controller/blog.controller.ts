import { Router, Request, Response } from "express";
import { BlogService } from "../services/blog.service";
import { AppResponse } from "../utils/AppResponse";
import { body, validationResult } from 'express-validator';
import { Blog } from "../database/entities/blog.entity";
import { UserService } from "../services/user.service";
import { User } from "../database/entities/user.entity";

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
    	* @apiBody {"title": "String", "description":"String", "content": "String"}
    	* @apiKey Get Blog
    	* @apiDescription Returns all blogs
    	* @apiResponse Array of Blog objects
    	*/
    public index = async (req: Request, res: Response) => {
        try {
            let blogs = await this.blogService.getBlogs();
            res.send(AppResponse(blogs));
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

            let blogObj = new Blog();
            blogObj.title = req.body.title;
            blogObj.description = req.body.description;

            let user = await this.userService.getUserById(1);

            blogObj.user = user as User;

            let blog = await this.blogService.createBlog(blogObj)
            res.send(AppResponse(blog));
        } catch (error) {
            return res.send(AppResponse('Server Error', 500, {}))
        }
    }

      public routes(){
        this.router.get('/', this.index);
        this.router.post('/', [
            body('title').exists().withMessage("Title is required!"),
            body('description').exists().withMessage("Description is required!")
        ], this.create);
      }


}