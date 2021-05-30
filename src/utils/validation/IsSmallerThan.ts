import { registerDecorator, ValidationArguments, ValidationOptions } from "class-validator";
import * as filesize from "filesize";

export function IsSmallerThan(size: number, validationOptions?: ValidationOptions) {
  // eslint-disable-next-line @typescript-eslint/ban-types
  return function(object: Object, propertyName: string) {
    registerDecorator({
      name: "isSmallerThan",
      target: object.constructor,
      propertyName,
      constraints: [size],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const maxSize = args.constraints[0];

          return value.size < maxSize;
        },
        defaultMessage(args: ValidationArguments): string {
          const maxSize = args.constraints[0];
          const actualFilesize = args.value.size;

          return `File is too large: was ${filesize(actualFilesize)} max ${filesize(maxSize)}`;
        },
      },
    });
  };
}
