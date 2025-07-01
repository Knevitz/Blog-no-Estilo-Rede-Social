// src/services/comment.service.ts
import { AppDataSource } from "../config/data-source";
import { Comment } from "../entities/Comment";
import { Post } from "../entities/Post";
import { User } from "../entities/User";
import { IsNull } from "typeorm";

const commentRepo = AppDataSource.getRepository(Comment);
const postRepo = AppDataSource.getRepository(Post);
const userRepo = AppDataSource.getRepository(User);

export const CommentService = {
  async create(
    userId: number,
    postId: number,
    content: string,
    parentId?: number
  ) {
    const user = await userRepo.findOneByOrFail({ id: userId });
    const post = await postRepo.findOneByOrFail({ id: postId });

    const comment = commentRepo.create({ content, author: user, post });

    if (parentId) {
      const parent = await commentRepo.findOneByOrFail({ id: parentId });
      comment.parent = parent;
    }

    return await commentRepo.save(comment);
  },

  async getByPost(postId: number) {
    const comments = await commentRepo.find({
      where: {
        post: { id: postId },
        parent: IsNull(),
      },
      relations: ["author", "replies", "replies.author"],
      order: { createdAt: "ASC" },
    });

    return comments;
  },

  async remove(id: number, userId: number) {
    const comment = await commentRepo.findOneOrFail({
      where: { id },
      relations: ["author"],
    });

    if (comment.author.id !== userId) {
      throw new Error("Você não pode excluir este comentário.");
    }

    await commentRepo.remove(comment);
  },
};
