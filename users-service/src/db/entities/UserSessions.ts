import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity("userSessions")
export default class UserSessions {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column("char", { length: 36 })
  userId: string;

  @CreateDateColumn()
  createdAt: string;

  @Column("datetime")
  expiresAt: string;
}
