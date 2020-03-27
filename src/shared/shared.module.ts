import { Module } from "@nestjs/common";
import { ProductsService } from "./products/products.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ProductEntity } from "./products/entities/Product.entity";
import { RedisService } from "./redis/redis.service";
import { EmailService } from "./email/email.service";
import { UserEntity } from "../users/entities/User.entity";

@Module({
  imports: [TypeOrmModule.forFeature([ProductEntity, UserEntity])],
  providers: [ProductsService, RedisService, EmailService],
  exports: [ProductsService, RedisService, EmailService],
})
export class SharedModule {}
