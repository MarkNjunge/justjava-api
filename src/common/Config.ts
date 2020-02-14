import * as dotenv from "dotenv";
dotenv.config();
import * as configPackage from "config";

export interface Config {
  env: string;
  port: number;
  swaggerEndpoint: string;
  rateLimit: RateLimit;
  corsOrigin: string;
  corsMethods: string;
  corsHeaders: string;
  validatorForbidUnknown: boolean;
  loggerTimestampFormat: string;
  adminKey: string;
  cloudinary: CloudinaryConfig;
  db: DbConfig;
  google: Google;
  redis: Redis;
  mpesa: Mpesa;
  rave: Rave;
  datadog: Datadog;
  mailgun: Mailgun;
}

interface RateLimit {
  enabled: boolean;
  max: number;
  timeWindow: string;
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

interface Google {
  clientId: string;
  serviceAccountKeyUrl: string;
  databaseURL: string;
}

interface Redis {
  url: string;
}

interface Mpesa {
  consumerKey: string;
  consumerSecret: string;
  callbackBaseUrl: string;
}

interface Rave {
  encryptionKey: string;
  publicKey: string;
}

interface Datadog {
  enabled: string;
  apiKey: string;
  service: string;
  source: string;
  host: string;
}

interface Mailgun {
  enabled: boolean;
  apiKey: string;
  from: string;
}

export const config: Config = configPackage;

// Handle dokku setting environment variables as string instead of boolean
export function trueBool(value: boolean | string) {
  if (typeof value === "string") {
    return value === "true" ? true : false;
  } else if (typeof value === "boolean") {
    return value;
  }
}
