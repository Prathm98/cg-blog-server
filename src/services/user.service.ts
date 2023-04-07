import { getConnection } from "typeorm";
import { User } from "../database/entities/user.entity";
import { UserRepository } from "../repository/user.repository";

export class UserService {
    private userRepo: UserRepository;
    constructor(){
        this.userRepo =  getConnection('blog').getCustomRepository(UserRepository);
    }

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

    public getUser = async (username: string) => {
        try {
          const user = await this.userRepo.findOne({
            where: {
              username,
            },
            select: ['username', 'email']
          })
          return user
        } catch (e) {
          return null
        }
    }

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