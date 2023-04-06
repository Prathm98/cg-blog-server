import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, OneToMany, ManyToOne } from "typeorm"
import { Blog } from "./blog.entity"
import { User } from "./user.entity"

@Entity('likes')
export class Like {
    @PrimaryGeneratedColumn()
    id!: number

    @CreateDateColumn({nullable: true})
    created!: Date

    @ManyToOne(() => Blog, (blog) => blog.likes)
    blog!: Blog

    @ManyToOne(() => User, (user) => user.likes)
    user!: User

}
