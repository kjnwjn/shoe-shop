import { IsString, IsNotEmpty, IsEmail, MinLength } from 'class-validator';

export class SignupDto {
  @IsString()
  @IsNotEmpty()
  name: string;
  @IsEmail()
  email: string;
  @MinLength(6)
  password: string;
}

export class SignInDto {
  @IsEmail()
  email: string;
  @MinLength(6)
  password: string;
}
