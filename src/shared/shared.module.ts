import { Module } from "@nestjs/common";
import { ProductsService } from "./products/products.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ProductEntity } from "./products/entities/Product.entity";

@Module({
  imports: [TypeOrmModule.forFeature([ProductEntity])],
  providers: [ProductsService],
  exports: [ProductsService],
})
export class SharedModule {}
