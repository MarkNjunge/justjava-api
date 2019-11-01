import { Module } from "@nestjs/common";
import { AppController } from "./app/app.controller";
import { AppService } from "./app/app.service";
import { ImagesController } from "./images/images.controller";
import { ImagesService } from "./images/images.service";

@Module({
  imports: [],
  controllers: [AppController, ImagesController],
  providers: [AppService, ImagesService],
})
export class AppModule {}
