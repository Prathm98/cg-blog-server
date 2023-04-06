import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, OneToMany, ManyToOne } from "typeorm"
import { Blog } from "./blog.entity"
import { User } from "./user.entity"

@Entity('comments')
export class Comment {
    @PrimaryGeneratedColumn()
    id!: number

    @Column()
    comment!: String

    @CreateDateColumn({nullable: true})
    created!: Date

    @ManyToOne(() => Blog, (blog) => blog.comments)
    blog!: Blog

    @ManyToOne(() => User, (user) => user.comments)
    user!: User
}