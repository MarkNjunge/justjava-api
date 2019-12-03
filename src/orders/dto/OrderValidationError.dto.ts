import { ApiModelProperty } from "@nestjs/swagger";
import { OrderValidationErrorModel } from "./OrderValidationErrorModel.dto";
import { OrderValidationErrorType } from "./OrderValidationErrorType.dto";

export class OrderValidationError {
  @ApiModelProperty()
  index: number;

  @ApiModelProperty()
  itemId: number;

  @ApiModelProperty({ enum: OrderValidationErrorModel })
  errorModel: OrderValidationErrorModel;

  @ApiModelProperty({ enum: OrderValidationErrorType })
  errorType: OrderValidationErrorType;

  @ApiModelProperty()
  errorString: string;

  @ApiModelProperty({ nullable: true })
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
