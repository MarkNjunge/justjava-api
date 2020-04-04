import slugify from "slugify";
import {
  Entity,
  Column,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { ProductChoiceEntity } from "./ProductChoice.entity";
import { CreateProductDto } from "../dto/CreateProduct.dto";
import * as moment from "moment";

@Entity({ name: "products" })
export class ProductEntity {
  @PrimaryGeneratedColumn("increment")
  id: number;

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

  @OneToMany(() => ProductChoiceEntity, choice => choice.product, {
    eager: true,
    cascade: true,
  })
  choices: ProductChoiceEntity[];

  static fromDto(dto: CreateProductDto): ProductEntity {
    const product = new ProductEntity();
    product.name = dto.name;
    product.slug = slugify(dto.name, { lower: true });
    product.description = dto.description;
    product.price = dto.price;
    product.image = dto.image;
    product.type = dto.type;
    product.status = dto.status;
    product.createdAt = moment().unix();
    product.choices = dto.choices.map(c => ProductChoiceEntity.fromDto(c));

    return product;
  }
}
