import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
} from "typeorm";
import { User } from "./User";
import { Post } from "./Post";
import { Comment } from "./Comment";

@Entity()
export class Like {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.likes, { onDelete: "CASCADE" })
  user: User;

  @ManyToOne(() => Post, (post) => post.likes, {
    nullable: true,
    onDelete: "CASCADE",
  })
  post?: Post;

  @ManyToOne(() => Comment, (comment) => comment.likes, {
    nullable: true,
    onDelete: "CASCADE",
  })
  comment?: Comment;

  @CreateDateColumn()
  createdAt: Date;
}
