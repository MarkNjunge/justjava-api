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
  logging: Logging;
  adminKey: string;
  cloudinary: CloudinaryConfig;
  db: DbConfig;
  google: Google;
  redis: Redis;
  mpesa: Mpesa;
  rave: Rave;
  datadog: Datadog;
  mailgun: Mailgun;
  queue: Queue;
}

interface RateLimit {
  enabled: boolean;
  max: number;
  timeWindow: string;
}

interface Logging {
  timestampFormat: string;
  sensitiveParams: string[];
  replacementString: string;
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
  domain: string;
  apiKey: string;
  from: string;
}

interface Queue {
  redisUrl: string;
  serviceName: string;
  mpesaCheckDelay: number;
  maxMpesaCheckAttempts: number;
}

export const config: Config = configPackage;
