import { Module } from "@nestjs/common";
import { ProductsController } from "./products/products.controller";
import { SharedModule } from "../shared/shared.module";
import { AuthService } from "./auth/auth.service";
import { AuthController } from "./auth/auth.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ProductEntity } from "../shared/products/entities/Product.entity";
import { UserEntity } from "../users/entities/User.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([ProductEntity, UserEntity]),
    SharedModule,
  ],
  controllers: [ProductsController, AuthController],
  providers: [AuthService],
})
export class ClientModule {}
