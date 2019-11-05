import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { ProductChoiceOptionEntity } from "./ProductChoiceOption.entity";
import { ProductEntity } from "./Product.entity";
import { CreateProductChoiceDto } from "../dto/CreateProductChoice.dto";

@Entity({ name: "product_choices" })
export class ProductChoiceEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  name: string;

  @Column()
  position: number;

  @Column({ name: "quantity_min" })
  qtyMin: number;

  @Column({ name: "quantity_max" })
  qtyMax: number;

  @ManyToOne(type => ProductEntity, product => product.choices, {
    nullable: false,
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "product_id" })
  product: ProductEntity;

  @OneToMany(type => ProductChoiceOptionEntity, option => option.choice, {
    eager: true,
    cascade: true,
  })
  options: ProductChoiceOptionEntity[];

  static fromDto(dto: CreateProductChoiceDto): ProductChoiceEntity {
    const choice = new ProductChoiceEntity();
    choice.name = dto.name;
    choice.position = dto.position;
    choice.qtyMax = dto.qtyMax;
    choice.qtyMin = dto.qtyMin;
    choice.options = dto.options.map(o => ProductChoiceOptionEntity.fromDto(o));

    return choice;
  }
}
