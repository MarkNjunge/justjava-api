import { Module } from "@nestjs/common";
import { AppController } from "./app/app.controller";
import { AppService } from "./app/app.service";
import { ImagesController } from "./images/images.controller";
import { ImagesService } from "./images/images.service";
import { ProductsController } from "./products/products.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { config } from "./common/Config";
import { ProductsService } from "./products/products.service";
import { ProductEntity } from "./products/entities/Product.entity";
import { AuthController } from "./auth/auth.controller";
import { AuthService } from "./auth/auth.service";
import { UserEntity } from "./auth/entities/User.entity";
import { RedisService } from "./redis/redis.service";

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "postgres",
      url: config.db.url,
      entities: [__dirname + "/**/*.entity{.ts,.js}"],
      synchronize: true,
      extra: {
        ssl: config.db.ssl,
      },
    }),
    TypeOrmModule.forFeature([ProductEntity, UserEntity]),
  ],
  controllers: [
    AppController,
    ImagesController,
    ProductsController,
    AuthController,
  ],
  providers: [AppService, ImagesService, ProductsService, AuthService, RedisService],
})
export class AppModule {}
