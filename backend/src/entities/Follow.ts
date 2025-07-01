import { Entity, ManyToOne, PrimaryGeneratedColumn, Unique } from "typeorm";
import { User } from "./User";

@Entity()
@Unique(["follower", "following"])
export class Follow {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => User, (user) => user.following, { eager: true })
  follower!: User; // quem segue

  @ManyToOne(() => User, (user) => user.followers, { eager: true })
  following!: User; // quem é seguido
}
