import { Controller, Get, Param } from "@nestjs/common";
import { ProductsService } from "../../shared/products/products.service";
import { ProductDto } from "../../shared/products/dto/Product.dto";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";

@Controller("products")
@ApiTags("products")
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  @ApiOperation({ summary: "Get all products" })
  @ApiResponse({ status: 200, type: ProductDto, isArray: true })
  async getAll(): Promise<ProductDto[]> {
    return this.productsService.all();
  }

  @Get(":slug")
  @ApiOperation({ summary: "Get a product by its slug" })
  @ApiResponse({ status: 200, type: ProductDto })
  async fingBySlug(@Param("slug") slug: string): Promise<ProductDto> {
    return this.productsService.findBySlug(slug);
  }
}
