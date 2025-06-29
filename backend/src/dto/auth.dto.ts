import {
  IsEmail,
  IsNotEmpty,
  MinLength,
  MaxLength,
  Matches,
} from "class-validator";

export class RegisterDTO {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(100)
  @Matches(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W)/, {
    message:
      "A senha deve conter pelo menos uma letra maiúscula, uma letra minúscula, um número e um caractere especial",
  })
  password: string;
}

export class LoginDTO {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;
}

export class ResetPasswordDTO {
  @IsNotEmpty()
  token: string;

  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(100)
  @Matches(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W)/, {
    message:
      "A senha deve conter pelo menos uma letra maiúscula, uma letra minúscula, um número e um caractere especial",
  })
  newPassword: string;
}

export class RefreshTokenDTO {
  @IsNotEmpty()
  refreshToken: string;
}
