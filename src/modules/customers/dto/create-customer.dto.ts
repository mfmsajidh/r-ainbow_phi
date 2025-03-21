import { IsNotEmpty, IsStrongPassword } from 'class-validator';

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

  /**
   * Customer's password
   *
   * @example string2A!
   */
  @IsNotEmpty()
  @IsStrongPassword()
  password: string;
}
