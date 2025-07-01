import {
  IsEmail,
  IsNotEmpty,
  MinLength,
  MaxLength,
  Matches,
  IsOptional,
  IsString,
} from "class-validator";

export class RegisterDTO {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @Matches(/^[a-zA-Z0-9_]{3,20}$/, {
    message:
      "Username deve ter entre 3 e 20 caracteres e conter apenas letras, números ou _",
  })
  username: string;

  @IsOptional()
  @IsString()
  name?: string;

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
