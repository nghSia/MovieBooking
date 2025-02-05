import { IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class loginDTO {

    @ApiProperty({ example: 'pseudo@gmail.com', description: 'Adresse email de l\'utilisateur' })
    @IsEmail()
    email : string;

    @ApiProperty({ example: '*******', description: 'Mot de passe de l\'utilisateur' })
    @IsNotEmpty()
    password : string;
}