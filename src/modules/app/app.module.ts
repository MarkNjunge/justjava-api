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
      migrations: [path.join(__dirname, "../../db/migration/*{.ts,.js}")],
      migrationsRun: true,
      synchronize: false,
      extra: {
        ssl: {
          require: config.db.ssl,
          // This accepts a self signed certificate
          // See node-postgres docs for how to verify
          // https://node-postgres.com/features/ssl
          rejectUnauthorized: false,
        },
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
