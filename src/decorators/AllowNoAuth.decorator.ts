import { SetMetadata } from "@nestjs/common";

export const AllowNoAuth = () => SetMetadata("allowNoAuth", true);
