import { Repository, EntityRepository } from "typeorm";
import { User } from "../database/entities/user.entity";

@EntityRepository(User)
export class UserRepository extends Repository<User>{

}