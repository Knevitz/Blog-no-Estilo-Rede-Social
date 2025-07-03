import { AppDataSource } from "../config/data-source";
import { Post } from "../entities/Post";
import { User } from "../entities/User";
import { Repository } from "typeorm";

const postRepo: Repository<Post> = AppDataSource.getRepository(Post);
const userRepo: Repository<User> = AppDataSource.getRepository(User);

export const PostService = {
  async create(userId: number, content: string, isPublic: boolean = true) {
    const author = await userRepo.findOneByOrFail({ id: userId });
    const post = postRepo.create({ content, isPublic, author });
    const saved = await postRepo.save(post);
    return this.sanitizePost(saved);
  },

  async getAll() {
    const posts = await postRepo.find({
      where: { isPublic: true },
      relations: ["author"],
      order: { likeCount: "DESC", createdAt: "DESC" },
    });
    return posts.map(this.sanitizePost);
  },

  async getOne(id: number) {
    const post = await postRepo.findOne({
      where: { id },
      relations: ["author"],
    });
    if (!post) throw new Error("Post não encontrado");
    return this.sanitizePost(post);
  },

  async update(
    id: number,
    userId: number,
    data: { content?: string; isPublic?: boolean }
  ) {
    const post = await postRepo.findOneOrFail({
      where: { id },
      relations: ["author"],
    });
    if (post.author.id !== userId)
      throw new Error("Você não tem permissão para editar este post");

    post.content = data.content ?? post.content;
    post.isPublic = data.isPublic ?? post.isPublic;
    const updated = await postRepo.save(post);

    return this.sanitizePost(updated);
  },

  async remove(id: number, userId: number) {
    const post = await postRepo.findOneOrFail({
      where: { id },
      relations: ["author"],
    });
    if (post.author.id !== userId)
      throw new Error("Você não tem permissão para excluir este post");

    await postRepo.remove(post);
  },

  sanitizePost(post: Post) {
    return {
      id: post.id,
      content: post.content,
      isPublic: post.isPublic,
      likeCount: post.likeCount,
      createdAt: post.createdAt.toISOString(), // UTC ISO para frontend calcular tempo relativo
      author: {
        id: post.author.id,
        username: post.author.username,
        name: post.author.name,
        bio: post.author.bio,
        createdAt: post.author.createdAt.toISOString(),
      },
    };
  },
};
