import { Module } from "@nestjs/common";
import { ProductsService } from "./products/products.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ProductEntity } from "./products/entities/Product.entity";
import { RedisService } from "./redis/redis.service";
import { EmailService } from "./email/email.service";
import { UserEntity } from "./users/entities/User.entity";
import { UsersService } from "./users/users.service";
import { AddressEntity } from "./users/entities/Address.entity";
import { OrdersService } from "./orders/orders.service";
import { OrderEntity } from "./orders/entities/Order.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ProductEntity,
      UserEntity,
      AddressEntity,
      OrderEntity,
    ]),
  ],
  providers: [
    ProductsService,
    RedisService,
    EmailService,
    UsersService,
    OrdersService,
  ],
  exports: [
    ProductsService,
    RedisService,
    EmailService,
    UsersService,
    OrdersService,
  ],
})
export class SharedModule {}
