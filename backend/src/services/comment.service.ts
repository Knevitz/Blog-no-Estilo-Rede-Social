// src/services/comment.service.ts
import { AppDataSource } from "../config/data-source";
import { Comment } from "../entities/Comment";
import { Post } from "../entities/Post";
import { User } from "../entities/User";
import { IsNull } from "typeorm";

const commentRepo = AppDataSource.getRepository(Comment);
const postRepo = AppDataSource.getRepository(Post);
const userRepo = AppDataSource.getRepository(User);

// Interface para retorno seguro
interface SanitizedUser {
  id: number;
  username: string;
  name?: string;
}

interface SanitizedComment {
  id: number;
  content: string;
  likeCount: number;
  createdAt: Date;
  author: SanitizedUser;
  replies?: SanitizedComment[];
}

function sanitizeUser(user: User): SanitizedUser {
  return {
    id: user.id,
    username: user.username,
    name: user.name,
  };
}

function sanitizeComment(comment: Comment): SanitizedComment {
  return {
    id: comment.id,
    content: comment.content,
    likeCount: comment.likeCount,
    createdAt: comment.createdAt,
    author: sanitizeUser(comment.author),
  };
}

function sanitizeCommentTree(comment: Comment): SanitizedComment {
  const base = sanitizeComment(comment);
  if (comment.replies && comment.replies.length > 0) {
    base.replies = comment.replies.map(sanitizeCommentTree);
  }
  return base;
}

export const CommentService = {
  async create(
    userId: number,
    postId: number,
    content: string,
    parentId?: number
  ): Promise<SanitizedComment> {
    const user = await userRepo.findOneByOrFail({ id: userId });
    const post = await postRepo.findOneByOrFail({ id: postId });

    const comment = commentRepo.create({ content, author: user, post });

    if (parentId) {
      const parent = await commentRepo.findOneByOrFail({ id: parentId });
      comment.parent = parent;
    }

    const saved = await commentRepo.save(comment);
    const fullComment = await commentRepo.findOneOrFail({
      where: { id: saved.id },
      relations: ["author", "replies", "replies.author"],
    });

    return sanitizeCommentTree(fullComment);
  },

  async getByPost(postId: number): Promise<SanitizedComment[]> {
    const comments = await commentRepo.find({
      where: {
        post: { id: postId },
        parent: IsNull(),
      },
      relations: ["author", "replies", "replies.author"],
      order: { createdAt: "ASC" },
    });

    return comments.map(sanitizeCommentTree);
  },

  async remove(id: number, userId: number): Promise<void> {
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
