import { Injectable, HttpStatus } from "@nestjs/common";
import slugify from "slugify";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { ProductEntity } from "./entities/Product.entity";
import { ProductDto } from "./dto/Product.dto";
import { ApiException } from "../../common/ApiException";
import { CreateProductDto } from "./dto/CreateProduct.dto";

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productsRepository: Repository<ProductEntity>,
  ) {}

  async all(): Promise<ProductDto[]> {
    return this.productsRepository.find();
  }

  async findBySlug(slug: string): Promise<ProductDto> {
    const product = await this.productsRepository.findOne({ where: { slug } });
    if (!product) {
      throw new ApiException(
        HttpStatus.NOT_FOUND,
        `Product with slug ${slug} does not exist`,
      );
    }

    return product;
  }

  async create(dto: CreateProductDto): Promise<ProductDto> {
    const slug = slugify(dto.name, { lower: true });
    const existing = await this.productsRepository.findOne({ where: { slug } });
    if (existing) {
      throw new ApiException(
        HttpStatus.CONFLICT,
        `Product with name ${dto.name} (${slug}) already exists`,
      );
    } else {
      const entity = ProductEntity.fromDto(dto);
      return this.productsRepository.save(entity);
    }
  }
}
