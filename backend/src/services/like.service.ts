// src/services/like.service.ts
import { AppDataSource } from "../config/data-source";
import { Like } from "../entities/Like";
import { User } from "../entities/User";
import { Post } from "../entities/Post";
import { Comment } from "../entities/Comment";
import { Repository } from "typeorm";

const likeRepo = AppDataSource.getRepository(Like);
const userRepo = AppDataSource.getRepository(User);
const postRepo = AppDataSource.getRepository(Post);
const commentRepo = AppDataSource.getRepository(Comment);

export const LikeService = {
  async togglePostLike(userId: number, postId: number): Promise<string> {
    const user = await userRepo.findOneByOrFail({ id: userId });
    const post = await postRepo.findOneByOrFail({ id: postId });

    const existing = await likeRepo.findOne({
      where: { user: { id: user.id }, post: { id: post.id } },
      relations: ["user", "post"],
    });

    if (existing) {
      await likeRepo.remove(existing);
      post.likeCount = Math.max(0, post.likeCount - 1);
      await postRepo.save(post);
      return "Like removido do post";
    }

    const like = likeRepo.create({ user, post });
    await likeRepo.save(like);

    post.likeCount += 1;
    await postRepo.save(post);
    return "Like adicionado ao post";
  },

  async toggleCommentLike(userId: number, commentId: number): Promise<string> {
    const user = await userRepo.findOneByOrFail({ id: userId });
    const comment = await commentRepo.findOneByOrFail({ id: commentId });

    const existing = await likeRepo.findOne({
      where: { user: { id: user.id }, comment: { id: comment.id } },
      relations: ["user", "comment"],
    });

    if (existing) {
      await likeRepo.remove(existing);
      comment.likeCount = Math.max(0, comment.likeCount - 1);
      await commentRepo.save(comment);
      return "Like removido do comentário";
    }

    const like = likeRepo.create({ user, comment });
    await likeRepo.save(like);

    comment.likeCount += 1;
    await commentRepo.save(comment);
    return "Like adicionado ao comentário";
  },
};
