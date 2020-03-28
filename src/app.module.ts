import { Module } from "@nestjs/common";
import { AppController } from "./app/app.controller";
import { AppService } from "./app/app.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { config } from "./common/Config";
import { ProductEntity } from "./shared/products/entities/Product.entity";
import { UserEntity } from "./shared/users/entities/User.entity";
import { AddressEntity } from "./shared/users/entities/Address.entity";
import { OrderEntity } from "./shared/orders/entities/Order.entity";
import { PaymentEntity } from "./shared/payments/entities/Payment.entity";
import { AdminModule } from "./admin/admin.module";
import { SharedModule } from "./shared/shared.module";
import { ClientModule } from "./client/client.module";
import * as path from "path";

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "postgres",
      url: config.db.url,
      entities: [path.join(__dirname, "./**/*.entity{.ts,.js}")],
      migrations: [path.join(__dirname, "./migration/*{.ts,.js}")],
      migrationsRun: true,
      synchronize: false,
      extra: {
        ssl: config.db.ssl,
      },
    }),
    TypeOrmModule.forFeature([
      ProductEntity,
      UserEntity,
      AddressEntity,
      OrderEntity,
      PaymentEntity,
    ]),
    ClientModule,
    AdminModule,
    SharedModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
