import { registerDecorator, ValidationOptions, ValidationArguments } from "class-validator";

export function IsImageFile(validationOptions?: ValidationOptions) {
  // eslint-disable-next-line @typescript-eslint/ban-types
  return function(object: Object, propertyName: string) {
    registerDecorator({
      name: "isImageFile",
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          return value.mimetype.startsWith("image/");
        },
        defaultMessage(): string {
          return "Invalid file type. Must be an image.";
        },
      },
    });
  };
}
