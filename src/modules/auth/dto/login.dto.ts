import { IsEmail, IsNotEmpty } from 'class-validator';


export class LoginDto {
  /**
   * The email address of the user
   *
   * @example test@example.com
   */
  @IsEmail()
  email: string;

  /**
   * The user password.
   *
   * @example password
   */
  @IsNotEmpty()
  password: string;
}
