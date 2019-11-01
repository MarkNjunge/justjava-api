import * as dotenv from "dotenv";
dotenv.config();
import * as configPackage from "config";

export interface Config {
  env: string;
  port: number;
  swaggerEndpoint: string;
  rateLimitMax: number;
  rateLimitTimeWindow: string;
  corsOrigin: string;
  corsMethods: string;
  corsHeaders: string;
  validatorForbidUnknown: boolean;
  loggerTimestampFormat: string;
  adminKey: string;
  cloudinary: CloudinaryConfig;
  db: DbConfig;
}

interface CloudinaryConfig {
  cloudName: string;
  apiKey: string;
  apiSecret: string;
}

interface DbConfig {
  url: string;
  ssl: boolean;
}

export const config: Config = configPackage;
