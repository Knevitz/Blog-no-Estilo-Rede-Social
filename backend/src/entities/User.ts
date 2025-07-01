// src/entities/User.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from "typeorm";
import {
  IsEmail,
  MinLength,
  MaxLength,
  IsOptional,
  IsString,
  Matches,
} from "class-validator";
import { Exclude } from "class-transformer";
import { Post } from "./Post";
import { Comment } from "./Comment";
import { Like } from "./Like";
import { Follow } from "./Follow";
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true, type: "varchar" })
  @IsEmail()
  email!: string;

  @Column({ unique: true, type: "varchar" })
  @IsString()
  @Matches(/^[a-zA-Z0-9_]{3,20}$/, {
    message:
      "Username deve ter entre 3 e 20 caracteres e conter apenas letras, números ou _",
  })
  username!: string;

  @Column({ type: "varchar" })
  @Exclude()
  @MinLength(8)
  @MaxLength(100)
  password!: string;

  @Column({ default: "user", type: "varchar" })
  role!: string;

  @Column({ type: "varchar", nullable: true })
  @Exclude()
  resetPasswordToken: string | null;

  @Column({ type: "timestamp", nullable: true })
  @Exclude()
  resetTokenExpiry: Date | null;

  @Column({ type: "int", default: 0 })
  @Exclude()
  loginAttempts!: number;

  @Column({ nullable: true, type: "varchar" })
  @IsOptional()
  @IsString()
  name?: string;

  @Column({ nullable: true, type: "text" })
  @IsOptional()
  @IsString()
  bio?: string;

  @Column({ type: "timestamp", nullable: true })
  @Exclude()
  blockExpires: Date | null;

  @CreateDateColumn({ type: "timestamp" })
  createdAt!: Date;

  @UpdateDateColumn({ type: "timestamp" })
  updatedAt!: Date;

  @OneToMany(() => Post, (post) => post.author)
  posts: Post[];

  @OneToMany(() => Comment, (comment) => comment.author)
  comments: Comment[];

  @OneToMany(() => Like, (like) => like.user)
  likes: Like[];

  @OneToMany(() => Follow, (follow) => follow.follower)
  following: Follow[];

  @OneToMany(() => Follow, (follow) => follow.following)
  followers: Follow[];
}
