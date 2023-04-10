import express, {Request, Response} from 'express';
// import { PostController } from './controller/post.controller'; // import the post controller
import "reflect-metadata"
import { createConnection } from "typeorm"
import { BlogController } from './src/controller/blog.controller';
import { UserController } from './src/controller/user.controller';
const cors = require('cors');

class Server {
  private blogController!: BlogController;
  private userController!: UserController;
  private app: express.Application;

  constructor(){
    if (process.env.NODE_ENV !== 'production') {
      require('dotenv').config();
    }

    this.app = express(); // init the application
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
  public configuration() {
    this.app.set('port', process.env.PORT || 3000);
    this.app.use(cors())
    this.app.use(express.json());
  }

  /**
   * Method to configure the routes
   */
  public async routes(){
    let host = process.env.RDS_HOST;
    let database = process.env.RDS_NAME;
    let username = process.env.RDS_USER;
    let password = process.env.RDS_PASS;

    await createConnection({
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

    this.blogController = new BlogController();
    this.userController = new UserController();

    this.app.use((req: Request, res: Response, next) => {
      res.header('Access-Control-Allow-Origin', '*')
      res.header('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT')
      // res.header(
      //   'Access-Control-Allow-Headers',
      //   'Origin, X-Requested-With, Content-Type, Accept, Authorization'
      // )
      next()
    })

    this.app.get( "/", async (req: Request, res: Response ) => {
      res.send( "Hello world!" );      
    });

    this.app.use(`/api/blog/`,this.blogController.router); // Configure the new routes of the controller blog
    this.app.use(`/api/user/`,this.userController.router); // Configure the new routes of the controller user
  }

  
  /**
   * Used to start the server
   */
  public start(){
    this.app.listen(this.app.get('port'), () => {
      console.log(`Server is listening ${this.app.get('port')} port.`);
    });
  }
}

const server = new Server(); // Create server instance
server.start(); // Execute the server