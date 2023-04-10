import { Router, Request, Response } from "express";
import { AppResponse } from "../utils/AppResponse";
import { body, validationResult } from 'express-validator';
import { UserService } from "../services/user.service";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken'
import { auth } from "../middleware/authMiddleware";

export class UserController{
    // Variable declaration for Router and User service
    public router: Router;
    private userService: UserService;

    /**
     * @constructor UserController
     * @description Initializes Router and User service
     */
    constructor(){
        this.router = Router()
        this.routes()
        this.userService = new UserService();
    }

    /**
    	* @apiType POST
    	* @apiPath /api/user/login
    	* @apiBody {"username": "String", "password":"String"}
    	* @apiKey Login
    	* @apiDescription Authenticate user
    	* @apiResponse Token with validity of 10 days
    	*/
    public login = async (req: Request, res: Response) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.send(AppResponse(null, 400, errors.array()));
        }
        
        const { username, password } = req.body
        try {
            let user = await this.userService.login(username)
    
            if (!user) {
                return res.send(AppResponse('Username does not exist!', 400, {}))
            }
    
            const isMatch = await bcrypt.compare(password, user.password)
            if (!isMatch) {
                return res.send(AppResponse('Invalid Credentials!!!', 400, {}))
            }
    
            const payload = {
            user: {
                id: user.id,
                username: user.username,
            },
            }
            let jwt_secret = process.env.JWT_SECRET as string;

            jwt.sign(
                payload,
                jwt_secret,
                { expiresIn: '10 days' },
                (err, token) => {
                    if (err) throw err
                    return res.send(AppResponse({ token }, 200))
                }
            )
        } catch (error) {
            console.error(error)
            return res.send(AppResponse('Server Error', 500, {}))
        }
    }

    /**
    	* @apiType POST
    	* @apiPath /api/user/register
    	* @apiBody {"username": "String", "password":"String", "email": "String", "name": "String"}
    	* @apiKey Register
    	* @apiDescription Register a user
    	* @apiResponse User object
    	*/
    public register = async (req: Request, res: Response) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.send(AppResponse(null, 400, errors.array()));
        }

        const { name, email, username, password } = req.body
        let userObj = {
            name,
            email,
            username,
            password
        }

        try {
            let user: any = await this.userService.getUser(username)
        
            if (user) {
                return res.send(AppResponse('Username already exist!', 401, {}))
            }
    
            const salt = await bcrypt.genSalt(10)
            userObj.password = await bcrypt.hash(password, salt)
    
            let resObj = await this.userService.register(userObj)
            // console.log('resObj', resObj)

            if (!resObj) return res.send(AppResponse('Server Error', 500, {}))
            return res.send(AppResponse('User registered successfully', 200, {}))
        } catch (error) {
            console.error(error)
            return res.send(AppResponse('Server Error', 500, {}))
        }
    }

    /**
    	* @apiType GET
    	* @apiPath /api/user
    	* @apiBody NA
    	* @apiKey Get User
    	* @apiDescription Returns user data for authenticated user
    	* @apiResponse User data object
    	*/
        public getUser = async (req: Request, res: Response) => {
            if(req.user)
                return res.send(AppResponse(req.user, 200, {}))
                return res.send(AppResponse(null, 401, {}))
        }

    public routes(){
        this.router.post('/login', [
            body('username').exists().withMessage('Username is required!'),
            body('password').exists().withMessage('Password is required!')
        ], this.login);
        this.router.post('/register', [
            body('username').exists().withMessage('Username is required!'),
            body('password').exists().withMessage('Password is required!'),
            body('name').exists().withMessage('Name is required!'),
            body('email').exists().withMessage('Email is required!')
            .isEmail().withMessage('Invalid email, please enter valid email!')
        ], this.register);
        this.router.get('/', auth, this.getUser);
    }


}