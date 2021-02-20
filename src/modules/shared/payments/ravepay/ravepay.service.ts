import {
  Injectable,
  InternalServerErrorException,
  HttpException,
  NotImplementedException,
} from "@nestjs/common";
import * as axios from "axios";
import * as forge from "node-forge";
import { config } from "../../../../utils/Config";
import { InitiatePaymentDto } from "../card/dto/InitiatePayment.dto";
import { UserDto } from "../../users/dto/User.dto";
import * as dayjs from "dayjs";
import { CheckCardDto } from "../card/dto/CheckCard.dto";

@Injectable()
export class RavepayService {
  // TODO Shorten
  // eslint-disable-next-line max-lines-per-function
  async checkCard(
    dto: CheckCardDto,
    amount: number,
    user: UserDto,
  ): Promise<string> {
    const body = this.makeBaseBody(
      dto.cardNumber,
      dto.cvv,
      dto.expiryMonth,
      dto.expiryYear,
      dto.orderId,
      amount,
      user,
    );

    const encryptedBody = this.encrypt(
      config.rave.encryptionKey,
      JSON.stringify(body),
    );

    try {
      const response = await axios.default.post(
        "https://ravesandboxapi.flutterwave.com/flwv3-pug/getpaidx/api/charge",
        {
          PBFPubKey: config.rave.publicKey,
          client: encryptedBody,
          alg: "3DES-24",
        },
      );

      if (response.data.data.chargeResponseCode === "02") {
        // TODO Handle verification requirement
      }

      switch (response.data.data.suggested_auth) {
      case "NOAUTH_INTERNATIONAL":
        return "ADDRESS_VERIFICATION";
      case "PIN":
        throw new NotImplementedException({
          message:
              "Unable to complete payment. Pin verification not implemented.",
        });
      default:
        throw new NotImplementedException({
          message: "Unable to complete payment. Unknown card type.",
        });
      }
    } catch (e) {
      this.handleRequestError(e);
    }
  }

  // TODO Shorten
  // eslint-disable-next-line max-lines-per-function
  async initiateAddressPayment(
    dto: InitiatePaymentDto,
    amount: number,
    user: UserDto,
  ) {
    const baseBody = this.makeBaseBody(
      dto.cardNo,
      dto.cvv,
      dto.expiryMonth,
      dto.expiryYear,
      dto.orderId,
      amount,
      user,
    );
    const body = {
      ...baseBody,
      suggested_auth: "NOAUTH_INTERNATIONAL",
      billingzip: dto.billingZip,
      billingcity: dto.billingCity,
      billingaddress: dto.billingAddress,
      billingstate: dto.billingState,
      billingcountry: dto.billingCountry,
    };

    const encryptedBody = this.encrypt(
      config.rave.encryptionKey,
      JSON.stringify(body),
    );

    try {
      const response = await axios.default.post(
        "https://ravesandboxapi.flutterwave.com/flwv3-pug/getpaidx/api/charge",
        {
          PBFPubKey: config.rave.publicKey,
          client: encryptedBody,
          alg: "3DES-24",
        },
      );

      if (response.data.data.chargeResponseCode !== "02") {
        throw new InternalServerErrorException({
          message: "Unable to complete payment",
          meta: { message: response.data.message },
        });
      }

      return response.data;
    } catch (e) {
      this.handleRequestError(e);
    }
  }

  async verify(flwRef: string, otp: string) {
    const verificationResponse = await axios.default.post(
      "https://ravesandboxapi.flutterwave.com/flwv3-pug/getpaidx/api/validatecharge",
      {
        PBFPubKey: config.rave.publicKey,
        transaction_reference: flwRef,
        otp,
      },
    );

    if (verificationResponse.data.data.data.responsecode !== "00") {
      throw new InternalServerErrorException({
        message: "Unable to complete payment",
        meta: { message: verificationResponse.data.message },
      });
    }

    return verificationResponse.data;
  }

  // eslint-disable-next-line max-params
  private makeBaseBody(
    cardNumber: string,
    cvv: string,
    expiryMonth: string,
    expiryYear: string,
    orderId: string,
    amount: number,
    user: UserDto,
  ) {
    const txRef = `ORDER-${orderId}-${dayjs().unix()}`;

    return {
      PBFPubKey: config.rave.publicKey,
      cardno: cardNumber,
      cvv,
      expirymonth: expiryMonth,
      expiryyear: expiryYear,
      currency: "KES",
      country: "KE",
      amount,
      email: user.email,
      firstname: user.firstName,
      txRef,
    };
  }

  private encrypt(key, payload) {
    const cipher = forge.cipher.createCipher(
      "3DES-ECB",
      forge.util.createBuffer(key),
    );
    cipher.start({ iv: "" });
    cipher.update(forge.util.createBuffer(payload, "utf-8"));
    cipher.finish();
    const encrypted = cipher.output;

    return forge.util.encode64(encrypted.getBytes());
  }

  private handleRequestError(e) {
    let statusCode = 500;
    let message = e.message;

    if (e.response) {
      statusCode = e.response.status;
      message = e.response.data.message;
    }

    throw new HttpException(
      {
        message: "Unable to complete payment",
        meta: { message },
      },
      statusCode,
    );
  }
}
