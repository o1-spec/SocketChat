import { IsEmail, IsNotEmpty, MinLength, IsOptional } from 'class-validator';

export class RegisterDto {
  @IsNotEmpty()
  @MinLength(3, { message: 'Username must be at least 3 characters' })
  username!: string;

  @IsEmail({}, { message: 'Please provide a valid email' })
  email!: string;

  @IsNotEmpty()
  @MinLength(6, { message: 'Password must be at least 6 characters' })
  password!: string;
}

export class LoginDto {
  @IsEmail({}, { message: 'Please provide a valid email' })
  email!: string;

  @IsNotEmpty()
  password!: string;
}
