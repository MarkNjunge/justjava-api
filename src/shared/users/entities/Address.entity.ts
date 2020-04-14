import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  JoinColumn,
  ManyToOne,
} from "typeorm";
import { UserEntity } from "./User.entity";

@Entity({ name: "addresses" })
export class AddressEntity {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column({ name: "street_address" })
  streetAddress: string;

  @Column({ name: "delivery_instructions", nullable: true })
  deliveryInstructions: string;

  @Column({ name: "lat_lng" })
  latLng: string;

  @ManyToOne(() => UserEntity, user => user.addresses, {
    nullable: false,
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "user_id" })
  user: UserEntity;
}
