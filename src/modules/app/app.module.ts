import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { config } from "../../utils/Config";
import { AdminModule } from "../admin/admin.module";
import { SharedModule } from "../shared/shared.module";
import { ClientModule } from "../client/client.module";
import * as path from "path";

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "postgres",
      url: config.db.url,
      entities: [path.join(__dirname, "../**/*.entity{.ts,.js}")],
      migrations: [path.join(__dirname, "../db/migration/*{.ts,.js}")],
      migrationsRun: true,
      synchronize: false,
      extra: {
        ssl: config.db.ssl,
      },
      keepConnectionAlive: true,
    }),
    ClientModule,
    AdminModule,
    SharedModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}