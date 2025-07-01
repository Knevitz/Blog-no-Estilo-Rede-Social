import { AppDataSource } from "../config/data-source";
import { Like } from "../entities/Like";
import { Post } from "../entities/Post";
import { Comment } from "../entities/Comment";
import { User } from "../entities/User";

export class LikeService {
  private likeRepo = AppDataSource.getRepository(Like);
  private postRepo = AppDataSource.getRepository(Post);
  private commentRepo = AppDataSource.getRepository(Comment);

  async togglePostLike(
    postId: number,
    user: User
  ): Promise<{ liked: boolean }> {
    const post = await this.postRepo.findOneBy({ id: postId });
    if (!post) throw new Error("Post não encontrado");

    const existing = await this.likeRepo.findOne({
      where: { user: { id: user.id }, post: { id: postId } },
    });

    if (existing) {
      await this.likeRepo.remove(existing);
      return { liked: false };
    }

    const like = this.likeRepo.create({ user, post });
    await this.likeRepo.save(like);
    return { liked: true };
  }

  async toggleCommentLike(
    commentId: number,
    user: User
  ): Promise<{ liked: boolean }> {
    const comment = await this.commentRepo.findOneBy({ id: commentId });
    if (!comment) throw new Error("Comentário não encontrado");

    const existing = await this.likeRepo.findOne({
      where: { user: { id: user.id }, comment: { id: commentId } },
    });

    if (existing) {
      await this.likeRepo.remove(existing);
      return { liked: false };
    }

    const like = this.likeRepo.create({ user, comment });
    await this.likeRepo.save(like);
    return { liked: true };
  }
}
