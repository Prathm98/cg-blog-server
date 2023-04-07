import { Repository, EntityRepository } from "typeorm";
import { Comment } from "../database/entities/comments.entity";

@EntityRepository(Comment)
export class CommentsRepository extends Repository<Comment>{

}