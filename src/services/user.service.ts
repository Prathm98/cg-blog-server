import { getConnection } from "typeorm";
import { User } from "../database/entities/user.entity";
import { UserRepository } from "../repository/user.repository";

/**
 * User service class for user related operations like authentication, login, register
 */
export class UserService {
    private userRepo: UserRepository;

    /**
     * Represents a User service
     * @constructor
     * @param {none} NA
     * @description Initializes required repositories
     */
    constructor(){
        this.userRepo =  getConnection('blog').getCustomRepository(UserRepository);
    }

    /**
     * Method to retieve user
     * @param {String} username - Username of the user 
     * @returns {User} Object of the user
     */
    public login = async (username: string) => {
        try {
          const user = await this.userRepo.findOne({
            where: {
              username,
            },
          })
    
          return user
        } catch (e) {
          return null
        }
    }

    /**
     * Method to retieve user by username
     * @param {String} username - Username of the user 
     * @returns {User} Object of the user with username and email only
     */
    public getUser = async (username: string) => {
        try {
          const user = await this.userRepo.findOne({
            where: {
              username,
            },
            select: ['id', 'name']
          })
          return user
        } catch (e) {
          return null
        }
    }

    /**
     * Method to retieve user by id
     * @param {Number} id - ID of the user 
     * @returns {User} Object of the user
     */
    public getUserById = async (id: number) => {
        try {
          const user = await this.userRepo.findOne({
            id
          })
          return user
        } catch (e) {
          return null
        }
    }

    /**
     * Method to create a new user
     * @param {User} user - User object 
     * @returns {User} Object of newly created user
     */
    public register = async (user: any) => {
        try {
          let usrObj = await this.userRepo.findOne({
            where: {
              username: user.username
            },
          })

          if(usrObj) return usrObj;
    
          let res = await this.userRepo.save({
            username: user.username,
            password: user.password,
            name: user.name,
            email: user.email
          })
    
          return res
        } catch (e) {
          return null
        }
    }
}