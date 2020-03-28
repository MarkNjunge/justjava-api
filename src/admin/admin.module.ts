import { Module } from "@nestjs/common";
import { ProductsController } from "./products/products.controller";
import { SharedModule } from "../shared/shared.module";
import { ImagesService } from "./images/images.service";
import { ImagesController } from "./images/images.controller";
import { UsersController } from './users/users.controller';
import { OrdersController } from './orders/orders.controller';

@Module({
  imports: [SharedModule],
  controllers: [ProductsController, ImagesController, UsersController, OrdersController],
  providers: [ImagesService],
})
export class AdminModule {}
