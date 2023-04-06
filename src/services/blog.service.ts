import { getConnection } from "typeorm";
import { Blog } from "../database/entities/blog.entity";
import { BlogRepository } from "../repository/blog.repository";

export class BlogService {
    private blogRepo: BlogRepository;
    constructor(){
        this.blogRepo =  getConnection('blog').getCustomRepository(BlogRepository);
    }

    public getBlogs = async () => {
        try {
            const blogs = await this.blogRepo.find({
                relations: ['user'],
                select: ['user', 'title']
            });

            return blogs;
        } catch (error) {
            console.error(error)
            return null;
        }      
    }

    public createBlog = async (blog: Blog) => {
        try {
            const res = await this.blogRepo.save(blog);
            return res;
        } catch (error) {
            console.error(error)
            return null;
        }
    }    
}