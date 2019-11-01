import { Controller, Post, Body, Get, Param } from "@nestjs/common";
import { CreateProductDto } from "./dto/CreateProduct.dto";
import { ProductsService } from "./products.service";
import { ProductDto } from "./dto/Product.dto";
import { ApiOperation, ApiResponse } from "@nestjs/swagger";

@Controller("products")
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  @ApiOperation({ title: "Get all products" })
  @ApiResponse({ status: 200, type: ProductDto, isArray: true })
  async getAll(): Promise<ProductDto[]> {
    return this.productsService.all();
  }

  @Get(":slug")
  @ApiOperation({ title: "Get a product by its slug" })
  @ApiResponse({ status: 200, type: ProductDto })
  async fingBySlug(@Param("slug") slug: string): Promise<ProductDto> {
    return this.productsService.findBySlug(slug);
  }

  @Post()
  @ApiOperation({ title: "Create a new product" })
  @ApiResponse({ status: 201, type: ProductDto })
  async create(@Body() dto: CreateProductDto): Promise<ProductDto> {
    return this.productsService.create(dto);
  }
}
