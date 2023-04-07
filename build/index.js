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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
// import { PostController } from './controller/post.controller'; // import the post controller
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const blog_controller_1 = require("./src/controller/blog.controller");
const user_controller_1 = require("./src/controller/user.controller");
class Server {
    constructor() {
        if (process.env.NODE_ENV !== 'production') {
            require('dotenv').config();
        }
        this.app = (0, express_1.default)(); // init the application
        this.configuration();
        this.routes();
        // const jsdocRestApi = require('jsdoc-rest-api')
        // const allApiEndpointsGrouped = jsdocRestApi.generateRoutes({ source: "build/src/controller/*.js" })
        // console.log(JSON.stringify(allApiEndpointsGrouped));
    }
    /**
     * Method to configure the server,
     * If we didn't configure the port into the environment
     * variables it takes the default port 3000
     */
    configuration() {
        this.app.set('port', process.env.PORT || 3000);
        console.log();
        this.app.use(express_1.default.json());
    }
    /**
     * Method to configure the routes
     */
    routes() {
        return __awaiter(this, void 0, void 0, function* () {
            let host = process.env.RDS_HOST;
            let database = process.env.RDS_NAME;
            let username = process.env.RDS_USER;
            let password = process.env.RDS_PASS;
            yield (0, typeorm_1.createConnection)({
                type: "mysql",
                host,
                port: 3306,
                username,
                password,
                database,
                entities: ["build/src/database/entities/**/*.js"],
                synchronize: true,
                name: "blog"
            });
            this.blogController = new blog_controller_1.BlogController();
            this.userController = new user_controller_1.UserController();
            this.app.get("/", (req, res) => __awaiter(this, void 0, void 0, function* () {
                res.send("Hello world!");
            }));
            this.app.use(`/api/blog/`, this.blogController.router); // Configure the new routes of the controller blog
            this.app.use(`/api/user/`, this.userController.router); // Configure the new routes of the controller user
        });
    }
    /**
     * Used to start the server
     */
    start() {
        this.app.listen(this.app.get('port'), () => {
            console.log(`Server is listening ${this.app.get('port')} port.`);
        });
    }
}
const server = new Server(); // Create server instance
server.start(); // Execute the server
