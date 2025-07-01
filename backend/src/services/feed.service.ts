import { AppDataSource } from "../config/data-source";
import { Post } from "../entities/Post";
import { Follow } from "../entities/Follow";
import { In } from "typeorm";

const postRepo = AppDataSource.getRepository(Post);
const followRepo = AppDataSource.getRepository(Follow);

export const FeedService = {
  async getFeed(userId: number, skip = 0, take = 20) {
    // Buscar quem o usuário segue
    const follows = await followRepo.find({
      where: { follower: { id: userId } },
    });

    const followingIds = follows.map((f) => f.following.id);

    // Buscar posts do próprio usuário ou dos que ele segue, só públicos
    const posts = await postRepo.find({
      where: [
        { author: { id: userId } }, // posts próprios (podem ser privados ou públicos)
        { author: { id: In(followingIds) }, isPublic: true }, // só públicos de quem segue
      ],
      order: { createdAt: "DESC" },
      relations: ["author"],
      skip,
      take,
    });

    return posts;
  },
};
