export class StkCallbackDto {
  merchantRequestId: string;
  checkoutRequestId: string;
  resultDesc: string;
  resultCode: string;
  amount?: string;
  mpesaReceiptNumber?: string;
  transtactionDate?: string;
  phoneNumber?: string;
}
