import { Repository, EntityRepository } from "typeorm";
import { Blog } from "../database/entities/blog.entity";

@EntityRepository(Blog)
export class BlogRepository extends Repository<Blog>{

}