import { Module } from "@nestjs/common";
import { ProductsController } from "./products/products.controller";
import { SharedModule } from "../shared/shared.module";
import { AuthService } from "./auth/auth.service";
import { AuthController } from "./auth/auth.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserEntity } from "../shared/users/entities/User.entity";
import { UsersController } from "./users/users.controller";
import { OrdersController } from "./orders/orders.controller";
import { PaymentsController } from "./payments/payments.controller";

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity]), SharedModule],
  controllers: [
    ProductsController,
    AuthController,
    UsersController,
    OrdersController,
    PaymentsController,
  ],
  providers: [AuthService],
})
export class ClientModule {}
