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
import { CardService } from "./payments/card/card.service";
import { MpesaService } from "./payments/mpesa/mpesa.service";
import { RavepayService } from "./payments/ravepay/ravepay.service";
import { PaymentEntity } from "./payments/entities/Payment.entity";
import { NotificationsService } from "./notifications/notifications.service";
import { NotificationEntity } from "./notifications/entity/Notification.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ProductEntity,
      UserEntity,
      AddressEntity,
      OrderEntity,
      PaymentEntity,
      NotificationEntity,
    ]),
  ],
  providers: [
    ProductsService,
    RedisService,
    EmailService,
    UsersService,
    OrdersService,
    CardService,
    MpesaService,
    RavepayService,
    NotificationsService,
  ],
  exports: [
    ProductsService,
    RedisService,
    EmailService,
    UsersService,
    OrdersService,
    CardService,
    MpesaService,
    RavepayService,
    NotificationsService,
  ],
})
export class SharedModule {}
