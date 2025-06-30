import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { IsEmail, MinLength, MaxLength } from "class-validator";
import { Exclude } from "class-transformer";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true, type: "varchar" })
  @IsEmail()
  email!: string;

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

  @Column({ type: "timestamp", nullable: true })
  @Exclude()
  blockExpires: Date | null;

  @CreateDateColumn({ type: "timestamp" })
  createdAt!: Date;

  @UpdateDateColumn({ type: "timestamp" })
  updatedAt!: Date;
}
