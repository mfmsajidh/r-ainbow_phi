import { IsNotEmpty } from 'class-validator';

export class CreateCustomerDto {
  /**
   * Customer's first name
   *
   * @example Harry
   */
  @IsNotEmpty()
  firstName: string;

  /**
   * Customer's last name
   *
   * @example Potter
   */
  @IsNotEmpty()
  lastName: string;
}
