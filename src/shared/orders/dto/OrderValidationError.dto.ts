import { ApiProperty } from "@nestjs/swagger";
import { OrderValidationErrorModel } from "./OrderValidationErrorModel.dto";
import { OrderValidationErrorType } from "./OrderValidationErrorType.dto";

export class OrderValidationError {
  @ApiProperty()
  index: number;

  @ApiProperty()
  itemId: number;

  @ApiProperty({ enum: OrderValidationErrorModel })
  errorModel: OrderValidationErrorModel;

  @ApiProperty({ enum: OrderValidationErrorType })
  errorType: OrderValidationErrorType;

  @ApiProperty()
  errorString: string;

  @ApiProperty({ nullable: true })
  newPrice?: number;

  constructor(
    index: number,
    itemId: number,
    errorModel: OrderValidationErrorModel,
    errorType: OrderValidationErrorType,
    errorString: string,
    newPrice?: number,
  ) {
    this.index = index;
    this.itemId = itemId;
    this.errorModel = errorModel;
    this.errorType = errorType;
    this.errorString = errorString;
    this.newPrice = newPrice;
  }
}
