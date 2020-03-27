import { Controller, Post, UseGuards, Body } from "@nestjs/common";
import {
  ApiImplicitHeader,
  ApiOperation,
  ApiResponse,
  ApiUseTags,
} from "@nestjs/swagger";
import { AdminGuard } from "../../common/guards/admin.guard";
import { ProductDto } from "../../shared/products/dto/Product.dto";
import { CreateProductDto } from "../../shared/products/dto/CreateProduct.dto";
import { ProductsService } from "../../shared/products/products.service";

@Controller("admin/products")
@ApiUseTags("products")
@UseGuards(AdminGuard)
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @ApiImplicitHeader({ name: "admin-key" })
  @ApiOperation({ title: "Create a new product" })
  @ApiResponse({ status: 201, type: ProductDto })
  async create(@Body() dto: CreateProductDto): Promise<ProductDto> {
    return this.productsService.create(dto);
  }
}
