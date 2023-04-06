import { getConnection } from "typeorm";
import { Blog } from "../database/entities/blog.entity";
import { User } from "../database/entities/user.entity";
import { UserRepository } from "../repository/user.repository";

export class UserService {
    private userRepo: UserRepository;
    constructor(){
        this.userRepo =  getConnection('blog').getCustomRepository(UserRepository);
    }

    public getUsers = async () => {
        try {
            const users = await this.userRepo.find();
            return users;
        } catch (error) {
            console.error(error)
            return null;
        }      
    }

    public getUserById = async (id: number) => {
        try {
            const user = await this.userRepo.findOne(id);
            return user;
        } catch (error) {
            console.error(error)
            return null;
        }      
    }

    public createBlog = async (user: User) => {
        try {
            const res = await this.userRepo.save(user);
            return res;
        } catch (error) {
            console.error(error)
            return null;
        }
    }    
}