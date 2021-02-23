import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "notifications" })
export class NotificationEntity {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column({ name: "user_id" })
  userId: number;

  @Column({ name: "token" })
  token: string;

  @Column({ name: "reason" })
  reason: string;

  @Column({ name: "message" })
  message: string;

  @Column({ name: "extra" })
  extra: string;
}
