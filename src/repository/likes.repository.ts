import { Repository, EntityRepository } from "typeorm";
import { Like } from "../database/entities/likes.entity";

@EntityRepository(Like)
export class LikesRepository extends Repository<Like>{

}