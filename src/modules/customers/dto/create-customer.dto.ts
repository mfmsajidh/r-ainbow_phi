import { IsDate, IsEmail, IsNotEmpty, IsStrongPassword } from 'class-validator';

export class CreateCustomerDto {
  /**
   *  Customer's email
   *
   *  @example mfmsajidh@yahoo.com
   */
  @IsEmail()
  @IsNotEmpty()
  email: string;

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
   * Customer's birthday
   *
   * @example 08/01/1999
   */
  @IsDate()
  @IsNotEmpty()
  birthday: Date;

  /**
   * Customer's preferences
   *
   * @example books, electronics
   */
  preferences?: string[];

  /**
   * Customer's password
   *
   * @example string2A!
   */
  @IsNotEmpty()
  @IsStrongPassword()
  password: string;
}
