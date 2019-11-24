import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "users" })
export class UserEntity {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column({ name: "first_name" })
  firstName: string;

  @Column({ name: "last_name" })
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column({ name: "mobile_number", nullable: true })
  mobileNumber: string;

  @Column({ nullable: true, select: false })
  password: string;

  @Column({ name: "sign_in_method" })
  signInMethod: string;

  @Column({ type: "bigint", name: "created_at" })
  createdAt: number;
}
