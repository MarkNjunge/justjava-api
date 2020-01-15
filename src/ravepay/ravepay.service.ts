import { Injectable, HttpStatus } from "@nestjs/common";
import * as axios from "axios";
import * as forge from "node-forge";
import { config } from "../common/Config";
import { InitiatePaymentDto } from "src/payments/card/dto/InitiatePayment.dto";
import { UserDto } from "src/users/dto/User.dto";
import * as moment from "moment";
import { ApiException } from "../common/ApiException";

@Injectable()
export class RavepayService {
  async initiate(dto: InitiatePaymentDto, amount: number, user: UserDto) {
    const baseBody = this.makeBaseBody(dto, amount, user);
    const initializeBody = {
      ...baseBody,
      suggested_auth: "NOAUTH_INTERNATIONAL",
      billingzip: dto.billingZip,
      billingcity: dto.billingCity,
      billingaddress: dto.billingAddress,
      billingstate: dto.billingState,
      billingcountry: dto.billingCountry,
    };

    const initializeEncryptedBody = this.encrypt(
      config.rave.encryptionKey,
      JSON.stringify(initializeBody),
    );

    const initializeResponse = await axios.default.post(
      "https://ravesandboxapi.flutterwave.com/flwv3-pug/getpaidx/api/charge",
      {
        PBFPubKey: config.rave.publicKey,
        client: initializeEncryptedBody,
        alg: "3DES-24",
      },
    );

    if (initializeResponse.data.data.chargeResponseCode !== "02") {
      throw new ApiException(
        HttpStatus.INTERNAL_SERVER_ERROR,
        "Error making payment",
        { message: initializeResponse.data.message },
      );
    }

    return initializeResponse.data;
  }

  async verify(flwRef: string) {
    const verificationResponse = await axios.default.post(
      "https://ravesandboxapi.flutterwave.com/flwv3-pug/getpaidx/api/validatecharge",
      {
        PBFPubKey: config.rave.publicKey,
        transaction_reference: flwRef,
        otp: "1234",
      },
    );

    if (verificationResponse.data.data.data.responsecode !== "00") {
      throw new ApiException(
        HttpStatus.INTERNAL_SERVER_ERROR,
        "Error validating payment",
        { message: verificationResponse.data.message },
      );
    }

    return verificationResponse.data;
  }

  private makeBaseBody(dto: InitiatePaymentDto, amount: number, user: UserDto) {
    const txRef = `MC-${dto.orderId}-${moment().unix()}`;
    return {
      PBFPubKey: config.rave.publicKey,
      cardno: dto.cardNo,
      cvv: dto.cvv,
      expirymonth: dto.expiryMonth,
      expiryyear: dto.expiryYear,
      currency: "KES",
      country: "KE",
      amount,
      email: user.email,
      firstname: user.firstName,
      lastname: user.lastName,
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
}
