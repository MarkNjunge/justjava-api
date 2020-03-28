import { Module } from "@nestjs/common";
import { ProductsController } from "./products/products.controller";
import { SharedModule } from "../shared/shared.module";
import { AuthService } from "./auth/auth.service";
import { AuthController } from "./auth/auth.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ProductEntity } from "../shared/products/entities/Product.entity";
import { UserEntity } from "../shared/users/entities/User.entity";
import { UsersController } from "./users/users.controller";
import { OrdersController } from './orders/orders.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProductEntity, UserEntity]),
    SharedModule,
  ],
  controllers: [ProductsController, AuthController, UsersController, OrdersController],
  providers: [AuthService],
})
export class ClientModule {}
