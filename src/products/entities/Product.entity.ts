import { Entity, Column, Index, PrimaryColumn, Generated } from "typeorm";

@Entity({ name: "products" })
export class ProductEntity {
  @PrimaryColumn()
  @Generated("uuid")
  id: string;

  @Column()
  name: string;

  @Column()
  @Index({ unique: true })
  slug: string;

  @Column()
  description: string;

  @Column({ type: "real" })
  price: number;

  @Column()
  image: string;

  @Column({ name: "product_type" })
  type: string;

  @Column({ name: "product_status" })
  status: string;

  @Column({ type: "bigint", name: "created_at" })
  createdAt: number;

  constructor(
    name: string,
    slug: string,
    description: string,
    price: number,
    image: string,
    type: string,
    status: string,
    createdAt: number,
  ) {
    this.name = name;
    this.slug = slug;
    this.description = description;
    this.price = price;
    this.image = image;
    this.type = type;
    this.status = status;
    this.createdAt = createdAt;
  }
}
