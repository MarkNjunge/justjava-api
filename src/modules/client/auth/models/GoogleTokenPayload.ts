export class GoogleTokenPayload {
  email: string;
  firstName: string;
  lastName: string;

  constructor(payload) {
    this.email = payload.email;
    this.firstName = payload.given_name;
    this.lastName = payload.family_name;
  }
}
