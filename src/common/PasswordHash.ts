import * as bcrypt from "bcryptjs";

export class PasswordHash {
  static hash(password): string {
    return bcrypt.hashSync(password);
  }

  static validate(password, hash): boolean {
    return bcrypt.compareSync(password, hash);
  }
}
