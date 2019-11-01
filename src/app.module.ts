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

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "postgres",
      url: config.db.url,
      entities: [__dirname + "/**/*.entity.ts"],
      synchronize: true,
      extra: {
        ssl: config.db.ssl,
      },
    }),
    TypeOrmModule.forFeature([ProductEntity]),
  ],
  controllers: [AppController, ImagesController, ProductsController],
  providers: [AppService, ImagesService, ProductsService],
})
export class AppModule {}
