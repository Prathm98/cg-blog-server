import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, OneToMany } from "typeorm"
import { Blog } from "./blog.entity"
import { Comment } from "./comments.entity"
import { Like } from "./likes.entity"

@Entity('users')
export class User {
    @PrimaryGeneratedColumn()
    id!: number

    @Column()
    name!: string

    @Column({nullable: false })
    email!: string

    @Column({unique: true})
    username!: string

    @Column({ length: 255, nullable: false })
    password!: string

    @CreateDateColumn({nullable: true})
    created!: Date

    @OneToMany(() => Blog, (blog) => blog.user)
    blogs!: Blog[]

    @OneToMany(() => Like, (like) => like.user)
    likes!: Like[]

    @OneToMany(() => Comment, (comment) => comment.user)
    comments!: Comment[]

}
