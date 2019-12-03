import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { ProductChoiceEntity } from "./ProductChoice.entity";
import { CreateProductChoiceOptionDto } from "../dto/CreateProductChoiceOption.dto";

@Entity({ name: "product_choice_options" })
export class ProductChoiceOptionEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ type: "real" })
  price: number;

  @ManyToOne(type => ProductChoiceEntity, choice => choice.options, {
    nullable: false,
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "choice_id" })
  choice: ProductChoiceEntity;

  static fromDto(dto: CreateProductChoiceOptionDto): ProductChoiceOptionEntity {
    const option = new ProductChoiceOptionEntity();
    option.name = dto.name;
    option.description = dto.description;
    option.price = dto.price;

    return option;
  }
}
