import { Controller, Post, UseGuards, Body } from "@nestjs/common";
import { ApiHeader, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { AdminGuard } from "../../common/guards/admin.guard";
import { ProductDto } from "../../shared/products/dto/Product.dto";
import { CreateProductDto } from "../../shared/products/dto/CreateProduct.dto";
import { ProductsService } from "../../shared/products/products.service";

@Controller("admin/products")
@ApiTags("products")
@UseGuards(AdminGuard)
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @ApiHeader({ name: "admin-key" })
  @ApiOperation({ summary: "Create a new product" })
  @ApiResponse({ status: 201, type: ProductDto })
  async create(@Body() dto: CreateProductDto): Promise<ProductDto> {
    return this.productsService.create(dto);
  }
}
