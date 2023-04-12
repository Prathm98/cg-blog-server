import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, OneToMany } from "typeorm"
import { Comment } from "./comments.entity"
import { Like } from "./likes.entity"
import { User } from "./user.entity"

@Entity('blogs')
export class Blog {
    @PrimaryGeneratedColumn()
    id!: number

    @Column()
    title!: string

    @Column({type: 'longtext'})
    description!: string

    @CreateDateColumn({nullable: true})
    created!: Date

    @ManyToOne(() => User, (user) => user.blogs)
    user!: User

    @OneToMany(() => Like, (like) => like.blog)
    likes!: Like[]

    @OneToMany(() => Comment, (comment) => comment.blog)
    comments!: Comment[]

}
