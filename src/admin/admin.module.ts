import { Module } from "@nestjs/common";
import { ProductsController } from "./products/products.controller";
import { SharedModule } from "../shared/shared.module";

@Module({
  imports: [SharedModule],
  controllers: [ProductsController],
})
export class AdminModule {}
